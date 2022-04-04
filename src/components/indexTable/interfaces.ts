import { IAnyObject } from './../../../dist/interfaces/anyObject.d';
import { IndexColumnDataType } from './../../providers/dataTable/interfaces';
import { MutableRefObject, ReactNode } from 'react';
import { ICrudProps, IDataTableInstance } from '../../providers/dataTable/interfaces';
import { DataTableFullInstance } from '../../providers/dataTable/contexts';

export type TableActionColumnType = 'create' | 'read' | 'update' | 'delete' | 'cancel'; // CRUD and cancel

export interface ITableActionColumns {
  icon?: ReactNode;
  type?: TableActionColumnType;
  onClick?: (id: string, context: IDataTableInstance, row: IAnyObject) => string | void | Promise<any>;

  /**
   * On CRUD mode, only CRUD-related action columns are preferred. To specify that the column should always show
   * irrespective of the CRUD mode, pass the extra property and it will always show
   */
  extra?: boolean;
}

export interface ITableCustomTypesRender {
  key: string;
  render: (data: any, router: any) => ReactNode;
}

export interface ITableCustomTypeEditor {
  key: string;
  property: string;
  render: (data: IColumnEditFieldProps) => ReactNode;
}

export interface IColumnEditFieldProps {
  id: string;
  name: string;
  caption?: string;
  referenceListName?: string;
  referenceListNamespace?: string;
  entityReferenceTypeShortAlias?: string;
  dataType: IndexColumnDataType;
  value?: any;
  onChange: (key: string, value: any) => void;
}

export interface IShaDataTableProps extends ICrudProps {
  id: string;
  useMultiselect?: boolean;
  disableCustomFilters?: boolean;
  actionColumns?: ITableActionColumns[];
  /**
   * @deprecated pass this on an `IndexTableProvider` level
   */

  header?: string;
  deleteConfirmationMessage?: string;
  selectedRowIndex?: number;
  onSelectRow?: (index: number, row: any) => void;
  onSelectedIdsChanged?: (selectedRowIds: string[]) => void;
  onDblClick?: (data: any, index?: number) => void;
  customTypeRenders?: ITableCustomTypesRender[];
  customTypeEditors?: ITableCustomTypeEditor[];
  onRowsChanged?: (rows: object[]) => void;
  tableRef?: MutableRefObject<Partial<DataTableFullInstance> | null>;
  /**
   * A callback for when the file export has succeeded
   */
  onExportSuccess?: () => void;

  /**
   * Called when fetch data or refresh is complete is complete
   */
  onFetchDataSuccess?: () => void;
  /**
   * A callback for when the file export has failed
   */
  onExportError?: () => void;
}
