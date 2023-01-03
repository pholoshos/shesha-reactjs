/* Generated by restful-react */

import React from "react";
import { Get, GetProps, useGet, UseGetProps, Mutate, MutateProps, useMutate, UseMutateProps } from "restful-react";

import * as RestfulShesha from "../utils/fetchers"
export const SPEC_VERSION = "v1"; 
export interface AjaxResponseBase {
  targetUrl?: string | null;
  success?: boolean;
  error?: ErrorInfo;
  unAuthorizedRequest?: boolean;
  __abp?: boolean;
}

/**
 * Status of the Shesha.Domain.ConfigurationItems.ConfigurationItem
 */
export type ConfigurationItemVersionStatus = 1 | 2 | 3 | 4 | 5;

/**
 * Indicate the type of the entity metadata
 */
export type EntityConfigTypes = 1 | 2;

export interface EntityViewConfigurationDto {
  isStandard?: boolean;
  type?: string | null;
  formId?: FormIdFullNameDto;
}

export interface ErrorInfo {
  code?: number;
  message?: string | null;
  details?: string | null;
  validationErrors?: ValidationErrorInfo[] | null;
}

export interface FormIdFullNameDto {
  name?: string | null;
  module?: string | null;
}

export interface MergeConfigurationDto {
  sourceId?: string | null;
  destinationId?: string | null;
  deleteAfterMerge?: boolean;
}

/**
 * Indicate the source of the entity/property metadata
 */
export type MetadataSourceType = 1 | 2;

/**
 * Model configuration DTO
 */
export interface ModelConfigurationDto {
  id?: string | null;
  className?: string | null;
  namespace?: string | null;
  generateAppService?: boolean;
  properties?: ModelPropertyDto[] | null;
  moduleId?: string | null;
  module?: string | null;
  name?: string | null;
  label?: string | null;
  description?: string | null;
  versionNo?: number;
  versionStatus?: ConfigurationItemVersionStatus;
  suppress?: boolean;
  notImplemented?: boolean;
  source?: MetadataSourceType;
  entityConfigType?: EntityConfigTypes;
  permission?: PermissionedObjectDto;
  permissionGet?: PermissionedObjectDto;
  permissionCreate?: PermissionedObjectDto;
  permissionUpdate?: PermissionedObjectDto;
  permissionDelete?: PermissionedObjectDto;
  viewConfigurations?: EntityViewConfigurationDto[] | null;
}

export interface ModelConfigurationDtoAjaxResponse {
  targetUrl?: string | null;
  success?: boolean;
  error?: ErrorInfo;
  unAuthorizedRequest?: boolean;
  __abp?: boolean;
  result?: ModelConfigurationDto;
}

/**
 * Model property DTO
 */
export interface ModelPropertyDto {
  id?: string | null;
  /**
   * Property Name
   */
  name?: string | null;
  /**
   * Label (display name)
   */
  label?: string | null;
  /**
   * Description
   */
  description?: string | null;
  /**
   * Data type
   */
  dataType?: string | null;
  /**
   * Data format
   */
  dataFormat?: string | null;
  /**
   * Entity type. Aplicable for entity references
   */
  entityType?: string | null;
  /**
   * Reference list name
   */
  referenceListName?: string | null;
  /**
   * Reference list namespace
   */
  referenceListNamespace?: string | null;
  source?: MetadataSourceType;
  /**
   * Default sort order
   */
  sortOrder?: number | null;
  /**
   * Child properties, applicable for complex data types (e.g. object, array)
   */
  properties?: ModelPropertyDto[] | null;
  /**
   * If true, indicates that current property is a framework-related (e.g. !:ISoftDelete.IsDeleted, !:IHasModificationTime.LastModificationTime)
   */
  isFrameworkRelated?: boolean;
  /**
   * If true, the property is not returned from Get end-points and is ignored if submitted on Create/Update end-points
   * The property should also not be listed on the form configurator property list
   */
  suppress?: boolean;
  /**
   * Indicates if a property value is required in order to save
   */
  required?: boolean;
  /**
   * If true, the property cannot be edited via the dynamically generated create/update end-points:
   * - property should not be listed on create/update end-points
   * - should be set to 'True' and not editable for read-only properties of domain classes
   */
  readOnly?: boolean;
  /**
   * Equivalent to Audited attribute on the property
   */
  audited?: boolean;
  /**
   * Validation min
   */
  min?: number | null;
  /**
   * Validation max
   */
  max?: number | null;
  /**
   * Validation min length
   */
  minLength?: number | null;
  /**
   * Validation max length
   */
  maxLength?: number | null;
  /**
   * Validation RegularExpression
   */
  regExp?: string | null;
  /**
   * Validation message
   */
  validationMessage?: string | null;
  suppressHardcoded?: boolean;
  requiredHardcoded?: boolean;
  readOnlyHardcoded?: boolean;
  auditedHardcoded?: boolean;
  sizeHardcoded?: boolean;
  regExpHardcoded?: boolean;
}

