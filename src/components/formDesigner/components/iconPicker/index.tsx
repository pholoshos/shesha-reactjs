import React, { FC, ReactNode } from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { HeartOutlined } from '@ant-design/icons';
import ConfigurableFormItem from '../formItem';
import settingsFormJson from './settingsForm.json';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import IconPicker, { ShaIconTypes } from '../../../iconPicker';
import { useForm } from '../../../..';

export interface IIconPickerComponentProps extends IConfigurableFormComponent {
  readOnly?: boolean;
}

const settingsForm = settingsFormJson as FormMarkup;

const IconPickerComponent: IToolboxComponent<IIconPickerComponentProps> = {
  type: 'iconPicker',
  name: 'Icon Picker',
  icon: <HeartOutlined />,
  factory: (model: IIconPickerComponentProps) => {
    return (
      <ConfigurableFormItem model={model}>
        <IconPickerWrapper />
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
};

export interface IIconPickerWrapperProps {
  value?: string;
  onChange?: (value?: string) => void;
}
export const IconPickerWrapper: FC<IIconPickerWrapperProps> = (props) => {
  const { formMode } = useForm();

  const onIconChange = (_icon: ReactNode, iconName: ShaIconTypes) => {
    if (props.onChange)
      props.onChange(iconName);
  }

  return (
    <IconPicker 
      value={props.value as ShaIconTypes}
      onIconChange={onIconChange}
      readOnly={ formMode === 'readonly' }
    />
  );  
}

export default IconPickerComponent;
