import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { FontColorsOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import ConfigurableFormItem from '../formItem';
import { TextAreaProps } from 'antd/lib/input';
import settingsFormJson from './settingsForm.json';
import React from 'react';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useForm } from '../../../../providers';
import ReadOnlyDisplayFormItem from '../../../readOnlyDisplayFormItem';
import { DataTypes, StringFormats } from '../../../../interfaces/dataTypes';
import { customEventHandler } from '../utils';

export interface ITextAreaProps extends IConfigurableFormComponent {
  placeholder?: string;
  showCount: boolean;
  autoSize: boolean;
  maxLength?: number;
  allowClear: boolean;
  hideBorder?: boolean;
  initialValue?: string;
  passEmptyStringByDefault?: boolean;
}

const settingsForm = settingsFormJson as FormMarkup;

const TextField: IToolboxComponent<ITextAreaProps> = {
  type: 'textArea',
  name: 'Text Area',
  icon: <FontColorsOutlined />,
  dataTypeSupported: ({ dataType, dataFormat }) =>
    dataType === DataTypes.string && dataFormat === StringFormats.multiline,
  factory: (model: ITextAreaProps, _c, form) => {
    const textAreaProps: TextAreaProps = {
      placeholder: model.placeholder,
      disabled: model.disabled,
      autoSize: model.autoSize ? { minRows: 2 } : false,
      showCount: model.showCount,
      maxLength: model.maxLength,
      allowClear: model.allowClear,
      bordered: !model.hideBorder,
      size: model?.size,
    };

    const { formMode, isComponentDisabled } = useForm();

    const isReadOnly = model?.readOnly || formMode === 'readonly';

    const disabled = isComponentDisabled(model);

    return (
      <ConfigurableFormItem model={model} initialValue={(model?.passEmptyStringByDefault && '') || model?.initialValue}>
        {isReadOnly ? (
          <ReadOnlyDisplayFormItem disabled={disabled} />
        ) : (
          <Input.TextArea rows={2} {...textAreaProps} disabled={disabled} {...customEventHandler(model, form)} />
        )}
      </ConfigurableFormItem>
    );
  },
  initModel: model => {
    const textAreaModel: ITextAreaProps = {
      ...model,
      label: 'Text Area',
      autoSize: false,
      showCount: false,
      allowClear: false,
    };

    return textAreaModel;
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  linkToModelMetadata: (model, metadata): ITextAreaProps => {
    return {
      ...model,
      maxLength: metadata.maxLength,
    };
  },
};

export default TextField;
