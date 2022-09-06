import { IConfigurableItemBase } from '../../../../providers/itemListConfigurator/contexts';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { IConfigurableFormComponent } from '../../../../interfaces';

export interface ITabPaneProps extends IConfigurableItemBase {
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
  childItems?: ITabPaneProps[];
}

export interface ITabsComponentProps extends IConfigurableFormComponent {
  tabs: ITabPaneProps[];
  wizardType?: 'default' | 'navigation';
  visibility?: 'Yes' | 'No' | 'Removed';
  permissions?: string[];
  hidden?: boolean;
  customVisibility?: string;
}
