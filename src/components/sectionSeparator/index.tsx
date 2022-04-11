import React, { CSSProperties, FC } from 'react';

export interface ISectionSeparatorProps {
  /** Section name */
  sectionName: string;
  containerStyle?: CSSProperties;
  titleStyle?: CSSProperties;
}

/** A component for separating the content on the form */
export const SectionSeparator: FC<ISectionSeparatorProps> = ({ sectionName, containerStyle, titleStyle }) => {
  return (
    <div className="sha-section-separator" style={containerStyle}>
      <span className="sha-section-separator-section-name" style={titleStyle}>
        {sectionName}
      </span>
    </div>
  );
};

export default SectionSeparator;
