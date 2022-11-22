import { EditOutlined } from '@ant-design/icons';
import React, { lazy } from 'react';
import { FormMarkup } from '../../../../providers/form/models';
import settingsFormJson from './settingsForm.json';
import { useForm, useGlobalState, useSubForm } from '../../../../providers';
import { IConfigurableFormComponent, IToolboxComponent } from '../../../../interfaces';
import { evaluateString, validateConfigurableComponentSettings } from '../../../../formDesignerUtils';
import { Alert, Skeleton } from 'antd';
import { getStyle } from '../../../../providers/form/utils';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './styles.less'; // This manually loads github-markdown-css, as per https://raw.githubusercontent.com/sindresorhus/github-markdown-css/gh-pages/github-markdown.css

const ReactMarkdown = lazy(async () => {
  return import('react-markdown');
});

export interface IMarkdownProps extends IConfigurableFormComponent {
  content: string;
  textColor?: string;
  remarkPlugins?: string[];
}

const settingsForm = settingsFormJson as FormMarkup;

const MarkdownComponent: IToolboxComponent<IMarkdownProps> = {
  type: 'markdown',
  name: 'Markdown',
  icon: <EditOutlined />,
  factory: (model: IMarkdownProps) => {
    const { formData, formMode } = useForm();
    const { value } = useSubForm();
    const { globalState } = useGlobalState();

    const data = value || formData;

    const content = evaluateString(model?.content, { data, globalState });

    if (!content && formMode === 'designer') {
      return <Alert type="warning" message="Please make sure you enter the content to be displayed here!" />;
    }

    const isSSR = typeof window === 'undefined';

    return isSSR ? (
      <Skeleton loading={true} />
    ) : (
      <React.Suspense fallback={<div>Loading editor...</div>}>
        <div className="markdown-body" style={getStyle(model?.style, { data, globalState })}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={dark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </React.Suspense>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => ({
    ...model,
  }),
};

export default MarkdownComponent;