export interface PermissionedObjectDto {
  id?: string;
  object?: string | null;
  category?: string | null;
  module?: string | null;
  type?: string | null;
  name?: string | null;
  description?: string | null;
  permissions?: string[] | null;
  actualPermissions?: string[] | null;
  access?: RefListPermissionedAccess;
  inherited?: boolean;
  actualAccess?: RefListPermissionedAccess;
  parent?: string | null;
  dependency?: string | null;
  child?: PermissionedObjectDto[] | null;
  hidden?: boolean;
  additionalParameters?: {
  [key: string]: string | null;
} | null;
}

export type RefListPermissionedAccess = 1 | 2 | 3 | 4 | 5;

export interface ValidationErrorInfo {
  message?: string | null;
  members?: string[] | null;
}

export interface ModelConfigurationsGetByNameQueryParams {
  name?: string;
  namespace?: string;
  /**
   * The requested API version
   */
  "api-version"?: string;
}

export type ModelConfigurationsGetByNameProps = Omit<GetProps<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsGetByNameQueryParams, void>, "path">;

export const ModelConfigurationsGetByName = (props: ModelConfigurationsGetByNameProps) => (
  <Get<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsGetByNameQueryParams, void>
    path={`/api/ModelConfigurations`}
    
    {...props}
  />
);

export type UseModelConfigurationsGetByNameProps = Omit<UseGetProps<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsGetByNameQueryParams, void>, "path">;

export const useModelConfigurationsGetByName = (props: UseModelConfigurationsGetByNameProps) => useGet<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsGetByNameQueryParams, void>(`/api/ModelConfigurations`, props);

export type modelConfigurationsGetByNameProps = Omit<
    RestfulShesha.GetProps<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsGetByNameQueryParams, void>,
    'queryParams'
  >;
        export const modelConfigurationsGetByName = (queryParams: ModelConfigurationsGetByNameQueryParams,
          props: modelConfigurationsGetByNameProps) => RestfulShesha.get<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsGetByNameQueryParams, void>(`/api/ModelConfigurations`, queryParams, props);


export interface ModelConfigurationsUpdateQueryParams {
  /**
   * The requested API version
   */
  "api-version"?: string;
}

export type ModelConfigurationsUpdateProps = Omit<MutateProps<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsUpdateQueryParams, ModelConfigurationDto, void>, "path" | "verb">;

export const ModelConfigurationsUpdate = (props: ModelConfigurationsUpdateProps) => (
  <Mutate<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsUpdateQueryParams, ModelConfigurationDto, void>
    verb="PUT"
    path={`/api/ModelConfigurations`}
    
    {...props}
  />
);

export type UseModelConfigurationsUpdateProps = Omit<UseMutateProps<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsUpdateQueryParams, ModelConfigurationDto, void>, "path" | "verb">;

export const useModelConfigurationsUpdate = (props: UseModelConfigurationsUpdateProps) => useMutate<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsUpdateQueryParams, ModelConfigurationDto, void>("PUT", `/api/ModelConfigurations`, props);

export type modelConfigurationsUpdateProps = Omit<
    RestfulShesha.MutateProps<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsUpdateQueryParams, ModelConfigurationDto, void>,
    'data'
  >;
      export const modelConfigurationsUpdate = (data: ModelConfigurationDto,props: modelConfigurationsUpdateProps) => RestfulShesha.mutate<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsUpdateQueryParams, ModelConfigurationDto, void>("PUT", `/api/ModelConfigurations`, data, props);


export interface ModelConfigurationsCreateQueryParams {
  /**
   * The requested API version
   */
  "api-version"?: string;
}

export type ModelConfigurationsCreateProps = Omit<MutateProps<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsCreateQueryParams, ModelConfigurationDto, void>, "path" | "verb">;

