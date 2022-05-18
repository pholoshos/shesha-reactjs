import React, { FC, useMemo, useRef, useState } from 'react';
import JoditEditor, { JoditProps } from 'jodit-react';

export interface IRichTextEditorProps extends Omit<JoditProps, 'value'> {
  value?: string;
  onChange?: (value: string) => void;
}

const RichTextEditor: FC<IRichTextEditorProps> = ({ value, onChange, config }) => {
  const editor = useRef(null);
  const [content, setContent] = useState(value);

  const handleChange = (incomingValue: string) => {
    setContent(incomingValue);

    if (onChange) {
      onChange(incomingValue);
    }
  };

  // const localConfig = useMemo<JoditProps>(config, [config]);

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      onBlur={handleChange} // preferred to use only this option to update the content for performance reasons
      // tabIndex={1} // tabIndex of textarea
      // onChange={newContent => {}}
    />
  );
};

export default RichTextEditor;
