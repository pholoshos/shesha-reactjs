import { DATA_TABLE_CONTEXT_INITIAL_STATE, DEFAULT_PAGE_SIZE_OPTIONS, IDataTableStateContext } from './contexts';
import {
  DataTableActionEnums,
  IChangeFilterAction,
  IChangeFilterOptionPayload,
  IFetchColumnsSuccessSuccessPayload,
  IFetchTableConfigSuccessPayload,
  IRegisterConfigurableColumnsPayload,
} from './actions';
import flagsReducer from '../utils/flagsReducer';
import {
  IColumnSorting,
  IEditableRowState,
  IGetDataPayload,
  IndexColumnDataType,
  IStoredFilter,
  ITableColumn,
  ITableCrudConfig,
  ITableDataResponse,
  ITableFilter,
  SortDirection,
} from './interfaces';
import { handleActions } from 'redux-actions';
import {
  IConfigurableActionColumnsProps,
  IConfigurableColumnsProps,
  IDataColumnsProps,
} from '../datatableColumnsConfigurator/models';
import { getFilterOptions } from '../../components/columnItemFilter';
import { cleanPropertyName } from './utils';

/** get dirty filter if exists and fallback to current filter state */
const getDirtyFilter = (state: IDataTableStateContext): ITableFilter[] => {
  return [...(state.tableFilterDirty || state.tableFilter || [])];
};