export const ModelConfigurationsCreate = (props: ModelConfigurationsCreateProps) => (
  <Mutate<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsCreateQueryParams, ModelConfigurationDto, void>
    verb="POST"
    path={`/api/ModelConfigurations`}
    
    {...props}
  />
);

export type UseModelConfigurationsCreateProps = Omit<UseMutateProps<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsCreateQueryParams, ModelConfigurationDto, void>, "path" | "verb">;

export const useModelConfigurationsCreate = (props: UseModelConfigurationsCreateProps) => useMutate<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsCreateQueryParams, ModelConfigurationDto, void>("POST", `/api/ModelConfigurations`, props);

export type modelConfigurationsCreateProps = Omit<
    RestfulShesha.MutateProps<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsCreateQueryParams, ModelConfigurationDto, void>,
    'data'
  >;
      export const modelConfigurationsCreate = (data: ModelConfigurationDto,props: modelConfigurationsCreateProps) => RestfulShesha.mutate<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsCreateQueryParams, ModelConfigurationDto, void>("POST", `/api/ModelConfigurations`, data, props);


export interface ModelConfigurationsGetByIdQueryParams {
  /**
   * The requested API version
   */
  "api-version"?: string;
}

export interface ModelConfigurationsGetByIdPathParams {
  id: string
}

export type ModelConfigurationsGetByIdProps = Omit<GetProps<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsGetByIdQueryParams, ModelConfigurationsGetByIdPathParams>, "path"> & ModelConfigurationsGetByIdPathParams;

export const ModelConfigurationsGetById = ({id, ...props}: ModelConfigurationsGetByIdProps) => (
  <Get<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsGetByIdQueryParams, ModelConfigurationsGetByIdPathParams>
    path={`/api/ModelConfigurations/${id}`}
    
    {...props}
  />
);

export type UseModelConfigurationsGetByIdProps = Omit<UseGetProps<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsGetByIdQueryParams, ModelConfigurationsGetByIdPathParams>, "path"> & ModelConfigurationsGetByIdPathParams;

export const useModelConfigurationsGetById = ({id, ...props}: UseModelConfigurationsGetByIdProps) => useGet<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsGetByIdQueryParams, ModelConfigurationsGetByIdPathParams>((paramsInPath: ModelConfigurationsGetByIdPathParams) => `/api/ModelConfigurations/${paramsInPath.id}`, {  pathParams: { id }, ...props });

export type modelConfigurationsGetByIdProps = Omit<
    RestfulShesha.GetProps<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsGetByIdQueryParams, ModelConfigurationsGetByIdPathParams> & {id: string},
    'queryParams'
  >;
        export const modelConfigurationsGetById = (queryParams: ModelConfigurationsGetByIdQueryParams,
          {id, ...props}: modelConfigurationsGetByIdProps) => RestfulShesha.get<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsGetByIdQueryParams, ModelConfigurationsGetByIdPathParams>(`/api/ModelConfigurations/${id}`, queryParams, props);


export interface ModelConfigurationsMergeQueryParams {
  /**
   * The requested API version
   */
  "api-version"?: string;
}

export type ModelConfigurationsMergeProps = Omit<MutateProps<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsMergeQueryParams, MergeConfigurationDto, void>, "path" | "verb">;

export const ModelConfigurationsMerge = (props: ModelConfigurationsMergeProps) => (
  <Mutate<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsMergeQueryParams, MergeConfigurationDto, void>
    verb="POST"
    path={`/api/ModelConfigurations/merge`}
    
    {...props}
  />
);

export type UseModelConfigurationsMergeProps = Omit<UseMutateProps<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsMergeQueryParams, MergeConfigurationDto, void>, "path" | "verb">;

export const useModelConfigurationsMerge = (props: UseModelConfigurationsMergeProps) => useMutate<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsMergeQueryParams, MergeConfigurationDto, void>("POST", `/api/ModelConfigurations/merge`, props);

export type modelConfigurationsMergeProps = Omit<
    RestfulShesha.MutateProps<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsMergeQueryParams, MergeConfigurationDto, void>,
    'data'
  >;
      export const modelConfigurationsMerge = (data: MergeConfigurationDto,props: modelConfigurationsMergeProps) => RestfulShesha.mutate<ModelConfigurationDtoAjaxResponse, AjaxResponseBase, ModelConfigurationsMergeQueryParams, MergeConfigurationDto, void>("POST", `/api/ModelConfigurations/merge`, data, props);

