import { IChangeable, IConfigurableFormComponent, IValuable } from '../../../../../interfaces';
import { IStoredFilter } from '../../../../../providers/dataTable/interfaces';

export interface ISetComponentsPayload {
  components?: IConfigurableFormComponent[];
}

export interface ISubFormProps extends IValuable, IChangeable {
  dataSourceUrl?: string;
  name: string;
  uniqueStateId?: string;
  formId?: string;
  submitUrl?: string;
  onSubmit?: string;
  showPagination?: boolean;
  paginationDefaultPageSize: number;
  allowSubmit?: boolean;
  buttons?: any[];
  maxHeight?: number;
  labelCol?: number;
  wrapperCol?: number;
  dataSource?: 'form' | 'api';
  entityType?: string;
  useExpression?: boolean;
  filters?: IStoredFilter;
  properties: string[];

  //#region Actions
  beforeGet?: string;
  onCreated?: string;
  onUpdated?: string;
  onDeleted?: string;
  //#endregion

  //#region URLs
  getUrl?: string;
  postUrl?: string;
  putUrl?: string;
  deleteUrl?: string;
  //#endregion
}

export interface IProperty {
  label: string;
  propertyName: string;
  dataType: string;
}
