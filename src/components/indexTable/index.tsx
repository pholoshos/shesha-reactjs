import React, { FC, useRef, useEffect, useState, Fragment, MutableRefObject, useMemo } from 'react';
import { Column, SortingRule, TableProps } from 'react-table';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { ICrudProps } from '../../providers/dataTable/interfaces';
import { useShaRouting } from '../../providers/shaRouting';
import { IColumnEditFieldProps, IShaDataTableProps, ITableActionColumns } from './interfaces';
import { renderers } from './columnRenderers';
import { useMutate } from 'restful-react';
import ColumnEditField from './columnEditField';
import ColumnDetailsField from './columnDetailsField';
import { Form, Modal } from 'antd';
import { crudActionColumns } from './crudActionColumns';
import { DataTableFullInstance } from '../../providers/dataTable/contexts';
import { ModalProps } from 'antd/lib/modal';
import { nanoid } from 'nanoid/non-secure';
import ReactTable from '../reactTable';
import { removeUndefinedProperties } from '../../utils/array';
import { ValidationErrors } from '..';
import { useAuthState, useDataTableStore } from '../../providers';
import { IReactTableProps } from '../reactTable/interfaces';
import { usePrevious } from 'react-use';

const FormItem = Form.Item;

const CRUD_MODAL_WIDTH = 700;

export interface IIndexTableProps extends IShaDataTableProps, ICrudProps, TableProps {
  tableRef?: MutableRefObject<Partial<DataTableFullInstance> | null>;
}

export interface IExtendedModalProps extends ModalProps {
  content?: string;
}

