import { ProfileOutlined } from '@ant-design/icons';
import React from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { DataTypes } from '../../../../interfaces/dataTypes';
import { FormMarkup } from '../../../../providers/form/models';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import ConfigurableFormItem from '../formItem';
import RefListCheckboxGroup from './refListCheckboxGroup';
import settingsFormJson from './settingsForm.json';
import { ICheckboxGoupProps } from './utils';

const settingsForm = settingsFormJson as FormMarkup;

const CheckboxGroupComponent: IToolboxComponent<ICheckboxGoupProps> = {
  type: 'checkboxGroup',
  name: 'Checkbox group',
  icon: <ProfileOutlined />,
  dataTypeSupported: ({ dataType }) => dataType === DataTypes.referenceListItem,
  factory: (model: ICheckboxGoupProps) => {
    return (
      <ConfigurableFormItem model={model}>
        <RefListCheckboxGroup {...model} />
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => {
    const customProps: ICheckboxGoupProps = {
      ...model,
      dataSourceType: 'values',
    };
    return customProps;
  },
  linkToModelMetadata: (model, metadata): ICheckboxGoupProps => {
    return {
      ...model,
      dataSourceType: metadata.dataType === DataTypes.referenceListItem ? 'referenceList' : 'values',
      referenceListNamespace: metadata.referenceListNamespace,
      referenceListName: metadata.referenceListName,
      mode: 'single',
    };
  },
};

export default CheckboxGroupComponent;
