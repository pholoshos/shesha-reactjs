import React from 'react';
import { ArrowsAltOutlined } from '@ant-design/icons';
import { ConfigurableFormItem } from '../../..';
import { validateConfigurableComponentSettings } from '../../../../formDesignerUtils';
import { IConfigurableFormComponent, IToolboxComponent } from '../../../../interfaces/formDesigner';
import { FormMarkup } from '../../../../providers/form/models';
import RichTextEditor from './richTextEditor';

import settingsFormJson from './settingsForm.json';

export interface IRichTextEditorProps extends IConfigurableFormComponent {}

const settingsForm = settingsFormJson as FormMarkup;

const RichTextEditorComponent: IToolboxComponent<IRichTextEditorProps> = {
  type: 'richTextEditor',
  name: 'Rich Text Editor',
  icon: <ArrowsAltOutlined />,
  factory: ({ ...model }: IRichTextEditorProps) => {
    return (
      <ConfigurableFormItem model={model}>
        <RichTextEditor />
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => ({
    ...model,
  }),
};

export default RichTextEditorComponent;
