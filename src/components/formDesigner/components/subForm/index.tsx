import React, { FC } from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { FormOutlined } from '@ant-design/icons';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useForm, SubFormProvider, SubFormProviderProps } from '../../../../providers';
import { alertSettingsForm } from './settings';
import SubForm from './subForm';
import ConfigurableFormItem from '../formItem';
import { SubFormSettings } from './settingsv2';

export interface ISubFormProps extends SubFormProviderProps, IConfigurableFormComponent {
  name: string;
  uniqueStateId?: string;
}

const SubFormComponent: IToolboxComponent<ISubFormProps> = {
  type: 'subForm',
  name: 'Sub Form',
  icon: <FormOutlined />,
  factory: (model: ISubFormProps) => {
    const { isComponentHidden } = useForm();

    const isHidden = isComponentHidden(model);

    if (isHidden) return null;

    return (
      <ConfigurableFormItem model={model}>
        <SubFormWrapper {...model} />
      </ConfigurableFormItem>
    );
  },
  // settingsFormMarkup: alertSettingsForm,
  settingsFormFactory: ({ model, onSave, onCancel, onValuesChange }) => {
    return (
      <SubFormSettings
        model={(model as unknown) as ISubFormProps}
        onSave={onSave as any}
        onCancel={onCancel}
        onValuesChange={onValuesChange as any}
      />
    );
  },
  initModel: model => {
    const customProps: ISubFormProps = {
      ...model,
      dataSource: 'form',
    };
    return customProps;
  },
  validateSettings: model => validateConfigurableComponentSettings(alertSettingsForm, model),
};

interface ISubFormWrapperProps extends Omit<ISubFormProps, 'id' | 'type'> {
  id: string;
}

const SubFormWrapper: FC<ISubFormWrapperProps> = props => {
  return (
    <SubFormProvider {...props}>
      <SubForm />
    </SubFormProvider>
  );
};

export default SubFormComponent;
