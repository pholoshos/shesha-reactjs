import { LineHeightOutlined } from '@ant-design/icons';
import { Alert, Typography } from 'antd';
import { TitleProps } from 'antd/lib/typography/Title';
import React from 'react';
import { validateConfigurableComponentSettings } from '../../../../../formDesignerUtils';
import { IConfigurableFormComponent, IToolboxComponent } from '../../../../../interfaces/formDesigner';
import { useForm, useSubForm } from '../../../../../providers';
import { evaluateString, getStyle } from '../../../../../providers/form/utils';
import { settingsFormMarkup } from './settings';

const { Title } = Typography;

declare const TITLE_ELE_LIST: [1, 2, 3, 4, 5];

type LevelType = typeof TITLE_ELE_LIST[number];

export interface ITitleProps extends IConfigurableFormComponent {
  content: string;
  contentType: 'secondary' | 'success' | 'warning' | 'danger';
  code?: boolean;
  italic?: boolean;
  copyable?: boolean;
  delete?: boolean;
  ellipsis?: boolean;
  mark?: boolean;
  underline?: boolean;
  level?: LevelType;
}

const TitleComponent: IToolboxComponent<ITitleProps> = {
  type: 'title',
  name: 'Title',
  icon: <LineHeightOutlined />,
  factory: (model: ITitleProps) => {
    const { formData, formMode } = useForm();
    const { value } = useSubForm();
    const data = value || formData;

    const props: TitleProps = {
      code: model?.code,
      copyable: model?.copyable,
      delete: model?.delete,
      ellipsis: model?.ellipsis,
      mark: model?.mark,
      italic: model?.italic,
      underline: model?.underline,
      level: model?.level ? (Number(model?.level) as LevelType) : 1,
      type: model?.contentType,
      style: { margin: 'unset', ...(getStyle(model.style, data) || {}) },
    };

    const content = evaluateString(model?.content, data);

    if (!content && formMode === 'designer') {
      return <Alert type="warning" message="Please make sure you enter the content to be displayed here!" />;
    }

    return (
      <Title {...props} style={{ margin: 'unset' }}>
        {content}
      </Title>
    );
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
    level: 1,
    ...model,
  }),
};

export default TitleComponent;
