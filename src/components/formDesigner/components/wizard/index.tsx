import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IFormComponentContainer } from '../../../../providers/form/models';
import { DoubleRightOutlined } from '@ant-design/icons';
import { Steps, Button, Space, message, Col, Row } from 'antd';
import ComponentsContainer from '../../componentsContainer';
import settingsFormJson from './settingsForm.json';
import React, { Fragment, useEffect, useState } from 'react';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useAuth, useForm, useGlobalState } from '../../../../providers';
import { useSheshaApplication } from '../../../../';
import { nanoid } from 'nanoid/non-secure';
import WizardSettings from './settings';
import { IWizardComponentProps } from './models';
import ShaIcon from '../../../shaIcon';
import moment from 'moment';
import { axiosHttp } from '../../../../apis/axios';
import { migrateV0toV1, IWizardComponentPropsV0 } from './migrations/migrate-v1';
import { useConfigurableAction, useConfigurableActionDispatcher } from '../../../../providers/configurableActionsDispatcher';
import { IConfigurableActionConfiguration } from '../../../../interfaces/configurableAction';

const { Step } = Steps;

const settingsForm = settingsFormJson as FormMarkup;

const TabsComponent: IToolboxComponent<IWizardComponentProps> = {
  type: 'wizard',
  name: 'Wizard',
  icon: <DoubleRightOutlined />,
  factory: model => {
    const { anyOfPermissionsGranted } = useAuth();
    const { isComponentHidden, formMode, formData } = useForm();
    const { globalState, setState: setGlobalState } = useGlobalState();
    const { backendUrl } = useSheshaApplication();
    const { executeAction } = useConfigurableActionDispatcher();
    const [current, setCurrent] = useState(() => {
      const localCurrent = model?.defaultActiveStep
        ? model?.steps?.findIndex(({ id }) => id === model?.defaultActiveStep)
        : 0;

      return localCurrent < 0 ? 0 : localCurrent;
    });
    const [component, setComponent] = useState(null);

    const { steps: tabs, wizardType = 'default' } = model as IWizardComponentProps;

    useEffect(() => {
      const defaultActiveStep = model?.steps?.findIndex(item => item?.id === model?.defaultActiveStep);
      setCurrent(defaultActiveStep < 0 ? 0 : defaultActiveStep);
    }, [model?.defaultActiveStep]);

    //#region configurable actions
    const { name: actionOwnerName, id: actionsOwnerId } = model;

    const actionDependencies = [actionOwnerName, actionsOwnerId, current];
    useConfigurableAction({
      name: 'Back',
      owner: actionOwnerName,
      ownerUid: actionsOwnerId,
      hasArguments: false,
      executer: () => {
        back();
        return Promise.resolve();
      }
    }, actionDependencies);

    useConfigurableAction({
      name: 'Next',
      owner: actionOwnerName,
      ownerUid: actionsOwnerId,
      hasArguments: false,
      executer: () => {
        next();
        return Promise.resolve();
      }
    }, actionDependencies);

    useConfigurableAction({
      name: 'Cancel',
      owner: actionOwnerName,
      ownerUid: actionsOwnerId,
      hasArguments: false,
      executer: () => {
        cancel();
        return Promise.resolve();
      }
    }, actionDependencies);

    useConfigurableAction({
      name: 'Done',
      owner: actionOwnerName,
      ownerUid: actionsOwnerId,
      hasArguments: false,
      executer: () => {
        done();
        return Promise.resolve();
      }
    }, actionDependencies);
    //#endregion

    if (isComponentHidden(model)) return null;

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
      console.log('generic action')
      const actionConfiguration = accessor(tabs[current]);
      if (!actionConfiguration) {
        console.warn(`Action not configured: tab '${current}', accessor: '${accessor.toString()}'`);
        return;
      }

      executeAction({
        actionConfiguration: actionConfiguration,
        argumentsEvaluationContext: actionEvaluationContext
      });
    }

    const next = () => {
      if (current >= model.steps.length - 1)
        return;
      executeActionIfConfigured(tab => tab.nextButtonActionConfiguration);

      setCurrent(current + 1);
      setComponent(tabs[current].components);
    };

    const back = () => {
      if (current <= 0)
        return;

      executeActionIfConfigured(tab => tab.backButtonActionConfiguration);

      setCurrent(current - 1);
      setComponent(tabs[current].components);
    };

    const cancel = () => {
      executeActionIfConfigured(tab => tab.cancelButtonActionConfiguration);
    };

    const done = () => {
      executeActionIfConfigured(tab => tab.doneButtonActionConfiguration);
    };

    return (
      <>
        <Steps type={wizardType} current={current} style={{ marginBottom: '25px' }}>
          {tabs?.map(({ key, title, subTitle, description, icon, permissions, customVisibility, customEnabled }) => {
            const granted = anyOfPermissionsGranted(permissions || []);
            const isVisibleByCondition = executeExpression(customVisibility, true);
            const isDisabledByCondition = !executeExpression(customEnabled, true) && formMode !== 'designer';

            if ((!granted || !isVisibleByCondition) && formMode !== 'designer') return null;

            return (
              <Step
                key={key}
                disabled={isDisabledByCondition}
                title={title}
                subTitle={subTitle}
                description={description}
                icon={
                  icon ? (
                    <Fragment>
                      <ShaIcon iconName={icon as any} />
                    </Fragment>
                  ) : (
                    <Fragment>{icon}</Fragment>
                  )
                }
              />
            );
          })}
        </Steps>

        <ComponentsContainer containerId={tabs[current].id} dynamicComponents={model?.isDynamic ? component : []} />

        <Row>
          <Col span={12}>
            <Space size={'middle'}>
              {tabs[current].allowCancel === true && (
                <Button onClick={() => cancel()}>
                  {tabs[current].cancelButtonText ? tabs[current].cancelButtonText : 'Cancel'}
                </Button>
              )}
              {current > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={() => back()}>
                  {tabs[current].backButtonText ? tabs[current].backButtonText : 'Back'}
                </Button>
              )}
            </Space>
          </Col>
          <Col span={12}>
            <Space size={'middle'} style={{ width: '100%', justifyContent: 'right' }}>
              {current < tabs.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                  {tabs[current].nextButtonText ? tabs[current].nextButtonText : 'Next'}
                </Button>
              )}
              {current === tabs.length - 1 && (
                <Button type="primary" onClick={() => done()}>
                  {tabs[current].doneButtonText ? tabs[current].doneButtonText : 'Done'}
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </>
    );
  },
  migrator: m => m.add<IWizardComponentPropsV0>(0, prev => {
    const model: IWizardComponentPropsV0 = {
      ...prev,
      name: prev.name ?? 'custom Name',
      tabs: prev['tabs'] ?? [
        {
          id: nanoid(),
          label: 'Tab 1',
          title: 'Tab 1',
          subTitle: 'Tab 1',
          description: 'Tab 1',
          allowCancel: false,
          cancelButtonText: 'Cancel',
          nextButtonText: 'Next',
          backButtonText: 'Back',
          doneButtonText: 'Done',
          key: 'tab1',
          components: [],
          itemType: 'item',
        },
      ],
    };
    return model;
  }).add(1, migrateV0toV1),

  settingsFormFactory: ({ readOnly, model, onSave, onCancel, onValuesChange }) => {
    return <WizardSettings readOnly={readOnly} model={model} onSave={onSave} onCancel={onCancel} onValuesChange={onValuesChange} />;
  },
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  customContainerNames: ['tabs'],
  getContainers: model => {
    const { steps } = model as IWizardComponentProps;
    return steps.map<IFormComponentContainer>(t => ({ id: t.id }));
  },
};

export default TabsComponent;
