import React, { useState } from 'react';
import { ITableColumn, IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { ColumnWidthOutlined } from '@ant-design/icons';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { DataTypes } from '../../../../interfaces/dataTypes';
import { useSubscribe } from '../../../../hooks';
import { Select } from 'antd';
import { COLUMNS_CHANGED_EVENT_NAME } from '../../../entityPicker';
import ConfigurableFormItem from '../formItem';
import settingsFormJson from './settingsForm.json';

export interface IEntityPickerComponentProps extends IConfigurableFormComponent {}

const settingsForm = settingsFormJson as FormMarkup;

const { Option } = Select;

const ColumnsSelectorComponent: IToolboxComponent<IEntityPickerComponentProps> = {
  type: 'columnsSelector',
  name: 'Columns Selector',
  icon: <ColumnWidthOutlined />,
  isHidden: true,
  dataTypeSupported: ({ dataType }) => dataType === DataTypes.entityReference,
  factory: (model: IEntityPickerComponentProps) => {
    const [columns, setColumns] = useState<ITableColumn[]>([]);

    useSubscribe(COLUMNS_CHANGED_EVENT_NAME, data => {
      if (Array.isArray(data?.state)) {
        setColumns(data?.state);
      }
    });

    return (
      <ConfigurableFormItem model={model} initialValue={model?.defaultValue}>
        <Select>
          {columns?.map(column => (
            <Option key={column?.id} value={column?.id}>
              {column?.caption}
            </Option>
          ))}
        </Select>
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
};

export default ColumnsSelectorComponent;
