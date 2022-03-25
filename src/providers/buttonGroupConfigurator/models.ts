import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { ButtonType } from 'antd/lib/button';

type ButtonGroupItemType = 'item' | 'group';

type ButtonGroupType = 'inline' | 'dropdown';

export type ButtonGroupItemProps = IButtonGroupButton | IButtonGroup;

export type ToolbarItemSubType = 'button' | 'separator' | 'line';

export type ButtonActionType =
  | 'navigate'
  | 'dialogue'
  | 'executeScript'
  | 'executeFormAction' // This is the old one which is now only being used for backward compatibility. The new one is 'customAction' to be consistent with the ButtonGroup
  | 'customAction' // This is the new one. Old one is 'executeFormAction'
  | 'submit'
  | 'reset'
  | 'startFormEdit'
  | 'cancelFormEdit';

export interface IButtonGroupItemBase {
  id: string;
  name: string;
  label: string;
  tooltip?: string;
  sortOrder: number;
  danger?: boolean;
  itemType: ButtonGroupItemType;
  groupType?: ButtonGroupType;
  icon?: string;
  buttonType?: ButtonType;
  customVisibility?: string;
  customEnabled?: string;
  permissions?: string[];
}

export interface IButtonGroupButton extends IButtonGroupItemBase {
  itemSubType: ToolbarItemSubType;
  buttonAction?: ButtonActionType;
  refreshTableOnSuccess?: boolean;
  targetUrl?: string;
  /**
   * @deprecated - use customAction. It is named that way to be consistent with the button
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

export interface IButtonGroup extends IButtonGroupItemBase {
  childItems?: ButtonGroupItemProps[];
}
