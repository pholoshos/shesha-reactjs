import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { ButtonType } from 'antd/lib/button';

type ToolbarItemType = 'item' | 'group';

type ButtonGroupType = 'inline' | 'dropdown';

export type ToolbarItemProps = IToolbarButton | IButtonGroup;

type ToolbarItemSubType = 'button' | 'separator' | 'line';
type ButtonActionType =
  | 'navigate'
  | 'dialogue'
  | 'executeScript'
  | 'executeFormAction' // This is the old one which is now only being used for backward compatibility. The new one is 'customAction' to be consistent with the ButtonGroup
  | 'customAction' // This is the new one. Old one is 'executeFormAction'
  | 'submit'
  | 'reset'
  | 'startFormEdit'
  | 'cancelFormEdit';

export interface IToolbarItemBase {
  id: string;
  name: string;
  label: string;
  tooltip?: string;
  sortOrder: number;
  danger?: boolean;
  itemType: ToolbarItemType;
  groupType?: ButtonGroupType;
  icon?: string;
  buttonType?: ButtonType;
  customVisibility?: string;
  customEnabled?: string;
  permissions?: string[];
}

export interface IToolbarButton extends IToolbarItemBase {
  itemSubType: ToolbarItemSubType;
  buttonAction?: ButtonActionType;
  refreshTableOnSuccess?: boolean;
  targetUrl?: string;

  /**
   * @deprecated - use customAction. It is named that way to be consistent with the 
   */
  formAction?: string;
  customAction?: string;
  customActionParameters?: string;
  actionScript?: string;
  size?: SizeType;
  modalFormId?: string;
  modalTitle?: string;
  modalWidth?: number;
  modalActionOnSuccess?: 'keepOpen' | 'navigateToUrl' | 'close' | undefined;
  showConfirmDialogBeforeSubmit?: boolean;
  modalConfirmDialogMessage?: string;

  onSuccessScript?: string;

  onErrorScript?: string;
}

export interface IButtonGroup extends IToolbarItemBase {
  childItems?: ToolbarItemProps[];
}
