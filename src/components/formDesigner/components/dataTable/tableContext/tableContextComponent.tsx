import { LayoutOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { IToolboxComponent } from '../../../../../interfaces';
import { MetadataProvider, useDataTableStore, useForm } from '../../../../../providers';
import DataTableProvider from '../../../../../providers/dataTable';
import { DataTableSelectionProvider, useDataTableSelection } from '../../../../../providers/dataTableSelection';
import { FormMarkup, IConfigurableFormComponent } from '../../../../../providers/form/models';
import { validateConfigurableComponentSettings } from '../../../../../providers/form/utils';
import ComponentsContainer from '../../../componentsContainer';
import ImportConfigModal from './modal/importConfigModal';
import settingsFormJson from './settingsForm.json';
import { useConfig } from './useConfig';

export interface ITableContextComponentProps extends IConfigurableFormComponent {
  entityType?: string;
  endpoint?: string;
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
    const uniqueKey = `${props.entityType ?? 'empty'}`; // is used just for re-rendering
    setTable(<TableContextInner key={uniqueKey} {...props} />);
  }, [props.entityType]);

  return entityType ? (
    <MetadataProvider id={props.id} modelType={entityType}>
      {table}
    </MetadataProvider>
  ) : (
    table
  );
};

export const TableContextInner: FC<ITableContextComponentProps> = props => {
  const { entityType, endpoint, label, uniqueStateId } = props;
  const { formMode } = useForm();
  const [selectedRow, setSelectedRow] = useState(-1);
  const isDesignMode = formMode === 'designer';

  if (isDesignMode && !entityType)
    return (
      <Alert
        className="sha-designer-warning"
        message="Table is not configured"
        description="Select entity type on the settings panel"
        type="warning"
        showIcon
      />
    );

  const onSelectRow = index => {
    setSelectedRow(index);
  };

  return (
    <DataTableSelectionProvider>
      <DataTableProvider
        userConfigId={props.id}
        entityType={entityType}
        getDataPath={endpoint}
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

const TableContextAccessor: FC<ITableContextComponentProps> = ({ id }) => {
  const { registerActions } = useForm();
  const { refreshTable, exportToExcel, tableConfigLoaded, setIsInProgressFlag } = useDataTableStore();
  const { selectedRow, selectedRows } = useDataTableSelection();
  const { deleteConfigs, duplicateConfigs, exportConfigs } = useConfig(selectedRows, refreshTable);

  const [{ visible }, setState] = useState({ visible: false });

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

  const importConfigs = () => setState(s => ({ ...s, visible: true }));

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
        deleteConfigs,
        duplicateConfigs,
        exportConfigs,
        importConfigs,
      }),
    [tableConfigLoaded, selectedRow]
  );

  return (
    <Fragment>
      <ComponentsContainer
        containerId={id}
        // dynamicComponents={isDynamic ? components : []}
      />

      <ImportConfigModal
        visible={visible}
        onRefresh={refreshTable}
        onCancel={() => setState(s => ({ ...s, visible: false }))}
      />
    </Fragment>
  );
};

export default TableContextComponent;
