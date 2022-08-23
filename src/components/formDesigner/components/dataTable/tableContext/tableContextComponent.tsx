import React, { FC, useEffect, useState } from 'react';
import { IToolboxComponent } from '../../../../../interfaces';
import { LayoutOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import settingsFormJson from './settingsForm.json';
import { IShaDataTableProps } from '../../../../../';
import { DataTableSelectionProvider, useDataTableSelection } from '../../../../../providers/dataTableSelection';
import ComponentsContainer from '../../../componentsContainer';
import { validateConfigurableComponentSettings } from '../../../../../providers/form/utils';
import { MetadataProvider, useDataTableStore, useForm } from '../../../../../providers';
import DataTableProvider from '../../../../../providers/dataTable';
import { FormMarkup, IConfigurableFormComponent } from '../../../../../providers/form/models';

export interface ITableContextComponentProps extends IConfigurableFormComponent {
  tableConfigId?: string;
  entityType?: string;
  uniqueStateId?: string;
  components?: IConfigurableFormComponent[]; // If isDynamic we wanna
}

const settingsForm = settingsFormJson as FormMarkup;

const TableContextComponent: IToolboxComponent<ITableContextComponentProps> = {
  type: 'datatableContext',
  name: 'DataTable Context',
  icon: <LayoutOutlined />,
  factory: (model: ITableContextComponentProps) => {
    return <TableContext {...model} />;
  },
  initModel: (model: ITableContextComponentProps) => {
    return {
      ...model,
      items: [],
    };
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
};

export const TableContext: FC<ITableContextComponentProps> = props => {
  const [table, setTable] = useState(<></>);
  const { entityType } = props;

  useEffect(() => {
    const uniqueKey = `${props.tableConfigId ?? 'empty'}_${props.entityType ?? 'empty'}`; // is used just for re-rendering
    setTable(<TableContextInner key={uniqueKey} {...props} />);
  }, [props.tableConfigId, props.entityType]);

  return entityType ? (
    <MetadataProvider id={props.id} modelType={entityType}>
      {table}
    </MetadataProvider>
  ) : (
    table
  );
};

export const TableContextInner: FC<ITableContextComponentProps> = props => {
  const { tableConfigId, entityType, label, uniqueStateId } = props;
  const { formMode } = useForm();
  const [selectedRow, setSelectedRow] = useState(-1);
  const isDesignMode = formMode === 'designer';

  if (isDesignMode && !tableConfigId && !entityType)
    return (
      <Alert
        className="sha-designer-warning"
        message="Table is not configured"
        description="Select entity type on the settings panel"
        type="warning"
        showIcon
      />
    );

  const tableProps: IShaDataTableProps = {
    id: tableConfigId,
    header: label,
    // actionColumns: [
    //   { icon: <ToolOutlined />, onClick: id => `/settings/forms/designer?id=${id}` },
    //   { icon: <EditOutlined />, onClick: id => `/settings/forms/edit?id=${id}` },
    // ],
    //disableCustomFilters: true,
  };

  const onSelectRow = index => {
    setSelectedRow(index);
  };

  return (
    <DataTableSelectionProvider>
      <DataTableProvider
        userConfigId={props.id}
        tableId={tableProps.id}
        entityType={entityType}
        title={label}
        selectedRow={selectedRow}
        onSelectRow={onSelectRow}
        uniqueStateId={uniqueStateId}
      >
        <TableContextAccessor {...props} />
      </DataTableProvider>
    </DataTableSelectionProvider>
  );
};

const TableContextAccessor: FC<ITableContextComponentProps> = ({ id, tableConfigId, components, isDynamic }) => {
  const { registerActions } = useForm();
  const { refreshTable, exportToExcel, tableConfigLoaded, setIsInProgressFlag } = useDataTableStore();
  const { selectedRow } = useDataTableSelection();

  const deleteRow = () => {
    console.log(`deleteRow ${selectedRow.id}`);
  };

  const toggleColumnsSelector = () => {
    setIsInProgressFlag({ isSelectingColumns: true, isFiltering: false });
  };

  const toggleAdvancedFilter = () => {
    setIsInProgressFlag({ isFiltering: true, isSelectingColumns: false });
  };

  const setToEditMode = () => {};

  // register available actions, refresh on every table configuration loading or change of the table Id
  useEffect(
    () =>
      registerActions(id, {
        refresh: refreshTable,
        toggleColumnsSelector,
        toggleAdvancedFilter,
        exportToExcel,
        deleteRow,
        setToEditMode,
      }),
    [tableConfigLoaded, tableConfigId, selectedRow]
  );

  return (
    <ComponentsContainer
      containerId={id}
      // dynamicComponents={isDynamic ? components : []}
    />
  );
};

export default TableContextComponent;
