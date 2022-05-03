import React, { FC, Fragment, ReactNode, useState } from 'react';
import { Button, Modal } from 'antd';
import {
  ButtonGroupConfiguratorProvider,
  useButtonGroupConfigurator,
} from '../../../../../providers/buttonGroupConfigurator';
import { ButtonGroupConfigurator } from './configurator';
import { ButtonGroupItemProps } from '../../../../../providers/buttonGroupConfigurator/models';

export interface IToolbarSettingsModal {
  value?: object;
  onChange?: any;
  allowAddGroups?: boolean;
  render?: ReactNode | (() => ReactNode);
  title?: ReactNode | string;
  heading?: ReactNode | (() => ReactNode);
}

export const ButtonGroupSettingsModalInner: FC<IToolbarSettingsModal> = ({
  onChange,
  allowAddGroups,
  render,
  title = 'Configure Buttons',
  heading,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { items } = useButtonGroupConfigurator();

  const toggleModalVisibility = () => setShowModal(prev => !prev);

  const onOkClick = () => {
    if (typeof onChange === 'function') onChange(items);
    toggleModalVisibility();
  };

  return (
    <Fragment>
      <Button onClick={toggleModalVisibility}>Customize Button Group</Button>

      <Modal
        width="60%"
        visible={showModal}
        title={title}
        okText="Save"
        onCancel={toggleModalVisibility}
        onOk={onOkClick}
      >
        <ButtonGroupConfigurator allowAddGroups={allowAddGroups} heading={heading} render={render} />
      </Modal>
    </Fragment>
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
