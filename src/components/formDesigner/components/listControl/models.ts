import { IConfigurableFormComponent, IFormItem, IGuidNullableEntityWithDisplayNameDto } from '../../../../interfaces';

export interface IListItemsProps {
  name: string;
  uniqueStateId?: string;
  queryParamsExpression?: string;
  title?: string;
  footer?: string;
  formPath?: IGuidNullableEntityWithDisplayNameDto;
  allowSelection?: boolean;
  allowDeleteItems?: boolean;
  allowRemoteDelete?: boolean;
  deleteUrl?: string;
  deleteConfirmMessage?: string;
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
  filters?: object;
}

export interface IListComponentProps extends IListItemsProps, IConfigurableFormComponent {
  /** the source of data for the list component */
  labelCol?: number;
  wrapperCol?: number;
  dataSource?: 'form' | 'api';
  renderStrategy?: 'dragAndDrop' | 'externalForm';
}

export interface IListControlProps extends IListItemsProps, IFormItem {
  containerId: string;
  value?: any[];
}

export interface IListComponentRenderState {
  quickSearch?: string;
  skipCount?: number;
  maxResultCount?: number;
  selectedItemIndexes?: number[];
}
