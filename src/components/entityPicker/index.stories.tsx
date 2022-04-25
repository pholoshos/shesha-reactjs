import React, { useState } from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import StoredFileUpload, { EntityPicker, IEntityPickerProps } from './';
import { CollapsiblePanel } from '..';
import { Form, Input } from 'antd';
import StoryApp from '../storyBookApp';

export default {
  title: 'Components/EntityPicker',
  component: StoredFileUpload,
} as Meta;

const defaulktProps: IEntityPickerProps = {
  tableId: 'Students_Picker_Index',
};

interface IEntityState {
  value?: string;
  selectedRow?: any;
}

// Create a master template for mapping args to render the Button component
const Template: Story<IEntityPickerProps> = args => {
  const [state, setState] = useState<IEntityState>({ value: null });
  const [form] = Form.useForm();

  return (
    <StoryApp>
      <CollapsiblePanel>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 6 }}
          form={form}
          initialValues={{
            firstName: 'Man',
            lastName: 'Down',
            entityPicker: 'Anything',
          }}
        >
          <Form.Item label="first Name" name="firstName">
            <Input />
          </Form.Item>

          <Form.Item label="Last Name" name="lastName">
            <Input />
          </Form.Item>

          <Form.Item label="Entity picker">
            <EntityPicker
              name="entityPicker"
              displayEntityKey="FullName"
              {...args}
              // onChange={(value, selectedRow) => setState({ ...state, value, selectedRow})}
              onSelect={selectedRow => {
                setState({ ...state, selectedRow });
              }}
              value={state?.value}
            />
          </Form.Item>
        </Form>
      </CollapsiblePanel>
    </StoryApp>
  );
};

export const Basic = Template.bind({});
Basic.args = { ...defaulktProps };
