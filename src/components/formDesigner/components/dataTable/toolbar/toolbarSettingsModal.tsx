import React, { FC, ReactNode } from 'react';
import { Modal } from 'antd';
import { ToolbarConfiguratorProvider, useToolbarConfigurator } from '../../../../../providers/toolbarConfigurator';
import { ToolbarConfigurator } from './toolbarConfigurator';
import { ToolbarItemProps } from '../../../../../providers/toolbarConfigurator/models';
import { useMedia } from 'react-use';

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

export const ToolbarSettingsModalInner: FC<IToolbarSettingsModal> = ({
  visible,
  onChange,
  hideModal,
  allowAddGroups,
  render,
  title = 'Configure Toolbar',
  heading,
}) => {
  const { items } = useToolbarConfigurator();
  const isSmall = useMedia('(max-width: 480px)');

  const onOkClick = () => {
    if (typeof onChange === 'function') onChange(items);
    hideModal();
  };

  return (
    <Modal width={isSmall ? '90%' : '60%'} visible={visible} title={title} okText="Save" onCancel={hideModal} onOk={onOkClick}>
      <ToolbarConfigurator allowAddGroups={allowAddGroups} heading={heading} render={render} />
    </Modal>
  );
};

export const ToolbarSettingsModal: FC<IToolbarSettingsModal> = props => {
  return (
    <ToolbarConfiguratorProvider items={(props.value as ToolbarItemProps[]) || []}>
      <ToolbarSettingsModalInner {...props} />
    </ToolbarConfiguratorProvider>
  );
};

export default ToolbarSettingsModal;
