import React, { FC } from 'react';
import { Modal } from 'antd';
import {
  TableViewSelectorConfiguratorProvider,
  useTableViewSelectorConfigurator,
} from '../../../../../providers/tableViewSelectorConfigurator';
import { TableViewSelectorConfigurator } from './tableViewSelectorConfigurator';
import { ITableViewProps } from '../../../../../providers/tableViewSelectorConfigurator/models';

export interface ITableViewSelectorSettingsModal {
  visible: boolean;
  hideModal: () => void;
  value?: object;
  onChange?: any;
}

export const TableViewSelectorSettingsModalInner: FC<ITableViewSelectorSettingsModal> = ({
  visible,
  onChange,
  hideModal,
}) => {
  const { items } = useTableViewSelectorConfigurator();

  const onOkClick = () => {
    if (typeof onChange === 'function') onChange(items);
    hideModal();
  };

  return (
    <Modal width="60%" visible={visible} title="Configure Filters" okText="Save" onCancel={hideModal} onOk={onOkClick}>
      <TableViewSelectorConfigurator />
    </Modal>
  );
};

export const TableViewSelectorSettingsModal: FC<ITableViewSelectorSettingsModal> = props => {
  return (
    <TableViewSelectorConfiguratorProvider items={(props.value as ITableViewProps[]) || []}>
      <TableViewSelectorSettingsModalInner {...props} />
    </TableViewSelectorConfiguratorProvider>
  );
};

export default TableViewSelectorSettingsModal;
