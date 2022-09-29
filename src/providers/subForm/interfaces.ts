import { ColProps } from 'antd';
import { IGuidNullableEntityWithDisplayNameDto } from '../../interfaces/shesha';
import { IChangeable, IValuable } from '../../interfaces';

export interface ISubFormProps extends IValuable, IChangeable {
  dataSourceUrl?: string;
  name: string;
  uniqueStateId?: string;
  formPath?: IGuidNullableEntityWithDisplayNameDto;
  submitUrl?: string;
  onSubmit?: string;
  buttons?: any[];
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  dataSource?: 'form' | 'api';
  entityType?: string;
  useExpression?: boolean;
  properties: string | string[];
  queryParams?: string;

  //#region Actions
  beforeGet?: string;
  onCreated?: string;
  onUpdated?: string;
  //#endregion

  //#region URLs
  /** Optional */
  getUrl?: string;
  postUrl?: string;
  putUrl?: string;
  //#endregion
}

export interface IProperty {
  label: string;
  propertyName: string;
  dataType: string;
}
