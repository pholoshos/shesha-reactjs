import React, { FC } from 'react';
import { Button } from 'antd';
import { SidebarContainer } from '../../../../../components';
import { TableViewProperties } from './tableViewProperties';
import TableViewContainer from './tableViewContainer';
import { useTableViewSelectorConfigurator } from '../../../../../providers/tableViewSelectorConfigurator';
import { PlusSquareFilled } from '@ant-design/icons';

export interface ITableViewSelectorConfiguratorProps {}

export const TableViewSelectorConfigurator: FC<ITableViewSelectorConfiguratorProps> = () => {
  const { items, addButton } = useTableViewSelectorConfigurator();

  return (
    <div className="sha-toolbar-configurator">
      <h4>Here you can create your own filters or adjust their settings and ordering</h4>
      <div className="sha-action-buttons">
        <Button onClick={addButton} type="primary" icon={<PlusSquareFilled />}>
          Add New Item
        </Button>
      </div>
      <SidebarContainer
        rightSidebarProps={{
          open: true,
          title: () => 'Properties',
          content: () => <TableViewProperties />,
        }}
      >
        <TableViewContainer items={items} index={[]} />
      </SidebarContainer>
    </div>
  );
};

export default TableViewSelectorConfigurator;
