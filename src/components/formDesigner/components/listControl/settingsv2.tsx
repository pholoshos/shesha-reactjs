import { Checkbox, Form, Input, InputNumber, Select, SelectProps } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import SectionSeparator from '../../../sectionSeparator';
import ButtonGroupSettingsModal from '../button/buttonGroup/buttonGroupSettingsModal';
import PropertyAutocomplete from '../propertyAutocomplete/propertyAutocomplete';
import { IListItemsProps, IProperty } from './models';
import CodeEditor from '../codeEditor/codeEditor';
import Show from '../../../show';
import { MetadataProvider, useMetadata } from '../../../../providers';
import { AutocompleteRaw } from '../../../autocomplete';
import { QueryBuilderWithModelType } from './queryBuilder';

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

  const initialValues: IListItemsProps = {
    dataSourceUrl: model?.dataSourceUrl,
    queryParamsExpression: model?.queryParamsExpression,
    bordered: model?.bordered,
    title: model?.title,
    footer: model?.footer,
    formId: model?.formId,
    allowAddAndRemove: model?.allowAddAndRemove,
    submitUrl: model?.submitUrl,
    submitHttpVerb: model?.submitHttpVerb,
    onSubmit: model?.onSubmit,
    showPagination: model?.showPagination,
    paginationDefaultPageSize: model?.paginationDefaultPageSize,
    allowSubmit: model?.allowSubmit,
    buttons: model?.buttons,
    maxHeight: model?.maxHeight,
    labelCol: model?.labelCol,
    wrapperCol: model?.wrapperCol,
    dataSource: model?.dataSource,
    renderStrategy: model?.renderStrategy,
    entityType: model?.entityType,
    properties: model?.properties,
    filters: model?.filters,
    useExpression: model?.useExpression,
  };

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
      initialValues={initialValues}
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

      <FormItem name="bordered" label="Bordered" valuePropName="checked">
        <Checkbox />
      </FormItem>

      <FormItem name="allowAddAndRemove" label="Allow Add/Remove Items" valuePropName="checked">
        <Checkbox />
      </FormItem>

      <FormItem
        name="dataSource"
        label="Data source"
        valuePropName="checked"
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
          name="customVisibility"
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
        valuePropName="checked"
        tooltip="Which form should be used to render the data? If current form, you can drag items, else specify form path"
      >
        <Select>
          <Option value="dragAndDrop">Drag And Drop</Option>
          <Option value="externalForm">External Form</Option>
        </Select>
      </FormItem>

      <Show when={state?.renderStrategy === 'externalForm'}>
        <FormItem name="formId" label="Form Path">
          <AutocompleteRaw dataSourceType={'url'} />
        </FormItem>
      </Show>

      <SectionSeparator sectionName="Submit" />

      <FormItem name="allowSubmit" label="Allow submit" valuePropName="checked">
        <Checkbox />
      </FormItem>

      <Show when={state?.allowSubmit}>
        <FormItem
          label="On Submit"
          name="onSubmit"
          tooltip="Write a code that return tha payload to be sent to the server when submitting this items"
        >
          <CodeEditor
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
      </Show>

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

interface IPropertiesWrapperProps extends SelectProps {
  modelType: string;
  mode?: 'multiple' | 'tags';
}

const Properties: FC<IPropertiesWrapperProps> = ({ modelType, children, ...props }) => {
  return (
    <MetadataProvider modelType={modelType}>
      <PropertiesEditor {...props}>{children}</PropertiesEditor>
    </MetadataProvider>
  );
};

interface PropertiesEditorProps extends SelectProps {
  mode?: 'multiple' | 'tags';
}

const PropertiesEditor: FC<PropertiesEditorProps> = ({ mode, ...props }) => {
  const metadata = useMetadata(false);

  const fields = useMemo<IProperty[]>(() => {
    if (metadata) {
      const properties = metadata?.metadata?.properties || [];
      if (Boolean(properties))
        return properties.map<IProperty>(property => ({
          label: property.label,
          propertyName: property.path,
          dataType: property.dataType,
        }));
    }
    return null;
  }, [metadata, metadata?.metadata]);

  return (
    <Select mode={mode} showSearch allowClear {...props}>
      {fields?.map(({ label, propertyName }) => (
        <Option value={propertyName} key={propertyName}>
          {label}
        </Option>
      ))}
    </Select>
  );
};
