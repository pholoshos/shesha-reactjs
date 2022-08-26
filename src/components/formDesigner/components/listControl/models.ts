import { IStoredFilter } from './../../../../providers/dataTable/interfaces';
import { IGuidNullableEntityWithDisplayNameDto } from '../../../../interfaces';
export interface IListItemsProps {
  name: string;
  uniqueStateId?: string;
  queryParamsExpression?: string;
  title?: string;
  footer?: string;
  formPath?: IGuidNullableEntityWithDisplayNameDto;
  allowRemoveItems?: boolean;
  allowSubmit?: boolean;
  deleteUrl?: string;
  submitUrl?: string;
  submitHttpVerb?: 'POST' | 'PUT';
  onSubmit?: string;
  showPagination?: boolean;
  showQuickSearch?: boolean;
  paginationDefaultPageSize: number;
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
