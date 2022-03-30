import { Moment } from 'moment';
import { IPublicDataTableActions } from './contexts';
export type ColumnFilter = string[] | number[] | Moment[] | Date[] | string | number | Moment | Date | boolean;

export type TableDataSourceType = 'entity' | 'tableConfig';

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

export type SortDirection = 0 | 1;

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
  readonly id: string;
  readonly entityType: string;
  readonly properties: string[];
  readonly pageSize: number;
  readonly currentPage: number;
  readonly sorting: IColumnSorting[];
  readonly quickSearch: string;
  readonly filter?: IFilterItem[];
  readonly parentEntityId?: string;
  selectedStoredFilterIds?: string[];
  selectedFilters?: IStoredFilter[];
}

export interface ITableDataResponse {
  readonly totalPages: number;
  readonly totalRows: number;
  readonly totalRowsBeforeFilter: number;
  readonly rows: object[];
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

  selected?: boolean;

  defaultSelected?: boolean;
}

export interface ITableDataResponse {
  readonly totalPages: number;
  readonly totalRows: number;
  readonly totalRowsBeforeFilter: number;
  readonly rows: object[];
}

export interface IDataTableInstance extends IPublicDataTableActions {}

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
