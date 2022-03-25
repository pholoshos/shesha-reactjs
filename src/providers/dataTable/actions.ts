import { SortingRule } from 'react-table';
import { createAction } from 'redux-actions';
import { DataTableColumnDto, DataTableConfigDto } from '../../apis/dataTable';
import { IConfigurableColumnsBase } from '../datatableColumnsConfigurator/models';
import { IDataTableUserConfig } from './contexts';
import {
  IndexColumnFilterOption,
  ITableFilter,
  IStoredFilter,
  ITableDataResponse,
  IGetDataPayload,
  IEditableRowState,
  ITableCrudConfig,
  IColumnSorting,
} from './interfaces';

export enum DataTableActionEnums {
  FetchTableConfig = 'FETCH_TABLE_CONFIG',
  FetchTableConfigSuccess = 'FETCH_TABLE_CONFIG_SUCCESS',
  FetchTableConfigError = 'FETCH_TABLE_CONFIG_ERROR',

  FetchColumnsSuccess = 'FETCH_COLUMNS_SUCCESS',

  FetchTableData = 'FETCH_TABLE_DATA',
  FetchTableDataSuccess = 'FETCH_TABLE_DATA_SUCCESS',
  FetchTableDataError = 'FETCH_TABLE_DATA_ERROR',

  ExportToExcelRequest = 'EXPORT_TO_EXCEL_REQUEST',
  ExportToExcelSuccess = 'EXPORT_TO_EXCEL_SUCCESS',
  ExportToExcelError = 'EXPORT_TO_EXCEL_ERROR',

  ChangePageSize = 'CHANGE_PAGE_SIZE',
  SetCurrentPage = 'SET_CURRENT_PAGE',

  ToggleColumnVisibility = 'TOGGLE_COLUMN_VISIBILITY',
  ToggleColumnFilter = 'TOGGLE_COLUMN_FILTER',
  ChangeFilterOption = 'CHANGE_FILTER_OPTION',
  ChangeFilter = 'CHANGE_FILTER',
  ApplyFilter = 'APPLY_FILTER',
  ChangeQuickSearch = 'CHANGE_QUICK_SEARCH',
  ToggleSaveFilterModal = 'TOGGLE_SAVE_FILTER_MODAL',
  ChangeSelectedRow = 'CHANGE_SELECTED_ROW',
  ChangeSelectedStoredFilterIds = 'CHANGE_SELECTED_STORED_FILTER_IDS',
  SetPredefinedFilters = 'REGISTER_STORED_FILTER',
  ChangeSelectedIds = 'CHANGE_SELECTED_IDS',
  SetCrudRowData = 'SET_CRUD_ROW_DATA',
  UpdateLocalTableData = 'UPDATE_LOCAL_TABLE_DATA',
  DeleteRowItem = 'DELETE_ROW_ITEM',
  RegisterConfigurableColumns = 'REGISTER_CONFIGURABLE_COLUMNS',
  OnSelectRow = 'ON_SELECT_ROW',
  OnSort = 'ON_SORT',

  SetCrudConfig = 'SET_CRUD_Config',

  /* NEW_ACTION_TYPE_GOES_HERE */
}

export const fetchTableDataAction = createAction<IGetDataPayload, IGetDataPayload>(
  DataTableActionEnums.FetchTableData,
  p => p
);

export const fetchTableDataSuccessAction = createAction<ITableDataResponse, ITableDataResponse>(
  DataTableActionEnums.FetchTableDataSuccess,
  p => p
);

export const fetchTableDataErrorAction = createAction(DataTableActionEnums.FetchTableDataError, () => {
  /*nop*/
});

export const fetchTableConfigAction = createAction<string, string>(DataTableActionEnums.FetchTableConfig, p => p);

export const fetchTableConfigSuccessAction = createAction<
  IFetchTableConfigSuccessPayload,
  IFetchTableConfigSuccessPayload
>(DataTableActionEnums.FetchTableConfigSuccess, p => p);

