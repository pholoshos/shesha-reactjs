import { IStoredFilter } from './../../../../../dist/providers/dataTable/interfaces.d';
export interface IListItemsProps {
  dataSourceUrl?: string;
  queryParamsExpression?: string;
  bordered?: boolean;
  title?: string;
  footer?: string;
  formId?: string;
  allowAddAndRemove?: boolean;
  submitUrl?: string;
  submitHttpVerb?: 'POST' | 'PUT';
  onSubmit?: string;
  showPagination?: boolean;
  paginationDefaultPageSize: number;
  allowSubmit?: boolean;
  buttons?: any[];
  maxHeight?: number;
  labelCol?: number;
  wrapperCol?: number;
  dataSource?: 'form' | 'api';
  renderStrategy?: 'dragAndDrop' | 'externalForm';
  entityType?: string;
  useExpression?: boolean;
  properties?: string[];
  filters?: IStoredFilter;
}

export interface IProperty {
  label: string;
  propertyName: string;
  dataType: string;
}
