import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IFormComponentContainer } from '../../../../providers/form/models';
import { DoubleRightOutlined } from '@ant-design/icons';
import ComponentsContainer from '../../componentsContainer';
import settingsFormJson from './settingsForm.json';
import React from 'react';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useAuth, useForm, useGlobalState } from '../../../../providers';
import { nanoid } from 'nanoid/non-secure';
import WizardSettings from './settings';
import { IWizardComponentProps } from './models';
import moment from 'moment';

const settingsForm = settingsFormJson as FormMarkup;

const WizardComponent: IToolboxComponent<IWizardComponentProps> = {
  type: 'wizard',
  name: 'Wizard',
  icon: <DoubleRightOutlined />,
  factory: model => {
    const { anyOfPermissionsGranted } = useAuth();
    const { isComponentHidden, formMode, formData } = useForm();
    const { globalState } = useGlobalState();
    const { steps } = model as IWizardComponentProps;

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
      const evaluated = new Function('data, formMode, globalState, moment', expression)(
        formData,
        formMode,
        globalState,
        moment
      );

      // tslint:disable-next-line:function-constructor
      return typeof evaluated === 'boolean' ? evaluated : true;
    };

    return (
      <>
        {steps?.map(
          ({
            id,
            permissions,
            customVisibility,
            components,
          }) => {

            const granted = anyOfPermissionsGranted(permissions || []);
            const isVisibleByCondition = executeExpression(customVisibility, true);
            if ((!granted || !isVisibleByCondition) && formMode !== 'designer') return null;

            return (
              <ComponentsContainer containerId={id} dynamicComponents={model?.isDynamic ? components : []} />
            );
          }
        )}
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