export interface IFetchColumnsSuccessSuccessPayload {
  columns: DataTableColumnDto[];
  configurableColumns: IConfigurableColumnsBase[];
  userConfig: IDataTableUserConfig;
}
export const fetchColumnsSuccessSuccessAction = createAction<
  IFetchColumnsSuccessSuccessPayload,
  IFetchColumnsSuccessSuccessPayload
>(DataTableActionEnums.FetchColumnsSuccess, p => p);

export const fetchTableConfigErrorAction = createAction<boolean, boolean>(
  DataTableActionEnums.FetchTableConfigError,
  p => p
);

export const setCreateOrEditRowDataAction = createAction<IEditableRowState, IEditableRowState>(
  DataTableActionEnums.SetCrudRowData,
  p => p
);

export interface IFetchTableConfigSuccessPayload {
  tableConfig: DataTableConfigDto;
  userConfig: IDataTableUserConfig;
}

export const changePageSizeAction = createAction<number, number>(DataTableActionEnums.ChangePageSize, p => p);

export const changeQuickSearchAction = createAction<string, string>(DataTableActionEnums.ChangeQuickSearch, p => p);

export const toggleSaveFilterModalAction = createAction<boolean, boolean>(
  DataTableActionEnums.ToggleSaveFilterModal,
  p => p
);

export const setCurrentPageAction = createAction<number, number>(DataTableActionEnums.SetCurrentPage, p => p);

export const toggleColumnVisibilityAction = createAction<string, string>(
  DataTableActionEnums.ToggleColumnVisibility,
  p => p
);

export const toggleColumnFilterAction = createAction<string[], string[]>(
  DataTableActionEnums.ToggleColumnFilter,
  p => p
);

export interface IChangeFilterOptionPayload {
  filterColumnId: string;
  filterOptionValue: IndexColumnFilterOption;
}
export const changeFilterOptionAction = createAction<IChangeFilterOptionPayload, IChangeFilterOptionPayload>(
  DataTableActionEnums.ChangeFilterOption,
  p => p
);

export interface IChangeFilterAction {
  filterColumnId: string;
  filterValue: any;
}
export const changeFilterAction = createAction<IChangeFilterAction, IChangeFilterAction>(
  DataTableActionEnums.ChangeFilter,
  p => p
);

export const applyFilterAction = createAction<ITableFilter[], ITableFilter[]>(DataTableActionEnums.ApplyFilter, p => p);

export const changeSelectedRowAction = createAction<number, number>(DataTableActionEnums.ChangeSelectedRow, p => p);

export const changeSelectedStoredFilterIdsAction = createAction<string[], string[]>(
  DataTableActionEnums.ChangeSelectedStoredFilterIds,
  p => p
);

export const setPredefinedFiltersAction = createAction<IStoredFilter[], IStoredFilter[]>(
  DataTableActionEnums.SetPredefinedFilters,
  p => p
);

export const changeSelectedIdsAction = createAction<string[], string[]>(DataTableActionEnums.ChangeSelectedIds, p => p);

export const exportToExcelRequestAction = createAction(DataTableActionEnums.ExportToExcelRequest);
export const exportToExcelSuccessAction = createAction(DataTableActionEnums.ExportToExcelSuccess);
export const exportToExcelErrorAction = createAction(DataTableActionEnums.ExportToExcelError);

export const updateLocalTableDataAction = createAction(DataTableActionEnums.UpdateLocalTableData);

export const deleteRowItemAction = createAction<string, string>(DataTableActionEnums.DeleteRowItem, p => p);

export interface IRegisterConfigurableColumnsPayload {
  /** owner of the columns list, not used now and may be removed later */
  ownerId: string;
  columns: IConfigurableColumnsBase[];
}
export const registerConfigurableColumnsAction = createAction<
  IRegisterConfigurableColumnsPayload,
  IRegisterConfigurableColumnsPayload
>(DataTableActionEnums.RegisterConfigurableColumns, p => p);

export const onSortAction = createAction<IColumnSorting[], IColumnSorting[]>(DataTableActionEnums.OnSort, p => p);

/* NEW_ACTION_GOES_HERE */

export const setCrudConfigAction = createAction<ITableCrudConfig, ITableCrudConfig>(
  DataTableActionEnums.SetCrudConfig,
  p => p
);
