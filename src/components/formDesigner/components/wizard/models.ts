import { IConfigurableItemBase } from '../../../../providers/itemListConfigurator/contexts';
import { StepProps } from 'antd';
import { IConfigurableFormComponent } from '../../../../interfaces';

export interface IStepProps extends IConfigurableItemBase, Omit<StepProps, 'children' | 'wizard' | 'style' | 'wizardKey'> {
  id: string;
  icon?: string;
  key: string;
  title: string;
  customVisibility?: string;
  customEnabled?: string;
  permissions?: string[];
  components?: IConfigurableFormComponent[];
  childItems?: IStepProps[];
}

export interface IWizardComponentProps extends IConfigurableFormComponent {
  steps: IStepProps[];
  wizardType?: 'default' | 'navigation';
  visibility?: 'Yes' | 'No' | 'Removed';
  permissions?: string[];
  hidden?: boolean;
  customVisibility?: string;
}
