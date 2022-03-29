import { SpaceProps } from "antd";
import { IConfigurableFormComponent } from "../../../../interfaces";

export interface IRadioItems {
  id: string;
  name: string;
  value: string;
}

export type DataSourceType = 'values' | 'reflist';

export interface IRadioProps extends IConfigurableFormComponent {
  items?: IRadioItems[];
  dataSourceType: DataSourceType;
  direction?: SpaceProps['direction'];
}
