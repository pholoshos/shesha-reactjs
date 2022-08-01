import { Moment } from 'moment';
import { IPublicDataTableActions } from './contexts';
export type ColumnFilter = string[] | number[] | Moment[] | Date[] | string | number | Moment | Date | boolean;

export type IndexColumnDataType =
  | 'string'
  | 'number'
  | 'date'
  | 'datetime'
  | 'time'
  | 'boolean'
  | 'refList'
  | 'multiValueRefList'
  | 'entityReference'
  | 'action'
  | 'other';

export type IndexColumnFilterOption =
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'equals'
  | 'lessThan'
  | 'greaterThan'
  | 'between'
  | 'before'
  | 'after';

export type SortDirection = 0 /*asc*/ | 1 /*desc*/;
export type ColumnSorting = 'asc' | 'desc';

export interface ITableColumn {
  customDataType?: string;
  id?: string;
  accessor: string;
  header: string;
  isVisible: boolean; // is visible in the table (including columns selector, filter etc.)
  isHiddenByDefault: boolean;
  show?: boolean; // is visible on client
  dataType?: IndexColumnDataType;
  filterOption?: IndexColumnFilterOption;
  filter?: any;
  isFilterable: boolean;
  isSortable: boolean;
  isEditable?: boolean;
  defaultSorting?: SortDirection;
  columnId?: string;
  propertyName?: string;
  filterCaption?: string;
  name?: string;
  caption?: string;
  allowShowHide?: boolean;
  //width?: string;
  referenceListName?: string;
  referenceListNamespace?: string;
  entityReferenceTypeShortAlias?: string;
  allowInherited?: boolean;

  minWidth?: number;
  maxWidth?: number;
}

export interface ICustomFilterOptions {
  readonly id: string;
  readonly name: string;
  readonly isApplied?: boolean;
}

export interface IFilterItem {
  readonly columnId: string;
  readonly filterOption: IndexColumnFilterOption;
  filter: ColumnFilter;
}

export interface IColumnSorting {
  readonly id: string;
  readonly desc: boolean;
}

export interface IGetDataPayload {
  readonly maxResultCount: number;
  readonly skipCount: number;
  readonly properties: string;
  readonly sorting?: string;
  readonly filter?: string;
  readonly quickSearch?: string;
}


export interface IGetDataPayloadInternal {
  readonly entityType: string;
  readonly properties: string[];
  readonly pageSize: number;
  readonly currentPage: number;
  readonly sorting: IColumnSorting[];
  readonly quickSearch: string;
  readonly advancedFilter?: IFilterItem[];
  readonly parentEntityId?: string;
  selectedFilterIds?: string[];
  selectedFilters?: IStoredFilter[];

  /**
   * If this is true, the data table will be cleared
   *
   * This is useful in a case where the payload has filters which have not been fully evaluated and `onlyFetchWhenFullyEvaluated` is `true`
   * the wouldn't wat to fetch the data at this stage and they don't want any data to be displayed on the table view as that would be misleading
   */
  skipFetch?: boolean;
}

export interface ITableConfigResponse {
  readonly columns?: any[];
  readonly storedFilters?: any[];
}

export interface ITableFilter {
  readonly columnId: string;
  readonly filterOption: IndexColumnFilterOption;
  readonly filter: any;
}

export interface IQuickFilter {
  readonly id: string;
  readonly name: string;
  readonly selected?: boolean;
}

export interface ICustomFilter {
  readonly id: string;
  readonly name: string;
  readonly columns: ITableColumn[];
  readonly isPrivate: boolean;
  readonly isApplied?: boolean;
}

export type FilterExpressionType = 'jsonLogic' | 'hql';
export type FilterType = 'predefined' | 'user-defined' | 'quick';
export interface IStoredFilter {
  id: string;

  name: string;

  tooltip?: string;
  // Exclusive filters cannot be applied on top of other filters. Only one can be selected

  isExclusive?: boolean;
  // Private filters are managed within the data table control
  isPrivate?: boolean;

  expressionType?: FilterExpressionType | string;

  expression?: string | object;

  filterType?: string;

  // use
  useExpression?: boolean;

  onlyFetchWhenFullyEvaluated?: boolean;

  selected?: boolean;

  defaultSelected?: boolean;

  //#region dynamic expressions
  hasDynamicExpression?: boolean;

  allFieldsEvaluatedSuccessfully?: boolean;

  unevaluatedExpressions?: string[];
  //#endregion
}

export interface ITableDataResponse {
  readonly totalCount: number;
  //readonly totalRowsBeforeFilter: number;
  readonly items: object[];
}

export interface ITableDataInternalResponse {
  readonly totalPages: number;
  readonly totalRows: number;
  readonly totalRowsBeforeFilter: number;
  readonly rows: object[];
}

export interface IDataTableInstance extends IPublicDataTableActions { }

export interface ITableCrudConfig {
  createUrl?: string;
  deleteUrl?: string;
  detailsUrl?: string;
  updateUrl?: string;
}

export interface IEditableRowState {
  id?: string;
  data?: any;
  mode: 'create' | 'edit' | 'read';
}

export interface ICrudState {
  create?: boolean;
  // read?: boolean; // You don't need this
  update?: boolean;
  delete?: boolean;
}

export interface ICrudProps {
  /**
   * whether this table supports CRUD functionality or not
   *
   * This should be removed later in favor of just checking the crud-related properties of the config
   */
  crud?: boolean | ICrudState;

  /**
   * Whether saving of table row items should be locally or not.
   *
   * This is especially useful in instances where the parentEntityId is not yet available and the items should be saved against that particular
   * entity
   */
  saveLocally?: boolean;

  /**
   * Whether you want the inline editing to be in the form of inline ot dialog
   */
  crudMode?: 'inline' | 'dialog';

  pickerOptions?: boolean;

  crudParentEntityKey?: string;

  overrideDefaultCrudBehavior?: boolean;
}

export interface IFormDataPayload {
  formData?: any;
}

export interface IFormDataPayload {
  crudSettings?: any;
}

export type ListSortDirection = 0 | 1;

export interface DataTableColumnDto {
  propertyName?: string | null;
  filterCaption?: string | null;
  name?: string | null;
  caption?: string | null;
  description?: string | null;
  allowShowHide?: boolean;
  dataType?: string | null;
  customDataType?: string | null;
  referenceListName?: string | null;
  referenceListNamespace?: string | null;
  entityReferenceTypeShortAlias?: string | null;
  autocompleteUrl?: string | null;
  allowInherited?: boolean;
  isVisible?: boolean;
  isFilterable?: boolean;
  isSortable?: boolean;
  isEditable?: boolean;
  width?: string | null;
  defaultSorting?: ListSortDirection;
  isHiddenByDefault?: boolean;
  hiddenByDefault?: boolean;
  visible?: boolean;
}

//#region todo: remove
export interface GetColumnsInput {
  entityType: string;
  properties?: string[] | null;
}

export interface DataTableColumnDtoListAjaxResponse {
  targetUrl?: string | null;
  success?: boolean;
  error?: ErrorInfo;
  unAuthorizedRequest?: boolean;
  __abp?: boolean;
  result?: DataTableColumnDto[] | null;
}

export interface ValidationErrorInfo {
  message?: string | null;
  members?: string[] | null;
}

export interface ErrorInfo {
  code?: number;
  message?: string | null;
  details?: string | null;
  validationErrors?: ValidationErrorInfo[] | null;
}
//#endregion