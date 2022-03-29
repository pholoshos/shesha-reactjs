import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Radio, Space, SpaceProps } from 'antd';
import ConfigurableFormItem from '../formItem';
import settingsFormJson from './settingsForm.json';
import React from 'react';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useForm } from '../../../../providers';
import { DataTypes } from '../../../../interfaces/dataTypes';
import ReadOnlyDisplayFormItem from '../../../readOnlyDisplayFormItem';

export interface ICheckItem {
  id: string;
  name: string;
  value: string;
}

export type DataSourceType = 'values' | 'reflist';

export interface IRadioProps extends IConfigurableFormComponent {
  items?: ICheckItem[];
  dataSourceType: DataSourceType;
  direction?: SpaceProps['direction'];
}

const settingsForm = settingsFormJson as FormMarkup;

const TextField: IToolboxComponent<IRadioProps> = {
  type: 'radio',
  name: 'Radio',
  icon: <CheckCircleOutlined />,
  dataTypeSupported: ({ dataType }) => dataType === DataTypes.array,
  factory: (model: IRadioProps) => {
    const { items = [] } = model;

    const { formMode, isComponentDisabled } = useForm();

    const isReadOnly = model?.readOnly || formMode === 'readonly';

    const disabled = isComponentDisabled(model);

    const renderCheckGroup = () => (
      <Radio.Group disabled={disabled}>
        <Space direction={model?.direction}>
          {items.map((checkItem, index) => (
            <Radio key={index} value={checkItem.value}>
              {checkItem.name}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    );

    return (
      <ConfigurableFormItem model={model}>
        {isReadOnly ? (
          <ReadOnlyDisplayFormItem type="radiogroup" disabled={disabled} render={renderCheckGroup} />
        ) : (
          renderCheckGroup()
        )}
      </ConfigurableFormItem>
    );
  },
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

export default TextField;
