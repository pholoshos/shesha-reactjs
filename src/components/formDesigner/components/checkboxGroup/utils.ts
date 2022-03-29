import { SpaceProps } from 'antd';
import { IConfigurableFormComponent } from '../../../../providers/form/models';

export interface ICheckItem {
  id: string;
  name: string;
  value: string;
}

export type DataSourceType = 'values' | 'referenceList';

export interface ICheckboxGoupProps extends IConfigurableFormComponent {
  items?: ICheckItem[];
  mode?: 'single' | 'multiple';
  referenceListNamespace?: string;
  referenceListName?: string;
  dataSourceType: DataSourceType;
  direction?: SpaceProps['direction'];
  values?: ICheckItem[];
}
