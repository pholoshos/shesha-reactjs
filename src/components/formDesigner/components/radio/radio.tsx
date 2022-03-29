import { CheckCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { DataTypes } from '../../../../interfaces/dataTypes';
import { FormMarkup } from '../../../../providers/form/models';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import ConfigurableFormItem from '../formItem';
import RadioGroup from './radioGroup';
import settingsFormJson from './settingsForm.json';
import { IRadioProps } from './utils';

const settingsForm = settingsFormJson as FormMarkup;

const Radio: IToolboxComponent<IRadioProps> = {
  type: 'radio',
  name: 'Radio',
  icon: <CheckCircleOutlined />,
  dataTypeSupported: ({ dataType }) => dataType === DataTypes.array,
  factory: (model: IRadioProps) => (
    <ConfigurableFormItem model={model}>
      <RadioGroup {...model} />
    </ConfigurableFormItem>
  ),

  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => {
    const customModel: IRadioProps = {
      ...model,
      dataSourceType: 'values',
    };
    return customModel;
  },
};

export default Radio;
