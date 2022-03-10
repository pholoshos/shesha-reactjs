/* Generated by restful-react */

import React from 'react';
import { Get, GetProps, useGet, UseGetProps, Mutate, MutateProps, useMutate, UseMutateProps } from 'restful-react';

import * as RestfulShesha from '../utils/fetchers';
export const SPEC_VERSION = 'v1';
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

export interface DataTableStoredFilterDto {
  id: string;
  name: string;
  isExclusive?: boolean;
  isPrivate?: boolean;
  expressionType?: string | null;
  expression?: string | null;
}

export interface DataTableConfigDto {
  id?: string | null;
  pageSize?: number;
  columns?: DataTableColumnDto[] | null;
  storedFilters?: DataTableStoredFilterDto[] | null;
  createUrl?: string | null;
  detailsUrl?: string | null;
  updateUrl?: string | null;
  deleteUrl?: string | null;
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

export interface DataTableConfigDtoAjaxResponse {
  targetUrl?: string | null;
  success?: boolean;
  error?: ErrorInfo;
  unAuthorizedRequest?: boolean;
  __abp?: boolean;
  result?: DataTableConfigDto;
}

export interface AjaxResponseBase {
  targetUrl?: string | null;
  success?: boolean;
  error?: ErrorInfo;
  unAuthorizedRequest?: boolean;
  __abp?: boolean;
}

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

export interface ColumnSortingDto {
  id?: string | null;
  desc?: boolean;
}

export interface ColumnFilterDto {
  columnId?: string | null;
  propertyName?: string | null;
  filterOption?: string | null;
  filter?: {} | null;
  realPropertyName?: string | null;
}

export interface SelectedStoredFilterDto {
  id?: string | null;
  name?: string | null;
  expressionType?: string | null;
  expression?: {} | null;
}

export interface DataTableGetDataInput {
  id?: string | null;
  uid?: string | null;
  entityType?: string | null;
  pageSize?: number;
  quickSearch?: string | null;
  currentPage?: number;
  parentEntityId?: string | null;
  sorting?: ColumnSortingDto[] | null;
  filter?: ColumnFilterDto[] | null;
  selectedStoredFilterIds?: string[] | null;
  selectedFilters?: SelectedStoredFilterDto[] | null;
  properties?: string[] | null;
}

export interface DataTableData {
  totalRows?: number;
  totalRowsBeforeFilter?: number;
  totalPages?: number;
  echo?: number;
  rows?: { [key: string]: any }[] | null;
}

export interface DataTableDataAjaxResponse {
  targetUrl?: string | null;
  success?: boolean;
  error?: ErrorInfo;
  unAuthorizedRequest?: boolean;
  __abp?: boolean;
  result?: DataTableData;
}

export interface FileStreamResultAjaxResponse {
  targetUrl?: string | null;
  success?: boolean;
  error?: ErrorInfo;
  unAuthorizedRequest?: boolean;
  __abp?: boolean;
  result?: string | null;
}

export interface DataTableGetConfigurationQueryParams {
  id?: string | null;
  /**
   * The requested API version
   */
  'api-version'?: string;
}

export type DataTableGetConfigurationProps = Omit<
  GetProps<DataTableConfigDtoAjaxResponse, AjaxResponseBase, DataTableGetConfigurationQueryParams, void>,
  'path'
>;

export const DataTableGetConfiguration = (props: DataTableGetConfigurationProps) => (
  <Get<DataTableConfigDtoAjaxResponse, AjaxResponseBase, DataTableGetConfigurationQueryParams, void>
    path={`/api/DataTable/GetConfiguration`}
    {...props}
  />
);

export type UseDataTableGetConfigurationProps = Omit<
  UseGetProps<DataTableConfigDtoAjaxResponse, AjaxResponseBase, DataTableGetConfigurationQueryParams, void>,
  'path'
>;

export const useDataTableGetConfiguration = (props: UseDataTableGetConfigurationProps) =>
  useGet<DataTableConfigDtoAjaxResponse, AjaxResponseBase, DataTableGetConfigurationQueryParams, void>(
    `/api/DataTable/GetConfiguration`,
    props
  );

export const dataTableGetConfiguration = (
  props: RestfulShesha.GetProps<
    DataTableConfigDtoAjaxResponse,
    AjaxResponseBase,
    DataTableGetConfigurationQueryParams,
    void
  >,
  signal?: RequestInit['signal']
) =>
  RestfulShesha.get<DataTableConfigDtoAjaxResponse, AjaxResponseBase, DataTableGetConfigurationQueryParams, void>(
    `/api/DataTable/GetConfiguration`,
    props,
    signal
  );

export interface DataTableGetColumnsQueryParams {
  /**
   * The requested API version
   */
  'api-version'?: string;
}

export type DataTableGetColumnsProps = Omit<
  MutateProps<
    DataTableColumnDtoListAjaxResponse,
    AjaxResponseBase,
    DataTableGetColumnsQueryParams,
    GetColumnsInput,
    void
  >,
  'path' | 'verb'
>;

export const DataTableGetColumns = (props: DataTableGetColumnsProps) => (
  <Mutate<DataTableColumnDtoListAjaxResponse, AjaxResponseBase, DataTableGetColumnsQueryParams, GetColumnsInput, void>
    verb="POST"
    path={`/api/DataTable/GetColumns`}
    {...props}
  />
);

export type UseDataTableGetColumnsProps = Omit<
  UseMutateProps<
    DataTableColumnDtoListAjaxResponse,
    AjaxResponseBase,
    DataTableGetColumnsQueryParams,
    GetColumnsInput,
    void
  >,
  'path' | 'verb'
>;

export const useDataTableGetColumns = (props: UseDataTableGetColumnsProps) =>
  useMutate<
    DataTableColumnDtoListAjaxResponse,
    AjaxResponseBase,
    DataTableGetColumnsQueryParams,
    GetColumnsInput,
    void
  >('POST', `/api/DataTable/GetColumns`, props);

export const dataTableGetColumns = (
  props: RestfulShesha.MutateProps<
    DataTableColumnDtoListAjaxResponse,
    AjaxResponseBase,
    DataTableGetColumnsQueryParams,
    GetColumnsInput,
    void
  >,
  signal?: RequestInit['signal']
) =>
  RestfulShesha.mutate<
    DataTableColumnDtoListAjaxResponse,
    AjaxResponseBase,
    DataTableGetColumnsQueryParams,
    GetColumnsInput,
    void
  >('POST', `/api/DataTable/GetColumns`, props, signal);

export interface DataTableGetDataQueryParams {
  /**
   * The requested API version
   */
  'api-version'?: string;
}

export type DataTableGetDataProps = Omit<
  MutateProps<DataTableDataAjaxResponse, AjaxResponseBase, DataTableGetDataQueryParams, DataTableGetDataInput, void>,
  'path' | 'verb'
>;

export const DataTableGetData = (props: DataTableGetDataProps) => (
  <Mutate<DataTableDataAjaxResponse, AjaxResponseBase, DataTableGetDataQueryParams, DataTableGetDataInput, void>
    verb="POST"
    path={`/api/DataTable/GetData`}
    {...props}
  />
);

export type UseDataTableGetDataProps = Omit<
  UseMutateProps<DataTableDataAjaxResponse, AjaxResponseBase, DataTableGetDataQueryParams, DataTableGetDataInput, void>,
  'path' | 'verb'
>;

export const useDataTableGetData = (props: UseDataTableGetDataProps) =>
  useMutate<DataTableDataAjaxResponse, AjaxResponseBase, DataTableGetDataQueryParams, DataTableGetDataInput, void>(
    'POST',
    `/api/DataTable/GetData`,
    props
  );

export const dataTableGetData = (
  props: RestfulShesha.MutateProps<
    DataTableDataAjaxResponse,
    AjaxResponseBase,
    DataTableGetDataQueryParams,
    DataTableGetDataInput,
    void
  >,
  signal?: RequestInit['signal']
) =>
  RestfulShesha.mutate<
    DataTableDataAjaxResponse,
    AjaxResponseBase,
    DataTableGetDataQueryParams,
    DataTableGetDataInput,
    void
  >('POST', `/api/DataTable/GetData`, props, signal);

export interface DataTableExportToExcelQueryParams {
  /**
   * The requested API version
   */
  'api-version'?: string;
}

export type DataTableExportToExcelProps = Omit<
  MutateProps<
    FileStreamResultAjaxResponse,
    AjaxResponseBase,
    DataTableExportToExcelQueryParams,
    DataTableGetDataInput,
    void
  >,
  'path' | 'verb'
>;

export const DataTableExportToExcel = (props: DataTableExportToExcelProps) => (
  <Mutate<
    FileStreamResultAjaxResponse,
    AjaxResponseBase,
    DataTableExportToExcelQueryParams,
    DataTableGetDataInput,
    void
  >
    verb="POST"
    path={`/api/DataTable/ExportToExcel`}
    {...props}
  />
);

export type UseDataTableExportToExcelProps = Omit<
  UseMutateProps<
    FileStreamResultAjaxResponse,
    AjaxResponseBase,
    DataTableExportToExcelQueryParams,
    DataTableGetDataInput,
    void
  >,
  'path' | 'verb'
>;

export const useDataTableExportToExcel = (props: UseDataTableExportToExcelProps) =>
  useMutate<
    FileStreamResultAjaxResponse,
    AjaxResponseBase,
    DataTableExportToExcelQueryParams,
    DataTableGetDataInput,
    void
  >('POST', `/api/DataTable/ExportToExcel`, props);

export const dataTableExportToExcel = (
  props: RestfulShesha.MutateProps<
    FileStreamResultAjaxResponse,
    AjaxResponseBase,
    DataTableExportToExcelQueryParams,
    DataTableGetDataInput,
    void
  >,
  signal?: RequestInit['signal']
) =>
  RestfulShesha.mutate<
    FileStreamResultAjaxResponse,
    AjaxResponseBase,
    DataTableExportToExcelQueryParams,
    DataTableGetDataInput,
    void
  >('POST', `/api/DataTable/ExportToExcel`, props, signal);
