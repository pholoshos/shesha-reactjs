import React, { FC, Fragment, ReactNode, useState } from 'react';
import { Button, Modal } from 'antd';
import {
  ButtonGroupConfiguratorProvider,
  useButtonGroupConfigurator,
} from '../../../../../providers/buttonGroupConfigurator';
import { ButtonGroupConfigurator } from './configurator';
import { ButtonGroupItemProps } from '../../../../../providers/buttonGroupConfigurator/models';
import { useMedia } from 'react-use';

export interface IToolbarSettingsModal {
  readOnly?: boolean;
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
  readOnly,
}) => {
  const isSmall = useMedia('(max-width: 480px)');
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
        width={isSmall ? '90%' : '60%'}
        open={showModal}
        title={title}
        okText="Save"
        onCancel={toggleModalVisibility}
        onOk={onOkClick}
      >
        <ButtonGroupConfigurator allowAddGroups={allowAddGroups} heading={heading} render={render} readOnly={readOnly}/>
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
