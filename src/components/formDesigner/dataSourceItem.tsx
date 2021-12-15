import React, { FC } from 'react';
import { DataTypes } from '../../interfaces/dataTypes';
import { IPropertyMetadata } from '../../providers/metadata/models';
import ShaIcon, { IconType } from '../shaIcon';

export interface IProps {
  item: IPropertyMetadata;
  index: number;
}

/*
const Item = styled.div`
  border: 1px ${props => (props.isDragging ? 'dashed #4099ff' : 'solid #ddd')};
`;
*/

const getIconByDataType = (dataType: string):IconType => {
  switch(dataType) {
    case DataTypes.string: return 'FieldStringOutlined';
    case DataTypes.int32:
    case DataTypes.int64:
    case DataTypes.float:
    case DataTypes.double: return 'FieldNumberOutlined';
    case DataTypes.entityReference: return 'PartitionOutlined';
    case DataTypes.date: return 'CalendarOutlined';
    case DataTypes.dateTime: return 'FieldTimeOutlined';
    case DataTypes.time: return 'ClockCircleOutlined';
    case DataTypes.uuid: return 'LinkOutlined';
    case DataTypes.boolean: return 'CheckSquareOutlined';
    case DataTypes.refListValue: return 'BookOutlined';    
    
    default: return null;
  }
  
}

const DataSourceItem: FC<IProps> = ({ item /*, index*/ }) => {
  const icon = getIconByDataType(item.dataType);
  const ComponentContent = () => (
    <div>
      {icon && <ShaIcon iconName={icon}></ShaIcon>}
      <span>{item.label}</span>
    </div>
  );

  return (
    <div className="sha-toolbox-component">
      <ComponentContent />
    </div>
  );
};

export default DataSourceItem;
