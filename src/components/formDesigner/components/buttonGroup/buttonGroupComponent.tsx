import React, { FC } from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { GroupOutlined } from '@ant-design/icons';
import ToolbarSettings from './settings';
import { IButtonGroupProps } from './models';
import { Alert, Menu, Dropdown, Space } from 'antd';
import { IButtonGroup, IToolbarButton, ToolbarItemProps } from '../../../../providers/toolbarConfigurator/models';
import { useForm, isInDesignerMode } from '../../../../providers/form';
import { getVisibilityFunc2 } from '../../../../providers/form/utils';
import { DataTableSelectionProvider, useDataTableSelection } from '../../../../providers/dataTableSelection';
import { ButtonGroupButton } from './button';
import { ShaIcon } from '../../..';
import { IconType } from '../../../shaIcon';
import { useAuth } from '../../../../providers';
import { nanoid } from 'nanoid/non-secure';

const ButtonGroupComponent: IToolboxComponent<IButtonGroupProps> = {
  type: 'buttonGroup',
  name: 'Button Group',
  icon: <GroupOutlined />,
  factory: (model: IButtonGroupProps) => {
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

export const ButtonGroupInner: FC<IButtonGroupProps> = ({ items, id, size, spaceSize }) => {
  const { formMode } = useForm();
  const { anyOfPermissionsGranted } = useAuth();
  const { selectedRow } = useDataTableSelection();
  const isDesignMode = formMode === 'designer';

  const renderItem = (item: ToolbarItemProps, uuid: string) => {
    if (!isInDesignerMode()) {
      const visibilityFunc = getVisibilityFunc2(item.customVisibility, item.name);

      const isVisible = visibilityFunc({}, { selectedRow }, formMode);
      if (!isVisible) return null;
    }

    switch (item.itemType) {
      case 'item':
        const itemProps = item as IToolbarButton;

        switch (itemProps.itemSubType) {
          case 'button':
            return (
              <ButtonGroupButton formComponentId={id} key={uuid} selectedRow={selectedRow} {...itemProps} size={size} />
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
                {group?.childItems
                  ?.filter(({ permissions }) => anyOfPermissionsGranted(permissions || []))
                  .map(item => renderItem(item, nanoid()))}
              </Space>
            );

          default: {
            // dropdown

            const menu = (
              <Menu>
                {group.childItems.map(childItem => (
                  <Menu.Item
                    key={childItem?.id}
                    title={childItem.tooltip}
                    danger={childItem.danger}
                    icon={childItem.icon ? <ShaIcon iconName={childItem.icon as IconType} /> : undefined}
                  >
                    {childItem.label}
                  </Menu.Item>
                ))}
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
      <Space size={spaceSize}>
        {items
          ?.filter(({ permissions }) => anyOfPermissionsGranted(permissions || []))
          .map(item => renderItem(item, nanoid()))}
      </Space>
    </div>
  );
};

export default ButtonGroupComponent;

//#region Page Toolbar

/**
 * ButtonGroup wrapped in DataTableSelectionProvider in cases whereby the buttons are rendered inside a DataTable
 * @param props properties for the ButtonGroup
 * @returns
 */
export const ButtonGroup: FC<IButtonGroupProps> = props => (
  <DataTableSelectionProvider>
    <ButtonGroupInner {...props} />
  </DataTableSelectionProvider>
);
//#endregion
