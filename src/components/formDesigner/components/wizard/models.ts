import { IConfigurableItemBase } from '../../../../providers/itemListConfigurator/contexts';
import { IConfigurableFormComponent } from '../../../../interfaces';

type ButtonActionType =
  | 'executeScript'
  | 'dispatchAnEvent';

export interface ITabPaneProps extends IConfigurableItemBase {
  id: string;
  icon?: string;
  key: string;
  title: string;
  subTitle: string;
  description: string;
  allowCancel?: boolean;

  cancelButtonText?: string;
  nextButtonText?: string;
  backButtonText?: string;
  doneButtonText?: string;

  cancelButtonAction?: ButtonActionType;
  nextButtonAction?: ButtonActionType;
  backButtonAction?: ButtonActionType;
  doneButtonAction?: ButtonActionType;

  cancelButtonActionScript?: string;
  backButtonActionScript?: string;
  nextButtonActionScript?: string;
  doneButtonActionScript?: string;

  nextEventName?: string;
  backEventName?: string;
  doneEventName?: string;
  cancelEventName?: string;

  cancelCustomEventNameToDispatch?: string;
  doneCustomEventNameToDispatch?: string;
  backCustomEventNameToDispatch?: string;
  nextCustomEventNameToDispatch?: string;

  nextUniqueStateId?: string;
  backUniqueStateId?: string;
  doneUniqueStateId?: string;
  cancelUniqueStateId?: string;

  customVisibility?: string;
  customEnabled?: string;
  permissions?: string[];
  components?: IConfigurableFormComponent[];
  childItems?: ITabPaneProps[];
}

export interface ITabsComponentProps extends IConfigurableFormComponent {
  tabs: ITabPaneProps[];
  wizardType?: 'default' | 'navigation';
  visibility?: 'Yes' | 'No' | 'Removed';
  uniqueStateId?: string;
  permissions?: string[];
  hidden?: boolean;
  customVisibility?: string;
}
