import React, { CSSProperties, ReactNode } from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { LinkOutlined } from '@ant-design/icons';
import { evaluateString, getStyle, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useForm } from '../../../../providers';
import settingsFormJson from './settingsForm.json';
import { Direction } from '../../componentsContainer';
import { AlignItems, JustifyContent, JustifyItems } from '../container/containerComponent';

export interface IAlertProps extends IConfigurableFormComponent {
  text: string;
  description?: string;
  showIcon?: boolean;
  icon?: string;
}
export interface ILinkProps extends IConfigurableFormComponent {
  content?: string;
  text?: string;
  target?: string;
  download?: string;
  direction?: Direction;
  justifyContent?: JustifyContent | string;
  alignItems?: AlignItems | string;
  justifyItems?: JustifyItems | string;
  className?: string;
  icon?: ReactNode;
}

const settingsForm = settingsFormJson as FormMarkup;
const LinkComponent: IToolboxComponent<ILinkProps> = {
  type: 'link',
  name: 'link',
  icon: <LinkOutlined />,
  factory: (model: ILinkProps) => {
    const { isComponentHidden, formData } = useForm();
    const { text, content = '', style, target, direction, justifyContent, alignItems, justifyItems } = model;

    const linkStyle: CSSProperties = {};
    if (direction === 'horizontal' && justifyContent) {
      (linkStyle['display'] = 'flex'), (linkStyle['justifyContent'] = justifyContent);
      linkStyle['alignItems'] = alignItems;
      linkStyle['justifyItems'] = justifyItems;
    }

    const href = evaluateString(content, formData);

    const isHidden = isComponentHidden(model);

    if (isHidden) return null;

    return (
      <a href={href} target={target} className="sha-link" style={{ ...linkStyle, ...getStyle(style, formData) }}>
        {text}
      </a>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: (model: ILinkProps) => {
    const customProps: ILinkProps = {
      ...model,
      direction: 'vertical',
      justifyContent: 'left',
      text: 'linkTextName',
      style: 'return ({})',
    };

    return customProps;
  },
};

export default LinkComponent;
