import { FileTextOutlined } from '@ant-design/icons';
import { Alert, Typography } from 'antd';
import { ParagraphProps } from 'antd/lib/typography/Paragraph';
import React from 'react';
import { validateConfigurableComponentSettings } from '../../../../../formDesignerUtils';
import { IConfigurableFormComponent, IToolboxComponent } from '../../../../../interfaces/formDesigner';
import { useForm, useSubForm } from '../../../../../providers';
import { evaluateString, getStyle } from '../../../../../providers/form/utils';
import { settingsFormMarkup } from './settings';

const { Paragraph } = Typography;

export interface IParagraphProps extends IConfigurableFormComponent {
  content: string;
  contentType: 'secondary' | 'success' | 'warning' | 'danger';
  code?: boolean;
  italic?: boolean;
  keyboard?: boolean;
  copyable?: boolean;
  delete?: boolean;
  ellipsis?: boolean;
  mark?: boolean;
  strong?: boolean;
  underline?: boolean;
}

const ParagraphComponent: IToolboxComponent<IParagraphProps> = {
  type: 'paragraph',
  name: 'Paragraph',
  icon: <FileTextOutlined />,
  factory: (model: IParagraphProps) => {
    const { formData, formMode } = useForm();
    const { value } = useSubForm();

    const data = value || formData;

    const props: ParagraphProps = {
      code: model?.code,
      copyable: model?.copyable,
      delete: model?.delete,
      ellipsis: model?.ellipsis,
      mark: model?.mark,
      underline: model?.underline,
      keyboard: model?.keyboard,
      strong: model?.strong,
      italic: model?.italic,
      type: model?.contentType,
      style: { margin: 'unset', ...(getStyle(model.style, data) || {}) },
    };

    const content = evaluateString(model?.content, data);

    if (!content && formMode === 'designer') {
      return <Alert type="warning" message="Please make sure you enter the content to be displayed here!" />;
    }

    return <Paragraph {...props}>{content}</Paragraph>;
  },
  settingsFormMarkup,
  validateSettings: model => validateConfigurableComponentSettings(settingsFormMarkup, model),
  initModel: model => ({
    code: false,
    copyable: false,
    delete: false,
    disabled: false,
    ellipsis: false,
    mark: false,
    italic: false,
    underline: false,
    keyboard: false,
    strong: false,
    ...model,
  }),
};

export default ParagraphComponent;
