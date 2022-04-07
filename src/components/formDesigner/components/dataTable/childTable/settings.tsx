import React, { FC, useMemo, useState } from 'react';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { SectionSeparator } from '../../../..';
import { IChildTableSettingsProps } from './models';
import { ToolbarSettingsModal } from '../../dataTable/toolbar/toolbarSettingsModal';
import TableViewSelectorSettingsModal from '../tableViewSelector/tableViewSelectorSettingsModal';
import { QueryBuilderProvider, useForm, useMetadata } from '../../../../../providers';
import { ITableColumn } from '../../../../../interfaces';
import { TableDataSourceType } from '../../../../../providers/dataTable/interfaces';
import { IProperty } from '../../../../../providers/queryBuilder/models';
import CodeEditor from '../../codeEditor/codeEditor';
import FilterSettingsModal from '../filter/filterSettingsModal';
import { CustomFilter } from '../filter/filterComponent';

export interface IChildDataTableSettingsProps {
  model: IChildTableSettingsProps;
  onSave: (model: IChildTableSettingsProps) => void;
  onCancel: () => void;
  onValuesChange?: (changedValues: any, values: IChildTableSettingsProps) => void;
}

interface IChildDataTableSettingsState {
  toolbarModalVisible?: boolean;
  filtersModalVisible?: boolean;
  data?: IChildTableSettingsProps;
}

export const ChildDataTableSettings: FC<IChildDataTableSettingsProps> = ({ onSave, model, onValuesChange }) => {
  const [state, setState] = useState<IChildDataTableSettingsState>({ data: model });
  const [form] = Form.useForm();

  const toggleToolbarModal = () => setState(prev => ({ ...prev, toolbarModalVisible: !prev?.toolbarModalVisible }));

  const initialValues = {
    title: model?.title,
    parentEntityId: model?.parentEntityId,
    allowQuickSearch: model?.allowQuickSearch,
    toolbarItems: model?.toolbarItems,
    filters: model?.filters,
    defaultSelectedFilterId: model?.defaultSelectedFilterId,
    customVisibility: model?.customVisibility,
  };

  return (
    <Form
      form={form}
      onFinish={onSave}
      layout="vertical"
      onValuesChange={(changedValues, values) => {
        setState(prev => ({ ...prev, data: values }));

        onValuesChange(changedValues, values);
      }}
      initialValues={initialValues}
    >
      <SectionSeparator sectionName={'Display'} />

      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true }]}
        initialValue={model.title}
        tooltip="This can be a literal string like below 'Details for {{data.companyName}}'"
      >
        <Input placeholder="Details for {{data.companyName}}" />
      </Form.Item>

      <Form.Item name="allowQuickSearch" label="Allow Quick Search" valuePropName="checked">
        <Checkbox checked={model?.allowQuickSearch} />
      </Form.Item>

      <SectionSeparator sectionName="Toolbar" />

      <Button onClick={toggleToolbarModal}>Configure Toolbar</Button>

      <Form.Item name="toolbarItems" initialValue={model.toolbarItems}>
        <ToolbarSettingsModal
          visible={state?.toolbarModalVisible}
          allowAddGroups={false}
          hideModal={toggleToolbarModal}
        />
      </Form.Item>

      <SectionSeparator sectionName="Filter" />

      <Form.Item name="filters" initialValue={model.filters}>
        <CustomFilter />
      </Form.Item>

      <Form.Item name="defaultSelectedFilterId" label="Selected filter" required>
        <Select value={state?.data?.defaultSelectedFilterId} allowClear showSearch>
          {state?.data?.filters?.map(({ id, name }) => (
            <Select.Option value={id} key={id}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

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
          description="Enter custom visibility code.  You must return true to show the component. The global variable data is provided, and allows you to access the data of any form component, by using its API key."
        />
      </Form.Item>
    </Form>
  );
};

export default ChildDataTableSettings;
