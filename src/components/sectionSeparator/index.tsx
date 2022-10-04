import { QuestionCircleOutlined } from '@ant-design/icons';
import { Space, Tooltip } from 'antd';
import React, { CSSProperties, FC } from 'react';

export interface ISectionSeparatorProps {
  /** Section name */
  sectionName: string;
  containerStyle?: CSSProperties;
  titleStyle?: CSSProperties;
  tooltip?: string;
}

/** A component for separating the content on the form */
export const SectionSeparator: FC<ISectionSeparatorProps> = ({ sectionName, containerStyle, titleStyle, tooltip }) => {
  return (
    <div className="sha-section-separator" style={containerStyle}>
      <span className="sha-section-separator-section-name" style={titleStyle}>
        <Space>
          {sectionName} {tooltip && <Tooltip title={tooltip}>{<QuestionCircleOutlined />}</Tooltip>}
        </Space>
      </span>
    </div>
  );
};

export default SectionSeparator;
