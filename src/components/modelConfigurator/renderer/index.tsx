import React, { FC } from 'react';
import modelSettingsMarkup from '../modelSettings.json';
import permissionSettingsMarkup from '../permissionSettings.json';
import { CustomErrorBoundary } from '../..';
import ConfigurableForm from '../../configurableForm';
import { FormMarkup } from '../../../providers/form/models';
import { PropertiesEditorComponent } from '../propertiesEditor';
import { ModelConfiguratorToolbar } from '../toolbar';
import { useModelConfigurator } from '../../..';
import { message, Form } from 'antd';
import { PermissionDto } from '../../../apis/permission';

export interface IModelConfiguratorRendererProps {}

export const ModelConfiguratorRenderer: FC<IModelConfiguratorRendererProps> = () => {
  const { modelConfiguration, form, save, id } = useModelConfigurator();

  const onSettingsSave = values => {
    const dto = { ...values, id };
    save(dto)
      .then(() => message.success('Model saved successfully'))
      .catch(() => message.error('Failed to save model'));
  };

  interface IPermissionEditorComponentProps {
    name: string;
  }

  const PermissionEditorComponent: FC<IPermissionEditorComponentProps> = (props) => {
    return (
       <Form.Item
           name={props.name}
           labelCol={{ span: 0 }}
           wrapperCol={{ span: 24 }}
       >
           <PermissionEditor {...props} />
       </Form.Item>
    );   
  }

  interface IPermissionEditorProps extends IPermissionEditorComponentProps {
    value?: PermissionDto;
    onChange?: (value: PermissionDto) => void;    
  }
  const PermissionEditor: FC<IPermissionEditorProps> = (props) => {
    return (
      <ConfigurableForm
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 13 }}
        mode="edit"
        markup={permissionSettingsMarkup as FormMarkup}
        initialValues={props?.value}
        onValuesChange={(_, v) =>{ 
          props?.onChange(v);
        }}
      />
    );
  }

  return (
    <div className="sha-model-configurator">
      {false && <ModelConfiguratorToolbar />}
      <CustomErrorBoundary>
        <ConfigurableForm
          layout="horizontal"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 13 }}
          mode="edit"
          markup={modelSettingsMarkup as FormMarkup}
          onFinish={onSettingsSave}
          form={form}
          initialValues={modelConfiguration}
          sections={{
            properties: () => <PropertiesEditorComponent />,
            permission: () => <PermissionEditorComponent name="permission" />,
            permissionGet: () => <PermissionEditorComponent name="permissionGet" />,
            permissionCreate: () => <PermissionEditorComponent name="permissionCreate" />,
            permissionUpdate: () => <PermissionEditorComponent name="permissionUpdate" />,
            permissionDelete: () => <PermissionEditorComponent name="permissionDelete" />
          }}
        />
      </CustomErrorBoundary>
    </div>
  );
};

export default ModelConfiguratorRenderer;
