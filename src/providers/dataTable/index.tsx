import React, { FC, useContext, PropsWithChildren, useEffect, useRef, useMemo } from 'react';
import useThunkReducer from 'react-hook-thunk-reducer';
import { dataTableReducer } from './reducer';
import axios from 'axios';
import FileSaver from 'file-saver';
import {
  DataTableActionsContext,
  DataTableStateContext,
  DATA_TABLE_CONTEXT_INITIAL_STATE,
  IDataTableStateContext,
  IDataTableUserConfig,
  DEFAULT_DT_USER_CONFIG,
  DEFAULT_TABLE_CONFIG_RESULT,
} from './contexts';
import { getFlagSetters } from '../utils/flagsSetters';
import {
  fetchTableConfigAction,
  fetchTableConfigSuccessAction,
  fetchTableDataAction,
  fetchTableDataSuccessAction,
  fetchTableDataErrorAction,
  setCurrentPageAction,
  changePageSizeAction,
  toggleColumnVisibilityAction,
  toggleColumnFilterAction,
  changeFilterOptionAction,
  changeFilterAction,
  applyFilterAction,
  changeQuickSearchAction,
  toggleSaveFilterModalAction,
  exportToExcelRequestAction,
  exportToExcelSuccessAction,
  exportToExcelErrorAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
  changeSelectedRowAction,
  changeSelectedStoredFilterIdsAction,
  setPredefinedFiltersAction,
  changeSelectedIdsAction,
  setCreateOrEditRowDataAction,
  updateLocalTableDataAction,
  deleteRowItemAction,
  registerConfigurableColumnsAction,
  fetchColumnsSuccessSuccessAction,
  setCrudConfigAction,
  onSortAction,
  changeDisplayColumnAction,
  changeActionedRowAction,
  changePersistedFiltersToggleAction,
} from './actions';
import {
  ITableDataResponse,
  IndexColumnFilterOption,
  IGetDataPayload,
  ColumnFilter,
  IFilterItem,
  IEditableRowState,
  ICrudProps,
  IStoredFilter,
  ITableFilter,
  ITableCrudConfig,
  IColumnSorting,
} from './interfaces';
import { useMutate, useGet } from 'restful-react';
import { isEmpty, isEqual, sortBy } from 'lodash';
import { GetColumnsInput, DataTableColumnDtoListAjaxResponse } from '../../apis/dataTable';
import { IResult } from '../../interfaces/result';
import { useLocalStorage, usePubSub, useSubscribe } from '../../hooks';
import { useAuth } from '../auth';
import { nanoid } from 'nanoid/non-secure';
import { useDebouncedCallback } from 'use-debounce';
import {
  IConfigurableColumnsBase,
  IConfigurableColumnsProps,
  IDataColumnsProps,
} from '../datatableColumnsConfigurator/models';
import { useSheshaApplication } from '../sheshaApplication';
import { DataTablePubsubConstants } from './pubSub';
import { useGlobalState } from '../globalState';
import camelCaseKeys from 'camelcase-keys';
import { useShaRouting } from '../shaRouting';

interface IDataTableProviderProps extends ICrudProps {
  /** Table configuration Id */
  tableId?: string;

  /** Type of entity */
  entityType?: string;

  /** Id of the user config, is used for saving of the user settings (sorting, paging etc) to the local storage. `tableId` is used if missing  */
  userConfigId?: string;

  /**
   * Used for storing the data table state in the global store and publishing and listening to events
   * If not provided, the state will not be saved globally and the user cannot listen to and publish events
   */
  uniqueStateId?: string;

  /** Table title */
  title?: string;

  /** Id of the parent entity */
  parentEntityId?: string;

  /**
   * @deprecated pass this on an `IndexTable` level
   */
  onDblClick?: (data: any) => void;

  /**
   * @deprecated pass this on an `IndexTable` level
   */
  onSelectRow?: (index: number, row: any) => void;

