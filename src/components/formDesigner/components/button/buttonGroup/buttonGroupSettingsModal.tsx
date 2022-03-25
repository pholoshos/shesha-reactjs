import React, { FC, ReactNode } from 'react';
import { Modal } from 'antd';
import {
  ButtonGroupConfiguratorProvider,
  useButtonGroupConfigurator,
} from '../../../../../providers/buttonGroupConfigurator';
import { ButtonGroupConfigurator } from './configurator';
import { ButtonGroupItemProps } from '../../../../../providers/buttonGroupConfigurator/models';

export interface IToolbarSettingsModal {
  visible: boolean;
  hideModal: () => void;
  value?: object;
  onChange?: any;
  allowAddGroups?: boolean;
  render?: ReactNode | (() => ReactNode);
  title?: ReactNode | string;
  heading?: ReactNode | (() => ReactNode);
}

export const ButtonGroupSettingsModalInner: FC<IToolbarSettingsModal> = ({
  visible,
  onChange,
  hideModal,
  allowAddGroups,
  render,
  title = 'Configure Toolbar',
  heading,
}) => {
  const { items } = useButtonGroupConfigurator();

  const onOkClick = () => {
    if (typeof onChange === 'function') onChange(items);
    hideModal();
  };

  return (
    <Modal width="60%" visible={visible} title={title} okText="Save" onCancel={hideModal} onOk={onOkClick}>
      <ButtonGroupConfigurator allowAddGroups={allowAddGroups} heading={heading} render={render} />
    </Modal>
  );
};

export const ButtonGroupSettingsModal: FC<IToolbarSettingsModal> = props => {
  return (
    <ButtonGroupConfiguratorProvider items={(props.value as ButtonGroupItemProps[]) || []}>
      <ButtonGroupSettingsModalInner {...props} />
    </ButtonGroupConfiguratorProvider>
  );
};

export default ButtonGroupSettingsModal;
