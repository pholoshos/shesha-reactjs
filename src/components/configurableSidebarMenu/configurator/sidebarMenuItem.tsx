import { FC } from 'react';
import { Button, Tooltip } from 'antd';
import { DeleteFilled, QuestionCircleOutlined } from '@ant-design/icons';
import { useSidebarMenuConfigurator } from '../../../providers/sidebarMenuConfigurator';
import DragHandle from './dragHandle';
import React from 'react';
import ShaIcon, { IconType } from '../../shaIcon';
import { ISidebarMenuItem } from '../../../interfaces/sidebar';

export interface IProps extends ISidebarMenuItem {
  index: number[];
}

export const SidebarMenuItem: FC<IProps> = props => {
  const { deleteItem, selectedItemId } = useSidebarMenuConfigurator();

  const onDeleteClick = () => {
    deleteItem(props.id);
  };

  let classes = ['sha-sidebar-item'];
  if (selectedItemId === props.id) classes.push('selected');

  const { icon } = props;
  const renderedIcon = icon ? (
    typeof icon === 'string' ? (
      <ShaIcon iconName={icon as IconType}></ShaIcon>
    ) : React.isValidElement(icon) ? (
      icon
    ) : null
  ) : null;

  return (
    <div className={classes.reduce((a, c) => a + ' ' + c)}>
      <div className="sha-sidebar-item-header">
        <DragHandle id={props.id}></DragHandle>
        {renderedIcon}
        <span className="sha-sidebar-item-name">{props.title}</span>
        {props.tooltip && (
          <Tooltip title={props.tooltip}>
            <QuestionCircleOutlined className="sha-help-icon" />
          </Tooltip>
        )}
        <div className="sha-sidebar-item-controls">
          <Button icon={<DeleteFilled color="red" />} onClick={onDeleteClick} size="small" danger></Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenuItem;
