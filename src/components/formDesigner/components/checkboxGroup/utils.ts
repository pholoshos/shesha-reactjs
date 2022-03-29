import { SpaceProps } from 'antd';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { DataSourceType, ILabelValue } from '../dropdown/models';

export interface ICheckboxGoupProps extends IConfigurableFormComponent {
  items?: ILabelValue[];
  mode?: 'single' | 'multiple';
  referenceListNamespace?: string;
  referenceListName?: string;
  dataSourceType: DataSourceType;
  direction?: SpaceProps['direction'];
  values?: ILabelValue[];
}
