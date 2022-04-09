import { CheckCircleOutlined } from '@ant-design/icons';
import React, { CSSProperties } from 'react';
import { useForm } from '../../../..';
import { IToolboxComponent } from '../../../../interfaces';
import { DataTypes } from '../../../../interfaces/dataTypes';
import { FormMarkup } from '../../../../providers/form/models';
import { getStyle, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import ConfigurableFormItem from '../formItem';
import RadioGroup from './radioGroup';
import settingsFormJson from './settingsForm.json';
import { IRadioProps } from './utils';

const settingsForm = settingsFormJson as FormMarkup;

interface IEnhancedRadioProps extends Omit<IRadioProps, 'style'> {
  style?: string;
}

const Radio: IToolboxComponent<IEnhancedRadioProps> = {
  type: 'radio',
  name: 'Radio',
  icon: <CheckCircleOutlined />,
  dataTypeSupported: ({ dataType }) => dataType === DataTypes.array,
  factory: ({ style, ...model }: IEnhancedRadioProps) => {
    const { formData } = useForm();

    return (
      <ConfigurableFormItem model={model}>
        <RadioGroup {...model} style={getStyle(style, formData)} />
      </ConfigurableFormItem>
    );
  },

  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => {
    const customModel: IEnhancedRadioProps = {
      ...model,
      dataSourceType: 'values',
      direction: 'horizontal',
    };
    return customModel;
  },
};

export default Radio;
