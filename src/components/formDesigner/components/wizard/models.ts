import { IConfigurableItemBase } from '../../../../providers/itemListConfigurator/contexts';
import { IConfigurableFormComponent } from '../../../../interfaces';
import { IConfigurableActionConfiguration } from '../../../../interfaces/configurableAction';

//type ButtonActionType = 'executeScript' | 'dispatchAnEvent';

export interface IWizardStepProps extends IConfigurableItemBase {
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

  cancelButtonActionConfiguration?: IConfigurableActionConfiguration;
  nextButtonActionConfiguration?: IConfigurableActionConfiguration;
  backButtonActionConfiguration?: IConfigurableActionConfiguration;
  doneButtonActionConfiguration?: IConfigurableActionConfiguration;

  customVisibility?: string;
  customEnabled?: string;
  permissions?: string[];
  components?: IConfigurableFormComponent[];
  childItems?: IWizardStepProps[];
}

export interface IWizardComponentProps extends IConfigurableFormComponent {
  steps: IWizardStepProps[];
  wizardType?: 'default' | 'navigation';
  visibility?: 'Yes' | 'No' | 'Removed';
  //uniqueStateId?: string;
  permissions?: string[];
  hidden?: boolean;
  customVisibility?: string;
  defaultActiveStep?: string;
}
