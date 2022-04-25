import React, { useEffect, useRef } from 'react';
import { Form } from 'antd';
import { ConfigurableForm } from '../../components';
import { IConfigurableFormComponent, FormMarkup } from '../../providers/form/models';
import { IToolboxComponent } from '../../interfaces';
import { ConfigurableFormInstance } from '../../providers/form/contexts';
import { IPropertyMetadata } from '../../interfaces/metadata';
import { listComponentToModelMetadata } from '../../providers/form/utils';

export interface IProps<TModel extends IConfigurableFormComponent> {
  model: TModel;
  markup: FormMarkup;
  onSave: (model: TModel) => void;
  onCancel: () => void;
  onValuesChange?: (changedValues: any, values: TModel) => void;
  toolboxComponent: IToolboxComponent;
}

function Settings<TModel extends IConfigurableFormComponent>({
  onSave,
  model,
  markup,
  onValuesChange,
  toolboxComponent,
}: IProps<TModel>) {
  const [form] = Form.useForm();
  const formRef = useRef<ConfigurableFormInstance>(null);

  useEffect(() => {
    form.resetFields();
  });

  const linkToModelMetadata = (metadata: IPropertyMetadata) => {
    const currentModel = form.getFieldsValue() as TModel;

    const wrapper = toolboxComponent.linkToModelMetadata
      ? m => listComponentToModelMetadata(toolboxComponent, m, metadata)
      : m => m;

    const newModel: TModel = wrapper({
      ...currentModel,
      label: metadata.label,
      description: metadata.description,
    });

    form.setFieldsValue(newModel);
    if (onValuesChange) onValuesChange(newModel, newModel);
  };

  return (
    <ConfigurableForm
      formRef={formRef}
      layout="vertical"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      mode="edit"
      form={form}
      onFinish={onSave}
      markup={markup}
      initialValues={model}
      onValuesChange={onValuesChange}
      actions={{
        linkToModelMetadata
      }}
    />
  );
}

export default Settings;
