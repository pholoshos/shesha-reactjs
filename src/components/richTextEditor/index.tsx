import React, { CSSProperties, FC, useEffect, useRef, useState } from 'react';
import JoditEditor, { JoditProps } from 'jodit-react';
import classNames from 'classnames';
import Show from '../show';

export interface IRichTextEditorProps extends Omit<JoditProps, 'value'> {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
}

interface IRichTextEditorState {
  content?: any;
  hasWindow?: boolean;
}

export const RichTextEditor: FC<IRichTextEditorProps> = ({ value, onChange, config, style, className }) => {
  const editor = useRef(null);
  const [state, setState] = useState<IRichTextEditorState>({ content: value, hasWindow: false });

  const { hasWindow, content } = state;

  useEffect(() => {
    setState(prev => ({ ...prev, hasWindow: true }));
  }, []);

  const handleChange = (incomingValue: string) => {
    setState(prev => ({ ...prev, content: incomingValue }));

    if (onChange) {
      onChange(incomingValue);
    }
  };

  return (
    <div style={style} className={classNames('sha-rich-text-editor', className)}>
      <Show when={hasWindow}>
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          onBlur={handleChange} // preferred to use only this option to update the content for performance reasons
        />
      </Show>
    </div>
  );
};

export default RichTextEditor;
