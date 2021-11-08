/* Generated by restful-react */

import React from 'react';
import { Get, GetProps, useGet, UseGetProps, Mutate, MutateProps, useMutate, UseMutateProps } from 'restful-react';

import * as RestfulShesha from '../utils/fetchers';
export const SPEC_VERSION = 'v1';
/**
 * Form DTO
 */
export interface FormDto {
  id?: string;
  /**
   * Form path/id is used to identify a form
   */
  path?: string | null;
  /**
   * Form name
   */
  name?: string | null;
  /**
   * Description
   */
  description?: string | null;
  /**
   * Form markup (components) in JSON format
   */
  markup?: string | null;
  /**
   * Type of the form model
   */
  modelType?: string | null;
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

export interface FormDtoAjaxResponse {
  targetUrl?: string | null;
  success?: boolean;
  error?: ErrorInfo;
  unAuthorizedRequest?: boolean;
  __abp?: boolean;
  result?: FormDto;
}

export interface AjaxResponseBase {
  targetUrl?: string | null;
  success?: boolean;
  error?: ErrorInfo;
  unAuthorizedRequest?: boolean;
  __abp?: boolean;
}

/**
 * Form update markup input
 */
export interface FormUpdateMarkupInput {
  id?: string;
  /**
   * Form markup (components) in JSON format
   */
  markup?: string | null;
}

/**
 * Generic DTO of the simple autocomplete item
 */
export interface AutocompleteItemDto {
  value?: string | null;
  displayText?: string | null;
}

export interface AutocompleteItemDtoListAjaxResponse {
  targetUrl?: string | null;
  success?: boolean;
  error?: ErrorInfo;
  unAuthorizedRequest?: boolean;
  __abp?: boolean;
  result?: AutocompleteItemDto[] | null;
}

export interface BooleanAjaxResponse {
  targetUrl?: string | null;
  success?: boolean;
  error?: ErrorInfo;
  unAuthorizedRequest?: boolean;
  __abp?: boolean;
  result?: boolean;
}

export interface FormGetPathParams {
  id: string;
}

export type FormGetProps = Omit<GetProps<FormDtoAjaxResponse, AjaxResponseBase, void, FormGetPathParams>, 'path'> &
  FormGetPathParams;

export const FormGet = ({ id, ...props }: FormGetProps) => (
  <Get<FormDtoAjaxResponse, AjaxResponseBase, void, FormGetPathParams> path={`/api/services/Forms/${id}`} {...props} />
);

export type UseFormGetProps = Omit<
  UseGetProps<FormDtoAjaxResponse, AjaxResponseBase, void, FormGetPathParams>,
  'path'
> &
  FormGetPathParams;

export const useFormGet = ({ id, ...props }: UseFormGetProps) =>
  useGet<FormDtoAjaxResponse, AjaxResponseBase, void, FormGetPathParams>(
    (paramsInPath: FormGetPathParams) => `/api/services/Forms/${paramsInPath.id}`,
    { pathParams: { id }, ...props }
  );

export type formGetProps = Omit<
  RestfulShesha.GetProps<FormDtoAjaxResponse, AjaxResponseBase, void, FormGetPathParams> & { id: string },
  'queryParams'
>;
export const formGet = ({ id, ...props }: formGetProps) =>
  RestfulShesha.get<FormDtoAjaxResponse, AjaxResponseBase, void, FormGetPathParams>(
    `/api/services/Forms/${id}`,
    undefined,
    props
  );

export interface FormGetByPathQueryParams {
  path?: string | null;
}

export type FormGetByPathProps = Omit<
  GetProps<FormDtoAjaxResponse, AjaxResponseBase, FormGetByPathQueryParams, void>,
  'path'
>;

export const FormGetByPath = (props: FormGetByPathProps) => (
  <Get<FormDtoAjaxResponse, AjaxResponseBase, FormGetByPathQueryParams, void> path={`/api/services/Forms`} {...props} />
);

export type UseFormGetByPathProps = Omit<
  UseGetProps<FormDtoAjaxResponse, AjaxResponseBase, FormGetByPathQueryParams, void>,
  'path'
>;

export const useFormGetByPath = (props: UseFormGetByPathProps) =>
  useGet<FormDtoAjaxResponse, AjaxResponseBase, FormGetByPathQueryParams, void>(`/api/services/Forms`, props);

export type formGetByPathProps = Omit<
  RestfulShesha.GetProps<FormDtoAjaxResponse, AjaxResponseBase, FormGetByPathQueryParams, void>,
  'queryParams'
>;
export const formGetByPath = (queryParams: FormGetByPathQueryParams, props: formGetByPathProps) =>
  RestfulShesha.get<FormDtoAjaxResponse, AjaxResponseBase, FormGetByPathQueryParams, void>(
    `/api/services/Forms`,
    queryParams,
    props
  );

export type FormUpdateProps = Omit<
  MutateProps<FormDtoAjaxResponse, AjaxResponseBase, void, FormDto, void>,
  'path' | 'verb'
>;

export const FormUpdate = (props: FormUpdateProps) => (
  <Mutate<FormDtoAjaxResponse, AjaxResponseBase, void, FormDto, void>
    verb="PUT"
    path={`/api/services/Forms`}
    {...props}
  />
);

export type UseFormUpdateProps = Omit<
  UseMutateProps<FormDtoAjaxResponse, AjaxResponseBase, void, FormDto, void>,
  'path' | 'verb'
>;

export const useFormUpdate = (props: UseFormUpdateProps) =>
  useMutate<FormDtoAjaxResponse, AjaxResponseBase, void, FormDto, void>('PUT', `/api/services/Forms`, props);

export type formUpdateProps = Omit<
  RestfulShesha.MutateProps<FormDtoAjaxResponse, AjaxResponseBase, void, FormDto, void>,
  'data'
>;
export const formUpdate = (data: FormDto, props: formUpdateProps) =>
  RestfulShesha.mutate<FormDtoAjaxResponse, AjaxResponseBase, void, FormDto, void>(
    'PUT',
    `/api/services/Forms`,
    data,
    props
  );

export type FormCreateProps = Omit<
  MutateProps<FormDtoAjaxResponse, AjaxResponseBase, void, FormDto, void>,
  'path' | 'verb'
>;

export const FormCreate = (props: FormCreateProps) => (
  <Mutate<FormDtoAjaxResponse, AjaxResponseBase, void, FormDto, void>
    verb="POST"
    path={`/api/services/Forms`}
    {...props}
  />
);

export type UseFormCreateProps = Omit<
  UseMutateProps<FormDtoAjaxResponse, AjaxResponseBase, void, FormDto, void>,
  'path' | 'verb'
>;

export const useFormCreate = (props: UseFormCreateProps) =>
  useMutate<FormDtoAjaxResponse, AjaxResponseBase, void, FormDto, void>('POST', `/api/services/Forms`, props);

export type formCreateProps = Omit<
  RestfulShesha.MutateProps<FormDtoAjaxResponse, AjaxResponseBase, void, FormDto, void>,
  'data'
>;
export const formCreate = (data: FormDto, props: formCreateProps) =>
  RestfulShesha.mutate<FormDtoAjaxResponse, AjaxResponseBase, void, FormDto, void>(
    'POST',
    `/api/services/Forms`,
    data,
    props
  );

export interface FormUpdateMarkupPathParams {
  id: string;
}

export type FormUpdateMarkupProps = Omit<
  MutateProps<void, unknown, void, FormUpdateMarkupInput, FormUpdateMarkupPathParams>,
  'path' | 'verb'
> &
  FormUpdateMarkupPathParams;

export const FormUpdateMarkup = ({ id, ...props }: FormUpdateMarkupProps) => (
  <Mutate<void, unknown, void, FormUpdateMarkupInput, FormUpdateMarkupPathParams>
    verb="PUT"
    path={`/api/services/Forms/${id}/Markup`}
    {...props}
  />
);

export type UseFormUpdateMarkupProps = Omit<
  UseMutateProps<void, unknown, void, FormUpdateMarkupInput, FormUpdateMarkupPathParams>,
  'path' | 'verb'
> &
  FormUpdateMarkupPathParams;

export const useFormUpdateMarkup = ({ id, ...props }: UseFormUpdateMarkupProps) =>
  useMutate<void, unknown, void, FormUpdateMarkupInput, FormUpdateMarkupPathParams>(
    'PUT',
    (paramsInPath: FormUpdateMarkupPathParams) => `/api/services/Forms/${paramsInPath.id}/Markup`,
    { pathParams: { id }, ...props }
  );

export type formUpdateMarkupProps = Omit<
  RestfulShesha.MutateProps<void, unknown, void, FormUpdateMarkupInput, FormUpdateMarkupPathParams> & { id: string },
  'data'
>;
export const formUpdateMarkup = (data: FormUpdateMarkupInput, { id, ...props }: formUpdateMarkupProps) =>
  RestfulShesha.mutate<void, unknown, void, FormUpdateMarkupInput, FormUpdateMarkupPathParams>(
    'PUT',
    `/api/services/Forms/${id}/Markup`,
    data,
    props
  );

export interface FormAutocompleteQueryParams {
  term?: string | null;
  selectedValue?: string | null;
}

export type FormAutocompleteProps = Omit<
  GetProps<AutocompleteItemDtoListAjaxResponse, AjaxResponseBase, FormAutocompleteQueryParams, void>,
  'path'
>;

export const FormAutocomplete = (props: FormAutocompleteProps) => (
  <Get<AutocompleteItemDtoListAjaxResponse, AjaxResponseBase, FormAutocompleteQueryParams, void>
    path={`/api/services/Forms/autocomplete`}
    {...props}
  />
);

export type UseFormAutocompleteProps = Omit<
  UseGetProps<AutocompleteItemDtoListAjaxResponse, AjaxResponseBase, FormAutocompleteQueryParams, void>,
  'path'
>;

export const useFormAutocomplete = (props: UseFormAutocompleteProps) =>
  useGet<AutocompleteItemDtoListAjaxResponse, AjaxResponseBase, FormAutocompleteQueryParams, void>(
    `/api/services/Forms/autocomplete`,
    props
  );

export type formAutocompleteProps = Omit<
  RestfulShesha.GetProps<AutocompleteItemDtoListAjaxResponse, AjaxResponseBase, FormAutocompleteQueryParams, void>,
  'queryParams'
>;
export const formAutocomplete = (queryParams: FormAutocompleteQueryParams, props: formAutocompleteProps) =>
  RestfulShesha.get<AutocompleteItemDtoListAjaxResponse, AjaxResponseBase, FormAutocompleteQueryParams, void>(
    `/api/services/Forms/autocomplete`,
    queryParams,
    props
  );

export interface FormTestDelayPostQueryParams {
  delayMs?: number;
}

export type FormTestDelayPostProps = Omit<
  MutateProps<BooleanAjaxResponse, AjaxResponseBase, FormTestDelayPostQueryParams, void, void>,
  'path' | 'verb'
>;

export const FormTestDelayPost = (props: FormTestDelayPostProps) => (
  <Mutate<BooleanAjaxResponse, AjaxResponseBase, FormTestDelayPostQueryParams, void, void>
    verb="POST"
    path={`/api/services/Forms/testDelay`}
    {...props}
  />
);

export type UseFormTestDelayPostProps = Omit<
  UseMutateProps<BooleanAjaxResponse, AjaxResponseBase, FormTestDelayPostQueryParams, void, void>,
  'path' | 'verb'
>;

export const useFormTestDelayPost = (props: UseFormTestDelayPostProps) =>
  useMutate<BooleanAjaxResponse, AjaxResponseBase, FormTestDelayPostQueryParams, void, void>(
    'POST',
    `/api/services/Forms/testDelay`,
    props
  );

export type formTestDelayPostProps = Omit<
  RestfulShesha.MutateProps<BooleanAjaxResponse, AjaxResponseBase, FormTestDelayPostQueryParams, void, void>,
  'data'
>;
export const formTestDelayPost = (props: formTestDelayPostProps) =>
  RestfulShesha.mutate<BooleanAjaxResponse, AjaxResponseBase, FormTestDelayPostQueryParams, void, void>(
    'POST',
    `/api/services/Forms/testDelay`,
    undefined,
    props
  );

export interface FormTestDelayGetQueryParams {
  delayMs?: number;
}

export type FormTestDelayGetProps = Omit<
  GetProps<BooleanAjaxResponse, AjaxResponseBase, FormTestDelayGetQueryParams, void>,
  'path'
>;

export const FormTestDelayGet = (props: FormTestDelayGetProps) => (
  <Get<BooleanAjaxResponse, AjaxResponseBase, FormTestDelayGetQueryParams, void>
    path={`/api/services/Forms/testDelay`}
    {...props}
  />
);

export type UseFormTestDelayGetProps = Omit<
  UseGetProps<BooleanAjaxResponse, AjaxResponseBase, FormTestDelayGetQueryParams, void>,
  'path'
>;

export const useFormTestDelayGet = (props: UseFormTestDelayGetProps) =>
  useGet<BooleanAjaxResponse, AjaxResponseBase, FormTestDelayGetQueryParams, void>(
    `/api/services/Forms/testDelay`,
    props
  );

export type formTestDelayGetProps = Omit<
  RestfulShesha.GetProps<BooleanAjaxResponse, AjaxResponseBase, FormTestDelayGetQueryParams, void>,
  'queryParams'
>;
export const formTestDelayGet = (queryParams: FormTestDelayGetQueryParams, props: formTestDelayGetProps) =>
  RestfulShesha.get<BooleanAjaxResponse, AjaxResponseBase, FormTestDelayGetQueryParams, void>(
    `/api/services/Forms/testDelay`,
    queryParams,
    props
  );
