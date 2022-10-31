import { IFormItem, IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { FileImageOutlined } from '@ant-design/icons';
import ConfigurableFormItem from '../formItem';
import settingsFormJson from './settingsForm.json';
import { getStyle, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import React from 'react';
import { useForm } from '../../../../providers';

export interface IFileUploadProps extends IConfigurableFormComponent, IFormItem {
  height: number|string;
  width: number|string;
  url: string;
  allowUpload?: boolean;
  allowReplace?: boolean;
  allowDelete?: boolean;
}

const settingsForm = settingsFormJson as FormMarkup;

const ImageComponent: IToolboxComponent<IFileUploadProps> = {
  type: 'image',
  name: 'Image Display',
  icon: <FileImageOutlined />,

  factory: (model: IFileUploadProps) => {
    const { formData } = useForm();
   
 
    return (
      <ConfigurableFormItem model={model}>
              <div className="container">
              <img src={model.url} 
                   alt="Avatar"
                   className="image" 
                   width={model?.width} 
                   height={model?.height} 
                   style={getStyle(model.style, formData)}
               />
              </div>
      </ConfigurableFormItem>
    );
  },
  initModel: model => {
    const customModel: IFileUploadProps = {
      ...model,
      allowReplace: true,
      allowDelete: true,
      allowUpload: true,

    };
    return customModel;
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
};

export default ImageComponent;
