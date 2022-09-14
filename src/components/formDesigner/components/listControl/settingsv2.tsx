import { Checkbox, Form, Input, InputNumber, Select } from 'antd';
import React, { FC, useState } from 'react';
import SectionSeparator from '../../../sectionSeparator';
import ButtonGroupSettingsModal from '../button/buttonGroup/buttonGroupSettingsModal';
import PropertyAutocomplete from '../../../propertyAutocomplete/propertyAutocomplete';
import { IListItemsProps } from './models';
import CodeEditor from '../codeEditor/codeEditor';
import Show from '../../../show';
import { AutocompleteDto, AutocompleteRaw } from '../../../autocomplete';
import Properties from '../../../properties';
import { QueryBuilderWithModelType } from '../queryBuilder/queryBuilderWithModelType';
import { QueryBuilderPlainRenderer } from '../queryBuilder/queryBuilderFieldPlain';

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

      <FormItem
        name="uniqueStateId"
        label="Unique State ID"
        tooltip="This is important for when you want to dispatch events that are related to the list component. In a case where you have more than one List component, you\'ll need to specify which you want to target. This ID helps identify the correct component"
      >
        <Input />
      </FormItem>

      <SectionSeparator sectionName="Buttons" />

      <FormItem name="buttons" label="Buttons">
        <ButtonGroupSettingsModal />
      </FormItem>

      <SectionSeparator sectionName="Data" />

      <FormItem
        name="dataSource"
        label="Data source"
        tooltip="The list data to be used can be the data that comes with the form of can be fetched from the API"
        initialValue={['form']}
      >
        <Select>
          <Option value="form">form</Option>
          <Option value="api">api</Option>
        </Select>
      </FormItem>

      <Show when={state?.dataSource === 'api'}>
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
            <QueryBuilderWithModelType modelType={state?.entityType}>
              <QueryBuilderPlainRenderer
                useExpression={state?.useExpression}
                value={state?.filters}
              ></QueryBuilderPlainRenderer>
            </QueryBuilderWithModelType>
          </FormItem>
        </Show>
      </Show>

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

      <SectionSeparator sectionName="Selection" />

      <FormItem
        name="selectionMode"
        label="Selection Mode"
        tooltip="How items should be selected"
        initialValue={['none']}
      >
        <Select allowClear>
          <Option value="none">None</Option>
          <Option value="single">Single</Option>
          <Option value="multiple">Multiple</Option>
        </Select>
      </FormItem>

      <SectionSeparator sectionName="Delete/Remove Items" />

      <FormItem name="allowDeleteItems" label="Allow Delete Items" valuePropName="checked">
        <Checkbox />
      </FormItem>

      <Show when={state?.allowDeleteItems}>
        <FormItem
          name="allowRemoteDelete"
          label="Allow Remote Delete"
          valuePropName="checked"
          tooltip="Whether items should also be deleted remotely. If this option is selected, you need to specify the deleteUrl and also make sure the returned data has an Id property to delete against"
        >
          <Checkbox />
        </FormItem>

        <Show when={state?.allowDeleteItems && state?.allowRemoteDelete}>
          <FormItem
            name="deleteUrl"
            label="Delete URL"
            tooltip="The API url that will be used delete the list item. Write the code that returns the string"
          >
            <CodeEditor
              mode="dialog"
              setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
              name="deleteUrl"
              label="Delete URL"
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

          <FormItem
            name="deleteConfirmMessage"
            label="Delete Confirm Message"
            tooltip="The confirm message that will be displayed before you delete an item. Write the code that returns the string"
          >
            <CodeEditor
              mode="dialog"
              label="Delete Confirm Message"
              setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
              name="deleteConfirmMessage"
              type={''}
              id={''}
              description="The confirm message that will be displayed before you delete an item. Write the code that returns the string"
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
      </Show>

      <SectionSeparator sectionName="Submit" />

      <FormItem
        label="On Submit"
        name="onSubmit"
        tooltip="Write a code that return tha payload to be sent to the server when submitting this items"
      >
        <CodeEditor
          label="On Submit"
          mode="dialog"
          setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
          name="onSubmit"
          type={''}
          id={''}
          description="Write a code that return tha payload to be sent to the server when submitting this items"
          exposedVariables={[
            {
              id: 'e964ed28-3c2c-4d02-b0b7-71faf243eb53',
              name: 'items',
              description: 'List of items',
              type: 'array',
            },
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

      <FormItem label="Submit URL" name="submitUrl" tooltip="The URL to submit the list items to. This is required">
        <CodeEditor
          mode="dialog"
          label="Submit URL"
          setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
          name="submitUrl"
          type={''}
          id={''}
          description="The URL to submit the list items to"
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

      <FormItem
        name="submitHttpVerb"
        label="Submit verb"
        valuePropName="checked"
        tooltip="Write  a code that returns the string that represent the url to be used to save the items"
      >
        <Select>
          <Option value="POST">POST</Option>
          <Option value="PUT">PUT</Option>
        </Select>
      </FormItem>

      <SectionSeparator sectionName="Layout" />

      <FormItem name="labelCol" label="Label Col">
        <InputNumber min={1} max={24} defaultValue={5} step={1} />
      </FormItem>

      <FormItem name="wrapperCol" label="Wrapper Col">
        <InputNumber min={1} max={24} defaultValue={13} step={1} />
      </FormItem>

      <SectionSeparator sectionName="Search" />

      <FormItem name="showQuickSearch" label="Show Quick Search" valuePropName="checked">
        <Checkbox />
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
          <InputNumber min={200} step={5} defaultValue={400} />
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
          label="Custom Visibility"
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
