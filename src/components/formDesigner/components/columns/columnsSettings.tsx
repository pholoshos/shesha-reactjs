import React from 'react';
import { Form, Input, InputNumber } from 'antd';
import { IColumnsComponentProps } from './columns';
import ColumnsList from './columnsList';

export interface IProps {
  model: IColumnsComponentProps;
  onSave: (model: IColumnsComponentProps) => void;
  onCancel: () => void;
  onValuesChange?: (changedValues: any, values: IColumnsComponentProps) => void;
}

function ColumnsSettings({ onSave, model, onValuesChange }: IProps) {
  const [form] = Form.useForm();

  return (
    <Form form={form} onFinish={onSave} layout="vertical" onValuesChange={onValuesChange}>
      <Form.Item name="name" label="Name" rules={[{ required: true }]} initialValue={model?.name}>
        <Input />
      </Form.Item>

      <Form.Item name="gutterX" label="Gutter X" initialValue={model?.gutterX}>
        <InputNumber min={1} max={48} step={4} />
      </Form.Item>

      <Form.Item name="gutterY" label="Gutter Y" initialValue={model?.gutterX}>
        <InputNumber min={1} max={48} step={4} />
      </Form.Item>

      <Form.Item name="label" label="Label" initialValue={model?.label}>
        <Input />
      </Form.Item>

      <Form.Item name="columns" label="Columns" initialValue={model?.columns || []}>
        <ColumnsList />
      </Form.Item>
    </Form>
  );
}

export default ColumnsSettings;