const reducer = handleActions<IDataTableStateContext, any>(
  {
    [DataTableActionEnums.ChangeSelectedRow]: (state: IDataTableStateContext, action: ReduxActions.Action<any>) => {
      const { payload } = action;

      return {
        ...state,
        selectedRow: payload?.id === state?.selectedRow?.id ? null : payload,
      };
    },

    [DataTableActionEnums.ChangeSelectedIds]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<string[]>
    ) => {
      const { payload } = action;
      return {
        ...state,
        selectedIds: payload,
      };
    },

    [DataTableActionEnums.ChangeDisplayColumn]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<string>
    ) => {
      const { payload } = action;
      return {
        ...state,
        displayColumnName: payload,
      };
    },

    [DataTableActionEnums.ChangeSelectedStoredFilterIds]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<string[]>
    ) => {
      const { payload } = action;

      return {
        ...state,
        selectedStoredFilterIds: payload,
      };
    },

    [DataTableActionEnums.ApplyFilter]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<ITableFilter[]>
    ) => {
      const { payload } = action;
      return {
        ...state,
        tableFilter: payload,
        tableFilterDirty: payload,
        currentPage: 1,
      };
    },

    [DataTableActionEnums.ToggleSaveFilterModal]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<boolean>
    ) => {
      const { payload } = action;
      return {
        ...state,
        saveFilterModalVisible: payload,
      };
    },

    [DataTableActionEnums.SetCrudRowData]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<IEditableRowState>
    ) => {
      const { payload } = action;
      return {
        ...state,
        newOrEditableRowData: payload,
      };
    },

    [DataTableActionEnums.SetCurrentPage]: (state: IDataTableStateContext, action: ReduxActions.Action<number>) => {
      const { payload } = action;
      return {
        ...state,
        currentPage: payload,
      };
    },

    [DataTableActionEnums.ChangePageSize]: (state: IDataTableStateContext, action: ReduxActions.Action<number>) => {
      const { payload } = action;
      return {
        ...state,
        selectedPageSize: payload,
      };
    },

    [DataTableActionEnums.ChangeQuickSearch]: (state: IDataTableStateContext, action: ReduxActions.Action<string>) => {
      const { payload } = action;
      return {
        ...state,
        quickSearch: payload,
      };
    },

    [DataTableActionEnums.FetchTableData]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<IGetDataPayload>
    ) => {
      const { payload } = action;

      return {
        ...state,
        isFetchingTableData: true,
        tableId: payload.id, // todo: isolate all table properties including id, for now we just pass the id from the fetch aciton
        tableSorting: payload.sorting,
        currentPage: payload.currentPage,
        selectedPageSize: payload.pageSize,
        parentEntityId: payload.parentEntityId,
        selectedStoredFilterIds: payload.selectedStoredFilterIds ?? [],
      };
    },

    [DataTableActionEnums.FetchTableDataError]: (state: IDataTableStateContext) => {
      return {
        ...state,
        isFetchingTableData: false,
        hasFetchTableDataError: true,
      };
    },

    [DataTableActionEnums.FetchTableDataSuccess]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<ITableDataResponse>
    ) => {
      const {
        payload: { rows, totalPages, totalRows, totalRowsBeforeFilter },
      } = action;

      return {
        ...state,
        tableData: rows,
        totalPages,
        totalRows,
        totalRowsBeforeFilter,
        isFetchingTableData: false,
      };
    },

    [DataTableActionEnums.FetchTableConfig]: (state: IDataTableStateContext, action: ReduxActions.Action<string>) => {
      const { payload } = action;

      return {
        ...state,
        tableId: payload,
      };
    },

    [DataTableActionEnums.FetchTableConfigError]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<boolean>
    ) => {
      const { payload } = action;

      return {
        ...state,
        isFetchingTableData: false,
        hasFetchTableDataError: payload,
      };
    },

    [DataTableActionEnums.FetchTableConfigSuccess]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<IFetchTableConfigSuccessPayload>
    ) => {
      const {
        payload: { tableConfig, userConfig },
      } = action;
      const { columns, storedFilters, createUrl, updateUrl, deleteUrl, detailsUrl } = tableConfig;

      const cols = columns.map<ITableColumn>(column => {
        const userColumn = userConfig?.columns?.find(c => c.id === column.name);

        const colVisibility =
          userColumn?.show === null || userColumn?.show === undefined ? !column.isHiddenByDefault : userColumn?.show;

        return {
          id: column.name,
          columnId: column.name,
          caption: column.caption,
          accessor: column.name,
          propertyName: column.propertyName,
          header: column.caption,
          isVisible: column.isVisible,
          isSortable: column.isSortable,
          isEditable: column.isEditable,
          isHiddenByDefault: column.isHiddenByDefault,
          isFilterable: column.isFilterable,
          entityReferenceTypeShortAlias: column.entityReferenceTypeShortAlias,
          referenceListName: column.referenceListName,
          referenceListNamespace: column.referenceListNamespace,
          autocompleteUrl: column.autocompleteUrl,
          allowInherited: column.allowInherited,
          dataType: column.dataType as IndexColumnDataType,
          defaultSorting: column.defaultSorting as SortDirection,

          show: column.isVisible && colVisibility,
          allowShowHide: column.allowShowHide ?? true,
        };
      });

      const filteredFilters = storedFilters
        ?.filter(f => Boolean(f.id))
        .map<IStoredFilter>(filter => ({ ...filter }));

      return {
        ...state,

        isFetchingTableData: false,
        tableConfigLoaded: true,
        columns: cols,
        storedFilters: [...(state.storedFilters || []), ...filteredFilters],
        crudConfig: {
          createUrl,
          updateUrl,
          deleteUrl,
          detailsUrl,
        },
        // user config
        currentPage: userConfig?.currentPage || 1,
        selectedPageSize: userConfig?.pageSize || DEFAULT_PAGE_SIZE_OPTIONS[1],
        quickSearch: userConfig?.quickSearch,
        tableFilter: userConfig?.tableFilter,
        selectedStoredFilterIds: userConfig?.selectedStoredFilterIds || [],
        tableSorting: userConfig?.tableSorting,
      };
    },

    [DataTableActionEnums.FetchColumnsSuccess]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<IFetchColumnsSuccessSuccessPayload>
    ) => {
      const {
        payload: { columns, configurableColumns, userConfig },
      } = action;

      const cols = configurableColumns
        .map<ITableColumn>(column => {
          const colProps = column as IConfigurableColumnsProps;
          const userColumn = userConfig?.columns?.find(c => c.id === column.id);
          const colVisibility =
            userColumn?.show === null || userColumn?.show === undefined ? column.isVisible : userColumn?.show;

          switch (colProps.columnType) {
            case 'data': {
              const dataProps = column as IDataColumnsProps;
              const srvColumn = dataProps.propertyName
                ? columns.find(c => cleanPropertyName(c.name) === cleanPropertyName(dataProps.propertyName))
                : {};

              return {
                id: dataProps?.propertyName,
                columnId: column.id,
                accessor: cleanPropertyName(dataProps?.propertyName),
                propertyName: dataProps?.propertyName,
                minWidth: column.minWidth,
                maxWidth: column.minWidth,

                dataType: srvColumn.dataType as IndexColumnDataType,
                isSortable: srvColumn.isSortable,
                isHiddenByDefault: srvColumn.isHiddenByDefault,
                isFilterable: srvColumn.isFilterable,
                entityReferenceTypeShortAlias: srvColumn.entityReferenceTypeShortAlias,
                referenceListName: srvColumn.referenceListName,
                referenceListNamespace: srvColumn.referenceListNamespace,
                autocompleteUrl: srvColumn.autocompleteUrl,
                allowInherited: srvColumn.allowInherited,
                defaultSorting: srvColumn.defaultSorting as SortDirection,

                caption: column.caption,
                header: column.caption,
                isVisible: column.isVisible,
                allowShowHide: true,

                show: srvColumn.isVisible && colVisibility,
              };
            }
            case 'action': {
              const actionProps = column as IConfigurableActionColumnsProps;

              return {
                id: column.id,
                columnId: column.id,
                accessor: column.id,
                propertyName: column.id,
                minWidth: column.minWidth,
                maxWidth: column.minWidth,

                dataType: 'action',
                actionProps, // todo: review and add to interface

                isSortable: false,
                isHiddenByDefault: false,
                isFilterable: false,

                caption: column.caption,
                header: column.caption,
                isVisible: column.isVisible,
                allowShowHide: false,

                show: column.isVisible,
              };
            }
          }
          return null;
        })
        .filter(c => c !== null);

      return {
        ...state,
        columns: cols,
        // user config
        currentPage: userConfig?.currentPage || 1,
        selectedPageSize: userConfig?.pageSize || DEFAULT_PAGE_SIZE_OPTIONS[1],
        quickSearch: userConfig?.quickSearch,
        tableFilter: userConfig?.tableFilter,
        selectedStoredFilterIds: userConfig?.selectedStoredFilterIds || [],
        tableSorting: userConfig?.tableSorting,
      };
    },

    [DataTableActionEnums.UpdateLocalTableData]: (state: IDataTableStateContext) => {
      const { tableData, newOrEditableRowData } = state;

      const rows = tableData as any[];

      const foundItem = rows?.find(({ Id }) => Id === newOrEditableRowData?.id);

      return {
        ...state,
        tableData: foundItem
          ? rows?.map(item => {
              if (item?.Id === newOrEditableRowData?.id) {
                return newOrEditableRowData?.data;
              }

              return item;
            })
          : [newOrEditableRowData?.data, ...(tableData || [])],
        newOrEditableRowData: null,
      };
    },

    [DataTableActionEnums.DeleteRowItem]: (state: IDataTableStateContext, action: ReduxActions.Action<string>) => {
      const { tableData, newOrEditableRowData } = state;
      const idOfItemToDeleteOrUpdate = action.payload;

      return {
        ...state,
        tableData: (tableData as any[])?.filter(({ Id }) => Id !== idOfItemToDeleteOrUpdate),
        newOrEditableRowData: idOfItemToDeleteOrUpdate === newOrEditableRowData?.id ? null : newOrEditableRowData,
      };
    },

    [DataTableActionEnums.ToggleColumnFilter]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<string[]>
    ) => {
      const { payload: appliedFiltersColumnIds } = action;

      const currentFilter = getDirtyFilter(state);
      const filter = appliedFiltersColumnIds.map<ITableFilter>(id => {
        const existingFilter = currentFilter.find(f => f.columnId === id);
        if (existingFilter) return existingFilter;

        const column = state.columns.find(c => c.id === id);
        const filterOptions = getFilterOptions(column?.dataType);
        return {
          columnId: id,
          filterOption: filterOptions.length > 0 ? filterOptions[0] : null,
          filter: null,
        } as ITableFilter;
      });

      return {
        ...state,
        tableFilterDirty: filter,
      };
    },

    [DataTableActionEnums.ToggleColumnVisibility]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<string>
    ) => {
      const { payload: columnIdToToggle } = action;
      return {
        ...state,
        columns: state.columns.map(({ id, show, ...rest }) => {
          if (id === columnIdToToggle) {
            return {
              id,
              ...rest,
              show: !show,
            };
          }
          return { id, show, ...rest };
        }),
      };
    },

    [DataTableActionEnums.ChangeFilterOption]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<IChangeFilterOptionPayload>
    ) => {
      const {
        payload: { filterColumnId, filterOptionValue },
      } = action;

      const currentFilter = getDirtyFilter(state);

      const filter = currentFilter.map<ITableFilter>(f => ({
        ...f,
        filterOption: f.columnId === filterColumnId ? filterOptionValue : f.filterOption,
      }));

      return {
        ...state,
        tableFilterDirty: filter,
      };
    },

    [DataTableActionEnums.ChangeFilter]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<IChangeFilterAction>
    ) => {
      const {
        payload: { filterColumnId, filterValue },
      } = action;

      const currentFilter = getDirtyFilter(state);

      const filter = currentFilter.map<ITableFilter>(f => ({
        ...f,
        filter: f.columnId === filterColumnId ? filterValue : f.filter,
      }));

      return {
        ...state,
        tableFilterDirty: filter,
      };
    },

    [DataTableActionEnums.SetPredefinedFilters]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<IStoredFilter[]>
    ) => {
      const { payload: filters } = action;

      return {
        ...state,
        predefinedFilters: filters ? [...filters] : [],
      };
    },

    [DataTableActionEnums.RegisterConfigurableColumns]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<IRegisterConfigurableColumnsPayload>
    ) => {
      const { payload } = action;

      return {
        ...state,
        configurableColumns: [...payload.columns],
      };
    },

    [DataTableActionEnums.OnSort]: (state: IDataTableStateContext, action: ReduxActions.Action<IColumnSorting[]>) => {
      const { payload } = action;

      return {
        ...state,
        tableSorting: [...payload],
      };
    },

    [DataTableActionEnums.SetCrudConfig]: (
      state: IDataTableStateContext,
      action: ReduxActions.Action<ITableCrudConfig>
    ) => {
      const { payload } = action;

      return {
        ...state,
        crudConfig: payload,
      };
    },
  },
  DATA_TABLE_CONTEXT_INITIAL_STATE
);

export function dataTableReducer(
  incomingState: IDataTableStateContext,
  action: ReduxActions.Action<any>
): IDataTableStateContext {
  const flaggedState = flagsReducer(incomingState, action) as IDataTableStateContext;
  const newState = reducer(flaggedState, action);

  return newState;
}
