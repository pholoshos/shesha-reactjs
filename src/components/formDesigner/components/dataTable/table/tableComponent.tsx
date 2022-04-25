import React, { FC, Fragment, useEffect } from 'react';
import { IToolboxComponent } from '../../../../../interfaces';
import { TableOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import { useForm } from '../../../../../providers/form';
import {
  IndexTable,
  CollapsibleSidebarContainer,
  IndexTableColumnFilters,
  IndexTableColumnVisibilityToggle,
} from '../../../../../';
import { useDataTableSelection } from '../../../../../providers/dataTableSelection';
import { useDataTableStore } from '../../../../../providers';
import TableSettings from './tableComponent-settings';
import { ITableComponentProps } from './models';

const TableComponent: IToolboxComponent<ITableComponentProps> = {
  type: 'datatable',
  name: 'DataTable',
  icon: <TableOutlined />,
  factory: (model: ITableComponentProps) => {
    return <TableWrapper {...model} />;
  },
  initModel: (model: ITableComponentProps) => {
    return {
      ...model,
      items: [],
    };
  },
  settingsFormFactory: ({ model, onSave, onCancel, onValuesChange }) => {
    return <TableSettings model={model} onSave={onSave} onCancel={onCancel} onValuesChange={onValuesChange} />;
  },
};

const NotConfiguredWarning: FC = () => {
  return <Alert className="sha-designer-warning" message="Table is not configured properly" type="warning" />;
};

export const TableWrapper: FC<ITableComponentProps> = ({
  id,
  items,
  useMultiselect,
  overrideDefaultCrudBehavior,
  crud,
  createUrl,
  deleteUrl,
  detailsUrl,
  updateUrl,
  isNotWrapped,
}) => {
  const { formMode } = useForm();

  const isDesignMode = formMode === 'designer';

  const {
    tableId,
    entityType,
    isInProgress: { isFiltering, isSelectingColumns },
    setIsInProgressFlag,
    registerConfigurableColumns,
    setCrudConfig,
  } = useDataTableStore();

  useEffect(() => {
    setCrudConfig({ createUrl, deleteUrl, detailsUrl, updateUrl });
  }, [createUrl, deleteUrl, detailsUrl, updateUrl]);

  useEffect(() => {
    // register columns
    registerConfigurableColumns(id, items);
  }, [items]);

  const { selectedRow, setSelectedRow } = useDataTableSelection();

  const renderSidebarContent = () => {
    if (isFiltering) {
      return <IndexTableColumnFilters />;
    }

    if (isSelectingColumns) {
      return <IndexTableColumnVisibilityToggle />;
    }

    return <Fragment />;
  };

  const toggleFieldPropertiesSidebar = () => {
    !isSelectingColumns && !isFiltering
      ? setIsInProgressFlag({ isFiltering: true })
      : setIsInProgressFlag({ isFiltering: false, isSelectingColumns: false });
  };

  if (isDesignMode && !tableId && !entityType) return <NotConfiguredWarning />;

  const onSelectRow = (index: number, row: any) => {
    if (row) {
      setSelectedRow(index, row);
    }
  };

  if (isNotWrapped) {
    return (
      <IndexTable
        id={tableId}
        onSelectRow={onSelectRow}
        selectedRowIndex={selectedRow?.index}
        useMultiselect={useMultiselect}
        crud={crud}
        overrideDefaultCrudBehavior={overrideDefaultCrudBehavior}
      />
    );
  }

  return (
    <CollapsibleSidebarContainer
      rightSidebarProps={{
        open: isSelectingColumns || isFiltering,
        onOpen: toggleFieldPropertiesSidebar,
        onClose: toggleFieldPropertiesSidebar,
        title: 'Table Columns',
        content: renderSidebarContent,
      }}
      allowFullCollapse
    >
      <IndexTable
        id={tableId}
        onSelectRow={onSelectRow}
        selectedRowIndex={selectedRow?.index}
        useMultiselect={useMultiselect}
        crud={crud}
        overrideDefaultCrudBehavior={overrideDefaultCrudBehavior}
        // crudMode="dialog"
      />
    </CollapsibleSidebarContainer>
  );
};

export default TableComponent;
