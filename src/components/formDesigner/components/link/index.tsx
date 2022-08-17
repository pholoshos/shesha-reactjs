import React, { CSSProperties } from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { LinkOutlined } from '@ant-design/icons';
import { getStyle, validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useForm } from '../../../../providers';
import settingsFormJson from './settingsForm.json';
import ComponentsContainer, { Direction } from '../../componentsContainer';
import { AlignItems, JustifyContent, JustifyItems } from '../container/containerComponent';

export interface IAlertProps extends IConfigurableFormComponent {
  text: string;
  description?: string;
  showIcon?: boolean;
  icon?: string;
}
export interface ILinkProps extends IConfigurableFormComponent {
  href?: string;
  text?: string;
  target?: string;
  download?: string;
  direction?: Direction;
  hasChildren?: boolean;
  justifyContent?: JustifyContent | string;
  alignItems?: AlignItems | string;
  justifyItems?: JustifyItems | string;
  className?: string;
}

const settingsForm = settingsFormJson as FormMarkup;
const LinkComponent: IToolboxComponent<ILinkProps> = {
  type: 'link',
  name: 'link',
  icon: <LinkOutlined />,
  factory: (model: ILinkProps) => {
    const { isComponentHidden, formData, formMode } = useForm();
    const {
      text,
      href = '',
      style,
      target,
      direction,
      hasChildren,
      id,
      justifyContent,
      alignItems,
      justifyItems,
    } = model;

    const linkStyle: CSSProperties = {};
    if (direction === 'horizontal' && justifyContent) {
      (linkStyle['display'] = 'flex'), (linkStyle['justifyContent'] = justifyContent);
      linkStyle['alignItems'] = alignItems;
      linkStyle['justifyItems'] = justifyItems;
    }
    const isDesignerMode = formMode === 'designer';
    const isHidden = isComponentHidden(model);

    if (isHidden) return null;
    console.log('isDesignerMode', isDesignerMode);

    if (!hasChildren) {
      return (
        <a href={href} target={target} className="sha-link" style={{ ...linkStyle, ...getStyle(style, formData) }}>
          {text}
        </a>
      );
    }
    const containerHolder = () => (
      <ComponentsContainer
        containerId={id}
        direction={direction}
        justifyContent={model.direction === 'horizontal' ? model?.justifyContent : null}
        alignItems={model.direction === 'horizontal' ? model?.alignItems : null}
        justifyItems={model.direction === 'horizontal' ? model?.justifyItems : null}
        className={model.className}
        itemsLimit={1}
      />
    );
    if (isDesignerMode) {
      return containerHolder();
    }
    return (
      <a href={href} target={target} style={getStyle(style, formData)}>
        {containerHolder()}
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
    };

    return customProps;
  },
};

export default LinkComponent;
