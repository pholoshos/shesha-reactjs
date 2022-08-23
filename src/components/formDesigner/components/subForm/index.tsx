import React, { FC } from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { FormOutlined } from '@ant-design/icons';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useForm } from '../../../../providers';
import { alertSettingsForm } from './settings';
import SubForm from './subForm';
import { SubFormProvider, SubFormProviderProps } from './provider';
import ConfigurableFormItem from '../formItem';
import { SubFormProps } from './provider/interfaces';

export interface ISubFormProps extends SubFormProviderProps, IConfigurableFormComponent {
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
  settingsFormMarkup: alertSettingsForm,
  validateSettings: model => validateConfigurableComponentSettings(alertSettingsForm, model),
};

interface ISubFormWrapperProps extends SubFormProps {
  id: string;
}

const SubFormWrapper: FC<ISubFormWrapperProps> = ({ id, name, ...props }) => {
  return (
    <SubFormProvider name={name} containerId={id} {...props}>
      <SubForm name={name} dataMode={'parent'} containerId={id} />
    </SubFormProvider>
  );
};

export default SubFormComponent;
