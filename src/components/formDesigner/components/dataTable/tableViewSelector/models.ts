import { IConfigurableFormComponent } from '../../../../../providers/form/models';
import { ITableViewProps } from '../../../../../providers/tableViewSelectorConfigurator/models';
import { MutableRefObject } from 'react';

export interface ITableViewSelectorProps extends IConfigurableFormComponent {
  filters: ITableViewProps[];
  useExpression?: boolean;
  title?: string;
  defaultFilterId?: string;
  componentRef: MutableRefObject<any>;
}
