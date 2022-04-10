import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup } from '../../../../providers/form/models';
import { NumberOutlined } from '@ant-design/icons';
import { InputNumber } from 'antd';
import ConfigurableFormItem from '../formItem';
import { INumberFieldProps } from './models';
import settingsFormJson from './settingsForm.json';
import React from 'react';
import { getStyle, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { DataTypes } from '../../../../interfaces/dataTypes';
import { useForm } from '../../../../providers';
import ReadOnlyDisplayFormItem from '../../../readOnlyDisplayFormItem';
import { customInputNumberEventHandler } from '../utils';

const settingsForm = settingsFormJson as FormMarkup;

const NumberField: IToolboxComponent<INumberFieldProps> = {
  type: 'numberField',
  name: 'Number field',
  icon: <NumberOutlined />,
  dataTypeSupported: ({ dataType }) => dataType === DataTypes.number,
  factory: (model: INumberFieldProps, _c, form) => {
    const { formMode, isComponentDisabled, formData } = useForm();

    const isReadOnly = model?.readOnly || formMode === 'readonly';

    const disabled = isComponentDisabled(model);

    return (
      <ConfigurableFormItem model={model} initialValue={model?.defaultValue}>
        {isReadOnly ? (
          <ReadOnlyDisplayFormItem disabled={disabled} />
        ) : (
          <InputNumber
            disabled={disabled}
            bordered={!model.hideBorder}
            min={model?.min}
            max={model?.max}
            {...customInputNumberEventHandler(model, form)}
            size={model?.size}
            style={getStyle(model?.style, formData)}
          />
        )}
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  linkToModelMetadata: (model, metadata): INumberFieldProps => {
    return {
      ...model,
      label: metadata.label,
      description: metadata.description,
      min: metadata.min,
      max: metadata.max,
      // todo: add decimal points and format
    };
  },
};

export default NumberField;