  /**
   * Called when fetch data or refresh is complete is complete
   */
  onFetchDataSuccess?: () => void;

  /**
   * @deprecated pass this on an `IndexTable` level
   */
  selectedRow?: any;
  getDataPath?: string;
  getExportToExcelPath?: string;
  defaultFilter?: IFilterItem[];
}

const DataTableProvider: FC<PropsWithChildren<IDataTableProviderProps>> = ({
  children,
  tableId,
  userConfigId,
  title,
  parentEntityId,
  onDblClick,
  onSelectRow,
  selectedRow,
  getDataPath,
  getExportToExcelPath,
  defaultFilter,
  entityType,
  uniqueStateId,
  onFetchDataSuccess,
}) => {
  const [state, dispatch] = useThunkReducer(dataTableReducer, {
    ...DATA_TABLE_CONTEXT_INITIAL_STATE,
    tableId,
    entityType,
    title,
    parentEntityId,
  });
  const { setState: setGlobalState } = useGlobalState();
  const { publish } = usePubSub();

  const { backendUrl } = useSheshaApplication();
  const tableIsReady = useRef(false);
  const { headers } = useAuth();

  const { router } = useShaRouting();

  const { mutate: fetchDataTableDataInternal } = useMutate<IResult<ITableDataResponse>>({
    verb: 'POST',
    path: getDataPath ?? '/api/DataTable/GetData',
    requestOptions: {
      headers,
    },
  });

  const expandFetchDataPayload = (payload: IGetDataPayload, providedState: IDataTableStateContext): IGetDataPayload => {
    // convert filters
    const allFilters = [...(providedState?.predefinedFilters || []), ...(providedState?.storedFilters || [])];

    const filters = payload.selectedStoredFilterIds
      .map(id => allFilters.find(f => f.id === id))
      .filter(f => Boolean(f));

    const expandedPayload: IGetDataPayload = { ...payload, selectedFilters: filters };

    // Check against state.selectedStoredFilterIds as well
    if (filters?.length === 0 && providedState?.predefinedFilters?.length) {
      const foundSelectedFilter = providedState?.predefinedFilters?.find(({ defaultSelected }) => defaultSelected);

      if (foundSelectedFilter) {
        expandedPayload.selectedStoredFilterIds = [foundSelectedFilter?.id];
        expandedPayload.selectedFilters = [foundSelectedFilter];
      }
    }

    //Make sure you don't query the data for a selected filter that has no expression
    const outgoingSelectedFilterId = expandedPayload?.selectedStoredFilterIds?.length
      ? expandedPayload?.selectedStoredFilterIds[0]
      : null;

    if (outgoingSelectedFilterId) {
      const foundFilter = expandedPayload?.selectedFilters?.find(({ id }) => id === outgoingSelectedFilterId);

      /**
       * We want to make sure that we do not pass the filters under the following conditions as they would cause the server to fail
       * 1. The filter has no expression
       * 2. Filter has an expression but not all dynamic expressions have been evaluated
       */

      if (
        foundFilter &&
        (!foundFilter?.expression || // Filter has no expression
          foundFilter?.unevaluatedExpressions?.length) // Filter has expression but not all expressions have been evaluated
      ) {
        expandedPayload.selectedStoredFilterIds = [];
        expandedPayload.selectedFilters = [];
      }
    }

    return expandedPayload;
  }

  const fetchDataTableData = (payload: IGetDataPayload) => {
    // save current user configuration to local storage
    const userConfigToSave = {
      pageSize: payload.pageSize,
      currentPage: payload.currentPage,
      quickSearch: payload.quickSearch,
      columns: state.columns,
      tableSorting: payload.sorting,
      selectedStoredFilterIds: payload.selectedStoredFilterIds || state?.selectedStoredFilterIds,
      tableFilter: payload.filter,
    };

    setUserDTSettings(userConfigToSave);

    const expandedPayload = expandFetchDataPayload(payload, state);

    return fetchDataTableDataInternal(expandedPayload);
  };

  const { loading: isFetchingTableConfig, data: tableConfig, refetch: fetTableConfig } = useGet({
    lazy: true,
    queryParams: {
      id: tableId,
    },
    requestOptions: {
      headers,
    },
    path: '/api/DataTable/GetConfiguration',
  });

  const [userDTSettingsInner, setUserDTSettings] = useLocalStorage<IDataTableUserConfig>(
    userConfigId || tableId,
    null
    // ['selectedStoredFilterIds'] // TODO: Review the saving of selected filters
  );

  const userDTSettings = useMemo(() => {
    const settingsToReturn: IDataTableUserConfig = defaultFilter
      ? { ...DEFAULT_DT_USER_CONFIG, tableFilter: defaultFilter }
      : userDTSettingsInner;

    return {
      ...settingsToReturn,
      selectedStoredFilterIds: settingsToReturn?.selectedStoredFilterIds,
    };
  }, [defaultFilter, userDTSettingsInner]);

  const configIsReady =
    tableId && !isFetchingTableConfig && state.tableConfigLoaded && tableConfig && (state?.columns?.length || 0) > 0;

  // fetch table data when config is ready or something changed (selected filter, changed current page etc.)
  useEffect(() => {
    if (tableId) {
      // fetch using table config
      if (configIsReady) {
        tableIsReady.current = true; // is used to prevent unneeded data fetch by the ReactTable. Any data fetch requests before this line should be skipped
        refreshTable();
      }
    } else if (entityType) {
      // fecth using entity type
      tableIsReady.current = true; // is used to prevent unneeded data fetch by the ReactTable. Any data fetch requests before this line should be skipped
      refreshTable();
    }
  }, [
    state.tableFilter?.length,
    state.currentPage,
    state.selectedStoredFilterIds,
    state.selectedPageSize,
    isFetchingTableConfig,
    state.tableConfigLoaded,
    state.entityType,
    state.columns?.length,
    state.tableSorting,
  ]);

  // fetch table data when config is ready or something changed (selected filter, changed current page etc.)
  const refreshTableWhenAppropriate = () => {
    if (tableId) {
      // fetch using table config
      if (configIsReady) {
        tableIsReady.current = true; // is used to prevent unneeded data fetch by the ReactTable. Any data fetch requests before this line should be skipped
        refreshTable();
      }
    } else if (entityType) {
      // fecth using entity type
      tableIsReady.current = true; // is used to prevent unneeded data fetch by the ReactTable. Any data fetch requests before this line should be skipped
      refreshTable();
    }
  };

  // const previousPredefinedFilters = usePrevious(state.predefinedFilters);

  const debouncedRefreshTable = useDebouncedCallback(() => {
    refreshTableWhenAppropriate();
  }, 500);

  useEffect(() => {
    if (state.predefinedFilters) {
      debouncedRefreshTable();
    }
  }, [state.predefinedFilters]);

  const refreshTable = () => {
    if ((configIsReady || columnsAreReady) && tableIsReady.current === true) {
      fetchTableData();
    }
  };

  const debouncedFetch = useDebouncedCallback(
    (payload: any) => {
      fetchDataTableData(payload)
        .then(data => {
          if (onFetchDataSuccess && typeof onFetchDataSuccess === 'function') {
            onFetchDataSuccess();
          }
          dispatch(fetchTableDataSuccessAction(data.result));
        })
        .catch(e => {
          console.log(e);
          dispatch(fetchTableDataErrorAction());
        });
    },
    // delay in ms
    300
  );

  const debouncedExportToExcel = useDebouncedCallback(
    () => {
      exportToExcel();
    },
    // delay in ms
    300
  );

  const debouncedDownloadLogFile = useDebouncedCallback(
    () => {
      downloadLogFile();
    },
    // delay in ms
    300
  );

  const columnsAreReady = !tableId && entityType && state?.columns?.length > 0;

  const fetchTableData = (payload?: IGetDataPayload) => {
    const internalPayload = {
      ...getFetchTableDataPayload(),
      ...(payload ?? {}),
      parentEntityId,
    };

    // note: we have two sources of the payload - ReactTable and our provider
    // so we have to save the payload on every fetch request but skip data fetch in some cases
    dispatch(fetchTableDataAction(internalPayload)); // todo: remove this line, it's needed just to save the Id

    if ((configIsReady || columnsAreReady) && tableIsReady.current === true) {
      debouncedFetch(internalPayload);
    }
  };

  // fetch table data when configuration is available
  useEffect(() => {
    if (!isFetchingTableConfig && tableConfig) {
      dispatch(
        fetchTableConfigSuccessAction({
          tableConfig: tableConfig.result ?? {
            id: tableId,
            ...DEFAULT_TABLE_CONFIG_RESULT,
          },
          userConfig: userDTSettings,
        })
      );

      //#region HACK - the value is not populated. I need to investigate why and remove this manual setting
      defaultFilter?.forEach(element => {
        changeFilter(element?.columnId, element?.filter);
      });
      //#endregion
    }
  }, [isFetchingTableConfig, tableConfig]);

  // fetch table config on first render
  useEffect(() => {
    if (tableId) fetTableConfig();
  }, [tableId]);

  useEffect(() => {
    // Save the settings whenever the columns change
    if (!isEmpty(userDTSettings) && state?.columns?.length > 0) {
      setUserDTSettings({
        ...userDTSettings,
        selectedStoredFilterIds: state?.selectedStoredFilterIds,
        columns: state?.columns,
      });
    }
  }, [state?.columns]);

  // useEffect(() => {
  //   setUserDTSettings({ ...userDTSettingsInner });
  // }, [state?.persistSelectedFilters]);

  const getFetchTableDataPayloadInternal = (localState: IDataTableStateContext): IGetDataPayload => {
    // Add default filter to table filter
    const filter = localState?.tableFilter || [];

    const localProperties = getDataProperties(localState.configurableColumns);

    const payload: IGetDataPayload = {
      id: tableId,
      entityType,
      properties: localProperties,
      pageSize: localState.selectedPageSize,
      currentPage: localState.currentPage,
      sorting: localState.tableSorting,
      quickSearch: localState.quickSearch,
      filter, //state.tableFilter,
      parentEntityId,
      selectedStoredFilterIds: localState.selectedStoredFilterIds || [],
    };
    return payload;
  };

  const getFetchTableDataPayload = (): IGetDataPayload => {
    return getFetchTableDataPayloadInternal(state);
  };

  const exportToExcel = () => {
    dispatch((dispatchThunk, getState) => {
      dispatchThunk(exportToExcelRequestAction());
      const currentState = getState();
      const payload = getFetchTableDataPayloadInternal(currentState);
      
      const expandedPayload = expandFetchDataPayload(payload, currentState);

      axios({
        url: `${backendUrl}` + (getExportToExcelPath ?? `/api/DataTable/ExportToExcel`),
        method: 'POST',
        data: expandedPayload,
        responseType: 'blob', // important
        headers,
      })
        .then(response => {
          dispatchThunk(exportToExcelSuccessAction());
          FileSaver.saveAs(new Blob([response.data]), 'Export.xlsx');
        })
        .catch(() => {
          dispatchThunk(exportToExcelErrorAction());
        });
    });
  };

  const fetchTableConfig = (id: string) => dispatch(fetchTableConfigAction(id));

  const setCurrentPage = (val: number) => {
    dispatch(setCurrentPageAction(val));
  };

  const changePageSize = (val: number) => {
    dispatch(changePageSizeAction(val));
  };

  const toggleColumnVisibility = (columnId: string) => {
    dispatch(toggleColumnVisibilityAction(columnId));
  };

  const changeFilterOption = (filterColumnId: string, filterOptionValue: IndexColumnFilterOption) =>
    dispatch(changeFilterOptionAction({ filterColumnId, filterOptionValue }));

  const changeFilter = (filterColumnId: string, filterValue: ColumnFilter) =>
    dispatch(changeFilterAction({ filterColumnId, filterValue }));

  const applyFilters = () => {
    const { tableFilterDirty } = state;

    dispatch(applyFilterAction(tableFilterDirty));
  };

  /** change quick search text without refreshing of the table data */
  const changeQuickSearch = (val: string) => {
    dispatch(changeQuickSearchAction(val));
  };

  /** change quick search and refresh table data */
  const performQuickSearch = (val: string) => {
    // note: use thunk to get state after update
    dispatch((dispatchThunk, getState) => {
      dispatchThunk(changeQuickSearchAction(val));
      dispatchThunk(setCurrentPageAction(1));

      const payload = getFetchTableDataPayloadInternal(getState());
      fetchTableData(payload);
    });
  };

  const toggleSaveFilterModal = (visible: boolean) => {
    dispatch(toggleSaveFilterModalAction(visible));
  };

  const clearFilters = () => {
    if (Boolean(userDTSettings)) {
      const newUserSTSettings = { ...userDTSettings, selectedStoredFilterIds: state?.selectedStoredFilterIds };
      delete newUserSTSettings.pageSize;
      delete newUserSTSettings.currentPage;
      delete newUserSTSettings.quickSearch;
      delete newUserSTSettings.tableFilter;

      setUserDTSettings(newUserSTSettings);
    }

    dispatch(toggleColumnFilterAction([]));
    dispatch(applyFilterAction([]));
  };

  const toggleColumnFilter = (ids: string[]) => {
    if (ids?.length) {
      dispatch(toggleColumnFilterAction(ids));
    } else {
      clearFilters();
    }
  };

  const changeSelectedRow = (val: any) => {
    dispatch(changeSelectedRowAction(val ? camelCaseKeys(val, { deep: true }) : null));
  };

  const changeActionedRow = (val: any) => {
    dispatch(changeActionedRowAction(val ? camelCaseKeys(val, { deep: true }) : null));
  };

  const changeSelectedStoredFilterIds = (selectedStoredFilterIds: string[]) => {
    dispatch(changeSelectedStoredFilterIdsAction(selectedStoredFilterIds));
  };

  const setPredefinedFilters = (filters: IStoredFilter[]) => {
    const filtersChanged = !isEqual(sortBy(state?.predefinedFilters), sortBy(filters));

    if (filtersChanged) {
      dispatch(setPredefinedFiltersAction(filters));
    }
  };

  const changeSelectedIds = (selectedIds: string[]) => {
    dispatch(changeSelectedIdsAction(selectedIds));
  };

  const initializeNewDataCreation = () => {
    const id = nanoid();

    const data = { Id: '' };

    state?.columns?.forEach(column => {
      switch (column.dataType) {
        case 'boolean':
          data[column.accessor] = false;
          break;
        case 'date':
        case 'string':
          data[column.accessor] = '';
          break;
        case 'number':
          data[column.accessor] = 0;
          break;
        case 'refList':
          data[column.accessor] = { item: null, itemValue: null };
          break;
        case 'entityReference':
          data[column.accessor] = { id: null, displayText: null };
          break;
        case 'multiValueRefList':
          data[column.accessor] = [];
          break;
        default:
          break;
      }
    });

    data.Id = id;

    setCrudRowData({
      id,
      data,
      mode: 'create',
    });
  };

  /**
   *
   * @param newOrEditableRowData - data to update. If empty, it'll initialize new item creation
   */
  const setCrudRowData = (newOrEditableRowData?: IEditableRowState) => {
    if (newOrEditableRowData && typeof newOrEditableRowData !== 'function') {
      dispatch(setCreateOrEditRowDataAction(newOrEditableRowData));
    } else {
      initializeNewDataCreation();
    }
  };

  const cancelCreateOrEditRowData = () => {
    dispatch(setCreateOrEditRowDataAction(null));
  };

  const updateLocalTableData = () => {
    dispatch(updateLocalTableDataAction());
  };

  const deleteRowItem = (idOfItemToDeleteOrUpdate: string) => {
    dispatch(deleteRowItemAction(idOfItemToDeleteOrUpdate));
  };

  const getDataProperties = (columns: IConfigurableColumnsBase[]) => {
    const dataFields = columns.filter(
      c =>
        c.itemType === 'item' &&
        (c as IConfigurableColumnsProps).columnType === 'data' &&
        Boolean((c as IDataColumnsProps).propertyName)
    ) as IDataColumnsProps[];

    return dataFields.map(f => f.propertyName);
  };

  const properties = useMemo(() => {
    const dataFields = state?.configurableColumns?.filter(
      c =>
        c.itemType === 'item' &&
        (c as IConfigurableColumnsProps).columnType === 'data' &&
        Boolean((c as IDataColumnsProps).propertyName)
    ) as IDataColumnsProps[];

    return dataFields.map(f => f.propertyName);
  }, [state?.configurableColumns]);

  useEffect(() => {
    const { configurableColumns } = state;
    if (!entityType) return;

    const localProperties = getDataProperties(configurableColumns);

    if (localProperties.length === 0) {
      // don't fetch data from server when properties is empty
      dispatch(fetchColumnsSuccessSuccessAction({ columns: [], configurableColumns, userConfig: userDTSettings }));
      return;
    }

    // fetch columns config from server
    const getColumnsPayload: GetColumnsInput = {
      entityType,
      properties: localProperties,
    };

    axios({
      method: 'POST',
      url: `${backendUrl}/api/DataTable/GetColumns`,
      data: getColumnsPayload,
      headers,
    })
      .then(response => {
        const responseData = response.data as DataTableColumnDtoListAjaxResponse;

        if (responseData.success) {
          dispatch(
            fetchColumnsSuccessSuccessAction({
              columns: responseData.result,
              configurableColumns,
              userConfig: userDTSettings,
            })
          );
        }
      })
      .catch(e => {
        console.log(e);
        //dispatch(exportToExcelErrorAction());
      });
  }, [state.configurableColumns, state.entityType]);

  const registerConfigurableColumns = (ownerId: string, columns: IConfigurableColumnsBase[]) => {
    dispatch(registerConfigurableColumnsAction({ ownerId, columns }));
  };

  const getCurrentFilter = (): ITableFilter[] => {
    return state.tableFilterDirty || state.tableFilter || [];
  };

  const getDataSourceType = () => {
    return !tableId && entityType ? 'entity' : 'tableConfig';
  };

  const setCrudConfig = (config: ITableCrudConfig) => {
    dispatch(setCrudConfigAction(config));
  };

  const onSort = (sorting: IColumnSorting[]) => {
    dispatch(onSortAction(sorting));
  };

  const flagSetters = getFlagSetters(dispatch);

  //#region public
  const deleteRow = () => {
    console.log(`deleteRow ${state?.selectedRow}`);
  };

  const toggleColumnsSelector = () => {
    flagSetters?.setIsInProgressFlag({ isSelectingColumns: true, isFiltering: false });
  };

  const toggleAdvancedFilter = () => {
    flagSetters?.setIsInProgressFlag({ isFiltering: true, isSelectingColumns: false });
  };

  const changeDisplayColumn = (displayColumnName: string) => {
    dispatch(changeDisplayColumnAction(displayColumnName));
  };

  const changePersistedFiltersToggle = (persistSelectedFilters: boolean) => {
    dispatch(changePersistedFiltersToggleAction(persistSelectedFilters));
  };

  const downloadLogFile = () => {
    axios({
      url: `${backendUrl}/api/services/Scheduler/ScheduledJobExecution/DownloadLogFile?id=${router?.query?.id}`,
      method: 'GET',
      responseType: 'blob',
    })
      .then(response => {
        const fileName = response.headers['content-disposition']?.split('filename=')[1] ?? 'logfile.log';
        FileSaver.saveAs(new Blob([response.data]), fileName);
      })
      .catch(e => console.error(e));
  };
  //#endregion

  //#region Subscriptions
  useEffect(() => {
    if (uniqueStateId) {
      // First off, notify that the state has changed
      publish(DataTablePubsubConstants.stateChanged, {
        stateId: uniqueStateId,
        state,
      });

      setGlobalState({
        key: uniqueStateId,
        data: { ...state, refreshTable },
      });
    }
  }, [state, uniqueStateId]);

  useSubscribe(DataTablePubsubConstants.refreshTable, data => {
    if (data.stateId === uniqueStateId) {
      refreshTable();
    }
  });

  useSubscribe(DataTablePubsubConstants.deleteRow, data => {
    if (data.stateId === uniqueStateId) {
      deleteRow();
    }
  });

  useSubscribe(DataTablePubsubConstants.exportToExcel, data => {
    if (data.stateId === uniqueStateId) {
      debouncedExportToExcel();
    }
  });

  useSubscribe(DataTablePubsubConstants.toggleAdvancedFilter, data => {
    if (data.stateId === uniqueStateId) {
      toggleAdvancedFilter();
    }
  });

  useSubscribe(DataTablePubsubConstants.toggleColumnsSelector, data => {
    if (data.stateId === uniqueStateId) {
      toggleColumnsSelector();
    }
  });

  useSubscribe(DataTablePubsubConstants.downloadLogFile, data => {
    if (data.stateId === uniqueStateId) {
      debouncedDownloadLogFile();
    }
  });

  //#endregion

  /* NEW_ACTION_DECLARATION_GOES_HERE */

  return (
    <DataTableStateContext.Provider value={{ ...state, onDblClick, onSelectRow, selectedRow, properties }}>
      <DataTableActionsContext.Provider
        value={{
          onSort,
          ...flagSetters,
          fetchTableConfig,
          changeDisplayColumn,
          fetchTableData,
          setCurrentPage,
          changePageSize,
          toggleColumnVisibility,
          toggleColumnFilter,
          changeFilterOption,
          changeFilter,
          applyFilters,
          clearFilters,
          getDataPayload: getFetchTableDataPayload,
          exportToExcel,
          changeQuickSearch,
          performQuickSearch,
          toggleSaveFilterModal,
          changeSelectedRow,
          changeActionedRow,
          changeSelectedStoredFilterIds,
          setPredefinedFilters,
          changeSelectedIds,
          refreshTable,
          setCrudRowData,
          cancelCreateOrEditRowData,
          updateLocalTableData,
          deleteRowItem,
          registerConfigurableColumns,
          getCurrentFilter,
          getDataSourceType,
          setCrudConfig,
          changePersistedFiltersToggle,
          /* NEW_ACTION_GOES_HERE */
        }}
      >
        {children}
      </DataTableActionsContext.Provider>
    </DataTableStateContext.Provider>
  );
};

function useDataTableState() {
  const context = useContext(DataTableStateContext);

  if (context === undefined) {
    throw new Error('useDataTableState must be used within a DataTableProvider');
  }

  return context;
}

function useDataTableActions() {
  const context = useContext(DataTableActionsContext);

  if (context === undefined) {
    throw new Error('useDataTableActions must be used within a DataTableProvider');
  }

  return context;
}

function useDataTableStore() {
  return { ...useDataTableState(), ...useDataTableActions() };
}

const useDataTable = useDataTableStore;

export default DataTableProvider;

export { DataTableProvider, useDataTableState, useDataTableActions, useDataTable, useDataTableStore };
