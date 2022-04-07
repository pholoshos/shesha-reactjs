import React, { useState } from 'react';
import { Form, Button } from 'antd';
import { ITableViewSelectorProps } from './models';
import FilterSettingsModal from './filterSettingsModal';

export interface IFilterSettingsSettingsProps {
  model: ITableViewSelectorProps;
  onSave: (model: ITableViewSelectorProps) => void;
  onCancel: () => void;
  onValuesChange?: (changedValues: any, values: ITableViewSelectorProps) => void;
}

function FilterSettings({ model, onSave, onValuesChange }: IFilterSettingsSettingsProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  return (
    <Form form={form} onFinish={onSave} onValuesChange={onValuesChange}>
      <Button onClick={() => setModalVisible(true)}>Customise Filters</Button>
      <Form.Item name="filterssss" initialValue={model.filters}>
        <FilterSettingsModal
          visible={modalVisible}
          hideModal={() => {
            setModalVisible(false);
          }}
        />
      </Form.Item>
    </Form>
  );
}

export default FilterSettings;
