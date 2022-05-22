import React, { FC, useEffect, useState } from 'react';
import { Alert, Divider, Modal } from 'antd';
import {
  TableViewSelectorConfiguratorProvider,
  useTableViewSelectorConfigurator,
} from '../../../../../providers/tableViewSelectorConfigurator';
import { TableViewSelectorConfigurator } from './tableViewSelectorConfigurator';
import { ITableViewProps } from '../../../../../providers/tableViewSelectorConfigurator/models';
import TableViewContainer from './tableViewContainer';
import { useQueryBuilder } from '../../../../..';

interface IFiltersListProps {
  filters?: ITableViewProps[];
  onSelectedIdChanged?: (selectedFilterId: string) => void;
}

const FiltersListInner: FC<Omit<IFiltersListProps, 'filters'>> = ({ onSelectedIdChanged }) => {
  const { items, selectedItemId } = useTableViewSelectorConfigurator();

  useEffect(() => {
    if (onSelectedIdChanged && selectedItemId) {
      onSelectedIdChanged(selectedItemId);
    }
  }, [selectedItemId]);

  return <TableViewContainer items={items} index={[]} />;
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
  const { items, selectedItem, selectedItemId } = useTableViewSelectorConfigurator();

  console.log('TableViewSelectorSettingsModalInner items: ', items, selectedItem, selectedItemId);

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

export const TableViewSelectorSettingsModal: FC<Omit<
  ITableViewSelectorSettingsModal,
  'visible' | 'hideModal'
>> = props => {
  const [modalVisible, setModalVisible] = useState(false);

  const onSelectedIdChanged = () => {
    setModalVisible(true);
  };

  const hideModal = () => setModalVisible(false);

  return (
    <TableViewSelectorConfiguratorProvider items={(props.value as ITableViewProps[]) || []}>
      <Alert
        message="Configure your filters here"
        description="Please note that by default the first filter will be used as a title of the page"
      />

      <Divider />

      <FiltersListInner onSelectedIdChanged={onSelectedIdChanged} />

      <TableViewSelectorSettingsModalInner {...props} visible={modalVisible} hideModal={hideModal} />
    </TableViewSelectorConfiguratorProvider>
  );
};

export default TableViewSelectorSettingsModal;
