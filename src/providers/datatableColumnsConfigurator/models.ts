import { FormMode } from './../form/models';
import { ColumnSorting } from '../dataTable/interfaces';

type ColumnsItemType = 'item' | 'group';

export type ColumnsItemProps = IConfigurableColumnsProps | IConfigurableColumnGroup;

type ButtonActionType = 'navigate' | 'dialogue' | 'executeScript' | 'executeFormAction' | 'deleteRow' | 'editRow';

/**
 * Base properties of configurable column
 */
export interface IConfigurableColumnsBase {
  id: string;
  caption: string;
  sortOrder: number;
  itemType: ColumnsItemType;
  description?: string;
  minWidth?: number;
  maxWidth?: number;
  isVisible: boolean;
  defaultSorting?: ColumnSorting;
  permissions?: string[];
}

export type DatatableColumnType = 'data' | 'action' | 'calculated';

/**
 * Configurable table column
 */
export interface IConfigurableColumnsProps extends IConfigurableColumnsBase {
  columnType: DatatableColumnType;
}

/**
 * Configurable data column (displays property of the model)
 */
export interface IDataColumnsProps extends IConfigurableColumnsProps {
  propertyName: string;
}

/**
 * Configurable action column
 */
export interface IConfigurableActionColumnsProps extends IConfigurableColumnsProps {
  icon?: string;
  /**
   * type of action
   */
  action?: ButtonActionType;

  //#region Action = 'navigate'

  /**
   * target Url, applicable when action = 'navigate'
   */
  targetUrl?: string;

  //#endregion

  //#region Action = 'dialogue'

  /**
   * Title of the modal
   */
  modalTitle?: string;

  /**
   * Id of the modal form
   */
  modalFormId?: string;

  //#endregion

  //#region Action = 'executeFormAction'

  /** Form action */
  formAction?: string;

  /** Form action */
  actionScript?: string;

  /**
   * The warning message to display before deleting an item
   */
  deleteWarningMessage?: string;

  additionalProperties?: any;

  uniqueStateId?: string;

  modalFormMode?: FormMode;

  modalWidth?: any;
  //#endregion
}

/**
 * Configurable columns group
 */
export interface IConfigurableColumnGroup extends IConfigurableColumnsBase {
  childItems?: ColumnsItemProps[];
}
