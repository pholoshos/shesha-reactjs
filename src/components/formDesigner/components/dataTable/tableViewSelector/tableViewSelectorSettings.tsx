import React from 'react';
import { Form } from 'antd';
import { ITableViewSelectorProps } from './models';
import TableViewSelectorSettingsModal from './tableViewSelectorSettingsModal';
import { SectionSeparator } from '../../../../..';

export interface ITableViewSelectorSettingsProps {
  model: ITableViewSelectorProps;
  onSave: (model: ITableViewSelectorProps) => void;
  onCancel: () => void;
  onValuesChange?: (changedValues: any, values: ITableViewSelectorProps) => void;
}

function TableViewSelectorSettings(props: ITableViewSelectorSettingsProps) {
  const [form] = Form.useForm();

  const handleValuesChange = (changedValues: any, values: ITableViewSelectorProps) => {
    if (props.onValuesChange) {
      props.onValuesChange(changedValues, values);
    }
  };

  return (
    <Form form={form} onFinish={props.onSave} onValuesChange={handleValuesChange} initialValues={props.model}>
      <SectionSeparator sectionName="Filters" />
      <Form.Item name="filters">
        <TableViewSelectorSettingsModal />
      </Form.Item>
    </Form>
  );
}

export default TableViewSelectorSettings;