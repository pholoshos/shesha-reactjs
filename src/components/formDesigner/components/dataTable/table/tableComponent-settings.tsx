import React, { useState } from 'react';
import { Form, Button, Input } from 'antd';
import { ITableComponentBaseProps, ITableComponentProps } from './models';
import { ColumnsEditorModal } from './columnsEditor/columnsEditorModal';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import SectionSeparator from '../../../../sectionSeparator';
import Show from '../../../../show';
import { ITableCrudConfig } from '../../../../../providers/dataTable/interfaces';
import CodeEditor from '../../codeEditor/codeEditor';

export interface IProps {
  model: ITableComponentProps;
  onSave: (model: ITableComponentProps) => void;
  onCancel: () => void;
  onValuesChange?: (changedValues: any, values: ITableComponentProps) => void;
}

interface IColumnsSettingsState extends ITableCrudConfig {
  showColumnsModal?: boolean;
  isCrud?: boolean;
  allowRowDragAndDrop?: boolean;
}

function ColumnsSettings(props: IProps) {
  const [state, setState] = useState<IColumnsSettingsState>({
    showColumnsModal: false,
    allowRowDragAndDrop: props?.model?.allowRowDragAndDrop,
  });
  const [form] = Form.useForm();

  const toggleColumnsModal = () => setState(prev => ({ ...prev, showColumnsModal: !prev?.showColumnsModal }));

  const initialState: ITableComponentBaseProps = {
    items: props?.model?.items,
    useMultiselect: props?.model?.useMultiselect,
    crud: props?.model?.crud,
    overrideDefaultCrudBehavior: props?.model?.overrideDefaultCrudBehavior,
    createUrl: props?.model?.createUrl,
    deleteUrl: props?.model?.deleteUrl,
    detailsUrl: props?.model?.detailsUrl,
    updateUrl: props?.model?.updateUrl,
    isNotWrapped: props?.model?.isNotWrapped,
    allowRowDragAndDrop: props?.model?.allowRowDragAndDrop,
    onRowDropped: props?.model?.onRowDropped,
  };

  const onValuesChange = (changedValues, values: ITableComponentBaseProps) => {
    setState(prev => ({ ...prev, allowRowDragAndDrop: values?.allowRowDragAndDrop }));

    if (props.onValuesChange) props.onValuesChange(changedValues, values as any);
  };

  return (
    <Form
      form={form}
      onFinish={props.onSave}
      onValuesChange={onValuesChange}
      initialValues={initialState}
      wrapperCol={{ span: 24 }}
      labelCol={{ span: 24 }}
    >
      <Button onClick={toggleColumnsModal}>Customize Columns</Button>

      <Form.Item name="items">
        <ColumnsEditorModal visible={state?.showColumnsModal} hideModal={toggleColumnsModal} />
      </Form.Item>

      <Form.Item name="useMultiselect" label="Use Multi-select" valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <SectionSeparator sectionName="Editing/CRUD" />

      <Form.Item
        name="crud"
        label="Allow editing/CRUD mode?"
        valuePropName="checked"
        tooltip="Whether you should be able to perform CRUD functionalities on this table"
      >
        <Checkbox />
      </Form.Item>

      <Form.Item
        name="isNotWrapped"
        label="Is Not Wrapped"
        valuePropName="checked"
        tooltip="By default, a table is wrapped inside"
      >
        <Checkbox />
      </Form.Item>

      <Show when={true}>
        <Show when={false}>
          <Form.Item
            name="overrideDefaultCrudBehavior"
            label="Override Default Crud Behavior?"
            valuePropName="checked"
            tooltip="By default you get custom action columns as part of editing mode. To get full control, you can check this to rely on custom behavior you define"
          >
            <Checkbox />
          </Form.Item>
        </Show>

        <Form.Item name="createUrl" label="Create URL">
          <Input />
        </Form.Item>

        <Form.Item name="deleteUrl" label="Delete URL">
          <Input />
        </Form.Item>

        <Form.Item name="detailsUrl" label="Get URL">
          <Input />
        </Form.Item>

        <Form.Item name="updateUrl" label="Update URL">
          <Input />
        </Form.Item>

        <SectionSeparator sectionName="Row drag and drop" />

        <Form.Item
          name="allowRowDragAndDrop"
          label="Allow row drag-and-drop"
          valuePropName="checked"
          tooltip="Whether rows should be dragged and dropped to rearrange them"
        >
          <Checkbox />
        </Form.Item>

        {state?.allowRowDragAndDrop && (
          <Form.Item name="onRowDropped" label="On Row Dropped">
            <CodeEditor
              mode="dialog"
              setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
              name="onRowDropped"
              type={''}
              id={''}
              label="On Row Dropped"
              description="The code that will be executed when the row has been dropped after being dragged"
              exposedVariables={[
                {
                  id: '1bfa234c-c8b8-44a0-a4b7-20fbac02b545',
                  name: 'row',
                  description: 'Target row',
                  type: 'object',
                },
                {
                  id: '5a2ca970-36de-400b-9534-6ce698b49dc0',
                  name: 'oldIndex',
                  description: 'Old index of the row',
                  type: 'number',
                },
                {
                  id: '898aa70a-2f33-452a-92f2-f9d50ce11bc4',
                  name: 'newIndex',
                  description: 'New index of the row',
                  type: 'number',
                },
                {
                  id: '2632277c-037d-420d-b77b-032327c2466b',
                  name: 'globalState',
                  description: 'The global state of the application',
                  type: 'object',
                },
                {
                  id: 'c2ee4779-db5b-4922-9925-985e39ddf6db',
                  name: 'http',
                  description: 'axios instance used to make http requests',
                  type: 'object',
                },
                {
                  id: '50ca96a8-ef8e-47b0-807e-41563c36d9cf',
                  name: 'message',
                  description:
                    'This is the Ant API for displaying toast messages. See: https://ant.design/components/message/#header',
                  type: 'object',
                },
                {
                  id: '4244cb63-1086-419f-8332-517390a2271d',
                  name: 'data',
                  description: 'Fetched data from the server',
                  type: 'object',
                },
              ]}
            />
          </Form.Item>
        )}
      </Show>
    </Form>
  );
}

export default ColumnsSettings;
