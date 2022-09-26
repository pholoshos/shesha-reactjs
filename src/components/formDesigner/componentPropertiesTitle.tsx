import React, { FC } from 'react';
import { Button } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import { useFormDesigner } from '../../providers/formDesigner';

export interface IProps {}

export const ComponentPropertiesTitle: FC<IProps> = ({}) => {
  const { deleteComponent, selectedComponentId } = useFormDesigner();

  const onDeleteClick = () => {
    deleteComponent({ componentId: selectedComponentId });
  };

  return (
    <div className="component-properties-actions">
      Properties
      {selectedComponentId && (
        <div className="action-buttons">
          <Button
            icon={<DeleteFilled color="red" />}
            onClick={onDeleteClick}
            size="small"
            danger
            title="Delete component"
          />
        </div>
      )}
    </div>
  );
};

export default ComponentPropertiesTitle;
