import { Checkbox, Form, Input, InputNumber, Select } from 'antd';
import React, { FC, useState } from 'react';
import SectionSeparator from '../../../sectionSeparator';
import ButtonGroupSettingsModal from '../button/buttonGroup/buttonGroupSettingsModal';
import PropertyAutocomplete from '../propertyAutocomplete/propertyAutocomplete';
import { IListItemsProps } from './models';
import CodeEditor from '../codeEditor/codeEditor';
import Show from '../../../show';
import { AutocompleteDto, AutocompleteRaw } from '../../../autocomplete';
import { QueryBuilderWithModelType } from './queryBuilder';
import Properties from '../../../properties';

const Option = Select.Option;

const FormItem = Form.Item;

export interface IListControlSettingsProps {
  model: IListItemsProps;
  onSave: (model: IListItemsProps) => void;
  onCancel: () => void;
  onValuesChange?: (changedValues: any, values: IListItemsProps) => void;
}

interface IListSettingsState extends IListItemsProps {}

export const ListControlSettings: FC<IListControlSettingsProps> = ({ onSave, model, onValuesChange }) => {
  const [state, setState] = useState<IListSettingsState>(model);
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      onFinish={onSave}
      layout="vertical"
      onValuesChange={(changedValues, values: IListItemsProps) => {
        const incomingState = { ...values };

        if (!values?.entityType) {
          incomingState.filters = null;
          incomingState.properties = null;
        }

        setState(prev => ({ ...prev, ...incomingState }));

        onValuesChange(changedValues, incomingState);
      }}
      initialValues={model}
    >
      <SectionSeparator sectionName="Display" />

      <FormItem name="name" label="Name" rules={[{ required: true }]}>
        <PropertyAutocomplete id="fb71cb51-884f-4f34-aa77-820c12276c95" />
      </FormItem>

      <FormItem name="label" label="Label">
        <Input />
      </FormItem>

      <Form.Item name="hideLabel" label="Hide Label" valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <FormItem name="title" label="Title">
        <Input />
      </FormItem>

      <SectionSeparator sectionName="Buttons" />

      <FormItem name="buttons" label="Buttons">
        <ButtonGroupSettingsModal />
      </FormItem>

      <SectionSeparator sectionName="" />

      <FormItem name="allowRemoveItems" label="Allow Delete Items" valuePropName="checked">
        <Checkbox />
      </FormItem>

      <Show when={state?.allowRemoveItems}>
        <FormItem
          name="deleteUrl"
          tooltip="The API url that will be used delete the list item. Write the code that returns the string"
        >
          <CodeEditor
            mode="dialog"
            setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
            name="deleteUrl"
            type={''}
            id={''}
            description="The API url that will be used delete the list item. Write the code that returns the string"
            exposedVariables={[
              {
                id: '5c82e997-f50f-4591-8112-31b58ac381f0',
                name: 'data',
                description: 'Form data',
                type: 'object',
              },
              {
                id: '788673a5-5eb9-4a9a-a34b-d8cea9cacb3c',
                name: 'item',
                description: 'Item to delete',
                type: 'object',
              },
              {
                id: '65b71112-d412-401f-af15-1d3080f85319',
                name: 'globalState',
                description: 'The global state',
                type: 'object',
              },
            ]}
          />
        </FormItem>
      </Show>

      <FormItem
        name="dataSource"
        label="Data source"
        tooltip="The list data to be used can be the data that comes with the form of can be fetched from the API"
      >
        <Select>
          <Option value="form">form</Option>
          <Option value="api">api</Option>
        </Select>
      </FormItem>

      <FormItem
        label="API Url"
        name="dataSourceUrl"
        tooltip="The API url that will be used to fetch the list data. Write the code that returns the string"
      >
        <CodeEditor
          mode="dialog"
          setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
          name="dataSourceUrl"
          type={''}
          id={''}
          description="The API url that will be used to fetch the list data. Write the code that returns the string"
          exposedVariables={[
            {
              id: '788673a5-5eb9-4a9a-a34b-d8cea9cacb3c',
              name: 'data',
              description: 'Form data',
              type: 'object',
            },
            {
              id: '65b71112-d412-401f-af15-1d3080f85319',
              name: 'globalState',
              description: 'The global state',
              type: 'object',
            },
            {
              id: '3633b881-43f4-4779-9f8c-da3de9ecf9b8',
              name: 'queryParams',
              description: 'Query parameters',
              type: 'object',
            },
          ]}
        />
      </FormItem>

      <SectionSeparator sectionName="Render" />

      <FormItem
        name="renderStrategy"
        label="Render Strategy"
        tooltip="Which form should be used to render the data? If current form, you can drag items, else specify form path"
      >
        <Select>
          <Option value="dragAndDrop">Drag And Drop</Option>
          <Option value="externalForm">External Form</Option>
        </Select>
      </FormItem>

      <Show when={state?.renderStrategy === 'externalForm'}>
        <FormItem name="formPath" label="Form Path">
          <AutocompleteDto
            dataSourceType="entitiesList"
            dataSourceUrl="/api/Autocomplete/List"
            typeShortAlias="Shesha.Framework.Form"
          />
        </FormItem>
      </Show>

      <SectionSeparator sectionName="Submit" />

      <FormItem name="uniqueStateId" label="Unique State ID">
        <Input />
      </FormItem>

      <SectionSeparator sectionName="Filters" />

      <FormItem name="entityType" label="Entity type">
        <AutocompleteRaw dataSourceType="url" dataSourceUrl="/api/services/app/Metadata/TypeAutocomplete" />
      </FormItem>

      <Show when={Boolean(state?.entityType)}>
        <FormItem name="properties" label="Properties">
          <Properties modelType={state?.entityType} mode="multiple" value={state?.properties} />
        </FormItem>

        <SectionSeparator sectionName="Query builder" />

        <FormItem name="useExpression" label="Use Expression" valuePropName="checked">
          <Checkbox />
        </FormItem>

        <FormItem label="Query builder" name="filters">
          <QueryBuilderWithModelType
            modelType={state?.entityType}
            useExpression={state?.useExpression}
            value={state?.filters}
          />
        </FormItem>
      </Show>

      <SectionSeparator sectionName="Layout" />

      <FormItem name="labelCol" label="">
        <InputNumber min={1} max={24} defaultValue={5} />
      </FormItem>

      <FormItem name="wrapperCol" label="Wrapper Col">
        <InputNumber min={1} max={24} defaultValue={13} />
      </FormItem>

      <SectionSeparator sectionName="Pagination" />

      <FormItem name="showPagination" label="Show pagination" valuePropName="checked">
        <Checkbox />
      </FormItem>

      <Show when={state?.showPagination}>
        <FormItem name="paginationDefaultPageSize" label="Default page size">
          <InputNumber min={5} max={50} step={5} defaultValue={10} />
        </FormItem>
      </Show>

      <Show when={!state?.showPagination}>
        <FormItem name="maxHeight" label="Max height">
          <InputNumber min={200} step={5} defaultValue={13} />
        </FormItem>
      </Show>

      <SectionSeparator sectionName="Visibility" />

      <FormItem
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
          exposedVariables={[
            {
              id: '788673a5-5eb9-4a9a-a34b-d8cea9cacb3c',
              name: 'data',
              description: 'Form data',
              type: 'object',
            },
            {
              id: '65b71112-d412-401f-af15-1d3080f85319',
              name: 'globalState',
              description: 'The global state',
              type: 'object',
            },
            {
              id: '3633b881-43f4-4779-9f8c-da3de9ecf9b8',
              name: 'queryParams',
              description: 'Query parameters',
              type: 'object',
            },
          ]}
        />
      </FormItem>
    </Form>
  );
};
