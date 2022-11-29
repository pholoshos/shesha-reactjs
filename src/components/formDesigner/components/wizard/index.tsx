import { IToolboxComponent } from '../../../../interfaces';
import { IFormComponentContainer } from '../../../../providers/form/models';
import { DoubleRightOutlined } from '@ant-design/icons';
import { Steps, Button, Space, message } from 'antd';
import ComponentsContainer from '../../componentsContainer';
import React, { useMemo, useState } from 'react';
import { useForm, useGlobalState } from '../../../../providers';
import { useSheshaApplication } from '../../../../';
import { nanoid } from 'nanoid/non-secure';
import WizardSettings from './settings';
import { IStepProps, IWizardComponentProps } from './models';
import ShaIcon from '../../../shaIcon';
import moment from 'moment';
import { axiosHttp } from '../../../../apis/axios';
import { migrateV0toV1, IWizardComponentPropsV0 } from './migrations/migrate-v1';
import {
  useConfigurableAction,
  useConfigurableActionDispatcher,
} from '../../../../providers/configurableActionsDispatcher';
import { IConfigurableActionConfiguration } from '../../../../interfaces/configurableAction';
import './styles.less';
import classNames from 'classnames';
import { findLastIndex } from 'lodash';
import ConditionalWrap from '../../../conditionalWrapper';
import { useDeepCompareEffect } from 'react-use';

