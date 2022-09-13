import { FormMarkupWithSettings } from '../../providers/form/models';

export type FormMode = 'designer' | 'edit' | 'readonly';

export interface IDynamicPageProps {
  /**
   * Form path.
   */
  path?: string;

  /**
   * Entity id. This should not be confused with the form id
   */
  id?: string;

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
  formMarkup?: FormMarkupWithSettings;
  fetchedData?: IEntity;
  mode?: FormMode;
}
