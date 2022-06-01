import React, { CSSProperties, FC, useRef, useState } from 'react';
import JoditEditor, { JoditProps } from 'jodit-react';
import classNames from 'classnames';

export interface IRichTextEditorProps extends Omit<JoditProps, 'value'> {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
}

export const RichTextEditor: FC<IRichTextEditorProps> = ({ value, onChange, config, style, className }) => {
  const editor = useRef(null);
  const [content, setContent] = useState(value);

  const handleChange = (incomingValue: string) => {
    setContent(incomingValue);

    if (onChange) {
      onChange(incomingValue);
    }
  };

  return (
    <div style={style} className={classNames('sha-rich-text-editor', className)}>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={handleChange} // preferred to use only this option to update the content for performance reasons
      />
    </div>
  );
};

export default RichTextEditor;
