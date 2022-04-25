import { FileTextOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { ParagraphProps } from 'antd/lib/typography/Paragraph';
import React from 'react';
import { validateConfigurableComponentSettings } from '../../../../../formDesignerUtils';
import { IConfigurableFormComponent, IToolboxComponent } from '../../../../../interfaces/formDesigner';
import { useForm } from '../../../../../providers';
import { FormMarkup } from '../../../../../providers/form/models';
import { evaluateString, getStyle } from '../../../../../providers/form/utils';
import settingsFormJson from './settingsForm.json';

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

const settingsForm = settingsFormJson as FormMarkup;

const ParagraphComponent: IToolboxComponent<IParagraphProps> = {
  type: 'paragraph',
  name: 'Paragraph',
  icon: <FileTextOutlined />,
  factory: (model: IParagraphProps) => {
    const { formData } = useForm();

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
      style: getStyle(model.style, formData),
    };

    const content = evaluateString(model?.content, formData);

    return <Paragraph {...props}>{content}</Paragraph>;
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
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
