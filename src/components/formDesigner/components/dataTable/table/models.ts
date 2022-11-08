import { IConfigurableFormComponent } from '../../../../../providers/form/models';
import { IConfigurableColumnsBase } from '../../../../../providers/datatableColumnsConfigurator/models';
import { ITableCrudConfig } from '../../../../../providers/dataTable/interfaces';

export type RowDroppedMode = 'executeScript' | 'showDialog';

export interface ITableComponentBaseProps extends ITableCrudConfig {
  items: IConfigurableColumnsBase[];
  useMultiselect: boolean;
  crud: boolean;
  flexibleHeight: boolean;
  crudMode?: 'inline' | 'dialog';
  allowRowDragAndDrop?: boolean;
  onRowDropped?: string;
  rowDroppedMode?: RowDroppedMode;

  //#region Dialog
  dialogTitle?: string;
  dialogForm?: string;
  dialogFormSkipFetchData?: boolean;
  dialogShowModalButtons?: boolean;
  dialogOnSuccessScript?: string;
  dialogOnErrorScript?: string;
  containerStyle?: string;
  tableStyle?: string;
  dialogSubmitHttpVerb?: 'POST' | 'PUT';
  //#endregion
}

/** Table component props */
export interface ITableComponentProps extends ITableComponentBaseProps, IConfigurableFormComponent {}
