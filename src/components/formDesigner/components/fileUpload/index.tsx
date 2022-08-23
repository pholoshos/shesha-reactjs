import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { FileAddOutlined } from '@ant-design/icons';
import ConfigurableFormItem from '../formItem';
import settingsFormJson from './settingsForm.json';
import { FileUpload, StoredFilesRenderer } from '../../..';
import { StoredFileProvider, StoredFilesProvider, useSheshaApplication } from '../../../../providers';
import { useForm } from '../../../../providers/form';
import { evaluateValue, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import React from 'react';

export interface IFileUploadProps extends IConfigurableFormComponent {
  ownerId: string;
  ownerType: string;
  propertyName: string;
  allowUpload?: boolean;
  allowReplace?: boolean;
  allowDelete?: boolean;
  list?: boolean;
}
interface IUpdateFormData{
  propertyName: string;
  id: string;
}

const settingsForm = settingsFormJson as FormMarkup;

const FileUploadComponent: IToolboxComponent<IFileUploadProps> = {
  type: 'fileUpload',
  name: 'File Upload',
  icon: <FileAddOutlined />,
  factory: (model: IFileUploadProps) => {
    const { backendUrl } = useSheshaApplication();

    // todo: refactor and implement a generic way for values evaluation
    const { formData} = useForm();
    const ownerId = evaluateValue(model.ownerId, { data: formData });




    const upDateFormdata=({propertyName,id}:IUpdateFormData)=>{ 
      let docName= Object.keys(formData).find(key=>key?.toLowerCase()==propertyName?.toLowerCase());
      formData[docName]=id;  
    }
 
    return (
      <ConfigurableFormItem model={model}>
        {model?.list ? (
          <StoredFilesProvider baseUrl={backendUrl} ownerId={ownerId} ownerType={model.ownerType}>
            <StoredFilesRenderer
              isDragger={false}
              uploadBtnProps={{ icon: null, type: 'link' }}
              disabled={model?.disabled}
              noFilesCaption={null}

            />

          </StoredFilesProvider>
        ) : (
          <StoredFileProvider
            baseUrl={backendUrl}
            ownerId={ownerId}
            ownerType={model.ownerType}
            propertyName={model.propertyName}
            uploadMode={ownerId ? 'async' : 'sync'}
            onUploadSuccess={({id})=>{
              upDateFormdata({id:id,propertyName:model.propertyName})
            }
            }
          >

            <FileUpload
              allowUpload={!model.disabled && model.allowUpload}
              allowDelete={!model.disabled && model.allowDelete}
              allowReplace={!model.disabled && model.allowReplace}
            />
     
            
          </StoredFileProvider>
        )}
      </ConfigurableFormItem>
    );
  },
  initModel: model => {
    const customModel: IFileUploadProps = {
      ...model,
      allowReplace: true,
      allowDelete: true,
      allowUpload: true,
      ownerId: '{data.id}',
      ownerType: '',
      propertyName: '',
    };
    return customModel;
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
};

export default FileUploadComponent;
