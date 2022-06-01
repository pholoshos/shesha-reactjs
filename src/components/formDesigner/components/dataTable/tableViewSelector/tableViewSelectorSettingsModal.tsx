import React, { FC, useEffect, useRef, useState } from 'react';
import { Button, Divider, Modal } from 'antd';
import {
  TableViewSelectorConfiguratorProvider,
  useTableViewSelectorConfigurator,
} from '../../../../../providers/tableViewSelectorConfigurator';
import { ITableViewSelectorConfiguratorHandles, TableViewSelectorConfigurator } from './tableViewSelectorConfigurator';
import { ITableViewProps } from '../../../../../providers/tableViewSelectorConfigurator/models';
import TableViewContainer from './tableViewContainer';
import { useDeepCompareEffect } from 'react-use';

interface IFiltersListProps {
  filters?: ITableViewProps[];
  showModal?: () => void;
}

const FiltersListInner: FC<Omit<IFiltersListProps, 'filters'>> = ({ showModal }) => {
  const { items, addButton, selectItem } = useTableViewSelectorConfigurator();

  const onConfigClick = (localSelectedId: string) => {
    selectItem(localSelectedId);

    showModal();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={addButton} size="small" type="primary">
          Add Filter Item
        </Button>
      </div>

      <Divider />

      <TableViewContainer items={items} index={[]} onConfigClick={onConfigClick} />
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
  const configRef = useRef<ITableViewSelectorConfiguratorHandles>();

  const filtersIds = items?.map(({ id }) => id);

  useEffect(() => {
    if (!visible) {
      updateFilters();
    }
  }, [items?.length]);

  useDeepCompareEffect(() => {
    updateFilters();
  }, [filtersIds]);

  const updateFilters = () => {
    if (typeof onChange === 'function') {
      configRef?.current?.saveFilters();
      onChange(items);
    }
    hideModal();
  };

  return (
    <Modal
      width="75%"
      visible={visible}
      title="Configure Filters"
      okText="Save"
      onCancel={hideModal}
      onOk={updateFilters}
    >
      <TableViewSelectorConfigurator ref={configRef} />
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
