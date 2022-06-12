import { IConfigurableFormComponent } from '../../../../../providers/form/models';
import { IConfigurableColumnsBase } from '../../../../../providers/datatableColumnsConfigurator/models';
import { ITableCrudConfig } from '../../../../../providers/dataTable/interfaces';

export interface ITableComponentBaseProps extends ITableCrudConfig {
  items: IConfigurableColumnsBase[];
  useMultiselect: boolean;
  crud: boolean;
  isNotWrapped: boolean;
  crudMode?: 'inline' | 'dialog';
  overrideDefaultCrudBehavior?: boolean;
  allowRowDragAndDrop?: boolean;
  onRowDropped?: string;
}

/** Table component props */
export interface ITableComponentProps extends ITableComponentBaseProps, IConfigurableFormComponent {}
