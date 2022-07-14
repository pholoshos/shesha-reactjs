import { IFormDto } from '../../providers/form/models';

export type FormMode = 'designer' | 'edit' | 'readonly';

export interface IDynamicPageProps {
  /**
   * Form path. You can pass either this or `formId`. This is required if `formId` is not provided
   */
  path?: string;

  /**
   * Entity id. This should not be confused with the form id
   */
  id?: string;

  /**
   * Form id. You can pass either this or the `path`. This is required if `path` is not provided
   */
  formId?: string;

  /**
   * form mode.
   */
  mode?: FormMode;

  submitVerb?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';

  /**
   * This tells the dynamic page that the id should be passed as a path and not as a query parameter
   * this is the id for fetching the entity
   *
   * Required if the id is not provided
   */
  entityPathId?: string;
}

export interface EntityAjaxResponse {
  targetUrl?: string | null;
  success?: boolean;
  error?: unknown;
  unAuthorizedRequest?: boolean;
  __abp?: boolean;
  result?: IEntity;
}

export interface IEntity {
  id: string;
  [name: string]: unknown;
}

export interface IDynamicPageState extends IDynamicPageProps {
  formResponse?: IFormDto;
  fetchedData?: IEntity;
  mode?: FormMode;
}
