import React, { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Skeleton } from 'antd';
import { JoditProps } from 'jodit-react';
import { Jodit } from 'jodit';

const JoditEditor = React.lazy(() => {
  return import('jodit-react');
});

export type JoditConfig = JoditProps['config'];

export interface IRichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  config?: Partial<JoditConfig>;
  className?: string;
  style?: CSSProperties;
}

interface IRichTextEditorState {
  content?: string;
}

export const RichTextEditor: FC<IRichTextEditorProps> = ({ value, onChange, config, style, className }) => {
  const isSSR = typeof window === 'undefined';
  const editor = useRef(null);
  const [state, setState] = useState<IRichTextEditorState>({ content: value });

  const fullConfig = useMemo<JoditConfig>(() => {
    const result = {
      ...Jodit.defaultOptions,
      ...config
    };

    console.log('full config', result);

    return result;
  }, [config]);

  const { content } = state;

  useEffect(() => {
    setState(prev => ({ ...prev, hasWindow: true }));
  }, []);

  const handleChange = (incomingValue: string) => {
    setState(prev => ({ ...prev, content: incomingValue }));

    if (onChange) {
      onChange(incomingValue);
    }
  };

  return isSSR ? (
    <Skeleton loading={true} />
  ) : (
    <React.Suspense fallback={<div>Loading editor...</div>}>
      <div style={style} className={classNames('sha-rich-text-editor', className)}>
        <JoditEditor
          ref={editor}
          value={content}
          config={fullConfig}
          onBlur={handleChange} // preferred to use only this option to update the content for performance reasons
        />
      </div>
    </React.Suspense>
  );
};

export default RichTextEditor;