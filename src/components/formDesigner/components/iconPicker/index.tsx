import React, { CSSProperties, FC, ReactNode } from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { HeartOutlined } from '@ant-design/icons';
import ConfigurableFormItem from '../formItem';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import IconPicker, { ShaIconTypes } from '../../../iconPicker';
import { useForm } from '../../../..';
import { iconPickerFormSettings } from './settings';
import { ColorResult } from 'react-color';

export interface IIconPickerComponentProps extends IConfigurableFormComponent {
  readOnly?: boolean;
  fontSize?: number;
  color?: ColorResult;
}

const IconPickerComponent: IToolboxComponent<IIconPickerComponentProps> = {
  type: 'iconPicker',
  name: 'Icon Picker',
  icon: <HeartOutlined />,
  factory: (model: IIconPickerComponentProps) => {
    console.log('LOGS::: IconPickerComponent', model);

    return (
      <ConfigurableFormItem model={model}>
        <IconPickerWrapper {...model} />
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: iconPickerFormSettings,
  validateSettings: model => validateConfigurableComponentSettings(iconPickerFormSettings, model),
};

export interface IIconPickerWrapperProps extends IIconPickerComponentProps {
  value?: string;
  onChange?: (value?: string) => void;
}

export const IconPickerWrapper: FC<IIconPickerWrapperProps> = ({ value, fontSize, color, ...props }) => {
  const { formMode } = useForm();

  const onIconChange = (_icon: ReactNode, iconName: ShaIconTypes) => {
    if (props.onChange) props.onChange(iconName);
  };

  const style: CSSProperties = {
    fontSize: fontSize || 24,
    color: color?.hex,
  };

  return (
    <IconPicker
      value={value as ShaIconTypes}
      onIconChange={onIconChange}
      readOnly={formMode === 'readonly'}
      style={style}
      twoToneColor={color?.hex}
    />
  );
};

export default IconPickerComponent;
