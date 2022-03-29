import React, { FC } from 'react';
import { IToolboxComponent } from '../../../../../interfaces';
import { GroupOutlined } from '@ant-design/icons';
import ToolbarSettings from './settings';
import { IButtonGroupProps } from './models';
import { Alert, Menu, Dropdown, Space } from 'antd';
import {
  IButtonGroup,
  IButtonGroupButton,
  ButtonGroupItemProps,
} from '../../../../../providers/buttonGroupConfigurator/models';
import { useForm } from '../../../../../providers/form';
import { ConfigurableButton } from '../configurableButton';
import { ShaIcon } from '../../../..';
import { IconType } from '../../../../shaIcon';
import { useAuth, useGlobalState } from '../../../../../providers';
import { nanoid } from 'nanoid/non-secure';
import moment from 'moment';

const ButtonGroupComponent: IToolboxComponent<IButtonGroupProps> = {
  type: 'buttonGroup',
  name: 'Button Group',
  icon: <GroupOutlined />,
  factory: (model: IButtonGroupProps) => {
    const { isComponentHidden, formMode } = useForm();
    const { anyOfPermissionsGranted } = useAuth();
    const hidden = isComponentHidden({ id: model?.id, isDynamic: model?.isDynamic, hidden: model?.hidden });
    const granted = anyOfPermissionsGranted(model?.permissions || []);

    if ((hidden || !granted) && formMode !== 'designer') return null;

    // TODO: Wrap this component within ConfigurableFormItem so that it will be the one handling the hidden state. Currently, it's failing. Always hide the component
    return <ButtonGroup {...model} />;
  },
  initModel: (model: IButtonGroupProps) => {
    return {
      ...model,
      items: [],
    };
  },
  settingsFormFactory: ({ model, onSave, onCancel, onValuesChange }) => {
    return <ToolbarSettings model={model} onSave={onSave} onCancel={onCancel} onValuesChange={onValuesChange} />;
  },
};

export const ButtonGroup: FC<IButtonGroupProps> = ({ items, id, size, spaceSize }) => {
  const { formMode, formData } = useForm();
  const { anyOfPermissionsGranted } = useAuth();
  const { globalState } = useGlobalState();

  const isDesignMode = formMode === 'designer';

  const executeExpression = (expression: string, returnBoolean = false) => {
    if (!expression) {
      if (returnBoolean) {
        return true;
      } else {
        console.error('Expected expression to be defined but it was found to be empty.');

        return false;
      }
    }

    /* tslint:disable:function-constructor */
    const evaluated = new Function('data, formMode, globalState, moment', expression)(
      formData,
      formMode,
      globalState,
      moment
    );

    // tslint:disable-next-line:function-constructor
    return typeof evaluated === 'boolean' ? evaluated : true;
  };

  /**
   * Return the visibility state of a button. A button is visible is it's not hidden and the user is permitted to view it
   * @param item
   * @returns
   */
  const getIsVisible = (item: ButtonGroupItemProps) => {
    const { permissions, hidden } = item;

    const isVisibleByCondition = executeExpression(item.customVisibility, true);

    const granted = anyOfPermissionsGranted(permissions || []);

    return isVisibleByCondition && !hidden && granted;
  };

  const renderItem = (item: ButtonGroupItemProps, uuid: string) => {
    const isEnabledByCondition = executeExpression(item.customEnabled, true);

    switch (item.itemType) {
      case 'item':
        const itemProps = item as IButtonGroupButton;

        switch (itemProps.itemSubType) {
          case 'button':
            return (
              <ConfigurableButton
                formComponentId={id}
                key={uuid}
                {...itemProps}
                size={size}
                disabled={!isEnabledByCondition}
              />
            );

          case 'separator':
            return <div key={uuid} className="sha-toolbar-separator" />;

          default:
            return null;
        }
      case 'group':
        const group = item as IButtonGroup;
        switch (item?.groupType) {
          case 'inline':
            return (
              <Space size={0}>
                {group?.childItems?.filter(getIsVisible).map(localItem => renderItem(localItem, nanoid()))}
              </Space>
            );

          default: {
            // dropdown

            const menu = (
              <Menu>
                {group.childItems?.filter(getIsVisible).map(childItem => {
                  const localIsEnabledByCondition = executeExpression(childItem.customEnabled, true);

                  return (
                    <Menu.Item
                      key={childItem?.id}
                      title={childItem.tooltip}
                      danger={childItem.danger}
                      icon={childItem.icon ? <ShaIcon iconName={childItem.icon as IconType} /> : undefined}
                      disabled={!localIsEnabledByCondition || childItem?.disabled}
                    >
                      {childItem.label}
                    </Menu.Item>
                  );
                })}
              </Menu>
            );

            return (
              <Dropdown.Button
                key={uuid}
                overlay={menu}
                icon={item.icon ? <ShaIcon iconName={item.icon as IconType} /> : undefined}
                size={size}
              >
                {item.label}
              </Dropdown.Button>
            );
          }
        }
    }
  };

  if (items.length === 0 && isDesignMode)
    return (
      <Alert
        className="sha-designer-warning"
        message="Button group is empty. Press 'Customize Button Group' button to add items"
        type="warning"
      />
    );

  return (
    <div style={{ minHeight: '30px' }}>
      <Space size={spaceSize}>{items?.filter(getIsVisible).map(localItem => renderItem(localItem, nanoid()))}</Space>
    </div>
  );
};

export default ButtonGroupComponent;

//#region Page Toolbar
