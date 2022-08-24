import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IConfigurableFormComponent } from '../../../../providers/form/models';
import { GroupOutlined } from '@ant-design/icons';
import settingsFormJson from './settingsForm.json';
import { CollapsiblePanel } from '../../../../';
import ComponentsContainer from '../../componentsContainer';
import { ExpandIconPosition } from 'antd/lib/collapse/Collapse';
import { useForm } from '../../../../providers/form';
import React from 'react';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';

export interface ICollapsiblePanelProps extends IConfigurableFormComponent {
  expandIconPosition?: ExpandIconPosition;
}

const settingsForm = settingsFormJson as FormMarkup;

const ColapsiblePanelComponent: IToolboxComponent<ICollapsiblePanelProps> = {
  type: 'collapsiblePanel',
  name: 'Collapsible Panel',
  icon: <GroupOutlined />,
  factory: (model: ICollapsiblePanelProps) => {
    const { isComponentHidden } = useForm();
    const { label, expandIconPosition } = model;

    if (isComponentHidden(model)) return null;

    return (
      <CollapsiblePanel header={label} expandIconPosition={expandIconPosition}>
        <ComponentsContainer
          containerId={model.id}
          dynamicComponents={model?.isDynamic ? (model as any)?.components : []}
        />
      </CollapsiblePanel>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  initModel: model => {
    const customProps: ICollapsiblePanelProps = {
      ...model,
      expandIconPosition: 'right',
    };
    return customProps;
  },
};

export default ColapsiblePanelComponent;