const TabsComponent: IToolboxComponent<Omit<IWizardComponentProps, 'size'>> = {
  type: 'wizard',
  name: 'Wizard',
  icon: <DoubleRightOutlined />,
  factory: model => {
    const { anyOfPermissionsGranted } = useSheshaApplication();
    const { isComponentHidden, formMode, formData } = useForm();
    const { globalState, setState: setGlobalState } = useGlobalState();
    const { backendUrl } = useSheshaApplication();
    const { executeAction } = useConfigurableActionDispatcher();
    const { steps: tabs, wizardType = 'default' } = model as IWizardComponentProps;
    const [current, setCurrent] = useState(() => {
      const localCurrent = model?.defaultActiveStep
        ? model?.steps?.findIndex(({ id }) => id === model?.defaultActiveStep)
        : 0;

      return localCurrent < 0 ? 0 : localCurrent;
    });

    const [component, setComponent] = useState(null);

    useDeepCompareEffect(() => {
      const defaultActiveStep = model?.steps?.findIndex(item => item?.id === model?.defaultActiveStep);
      setCurrent(defaultActiveStep < 0 ? 0 : defaultActiveStep);
    }, [model?.defaultActiveStep]);

    //#region configurable actions
    const { name: actionOwnerName, id: actionsOwnerId } = model;

    const actionDependencies = [actionOwnerName, actionsOwnerId, current];

    useConfigurableAction(
      {
        name: 'Back',
        owner: actionOwnerName,
        ownerUid: actionsOwnerId,
        hasArguments: false,
        executer: () => {
          back();
          return Promise.resolve();
        },
      },
      actionDependencies
    );

    useConfigurableAction(
      {
        name: 'Next',
        owner: actionOwnerName,
        ownerUid: actionsOwnerId,
        hasArguments: false,
        executer: () => {
          next();
          return Promise.resolve();
        },
      },
      actionDependencies
    );

    useConfigurableAction(
      {
        name: 'Cancel',
        owner: actionOwnerName,
        ownerUid: actionsOwnerId,
        hasArguments: false,
        executer: () => {
          cancel();
          return Promise.resolve();
        },
      },
      actionDependencies
    );

    useConfigurableAction(
      {
        name: 'Done',
        owner: actionOwnerName,
        ownerUid: actionsOwnerId,
        hasArguments: false,
        executer: () => {
          done();
          return Promise.resolve();
        },
      },
      actionDependencies
    );
    //#endregion

    const executeExpression = (expression: string, returnBoolean = true) => {
      if (!expression) {
        if (returnBoolean) {
          return true;
        } else {
          console.error('Expected expression to be defined but it was found to be empty.');
          return false;
        }
      }

      /* tslint:disable:function-constructor */
      const evaluated = new Function('data, formMode, globalState, http, message, setGlobalState, moment', expression)(
        formData,
        formMode,
        globalState,
        axiosHttp(backendUrl),
        message,
        setGlobalState,
        moment
      );

      // tslint:disable-next-line:function-constructor
      return typeof evaluated === 'boolean' ? evaluated : true;
    };

    //#region Get next and previous steps
    // Factor in the fact that some steps will be hidden by condition
    const visibleSteps = useMemo(
      () =>
        tabs?.map(({ customVisibility, permissions }, index) => {
          const granted = anyOfPermissionsGranted(permissions || []);
          const isVisibleByCondition = executeExpression(customVisibility, true);

          const hidden = (!granted || !isVisibleByCondition) && formMode !== 'designer';

          return {
            index,
            visible: !hidden,
          };
        }),
      [tabs]
    );

    const getNextStep = () => visibleSteps?.findIndex(({ index, visible }) => index > current && visible);

    const getPrevStep = () => findLastIndex(visibleSteps, ({ index, visible }) => visible && index < current);
    //#endregion

    if (isComponentHidden(model)) return null;

    const actionEvaluationContext = {
      data: formData,
      formMode: formMode,
      globalState: globalState,
      http: axiosHttp(backendUrl),
      message: message,
      setGlobalState: setGlobalState,
      moment: moment,
    };

    /// NAVIGATION
    const executeActionIfConfigured = (accessor: (IWizardStepProps) => IConfigurableActionConfiguration) => {
      const actionConfiguration = accessor(tabs[current]);
      if (!actionConfiguration) {
        console.warn(`Action not configured: tab '${current}', accessor: '${accessor.toString()}'`);
        return;
      }

      executeAction({
        actionConfiguration: actionConfiguration,
        argumentsEvaluationContext: actionEvaluationContext,
      });
    };

    const next = () => {
      if (current >= model.steps.length - 1) return;
      executeActionIfConfigured(tab => tab.nextButtonActionConfiguration);

      const nextStep = getNextStep();

      if (nextStep >= 0) {
        setCurrent(nextStep);
      }

      setComponent(tabs[current]?.components);
    };

    const back = () => {
      if (current <= 0) return;

      executeActionIfConfigured(tab => tab.backButtonActionConfiguration);

      const prevStep = getPrevStep();

      if (prevStep >= 0) {
        setCurrent(prevStep);
      }

      setComponent(tabs[current]?.components);
    };

    const cancel = () => {
      executeActionIfConfigured(tab => tab.cancelButtonActionConfiguration);
    };

    const done = () => {
      executeActionIfConfigured(tab => tab.doneButtonActionConfiguration);
    };

    const steps = tabs
      ?.filter(({ customVisibility, permissions }) => {
        const granted = anyOfPermissionsGranted(permissions || []);
        const isVisibleByCondition = executeExpression(customVisibility, true);

        const hidden = (!granted || !isVisibleByCondition) && formMode !== 'designer';

        return !hidden;
      })
      ?.map<IStepProps>(({ id, title, subTitle, description, icon, customEnabled }) => {
        const isDisabledByCondition = !executeExpression(customEnabled, true) && formMode !== 'designer';

        const iconProps = icon ? { icon: <ShaIcon iconName={icon as any} /> } : {};

        return {
          id,
          title,
          subTitle,
          description,
          disabled: isDisabledByCondition,
          ...iconProps,
          content: <ComponentsContainer containerId={id} dynamicComponents={model?.isDynamic ? component : []} />,
        };
      });

    const { buttonsLayout = 'spaceBetween' } = model;

    const splitButtons = buttonsLayout === 'spaceBetween';

    return (
      <div className="sha-wizard">
        <div className={classNames('sha-wizard-container', { vertical: model?.direction === 'vertical' })}>
          <Steps
            type={wizardType}
            current={current}
            items={steps}
            size={model['size']}
            direction={model?.direction}
            labelPlacement={model?.labelPlacement}
          />

          <div className="sha-steps-content">{steps[current]?.content}</div>
        </div>

        <ConditionalWrap condition={buttonsLayout === 'left'} wrap={children => <Space>{children}</Space>}>
          <div
            className={classNames('sha-steps-buttons-container', {
              split: splitButtons,
              left: buttonsLayout === 'left',
              right: buttonsLayout === 'right',
            })}
          >
            <ConditionalWrap
              condition={splitButtons}
              wrap={children => (
                <Space>
                  <div className={classNames('sha-steps-buttons')}>{children}</div>
                </Space>
              )}
            >
              {current > 0 && (
                <Button
                  style={{ margin: '0 8px' }}
                  onClick={() => back()}
                  disabled={!executeExpression(tabs[current]?.backButtonCustomEnabled, true)}
                >
                  {tabs[current].backButtonText ? tabs[current].backButtonText : 'Back'}
                </Button>
              )}

              {tabs[current].allowCancel === true && (
                <Button
                  onClick={() => cancel()}
                  disabled={!executeExpression(tabs[current]?.cancelButtonCustomEnabled, true)}
                >
                  {tabs[current].cancelButtonText ? tabs[current].cancelButtonText : 'Cancel'}
                </Button>
              )}
            </ConditionalWrap>

            <ConditionalWrap
              condition={splitButtons}
              wrap={children => (
                <Space>
                  <div className={classNames('sha-steps-buttons')}>{children}</div>
                </Space>
              )}
            >
              {current < tabs.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => next()}
                  disabled={!executeExpression(tabs[current]?.nextButtonCustomEnabled, true)}
                >
                  {tabs[current].nextButtonText ? tabs[current].nextButtonText : 'Next'}
                </Button>
              )}

              {current === tabs.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => done()}
                  disabled={!executeExpression(tabs[current]?.doneButtonCustomEnabled, true)}
                >
                  {tabs[current].doneButtonText ? tabs[current].doneButtonText : 'Done'}
                </Button>
              )}
            </ConditionalWrap>
          </div>
        </ConditionalWrap>
      </div>
    );
  },
  migrator: m =>
    m
      .add<IWizardComponentPropsV0>(0, prev => {
        const model: IWizardComponentPropsV0 = {
          ...prev,
          name: prev.name ?? 'custom Name',
          tabs: prev['tabs'] ?? [
            {
              id: nanoid(),
              name: 'step1',
              label: 'Step 1',
              title: 'Step 1',
              subTitle: 'Sub title 1',
              description: 'Description 1',
              sortOrder: 0,
              allowCancel: false,
              cancelButtonText: 'Cancel',
              nextButtonText: 'Next',
              backButtonText: 'Back',
              doneButtonText: 'Done',
              key: 'step1',
              components: [],
              itemType: 'item',
            },
          ],
        };
        return model;
      })
      .add(1, migrateV0toV1),

  settingsFormFactory: ({ readOnly, model, onSave, onCancel, onValuesChange }) => {
    return (
      <WizardSettings
        readOnly={readOnly}
        model={model}
        onSave={onSave}
        onCancel={onCancel}
        onValuesChange={onValuesChange}
      />
    );
  },
  // validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  customContainerNames: ['steps'],
  getContainers: model => {
    const { steps } = model as IWizardComponentProps;

    return steps.map<IFormComponentContainer>(t => ({ id: t.id }));
  },
};

export default TabsComponent;
