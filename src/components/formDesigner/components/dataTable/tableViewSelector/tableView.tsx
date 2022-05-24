import React, { FC, useState } from 'react';
import { ITableViewProps } from '../../../../../providers/tableViewSelectorConfigurator/models';
import { Button, Tooltip } from 'antd';
import { DeleteFilled, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { useTableViewSelectorConfigurator } from '../../../../../providers/tableViewSelectorConfigurator';
import DragHandle from './dragHandle';
import classNames from 'classnames';

export interface IProps extends ITableViewProps {
  index: number[];
  onConfigClick?: (selectedItemId: string) => void;
}

interface ITableViewState {
  edit?: boolean;
  text?: string;
}

export const TableView: FC<IProps> = ({ onConfigClick, tooltip, id, name }) => {
  const { deleteButton, selectedItemId } = useTableViewSelectorConfigurator();
  const [] = useState<ITableViewState>();

  const onDeleteClick = () => {
    deleteButton(id);
  };

  const onEditBtnClick = () => {
    if (onConfigClick) {
      onConfigClick(id);
    }
  };

  return (
    <div className={classNames('sha-toolbar-item', { selected: selectedItemId === id })}>
      <div className="sha-toolbar-item-header">
        <DragHandle id={id} />
        {name}

        {tooltip && (
          <Tooltip title={tooltip} className="sha-tooltip-icon">
            <QuestionCircleOutlined />
          </Tooltip>
        )}
        <div className="sha-toolbar-item-controls">
          <Button icon={<SettingOutlined />} onClick={onEditBtnClick} size="small" />

          <Button icon={<DeleteFilled color="red" />} onClick={onDeleteClick} size="small" danger />
        </div>
      </div>
    </div>
  );
};

export default TableView;
