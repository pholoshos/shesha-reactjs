import { SpaceProps } from 'antd';
import { ReferenceListItemDto } from '../../../../apis/referenceList';
import { IConfigurableFormComponent } from '../../../../interfaces';
import { DataSourceType, ILabelValue } from '../dropdown/models';

export interface IRadioProps extends IConfigurableFormComponent {
  items?: ILabelValue[];
  referenceListNamespace?: string;
  referenceListName?: string;
  dataSourceType: DataSourceType;
  direction?: SpaceProps['direction'];
}

export const getDataSourceList = (
  dataSource: DataSourceType,
  values: ILabelValue[],
  refList: ReferenceListItemDto[],
  urlList: any[] = []
): ILabelValue[] => {
  switch (dataSource) {
    case 'values':
      return values;

    case 'referenceList':
      return (refList || []).map(({ id, item, itemValue }) => ({ id, value: itemValue, label: item }));
    case 'url':
      return (urlList || []).map(i => ({
        id: i?.id,
        value: i?.id || i?.itemValue,
        label: i?.displayName || i?.name || i?.item,
      }));
  }
};
