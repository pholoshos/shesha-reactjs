import React, { FC } from 'react';
import { Modal } from 'antd';
import {
  ColumnsConfiguratorProvider,
  useColumnsConfigurator,
} from '../../../../../../providers/datatableColumnsConfigurator';
import { ColumnsConfigurator } from './columnsConfigurator';
import { IConfigurableColumnsBase } from '../../../../../../providers/datatableColumnsConfigurator/models';
import { useMedia } from 'react-use';
import { MetadataProvider, useForm } from '../../../../../../providers';
import { IEntityPickerComponentProps } from '../../../entityPicker';

export interface IColumnsEditorModal {
  visible: boolean;
  hideModal: () => void;
  value?: object;
  onChange?: any;
}

export const ColumnsEditorModalInner: FC<IColumnsEditorModal> = ({ visible, onChange, hideModal }) => {
  const isSmall = useMedia('(max-width: 480px)');
  const { items } = useColumnsConfigurator();

  const onOkClick = () => {
    if (typeof onChange === 'function') onChange(items);
    hideModal();
  };

  return (
    <Modal
      width={isSmall ? '90%' : '60%'}
      visible={visible}
      title="Configure Columns"
      okText="Save"
      onCancel={hideModal}
      onOk={onOkClick}
    >
      <ColumnsConfigurator />
    </Modal>
  );
};

export const ColumnsEditorModal: FC<IColumnsEditorModal> = props => {
  const { formData } = useForm();
  let modelType = (formData as IEntityPickerComponentProps)?.entityType;
  return (
    <ColumnsConfiguratorProvider items={(props.value as IConfigurableColumnsBase[]) || []}>
      <MetadataProvider modelType={modelType}>
        <ColumnsEditorModalInner {...props} />
      </MetadataProvider>
    </ColumnsConfiguratorProvider>
  );
};

export default IColumnsEditorModal;
