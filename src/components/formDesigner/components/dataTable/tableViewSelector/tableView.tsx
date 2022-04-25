import React, { FC } from 'react';
import { ITableViewProps } from '../../../../../providers/tableViewSelectorConfigurator/models';
import { Button, Tooltip } from 'antd';
import { DeleteFilled, QuestionCircleOutlined } from '@ant-design/icons';
import { useTableViewSelectorConfigurator } from '../../../../../providers/tableViewSelectorConfigurator';
import DragHandle from './dragHandle';

export interface IProps extends ITableViewProps {
  index: number[];
}

export const TableView: FC<IProps> = (props) => {
  const { deleteButton, selectedItemId } = useTableViewSelectorConfigurator();

  const onDeleteClick = () => {
    deleteButton(props.id);
  };

  const classes = ['sha-toolbar-item'];
  if (selectedItemId === props.id) classes.push('selected');

  return (
    <div className={classes.reduce((a, c) => a + ' ' + c)}>
      <div className="sha-toolbar-item-header">
        <DragHandle id={props.id} />
        {props.name}
        {props.tooltip && (
          <Tooltip title={props.tooltip} className="sha-tooltip-icon">
            <QuestionCircleOutlined />
          </Tooltip>
        )}
        <div className="sha-toolbar-item-controls">
          <Button icon={<DeleteFilled color="red" />} onClick={onDeleteClick} size="small" danger />
        </div>
      </div>
    </div>
  );
};

export default TableView;
