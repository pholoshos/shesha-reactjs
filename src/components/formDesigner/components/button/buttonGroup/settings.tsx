import React, { FC, useState } from 'react';
import { Form, Button, Select } from 'antd';
import { IButtonGroupProps } from './models';
import { ButtonGroupSettingsModal } from './buttonGroupSettingsModal';
import SectionSeparator from '../../../../sectionSeparator';

const { Option } = Select;

export interface IButtonGroupSettingsProps {
  model: IButtonGroupProps;
  onSave: (model: IButtonGroupProps) => void;
  onCancel: () => void;
  onValuesChange?: (changedValues: any, values: IButtonGroupProps) => void;
}

const ButtonGroupSettings: FC<IButtonGroupSettingsProps> = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const onValuesChange = (changedValues, values) => {
    if (props.onValuesChange) props.onValuesChange(changedValues, values);
  };

  return (
    <Form form={form} onFinish={props.onSave} onValuesChange={onValuesChange} labelCol={{ span: 24 }}>
      <Form.Item
        name="size"
        initialValue={props.model.size}
        label="Size"
        tooltip="This will set the size for all buttons"
      >
        <Select>
          <Option value="small">Small</Option>
          <Option value="middle">Middle</Option>
          <Option value="large">Large</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="spaceSize"
        initialValue={props.model.spaceSize}
        label="Space size"
        tooltip="This will be the gap size between the buttons"
      >
        <Select>
          <Option value="small">Small</Option>
          <Option value="middle">Middle</Option>
          <Option value="large">Large</Option>
        </Select>
      </Form.Item>

      <SectionSeparator sectionName="Customization" />

      <Button onClick={() => setModalVisible(true)}>Customize Button Group</Button>

      <Form.Item name="items" initialValue={props.model.items}>
        <ButtonGroupSettingsModal
          visible={modalVisible}
          hideModal={() => {
            setModalVisible(false);
          }}
        />
      </Form.Item>
    </Form>
  );
};

export default ButtonGroupSettings;
