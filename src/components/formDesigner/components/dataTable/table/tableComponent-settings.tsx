import React, { useState } from 'react';
import { Form, Button, Input } from 'antd';
import { ITableComponentBaseProps, ITableComponentProps } from './models';
import { ColumnsEditorModal } from './columnsEditor/columnsEditorModal';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import SectionSeparator from '../../../../sectionSeparator';
import Show from '../../../../show';
import { ITableCrudConfig } from '../../../../../providers/dataTable/interfaces';

export interface IProps {
  model: ITableComponentProps;
  onSave: (model: ITableComponentProps) => void;
  onCancel: () => void;
  onValuesChange?: (changedValues: any, values: ITableComponentProps) => void;
}

interface IColumnsSettingsState extends ITableCrudConfig {
  showColumnsModal?: boolean;
  isCrud?: boolean;
}

function ColumnsSettings(props: IProps) {
  const [state, setState] = useState<IColumnsSettingsState>({ showColumnsModal: false });
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
  };

  const onValuesChange = (changedValues, values: ITableComponentBaseProps) => {
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
      </Show>
    </Form>
  );
}

export default ColumnsSettings;
