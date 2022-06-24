import React, { FC, Fragment, useEffect, useState } from 'react';
import { IToolboxComponent } from '../../../../../interfaces';
import { TableOutlined } from '@ant-design/icons';
import { Alert, message } from 'antd';
import { useForm } from '../../../../../providers/form';
import {
  IndexTable,
  CollapsibleSidebarContainer,
  IndexTableColumnFilters,
  IndexTableColumnVisibilityToggle,
  useAuth,
  axiosHttp,
  useSheshaApplication,
  useModal,
} from '../../../../../';
import { useDataTableSelection } from '../../../../../providers/dataTableSelection';
import { useDataTableStore, useGlobalState } from '../../../../../providers';
import TableSettings from './tableComponent-settings';
import { ITableComponentProps } from './models';
import ConditionalWrap from '../../../../conditionalWrapper';
import { IModalProps } from '../../../../../providers/dynamicModal/models';

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

interface ITableWrapperState {
  modalProps?: IModalProps;
}

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
  allowRowDragAndDrop,
  onRowDropped,
  rowDroppedMode,
  dialogForm,
  dialogFormSkipFetchData,
  dialogOnSuccessScript,
  dialogOnErrorScript,
  dialogSubmitHttpVerb,
  dialogShowModalButtons,
  dialogTitle,
}) => {
  const { formMode, formData } = useForm();
  const { globalState } = useGlobalState();
  const { anyOfPermissionsGranted } = useAuth();
  const { backendUrl } = useSheshaApplication();
  const [state, setState] = useState<ITableWrapperState>({
    modalProps: null,
  });

  const dynamicModal = useModal(state?.modalProps);

  const isDesignMode = formMode === 'designer';

  const {
    tableId,
    entityType,
    isInProgress: { isFiltering, isSelectingColumns },
    setIsInProgressFlag,
    registerConfigurableColumns,
    setCrudConfig,
    refreshTable,
    changeActionedRow,
  } = useDataTableStore();

  useEffect(() => {
    setCrudConfig({ createUrl, deleteUrl, detailsUrl, updateUrl });
  }, [createUrl, deleteUrl, detailsUrl, updateUrl]);

  useEffect(() => {
    // register columns
    const permissibleColumns = isDesignMode
      ? items
      : items?.filter(({ permissions }) => anyOfPermissionsGranted(permissions || []));

    registerConfigurableColumns(id, permissibleColumns);
  }, [items, isDesignMode]);

  useEffect(() => {
    if (state?.modalProps) {
      dynamicModal?.open();
    }
  }, [state]);

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

  /**
   * This expression will be executed when the row has been dropped
   * @param expression - the expression to be executed
   * @param row - the row data that has just been dropped
   * @param oldIndex - the old index of the row
   * @param newIndex - the new index of the row
   * @returns - a function to execute
   */
  const getExpressionExecutor = (expression: string, row: any, oldIndex: number, newIndex: number) => {
    if (!expression) {
      return null;
    }

    // tslint:disable-next-line:function-constructor
    return new Function('row, oldIndex, newIndex, globalState, http, message, data, refreshTable', expression)(
      row,
      oldIndex,
      newIndex,
      globalState,
      axiosHttp(backendUrl),
      message,
      formData,
      refreshTable
    );
  };

  const handleOnRowDropped = (row: any, oldIndex: number, newIndex: number) => {
    changeActionedRow(row);
    if (rowDroppedMode === 'executeScript') {
      getExpressionExecutor(onRowDropped, row, oldIndex, newIndex);
    } else {
      const dialogExpressionExecutor = (expression: string, result?: any) => {
        if (!expression) {
          return null;
        }

        // tslint:disable-next-line:function-constructor
        return new Function('data, result, globalState, http, message, refreshTable', expression)(
          formData,
          result,
          globalState,
          axiosHttp(backendUrl),
          message,
          refreshTable
        );
      };
      setState(prev => ({
        ...prev,
        modalProps: {
          id: dialogForm,
          isVisible: false,
          formId: dialogForm,
          skipFetchData: dialogFormSkipFetchData,
          title: dialogTitle,
          showModalFooter: dialogShowModalButtons,
          submitHttpVerb: dialogSubmitHttpVerb,
          parentFormValues: row,
          onSubmitted: (submittedValue: any) => {
            if (dialogOnSuccessScript) {
              dialogExpressionExecutor(dialogOnSuccessScript, submittedValue);
            }
          },
          onFailed: () => {
            if (dialogOnErrorScript) {
              dialogExpressionExecutor(dialogOnErrorScript);
            }
          },
        },
      }));
    }
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

  return (
    <ConditionalWrap
      condition={!isNotWrapped}
      wrap={children => (
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
          {children}
        </CollapsibleSidebarContainer>
      )}
    >
      <IndexTable
        id={tableId}
        onSelectRow={onSelectRow}
        selectedRowIndex={selectedRow?.index}
        useMultiselect={useMultiselect}
        crud={crud}
        overrideDefaultCrudBehavior={overrideDefaultCrudBehavior}
        allowRowDragAndDrop={allowRowDragAndDrop}
        onRowDropped={handleOnRowDropped}
        // crudMode="dialog"
      />
    </ConditionalWrap>
  );
};

export default TableComponent;
