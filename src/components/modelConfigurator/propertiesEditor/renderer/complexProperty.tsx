import React, { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { DeleteFilled, QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { usePropertiesEditor } from '../provider';
import DragHandle from './dragHandle';
import { IModelItem } from '../../../../interfaces/modelConfigurator';
import ItemsContainer from './itemsContainer';
import { getIconByDataType } from '../../../../utils/metadata';
import { ShaIcon } from '../../..';

export interface IProps extends IModelItem {
  index: number[];
}

export const ComplexProperty: FC<IProps> = props => {
  const { deleteItem, addItem, selectedItemId, selectedItemRef } = usePropertiesEditor();

  const icon = getIconByDataType(props.dataType);

  const onDeleteClick = () => {
    deleteItem(props.id);
  };

  const classes = ['sha-sidebar-item'];
  if (selectedItemId === props.id) {
    classes.push('selected');
  }

  const onAddChildClick = () => {
    addItem(props.id);
  }

  return (
    <div className={classes.reduce((a, c) => a + ' ' + c)} ref={selectedItemId === props.id ? selectedItemRef : undefined}>
      <div className="sha-sidebar-item-header">
        <DragHandle id={props.id} />
        {icon && <ShaIcon iconName={icon} />}
        <span className="sha-sidebar-item-name">{props.name}</span>
        {props.description && (
          <Tooltip title={props.description}>
            <QuestionCircleOutlined className="sha-help-icon" />
          </Tooltip>
        )}
        <Button icon={<PlusOutlined color="red" />} onClick={onAddChildClick} size="small">Add child</Button>

        <div className="sha-sidebar-item-controls">
          <Button icon={<DeleteFilled color="red" />} onClick={onDeleteClick} size="small" danger />
        </div>
        <div className="sha-sidebar-group-container">
          <ItemsContainer index={props.index} items={props.properties || []} />
        </div>
        {/* { props.childItems && props.childItems.map((item, index) => {
          return <ModelItem {...item} key={index} index={[ ...props.index, index ]} />
        }) } */}
      </div>
    </div>
  );
};

export default ComplexProperty;
