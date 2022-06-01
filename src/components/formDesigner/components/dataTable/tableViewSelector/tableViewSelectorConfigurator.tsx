import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Alert, Tabs } from 'antd';
import { SidebarContainer } from '../../../../../components';
import { TableViewProperties } from './tableViewProperties';
import { useTableViewSelectorConfigurator } from '../../../../../providers/tableViewSelectorConfigurator';
import QueryBuilderSettings from '../../queryBuilder/queryBuilderSettings';
import QueryBuilderExpressionViewer from '../../queryBuilder/queryBuilderExpressionViewer';

const { TabPane } = Tabs;

export interface ITableViewSelectorConfiguratorProps {}

export interface ITableViewSelectorConfiguratorHandles {
  saveFilters: () => void;
}

export const TableViewSelectorConfigurator = forwardRef<
  ITableViewSelectorConfiguratorHandles,
  ITableViewSelectorConfiguratorProps
>(({}, forwardedRef) => {
  useImperativeHandle(forwardedRef, () => ({
    saveFilters() {
      onQueryBuilderValueChange();
    },
  }));

  const { selectedItemId, updateItem, items } = useTableViewSelectorConfigurator();
  const [localQueryExpression, setLocalQueryExpression] = useState<any>();

  const selectedItem = useMemo(() => items?.find(({ id }) => id === selectedItemId), [items, selectedItemId]);

  const onQueryBuilderValueChange = () => {
    if (localQueryExpression) {
      updateItem({
        id: selectedItemId,
        settings: { ...selectedItem, expression: localQueryExpression },
      });
    }
  };

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
          onChange={onQueryBuilderValueChange}
        >
          <TabPane tab="Query builder" key="queryBuilderConfigureTab">
            <QueryBuilderSettings onChange={setLocalQueryExpression} value={queryBuilderValue} />
          </TabPane>

          <TabPane tab="Query expression viewer" key="expressionViewerTab">
            <QueryBuilderExpressionViewer value={queryBuilderValue} jsonExpanded={true} />
          </TabPane>
        </Tabs>
      </SidebarContainer>
    </div>
  );
});

export type TableViewSelectorConfiguratorRefType = React.ElementRef<typeof TableViewSelectorConfigurator>;

export default TableViewSelectorConfigurator;
