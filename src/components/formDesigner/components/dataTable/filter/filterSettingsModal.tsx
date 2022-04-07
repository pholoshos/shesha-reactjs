import React, { FC } from 'react';
import { Modal } from 'antd';
import {
  TableViewSelectorConfiguratorProvider,
  useTableViewSelectorConfigurator,
} from '../../../../../providers/tableViewSelectorConfigurator';
import { FilterConfigurator } from './filterConfigurator';
import { ITableViewProps } from '../../../../../providers/tableViewSelectorConfigurator/models';
import { QueryBuilderModelWrapper } from '../../queryBuilder/queryBuilderModelWrapper';

export interface IFilterSettingsModal {
  visible: boolean;
  hideModal: () => void;
  value?: object;
  onChange?: any;
}

export const FilterSettingsModalInner: FC<IFilterSettingsModal> = ({ visible, onChange, hideModal }) => {
  const { items } = useTableViewSelectorConfigurator();

  const onOkClick = () => {
    if (typeof onChange === 'function') onChange(items);
    hideModal();
  };

  return (
    <Modal width="60%" visible={visible} title="Configure Filters" okText="Save" onCancel={hideModal} onOk={onOkClick}>
      <FilterConfigurator />
    </Modal>
  );
};

export const FilterSettingsModal: FC<IFilterSettingsModal> = props => {
  return (
    <QueryBuilderModelWrapper>
      <TableViewSelectorConfiguratorProvider items={(props.value as ITableViewProps[]) || []}>
        <FilterSettingsModalInner {...props} />
      </TableViewSelectorConfiguratorProvider>
    </QueryBuilderModelWrapper>
  );
};

export default FilterSettingsModal;
