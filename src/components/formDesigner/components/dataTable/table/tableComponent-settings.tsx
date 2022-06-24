import React, { useState } from 'react';
import { Form, Button, Input, Select } from 'antd';
import { ITableComponentBaseProps, ITableComponentProps, RowDroppedMode } from './models';
import { ColumnsEditorModal } from './columnsEditor/columnsEditorModal';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import SectionSeparator from '../../../../sectionSeparator';
import Show from '../../../../show';
import { ITableCrudConfig } from '../../../../../providers/dataTable/interfaces';
import CodeEditor from '../../codeEditor/codeEditor';
import Autocomplete from '../../../../autocomplete';

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
  rowDroppedMode?: RowDroppedMode;
}

function ColumnsSettings(props: IProps) {
  const [state, setState] = useState<IColumnsSettingsState>({
    showColumnsModal: false,
    allowRowDragAndDrop: props?.model?.allowRowDragAndDrop,
    rowDroppedMode: props?.model?.rowDroppedMode,
  });
  const [form] = Form.useForm();

  const toggleColumnsModal = () => setState(prev => ({ ...prev, showColumnsModal: !prev?.showColumnsModal }));

  const initialState: ITableComponentBaseProps = {
    ...props?.model,
  };

  const onValuesChange = (changedValues, values: ITableComponentBaseProps) => {
    setState(prev => ({
      ...prev,
      allowRowDragAndDrop: values?.allowRowDragAndDrop,
      rowDroppedMode: values?.rowDroppedMode,
    }));

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

        <Show when={state?.allowRowDragAndDrop}>
          <Form.Item label="Row Dropped Mode" name="rowDroppedMode">
            <Select>
              <Select.Option value="executeScript">Execute Script</Select.Option>
              <Select.Option value="showDialog">Show dialog</Select.Option>
            </Select>
          </Form.Item>

          <Show when={state.rowDroppedMode === 'showDialog'}>
            <SectionSeparator sectionName="Dialog settings" />

            <Form.Item name="dialogTitle" label="Title" tooltip="The title that will be displayed on the modal">
              <Input />
            </Form.Item>

            <Form.Item
              name="dialogForm"
              label="Modal form"
              tooltip="The form that will be rendered within the dialog. Please make sure the form has been been created"
            >
              <Autocomplete.Raw typeShortAlias="Shesha.Framework.Form" dataSourceType="entitiesList" />
            </Form.Item>

            <Form.Item
              name="dialogFormSkipFetchData"
              label="Skip Fetch Data"
              valuePropName="checked"
              tooltip="If specified, the form data will not be fetched, even if the GET Url has query parameters that can be used to fetch the data. This is useful in cases whereby one form is used both for create and edit mode"
            >
              <Checkbox />
            </Form.Item>

            <Form.Item
              name="dialogShowModalButtons"
              label="Show Modal Buttons"
              valuePropName="checked"
              tooltip="By default the modal does not show the buttons. Check this box if you wish to see the buttons"
            >
              <Checkbox />
            </Form.Item>

            <Form.Item label="Submit HTTP Verb" name="dialogSubmitHttpVerb">
              <Select>
                <Select.Option value="POST">POST</Select.Option>
                <Select.Option value="PUT">PUT</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="dialogOnSuccessScript" label="On Success Script">
              <CodeEditor
                mode="dialog"
                setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
                name="dialogOnSuccessScript"
                type={''}
                id={''}
                label="On Success Script"
                description="The code that will be when the dialog action has succeeded"
                exposedVariables={[
                  {
                    id: '70edb9d5-e028-409c-9c22-ce66f13561da',
                    name: 'data',
                    description: 'The form data',
                    type: 'object',
                  },
                  {
                    id: '33e5f4fb-8294-47fb-ac92-c3d69115063d',
                    name: 'result',
                    description: 'Submitted data',
                    type: 'object',
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
                    id: '4244cb63-1086-419f-8333-517390a2271d',
                    name: 'refreshTable',
                    description: 'A function for refreshing the table',
                    type: 'function',
                  },
                ]}
              />
            </Form.Item>

            <Form.Item name="dialogOnErrorScript" label="On Error Script">
              <CodeEditor
                mode="dialog"
                setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
                name="dialogOnErrorScript"
                type={''}
                id={''}
                label="On Row Dropped"
                description="The code that will be executed when the dialog action fails"
                exposedVariables={[
                  {
                    id: '70edb9d5-e028-409c-9c22-ce66f13561da',
                    name: 'data',
                    description: 'The form data',
                    type: 'object',
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
                    id: '4244cb63-1086-419f-8333-517390a2271d',
                    name: 'refreshTable',
                    description: 'A function for refreshing the table',
                    type: 'function',
                  },
                ]}
              />
            </Form.Item>
          </Show>

          <Show when={state.rowDroppedMode === 'executeScript'}>
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
                  {
                    id: '4244cb63-1086-419f-8333-517390a2271d',
                    name: 'refreshTable',
                    description: 'A function for refreshing the table',
                    type: 'function',
                  },
                ]}
              />
            </Form.Item>
          </Show>
        </Show>
      </Show>
    </Form>
  );
}

export default ColumnsSettings;
