import React, { FC } from 'react';
import { Form, Select, Input } from 'antd';
import SectionSeparator from '../../../sectionSeparator';
import CodeEditor from '../codeEditor/codeEditor';
import EditableTagGroup from '../../../editableTagGroup';
import { ITabPaneProps, ITabsComponentProps } from './models';
import ItemListSettingsModal from '../itemListConfigurator/itemListSettingsModal';
import itemSettings from './itemSettings.json';
import { FormMarkup } from '../../../../providers/form/models';
import { nanoid } from 'nanoid/non-secure';

const { Option } = Select;

export interface ITabSettingsProps {
  model: ITabsComponentProps;
  onSave: (model: ITabsComponentProps) => void;
  onCancel: () => void;
  onValuesChange?: (changedValues: any, values: ITabsComponentProps) => void;
}

const TabSettings: FC<ITabSettingsProps> = props => {
  const [form] = Form.useForm();

  const onValuesChange = (changedValues, values) => {
    if (props.onValuesChange) props.onValuesChange(changedValues, values);
  };

  const onAddNewItem = (_, count: number) => {
    const buttonProps: ITabPaneProps = {
      id: nanoid(),
      itemType: 'item',
      sortOrder: count,
      name: `Tab${count + 1}`,
      key: `tabKey${count + 1}`,
      title: `Tab ${count + 1}`,
      subTitle: `Tab ${count + 1}`,
      description: `Tab ${count + 1}`,
      nextButtonText: 'Next',
      backButtonText: 'Back',
      components: [],
    };

    return buttonProps;
  };

  const tabs = props.model.tabs?.map(item => ({ ...item, label: item?.title }));

  return (
    <Form form={form} onFinish={props.onSave} onValuesChange={onValuesChange} labelCol={{ span: 24 }}>
      <SectionSeparator sectionName="Display" />
      <Form.Item name="name" initialValue={props.model.name} label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="wizardType" initialValue={props.model.wizardType} label="Wizard Type">
        <Select allowClear>
          <Option value="default">Default</Option>
          <Option value="navigation">Navigation</Option>
        </Select>
      </Form.Item>

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
        name="visibility"
        initialValue={props.model.visibility}
        label="Visibility"
        tooltip="This property will eventually replace the 'hidden' property and other properties that toggle visibility on the UI and payload"
      >
        <Select>
          <Option value="Yes">Yes (Display in UI and include in payload)</Option>
          <Option value="No">No (Only include in payload)</Option>
          <Option value="Removed">Removed (Remove from UI and exlude from payload)</Option>
        </Select>
      </Form.Item>

      <SectionSeparator sectionName="Configure Wizard Steps" />

      <Form.Item name="tabs" initialValue={tabs}>
        <ItemListSettingsModal
          options={{ onAddNewItem }}
          title="Configure Wizard Steps"
          heading="Settings"
          callToAction="Configure Wizard Steps"
          itemTypeMarkup={itemSettings as FormMarkup}
          allowAddGroups={false}
        />
      </Form.Item>

      <SectionSeparator sectionName="Security" />

      <Form.Item
        label="Custom Visibility"
        name="customVisibility"
        tooltip="Enter custom visibility code.  You must return true to show the component. The global variable data is provided, and allows you to access the data of any form component, by using its API key."
      >
        <CodeEditor
          mode="dialog"
          setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
          name="customVisibility"
          type={''}
          id={''}
          label="Custom Visibility"
          description="Enter custom visibility code.  You must return true to show the component. The global variable data is provided, and allows you to access the data of any form component, by using its API key."
        />
      </Form.Item>

      <Form.Item
        label="Permissions"
        name="permissions"
        initialValue={props.model.permissions}
        tooltip="Enter a list of permissions that should be associated with this component"
      >
        <EditableTagGroup />
      </Form.Item>
    </Form>
  );
};

export default TabSettings;
