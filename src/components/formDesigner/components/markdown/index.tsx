import { EditOutlined } from '@ant-design/icons';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FormMarkup } from '../../../../providers/form/models';
import settingsFormJson from './settingsForm.json';
import { useForm, useGlobalState, useSubForm } from '../../../../providers';
import { IConfigurableFormComponent, IToolboxComponent } from '../../../../interfaces';
import { evaluateString, validateConfigurableComponentSettings } from '../../../../formDesignerUtils';
import { Alert } from 'antd';
import { getStyle } from '../../../../providers/form/utils';
import 'github-markdown-css';

export interface IMarkdownProps extends IConfigurableFormComponent {
  content: string;
  textColor?: string;
}

const settingsForm = settingsFormJson as FormMarkup;

const MarkdownComponent: IToolboxComponent<IMarkdownProps> = {
  type: 'markdown',
  name: 'Markdown',
  icon: <EditOutlined />,
  factory: (model: IMarkdownProps) => {
    const { formData } = useForm();
    const { value } = useSubForm();
    const { globalState } = useGlobalState();

    const data = value || formData;

    const content = evaluateString(model?.content, { data, globalState });

    if (!content) {
      return <Alert type="warning" message="Content will be displayed when Available" />;
    }
    // getStyle(style, formData)
    return (
      <div className="markdown-body" style={getStyle(model?.style, { data, globalState })}>
        <ReactMarkdown skipHtml>{content}</ReactMarkdown>
      </div>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => ({
    ...model,
  }),
};

export default MarkdownComponent;
