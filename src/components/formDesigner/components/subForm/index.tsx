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
import { SubFormSettings } from './settingsv2';
import ComponentsContainer from '../../componentsContainer';

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

        <ComponentsContainer containerId={model?.id} />
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

interface ISubFormWrapperProps extends ISubFormProps {
  id: string;
}

const SubFormWrapper: FC<ISubFormWrapperProps> = ({ id, name, ...props }) => {
  return (
    <SubFormProvider name={name} containerId={id} {...props}>
      <SubForm name={name} containerId={id} paginationDefaultPageSize={0} properties={[]} type={''} id={''} />
    </SubFormProvider>
  );
};

export default SubFormComponent;
