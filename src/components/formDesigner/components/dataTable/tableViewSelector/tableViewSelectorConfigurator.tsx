import React, { FC, useMemo } from 'react';
import { Alert, Tabs } from 'antd';
import { SidebarContainer } from '../../../../../components';
import { TableViewProperties } from './tableViewProperties';
import { useTableViewSelectorConfigurator } from '../../../../../providers/tableViewSelectorConfigurator';
import QueryBuilderSettings from '../../queryBuilder/queryBuilderSettings';
import QueryBuilderExpressionViewer from '../../queryBuilder/queryBuilderExpressionViewer';
import { useDebouncedCallback } from 'use-debounce/lib';

const { TabPane } = Tabs;

export interface ITableViewSelectorConfiguratorProps {}

export const TableViewSelectorConfigurator: FC<ITableViewSelectorConfiguratorProps> = () => {
  const { selectedItemId, updateItem, items } = useTableViewSelectorConfigurator();

  const selectedItem = useMemo(() => items?.find(({ id }) => id === selectedItemId), [items]);

  const debouncedOnQueryBuilderValueChange = useDebouncedCallback(
    (expression: any) => {
      updateItem({
        id: selectedItemId,
        settings: { ...selectedItem, expression },
      });
    },
    // delay in ms
    300
  );

  // const onQueryBuilderValueChange = (expression: any) => {
  //   updateItem({
  //     id: selectedItemId,
  //     settings: { ...selectedItem, expression },
  //   });
  // };

  const queryBuilderValue = useMemo(() => {
    return selectedItem?.expression;
  }, [selectedItem, selectedItemId, items]);

  return (
    <div className="sha-toolbar-configurator">
      <SidebarContainer
        rightSidebarProps={{
          open: true,
          title: () => 'Properties',
          content: () => <TableViewProperties />,
        }}
      >
        <Alert
          message="Here you can create your own filters or adjust their settings and ordering"
          className="sha-toolbar-configurator-alert"
        />

        <Tabs
          defaultActiveKey="queryBuilderConfigureTab"
          className="sha-toolbar-configurator-body-tabs"
          destroyInactiveTabPane
        >
          <TabPane tab="Query builder" key="queryBuilderConfigureTab">
            <QueryBuilderSettings onChange={debouncedOnQueryBuilderValueChange} value={queryBuilderValue} />
          </TabPane>

          <TabPane tab="Query expression viewer" key="expressionViewerTab">
            <QueryBuilderExpressionViewer value={queryBuilderValue} jsonExpanded={true} />
          </TabPane>
        </Tabs>
      </SidebarContainer>
    </div>
  );
};

export default TableViewSelectorConfigurator;
