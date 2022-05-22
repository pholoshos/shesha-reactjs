import React, { FC, useState } from 'react';
import { Button, Divider, Modal } from 'antd';
import {
  TableViewSelectorConfiguratorProvider,
  useTableViewSelectorConfigurator,
} from '../../../../../providers/tableViewSelectorConfigurator';
import { TableViewSelectorConfigurator } from './tableViewSelectorConfigurator';
import { ITableViewProps } from '../../../../../providers/tableViewSelectorConfigurator/models';
import TableViewContainer from './tableViewContainer';

interface IFiltersListProps {
  filters?: ITableViewProps[];
  showModal?: () => void;
}

const FiltersListInner: FC<Omit<IFiltersListProps, 'filters'>> = ({ showModal }) => {
  const { items, addButton, selectedItemId } = useTableViewSelectorConfigurator();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={addButton} size="small" type="primary">
          Add Filter Item
        </Button>

        <Button onClick={showModal} size="small" disabled={!selectedItemId}>
          Configure Item
        </Button>
      </div>

      <Divider />

      <TableViewContainer items={items} index={[]} />
    </div>
  );
};

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
    <Modal width="75%" visible={visible} title="Configure Filters" okText="Save" onCancel={hideModal} onOk={onOkClick}>
      <TableViewSelectorConfigurator />
    </Modal>
  );
};

export const TableViewSelectorSettingsModal: FC<Omit<
  ITableViewSelectorSettingsModal,
  'visible' | 'hideModal'
>> = props => {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => setModalVisible(true);

  const hideModal = () => setModalVisible(false);

  const items = (props.value as ITableViewProps[]) || [];

  return (
    <TableViewSelectorConfiguratorProvider items={items}>
      <FiltersListInner showModal={showModal} />

      <TableViewSelectorSettingsModalInner {...props} visible={modalVisible} hideModal={hideModal} />
    </TableViewSelectorConfiguratorProvider>
  );
};

export default TableViewSelectorSettingsModal;
