import { FormMode } from './../form/models';
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
  | 'cancelFormEdit'
  | 'dispatchAnEvent';

export interface IButtonGroupItemBase {
  id: string;
  name: string;
  label?: string;
  tooltip?: string;
  sortOrder: number;
  danger?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  isDynamic?: boolean;
  itemType: ButtonGroupItemType;
  groupType?: ButtonGroupType;
  icon?: string;
  buttonType?: ButtonType;
  customVisibility?: string;
  customEnabled?: string;
  permissions?: string[];
  style?: string;
  size?: SizeType;
}

export interface IButtonGroupButton extends IButtonGroupItemBase {
  itemSubType: ToolbarItemSubType;
  buttonAction?: ButtonActionType;
  refreshTableOnSuccess?: boolean; // TODO: Remove this and make this logic more generic
  targetUrl?: string;

  /**
   * Predefined form action that gets executed via events
   */
  formAction?: string;

  /**
   * Custom form events that can be passed with parameters
   */
  customFormAction?: string;
  uniqueStateId?: string;
  customAction?: string;
  customActionParameters?: string;
  actionScript?: string;
  size?: SizeType;
  modalFormId?: string;
  modalTitle?: string;
  modalFormMode?: FormMode;
  skipFetchData?: boolean;
  submitLocally?: boolean;

  // This is the event that will be triggered once the form has been submitted. The event will be passed this data
  onSubmitEvent?: string;

  /** An event name to dispatch on the click of a button */
  eventName?: string;

  /** The string representing a custom event name to dispatch when the button has been dispatched
   * in case we forgot to include it in the `eventName` dropdown
   */
  customEventNameToDispatch?: string;

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
