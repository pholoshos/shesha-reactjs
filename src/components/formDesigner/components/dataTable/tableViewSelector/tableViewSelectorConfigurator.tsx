import React, { FC, useMemo } from 'react';
import { Button, Col, Row } from 'antd';
import { SidebarContainer } from '../../../../../components';
import { TableViewProperties } from './tableViewProperties';
import TableViewContainer from './tableViewContainer';
import { useTableViewSelectorConfigurator } from '../../../../../providers/tableViewSelectorConfigurator';
import { PlusSquareFilled } from '@ant-design/icons';
import QueryBuilderSettings from '../../queryBuilder/queryBuilderSettings';

export interface ITableViewSelectorConfiguratorProps {}

export const TableViewSelectorConfigurator: FC<ITableViewSelectorConfiguratorProps> = () => {
  const { items, addButton, selectedItem, selectedItemId, updateItem } = useTableViewSelectorConfigurator();

  const onQueryBuilderValueChange = (expression: any) => {
    updateItem({
      id: selectedItemId,
      settings: { ...selectedItem, expression },
    });
  };

  const queryBuilderValue = useMemo(() => {
    return selectedItem?.expression;
  }, [selectedItem, selectedItemId]);

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
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <QueryBuilderSettings onChange={onQueryBuilderValueChange} value={queryBuilderValue} />
          </Col>
          <Col span={24}>
            <TableViewContainer items={items} index={[]} />
          </Col>
        </Row>
      </SidebarContainer>
    </div>
  );
};

export default TableViewSelectorConfigurator;