export const IndexTable: FC<Partial<IIndexTableProps>> = ({
  crud,
  overrideDefaultCrudBehavior,
  saveLocally,
  useMultiselect: useMultiSelect,
  actionColumns,
  selectedRowIndex,
  onSelectRow,
  onDblClick,
  customTypeRenders,
  customTypeEditors,
  tableRef,
  crudMode = 'inline',
  onRowsChanged,
  onExportSuccess,
  onExportError,
  onFetchDataSuccess,
  onSelectedIdsChanged,
  crudParentEntityKey = 'parentEntity',
}) => {
  const store = useDataTableStore();
  const { headers } = useAuthState();

  if (tableRef) tableRef.current = store;

  const { router } = useShaRouting();

  const {
    tableData,
    isFetchingTableData,
    totalPages,
    columns,
    pageSizeOptions,
    currentPage,
    selectedPageSize,
    tableFilter,
    onSelectRow: onSelectRowDeprecated,
    onDblClick: onDblClickDeprecated,
    selectedRow,
    parentEntityId,
    selectedIds,
    tableSorting,
    quickSearch,
    crudConfig,
    refreshTable,
    onSort,
    newOrEditableRowData,
    setCrudRowData,
    cancelCreateOrEditRowData,
    updateLocalTableData,
    deleteRowItem,
    changeSelectedIds,
    // succeeded,
    succeeded: { exportToExcel: exportToExcelSuccess },
    error: { exportToExcel: exportToExcelError },
  } = store;

  const previousIds = usePrevious(selectedIds);
  useEffect(() => {
    if (!(previousIds?.length === 0 && selectedIds?.length === 0) && typeof onSelectedIdsChanged === 'function') {
      onSelectedIdsChanged(selectedIds);
    }
  }, [selectedIds]);

  useEffect(() => {
    if (!isFetchingTableData && tableData?.length && onFetchDataSuccess) {
      onFetchDataSuccess();
    }
  }, [isFetchingTableData]);

  useEffect(() => {
    if (exportToExcelSuccess && onExportSuccess) {
      onExportSuccess();
    }
  }, [exportToExcelSuccess]);

  useEffect(() => {
    if (exportToExcelError && onExportError) {
      onExportError();
    }
  }, [exportToExcelError]);

  const [preparedColumns, setPreparedColumns] = useState<Column<any>[]>([]);

  const [confirmModalProps, setConfirmModalProps] = useState<IExtendedModalProps>({});

  const { mutate: createItemHttp, loading: isCreating, error: createError } = useMutate({
    path: crudConfig?.createUrl,
    verb: 'POST',
    requestOptions: { headers },
  });

  const { mutate: updateItemHttp, loading: isUpdating, error: updateError } = useMutate({
    path: crudConfig?.updateUrl,
    verb: 'PUT',
    requestOptions: { headers },
  });

  const { mutate: deleteItemHttp, loading: isDeleting, error: deleteError } = useMutate({
    path: crudConfig?.deleteUrl,
    verb: 'DELETE',
    requestOptions: { headers },
  });

  const table = useDataTableStore();

  const handleGenericChange = (key: string, value: any) => {
    const obj = newOrEditableRowData?.data || {};
    obj[key] = value;
    setCrudRowData({ ...newOrEditableRowData, data: obj });
  };

  const handleGenericChangeRef = useRef(handleGenericChange);

  const newOrEditableRowDataRef = useRef(newOrEditableRowData);

  useEffect(() => {
    handleGenericChangeRef.current = handleGenericChange;
  }, []);

  useEffect(() => {
    newOrEditableRowDataRef.current = newOrEditableRowData;
  }, [newOrEditableRowData]);

  const handleSelectRow = onSelectRow || onSelectRowDeprecated;

  const dblClickHandler = onDblClick || onDblClickDeprecated;

  useEffect(() => {
    if (Boolean(handleSelectRow)) handleSelectRow(null, null);
  }, [
    tableData,
    isFetchingTableData,
    totalPages,
    columns,
    pageSizeOptions,
    currentPage,
    selectedPageSize,
    tableFilter,
    // dblClickHandler,
    selectedRow,
    parentEntityId,
    quickSearch,
    tableSorting,
  ]);

  useEffect(() => {
    if (onRowsChanged) {
      onRowsChanged(tableData);
    }
  }, [tableData]);

  const selectedObject = newOrEditableRowDataRef?.current?.data;

  const selectedObjectRef = useRef(selectedObject);

  useEffect(() => {
    selectedObjectRef.current = selectedObject || {};
  }, [selectedObject]);

  // console.log('crudMode: ', newOrEditableRowData);

  // Crud is either boolean or ICrudState, so here we're just return allowed crud actions
  const getAllowedCrudActions = () => {
    if (overrideDefaultCrudBehavior) return [];

    if (typeof crud === 'boolean') {
      return crudActionColumns;
    } else {
      const allowedActions = [...Object.keys(crud), 'create', 'cancel'];

      return crudActionColumns.filter(({ type }) => allowedActions.includes(type));
    }
  };

  // We are making sure that we only update the columns
  useEffect(() => {
    const localPreparedColumns = columns
      .filter(({ show }) => show)
      .map<Column<any>>(columnItem => {
        return {
          ...columnItem,
          Header: columnItem.header,
          minWidth: columnItem.minWidth,
          maxWidth: columnItem.maxWidth,
          width: undefined,
          resizable: true,
          Cell: props => {
            const allRenderers = [...(customTypeRenders || []), ...renderers];

            const localData = newOrEditableRowDataRef?.current?.data || {};

            if (
              props?.row?.original?.Id === newOrEditableRowData?.id &&
              crudMode === 'inline' &&
              columnItem?.isEditable
            ) {
              const editProps: IColumnEditFieldProps = {
                id: columnItem?.id,
                dataType: columnItem?.dataType,
                name: columnItem.id,
                caption: columnItem.caption,
                onChange: handleGenericChange,
                value: localData[columnItem?.id],
                referenceListName: columnItem?.referenceListName,
                referenceListNamespace: columnItem?.referenceListNamespace,
                entityReferenceTypeShortAlias: columnItem?.entityReferenceTypeShortAlias,
              };

              if (customTypeEditors?.length) {
                for (const customEditor of customTypeEditors) {
                  const { property, render } = customEditor;

                  if (columnItem?.id === property) {
                    return render(editProps) || null;
                  }
                }
              }

              return <ColumnEditField {...editProps} />;
            }

            // Allow the user to override the default render behavior of the table without having to make changes to it
            if (allRenderers) {
              for (const customRender of allRenderers) {
                const { key, render } = customRender;

                if (columnItem.dataType === key || columnItem.customDataType === key) {
                  return render(props, router) || null;
                }
              }
            }

            return props.value || null;
          },
        };
      });

    const allActionColumns = [...(actionColumns || []), ...(crud ? getAllowedCrudActions() : [])];

    // Now add a list of actions
    allActionColumns
      ?.filter(d => {
        let show = !!(Boolean(d?.onClick) || d?.type);

        if (show && d.extra) {
          return show;
        }

        if (crud) {
          const isCreateOrEditMode = newOrEditableRowData?.mode === 'create' || newOrEditableRowData?.mode === 'edit';
          const isSaveOrCancelType = d.type === 'create' || d?.type === 'cancel';
          const isDeleteOrUpdate = d.type === 'delete' || d?.type === 'update';

          // If mode is create or edit, hide details and delete
          if (isCreateOrEditMode) {
            if (!isSaveOrCancelType) {
              show = false;
            }
          } else {
            if (!isDeleteOrUpdate) {
              show = false;
            }
          }
        }

        return show;
      })
      ?.reverse()
      ?.forEach(localData => {
        // @ts-ignore
        const clickHandler = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, props: any) => {
          event.preventDefault();
          const currentId = props?.row?.original?.Id;

          if (localData?.type === 'update') {
            const callback = () =>
              setCrudRowData({
                id: currentId,
                data: props?.row?.original,
                mode: 'edit',
              });

            // If you were creating or already editing something
            if (newOrEditableRowData?.id && newOrEditableRowData?.id !== currentId) {
              confirmAndProceed('Please note that you will lose data you have not yet saved', callback);
            } else {
              callback();
            }
          }

          if (localData?.type === 'delete') {
            deleteItem(currentId);
          }

          if (localData?.type === 'create') {
            createOrUpdateItem();
          }

          if (localData?.type === 'cancel') {
            confirmAndProceed('Please note that you will lose data you have not yet saved', cancelCreateOrEditRowData);
          }

          // The user wants to view the details using the modal
          if (localData?.type === 'read' && !localData?.onClick) {
            setCrudRowData({
              id: currentId,
              mode: 'read',
              data: props?.row?.original,
            });
          }

          if (localData?.onClick) {
            const result = localData.onClick(currentId, table, props?.row?.original);

            if (typeof result === 'string') router?.push(result);
          }
        };

        // I'm assigning a random accessor because with react-table v
        const accessor = nanoid();

        localPreparedColumns.unshift({
          accessor,
          id: accessor, // This needs to be fixed
          Header: '',
          width: 35,
          minWidth: 35,
          maxWidth: 35,
          disableSortBy: true,
          disableResizing: true,
          Cell: props => {
            // Do not show the save or cancel button for rows which are not currently the ones being edited
            if (
              (localData?.type === 'create' || localData?.type === 'cancel') &&
              props?.row?.original?.Id !== newOrEditableRowData?.id
            ) {
              return null;
            }

            return (
              <a className="sha-link" onClick={e => clickHandler(e, props)}>
                {getDefaultActionColumns(localData)}
              </a>
            );
          },
        });
      });

    setPreparedColumns(localPreparedColumns);
  }, [columns, newOrEditableRowData?.id, crud, overrideDefaultCrudBehavior]);

  /**
   * Returns a default action column icon
   *
   * I want to give the user the freedom to simply specify the type of action column without also forcing them to always specify it.
   * Usually with CRUD action, we can predict the icon, hence it's optional
   */
  const getDefaultActionColumns = (column: ITableActionColumns) => {
    if (column?.icon) return column?.icon;

    switch (column?.type) {
      case 'cancel':
        return <CloseOutlined />;
      case 'create':
        return <CheckOutlined />;
      case 'delete':
        return <DeleteOutlined />;
      case 'read':
        return <SearchOutlined />;
      case 'update':
        return <EditOutlined />;

      default:
        return <QuestionCircleOutlined />;
    }
  };

  //#region CRUD helpers
  const hideModal = () => setConfirmModalProps({});

  // In here I'm show Modal because Modal.confirm, for some reason, it's not closing
  const confirmAndProceed = (confirmationMessage: string, callback: () => void) => {
    const onOk = () => {
      callback();
      hideModal();
    };
    setConfirmModalProps({ content: confirmationMessage, onOk, visible: true });
  };

  const deleteItem = (itemId: string) => {
    const deleteCallback = saveLocally
      ? () => deleteRowItem(itemId)
      : () => {
          {
            deleteItemHttp('', {
              queryParams: { id: itemId },
            })
              .then(() => {
                cancelCreateOrEditRowData();
                refreshTable();
              })
              .catch(() => {
                console.log('Delete error');
              });
          }
        };

    confirmAndProceed(
      'Are you sure you want to delete this item. Please note this action cannot be reversed?',
      deleteCallback
    );
  };

  const createOrUpdateItem = () => {
    if (saveLocally) {
      updateLocalTableData();
    } else {
      let mutateHttp = updateItemHttp;
      const payload = newOrEditableRowData?.data;
      payload[crudParentEntityKey] = { id: parentEntityId };

      if (newOrEditableRowData?.mode === 'create') {
        mutateHttp = createItemHttp;

        delete payload.Id; // Remove the id because we are saving a new one
      }

      // For Entity reference objects, the object will be something like ColumnName: { value: string, displayText: string }
      // But the server expects ColumnName: { id: string }. So we just to replace value with id. Let's go
      Object.keys(payload).forEach(key => {
        const prop = payload[key];
        // TODO: check if column type is entityReference. Anyway, for now it is, but you never know
        if (typeof prop === 'object' && 'value' in prop) {
          payload[key] = {
            id: payload[key]['value'],
          };

          delete payload[key]['value'];
        }
      });

      mutateHttp(payload)
        .then(() => {
          cancelCreateOrEditRowData();
          refreshTable();
        })
        .catch(errorObj => console.log(errorObj));
    }
  };
  //#endregion

  // const onFetchData = (state: any) => {
  //   const payload: IGetDataPayload = {
  //     id: tableId,
  //     pageSize: state.pageSize,
  //     currentPage: state.page + 1, // starts from 0
  //     sorting: state.sorted,
  //     quickSearch: state.quickSearch,
  //     filter: tableFilter,
  //   };
  //   fetchTableData(payload);
  // };

  // sort
  const defaultSorting = tableSorting
    ? tableSorting.map<SortingRule<string>>(c => ({ id: c.id, desc: c.desc }))
    : columns
        .filter(c => c.defaultSorting !== null)
        .map<SortingRule<string>>(c => ({ id: c.id, desc: c.defaultSorting === 1 }));

  const isLoading = isFetchingTableData || isCreating || isUpdating || isDeleting;

  const data =
    newOrEditableRowData && crudMode === 'inline'
      ? newOrEditableRowData?.mode === 'create'
        ? [newOrEditableRowData?.data, ...tableData]
        : tableData
      : tableData;

  const memoizedColumns = useMemo(() => {
    return columns?.filter(({ isVisible, isHiddenByDefault }) => isVisible && !isHiddenByDefault);
  }, [columns]);

  const tableProps: IReactTableProps = {
    // ref: reactTableRef,
    data,
    // Disable sorting if we're in create mode so that the new row is always the first
    defaultSorting: newOrEditableRowData?.mode === 'create' ? null : defaultSorting,
    disableSortBy: Boolean(newOrEditableRowData?.id), // Disable sorting if we're creating or editing so that
    useMultiSelect,
    // disableSortBy: false, // Do not disable sorting
    onSelectRow,
    onRowDoubleClick: dblClickHandler,
    onSelectedIdsChanged: changeSelectedIds,
    onSort, // Update it so that you can pass it as param. Quick fix for now
    columns: preparedColumns?.map(column => {
      const cleanedColumn = removeUndefinedProperties(column);

      return cleanedColumn as Column<any>;
    }),
    selectedRowIndex,
    // onFetchData,
    loading: isLoading,
    // minRows: 0, // to hide empty rows
    pageCount: totalPages,
    manualFilters: true, // informs React Table that you'll be handling sorting and pagination server-side
    manualPagination: true, // informs React Table that you'll be handling sorting and pagination server-side
    // pageSizeOptions,
    // pageIndex: currentPage ? currentPage - 1 : currentPage,
    loadingText: (
      <span>
        <LoadingOutlined /> loading...
      </span>
    ),
    // pageSize: selectedPageSize,
  };

  const renderConfirmDialog = () => {
    /* For some strange reasons, the modal is not closing when the visible property is set false, hence this hack
     * I started by using Modal.confirm and that's when I realized this issue. Will investigate later
     */

    if (confirmModalProps?.visible) {
      return (
        <Modal
          title="Please confirm"
          {...confirmModalProps}
          // icon={<ExclamationCircleOutlined />}
          okText="Proceed"
          onCancel={hideModal}
        >
          <p>{confirmModalProps?.content}</p>
        </Modal>
      );
    }

    return null;
  };

  const EditModal = useMemo(() => {
    return (
      <Modal
        title="Capture Details"
        okText="Save"
        onCancel={cancelCreateOrEditRowData}
        onOk={createOrUpdateItem}
        visible={crudMode === 'dialog' && Boolean(newOrEditableRowData?.id)}
        key="captureEntityDetailsModal"
        width={CRUD_MODAL_WIDTH}
        okButtonProps={{ loading: isCreating }}
      >
        <Form
          {...{
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
          }}
        >
          {memoizedColumns.map(
            ({ id, caption, dataType, referenceListName, referenceListNamespace, entityReferenceTypeShortAlias }) => {
              const editProps: IColumnEditFieldProps = {
                id,
                dataType,
                name: id,
                caption,
                onChange: handleGenericChange,
                value: selectedObject && selectedObject[id],
                referenceListName,
                referenceListNamespace,
                entityReferenceTypeShortAlias,
              };

              if (customTypeEditors?.length) {
                for (const customEditor of customTypeEditors) {
                  const { property, render } = customEditor;

                  if (id === property) {
                    return render(editProps);
                  }
                }
              }

              return (
                <FormItem label={caption} key={nanoid()}>
                  <ColumnEditField {...editProps} />
                </FormItem>
              );
            }
          )}
        </Form>
      </Modal>
    );
  }, [crudMode, newOrEditableRowData?.id]);

  const renderDetails = () => {
    return (
      <Modal
        title="Details"
        onCancel={cancelCreateOrEditRowData}
        onOk={cancelCreateOrEditRowData}
        visible={Boolean(newOrEditableRowData?.id) && newOrEditableRowData?.mode === 'read'}
        key="displayEntityDetailsModal"
        width={CRUD_MODAL_WIDTH}
      >
        <Form
          {...{
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
          }}
        >
          {memoizedColumns.map(({ id, caption, dataType }) => {
            return (
              <FormItem label={caption} key={nanoid()}>
                <ColumnDetailsField
                  dataType={dataType}
                  value={newOrEditableRowData && newOrEditableRowData?.data[id]}
                />
              </FormItem>
            );
          })}
        </Form>
      </Modal>
    );
  };

  return (
    <Fragment>
      <div className="sha-child-table-error-container">
        <ValidationErrors error={createError?.data} />
        <ValidationErrors error={updateError?.data} />
        <ValidationErrors error={deleteError?.data} />
        {exportToExcelError && <ValidationErrors error={'Error occurred while exporting to excel'} />}
      </div>

      {/* {useMultiselect ? <MultiselectWithState {...tableProps} /> : <ReactTable {...tableProps} />} */}
      <ReactTable {...tableProps} />

      {renderConfirmDialog()}

      {EditModal}

      {renderDetails()}
    </Fragment>
  );
};

export default IndexTable;
