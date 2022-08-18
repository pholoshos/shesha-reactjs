import React from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { FormOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import { getStyle, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useForm } from '../../../../providers';
import { alertSettingsForm } from './settings';
import ShaIcon from '../../../shaIcon';
import SubForm from './subForm';

export interface ISubFormProps extends IConfigurableFormComponent {}

const SubFormComponent: IToolboxComponent<ISubFormProps> = {
  type: 'subForm',
  name: 'Sub Form',
  icon: <FormOutlined />,
  factory: (model: ISubFormProps) => {
    const { isComponentHidden, formData } = useForm();

    const isHidden = isComponentHidden(model);

    if (isHidden) return null;

    return <SubForm />;
  },
  settingsFormMarkup: alertSettingsForm,
  validateSettings: model => validateConfigurableComponentSettings(alertSettingsForm, model),
};

export default SubFormComponent;
