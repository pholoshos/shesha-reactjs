import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IFormComponentContainer } from '../../../../providers/form/models';
import { DoubleRightOutlined } from '@ant-design/icons';
import { Steps, Button } from 'antd';
import ComponentsContainer from '../../componentsContainer';
import settingsFormJson from './settingsForm.json';
import React, { Fragment, useState } from 'react';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useAuth, useForm, useGlobalState } from '../../../../providers';
import { nanoid } from 'nanoid/non-secure';
import WizardSettings from './settings';
import { IWizardComponentProps } from './models';
import ShaIcon from '../../../shaIcon';
import moment from 'moment';

const { Step } = Steps;

const settingsForm = settingsFormJson as FormMarkup;

const WizardComponent: IToolboxComponent<IWizardComponentProps> = {
  type: 'wizard',
  name: 'Wizard',
  icon: <DoubleRightOutlined />,
  factory: model => {
    const { anyOfPermissionsGranted } = useAuth();
    const { isComponentHidden, formMode, formData } = useForm();
    const { globalState } = useGlobalState();
    const [ currentStep, setCurrentStep] = useState(0);

    const { steps, wizardType = 'default', current = currentStep } = model as IWizardComponentProps;

    if (isComponentHidden(model)) return null;

    // const actionKey = defaultActiveKey || (steps?.length && steps[0]?.key);

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
      const evaluated = new Function('data, formMode, globalState, moment', expression)(
        formData,
        formMode,
        globalState,
        moment
      );

      // tslint:disable-next-line:function-constructor
      return typeof evaluated === 'boolean' ? evaluated : true;
    };

    const next = () => {
      setCurrentStep(current + 1);
    };

    const prev = () => {
      setCurrentStep(current - 1);
    };

    return (
      <>
        <Steps
          /*defaultActiveKey={actionKey} size={size}*/
          type={wizardType}
          current={current}>
          {steps?.map(
            ({
              // id,
              key,
              title,
              subTitle,
              description,
              icon,
              className,
              permissions,
              customVisibility,
              customEnabled,
            }) => {
              const granted = anyOfPermissionsGranted(permissions || []);

              const isVisibleByCondition = executeExpression(customVisibility, true);

              const isDisabledByCondition = !executeExpression(customEnabled, true) && formMode !== 'designer';

              if ((!granted || !isVisibleByCondition) && formMode !== 'designer') return null;

              return (
                <>
                  <Step
                    key={key}
                    className={className}
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
                        <Fragment>
                          {icon}
                        </Fragment>
                      )
                    }
                  />

                </>
              );
            }
          )}
        </Steps>
        <div className="wizard-content">
          <ComponentsContainer containerId={steps[current].id} />
        </div>
        <div className="wizard-action">
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary">
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )}
        </div>
      </>
    );
  },
  initModel: model => {
    const wizardModel: IWizardComponentProps = {
      ...model,
      name: 'custom Name',
      steps: [{
        id: nanoid(),
        label: 'Step 1',
        title: 'Step 1',
        subTitle: 'Step 1',
        description: 'Step 1',
        key: 'step1',
        components: [],
        itemType: 'item'
      }],
    };
    return wizardModel;
  },
  // settingsFormMarkup: settingsForm,
  settingsFormFactory: ({ model, onSave, onCancel, onValuesChange }) => {
    return <WizardSettings model={model} onSave={onSave} onCancel={onCancel} onValuesChange={onValuesChange} />;
  },
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  customContainerNames: ['wizard'],
  getContainers: model => {
    const { steps } = model as IWizardComponentProps;
    return steps.map<IFormComponentContainer>(t => ({ id: t.id }));
  },
};

export default WizardComponent;
