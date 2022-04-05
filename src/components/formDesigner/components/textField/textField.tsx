import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { CodeOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import ConfigurableFormItem from '../formItem';
import settingsFormJson from './settingsForm.json';
import React from 'react';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useForm } from '../../../../providers';
import { customEventHandler } from '../utils';
import { DataTypes, StringFormats } from '../../../../interfaces/dataTypes';
import ReadOnlyDisplayFormItem from '../../../readOnlyDisplayFormItem';

type TextType = 'text' | 'password';

export interface ITextFieldProps extends IConfigurableFormComponent {
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  hideBorder?: boolean;
  initialValue?: string;
  passEmptyStringByDefault?: boolean;
  textType?: TextType;
  maxLength?: number;
}

const settingsForm = settingsFormJson as FormMarkup;

const renderInput = (type: TextType) => {
  switch (type) {
    case 'password':
      return Input.Password;
    default:
      return Input;
  }
};

const TextField: IToolboxComponent<ITextFieldProps> = {
  type: 'textField',
  name: 'Text field',
  icon: <CodeOutlined />,
  dataTypeSupported: ({ dataType, dataFormat }) =>
    dataType === DataTypes.string &&
    (dataFormat === StringFormats.singleline ||
      dataFormat === StringFormats.emailAddress ||
      dataFormat === StringFormats.phoneNumber ||
      dataFormat === StringFormats.password),
  factory: (model: ITextFieldProps, _c, form) => {
    const { formMode, isComponentDisabled } = useForm();

    const disabled = isComponentDisabled(model);

    const readOnly = model?.readOnly || (formMode === 'readonly' && model.textType !== 'password');

    const inputProps: InputProps = {
      placeholder: model.placeholder,
      prefix: model.prefix,
      suffix: model.suffix,
      bordered: !model.hideBorder,
      maxLength: model.maxLength,
      size: model?.size,
      disabled,
      readOnly,
    };

    const InputComponentType = renderInput(model.textType);

    return (
      <ConfigurableFormItem model={model} initialValue={(model?.passEmptyStringByDefault && '') || model?.initialValue}>
        {readOnly ? (
          <ReadOnlyDisplayFormItem disabled={disabled} />
        ) : (
          <InputComponentType {...inputProps} disabled={disabled} {...customEventHandler(model, form)} />
        )}
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => ({
    textType: 'text',
    ...model,
  }),
  linkToModelMetadata: (model, metadata): ITextFieldProps => {
    return {
      ...model,
      maxLength: metadata.maxLength,
      textType: metadata.dataFormat === StringFormats.password ? 'password' : 'text',
    };
  },
};

export default TextField;
