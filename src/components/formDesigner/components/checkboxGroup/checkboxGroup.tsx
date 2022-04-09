import { ProfileOutlined } from '@ant-design/icons';
import React from 'react';
import { useForm } from '../../../..';
import { IToolboxComponent } from '../../../../interfaces';
import { DataTypes } from '../../../../interfaces/dataTypes';
import { FormMarkup } from '../../../../providers/form/models';
import { getStyle, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import ConfigurableFormItem from '../formItem';
import RefListCheckboxGroup from './refListCheckboxGroup';
import settingsFormJson from './settingsForm.json';
import { ICheckboxGroupProps } from './utils';

const settingsForm = settingsFormJson as FormMarkup;

interface IEnhancedICheckboxGoupProps extends Omit<ICheckboxGroupProps, 'style'> {
  style?: string;
}

const CheckboxGroupComponent: IToolboxComponent<IEnhancedICheckboxGoupProps> = {
  type: 'checkboxGroup',
  name: 'Checkbox group',
  icon: <ProfileOutlined />,
  dataTypeSupported: ({ dataType }) => dataType === DataTypes.referenceListItem,
  factory: (model: IEnhancedICheckboxGoupProps) => {
    const { formData } = useForm();

    return (
      <ConfigurableFormItem model={model}>
        <RefListCheckboxGroup {...model} style={getStyle(model?.style, formData)} />
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => {
    const customProps: IEnhancedICheckboxGoupProps = {
      ...model,
      dataSourceType: 'values',
      direction: 'horizontal',
      mode: 'single',
    };
    return customProps;
  },
  linkToModelMetadata: (model, metadata): IEnhancedICheckboxGoupProps => {
    return {
      ...model,
      dataSourceType: metadata.dataType === DataTypes.referenceListItem ? 'referenceList' : 'values',
      referenceListNamespace: metadata.referenceListNamespace,
      referenceListName: metadata.referenceListName,
    };
  },
};

export default CheckboxGroupComponent;
