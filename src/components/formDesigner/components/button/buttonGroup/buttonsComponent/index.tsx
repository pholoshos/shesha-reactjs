import React from 'react';
import { IConfigurableFormComponent, IToolboxComponent } from '../../../../../../interfaces';
import { GroupOutlined } from '@ant-design/icons';
import ButtonGroupSettingsModal, { IToolbarSettingsModal } from '../buttonGroupSettingsModal';
import { buttonsSettingsForm } from './settings';
import ConfigurableFormItem from '../../../formItem';

export interface IButtonsProps extends IToolbarSettingsModal, IConfigurableFormComponent {}

const ButtonsComponent: IToolboxComponent<IButtonsProps> = {
  type: 'buttons',
  name: 'Buttons',
  icon: <GroupOutlined />,
  isHidden: true,
  factory: (model: IButtonsProps) => {
    return (
      <ConfigurableFormItem model={model}>
        <ButtonGroupSettingsModal title="Configure Buttons" />
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: buttonsSettingsForm,
};

export default ButtonsComponent;

//#region Page Toolbar
