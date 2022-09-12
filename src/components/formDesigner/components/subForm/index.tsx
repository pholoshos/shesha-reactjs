import React, { FC } from 'react';
import { IStylable, IToolboxComponent } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { FormOutlined } from '@ant-design/icons';
import { getStyle, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useForm, SubFormProvider, SubFormProviderProps } from '../../../../providers';
import { alertSettingsForm } from './settings';
import SubForm from './subForm';
import ConfigurableFormItem from '../formItem';
import { SubFormSettings } from './settingsv2';

export interface ISubFormProps
  extends Omit<SubFormProviderProps, 'labelCol' | 'wrapperCol'>,
    IConfigurableFormComponent {
  name: string;
  uniqueStateId?: string;
  labelCol?: number;
  wrapperCol?: number;
}

const SubFormComponent: IToolboxComponent<ISubFormProps> = {
  type: 'subForm',
  name: 'Sub Form',
  icon: <FormOutlined />,
  factory: (model: ISubFormProps) => {
    const { isComponentHidden, formData } = useForm();

    const isHidden = isComponentHidden(model);

    if (isHidden) return null;

    return (
      <ConfigurableFormItem
        model={model}
        labelCol={{ span: model?.hideLabel ? 0 : model?.labelCol }}
        wrapperCol={{ span: model?.hideLabel ? 24 : model?.wrapperCol }}
      >
        <SubFormWrapper {...model} style={getStyle(model?.style, formData)} />
      </ConfigurableFormItem>
    );
  },
  // settingsFormMarkup: alertSettingsForm,
  settingsFormFactory: ({ model, onSave, onCancel, onValuesChange }) => {
    return (
      <SubFormSettings
        model={model as any}
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
      labelCol: 5,
      wrapperCol: 13,
    };
    return customProps;
  },
  validateSettings: model => validateConfigurableComponentSettings(alertSettingsForm, model),
};

interface ISubFormWrapperProps extends Omit<ISubFormProps, 'id' | 'type' | 'style'>, IStylable {
  id: string;
}

const SubFormWrapper: FC<ISubFormWrapperProps> = ({ style, ...props }) => {
  return (
    <SubFormProvider {...props}>
      <SubForm style={style} />
    </SubFormProvider>
  );
};

export default SubFormComponent;
