import { RadioChangeEvent, SpaceProps } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { DataSourceType, ILabelValue } from '../dropdown/models';

type CheckboxGroupMode = 'single' | 'multiple';
export interface ICheckboxGoupProps extends IConfigurableFormComponent {
  items?: ILabelValue[];
  mode?: CheckboxGroupMode;
  referenceListNamespace?: string;
  referenceListName?: string;
  dataSourceType: DataSourceType;
  direction?: SpaceProps['direction'];
  value?: CheckboxValueType[] | any;
  onChange?: (checkedValue: Array<CheckboxValueType> | RadioChangeEvent) => void;
}

export const getSpan = (direction: SpaceProps['direction'], size: number) =>
  direction === 'vertical' ? 24 : size < 4 ? 24 / size : 6;
