import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { ToolbarItemProps } from '../../../../providers/toolbarConfigurator/models';

export interface IButtonGroupProps extends IConfigurableFormComponent {
  items: ToolbarItemProps[];
  size?: SizeType;
  spaceSize?: SizeType;
}
