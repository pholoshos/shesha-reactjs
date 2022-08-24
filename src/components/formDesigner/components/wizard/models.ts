import { IConfigurableItemBase } from '../../../../providers/itemListConfigurator/contexts';
import { StepProps } from 'antd';
// import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { IConfigurableFormComponent } from '../../../../interfaces';

export interface IStepProps extends IConfigurableItemBase, Omit<StepProps, 'children' | 'style' > {
  id: string;
  icon?: string;
  key: string;
  title: string;
  subTitle: string;
  description: string;
  customVisibility?: string;
  customEnabled?: string;
  permissions?: string[];
  components?: IConfigurableFormComponent[];
  childItems?: IStepProps[];
}

export interface IWizardComponentProps extends IConfigurableFormComponent {
  steps: IStepProps[];
  // size?: 'default' | 'small';
  // defaultActiveKey?: string;
  wizardType?: 'default' | 'navigation';
  visibility?: 'Yes' | 'No' | 'Removed';
  permissions?: string[];
  hidden?: boolean;
  customVisibility?: string;
  // position?: 'left' | 'right' | 'top' | 'bottom';
}
