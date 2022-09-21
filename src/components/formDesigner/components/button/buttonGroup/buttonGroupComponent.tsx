import React, { FC } from 'react';
import { IToolboxComponent } from '../../../../../interfaces';
import { GroupOutlined } from '@ant-design/icons';
import ToolbarSettings from './settings';
import { IButtonGroupProps } from './models';
import { Alert, Menu } from 'antd';
import { IButtonGroupButton, ButtonGroupItemProps } from '../../../../../providers/buttonGroupConfigurator/models';
import { useForm } from '../../../../../providers/form';
import { ConfigurableButton } from '../configurableButton';
import { useAuth, useDataTableSelection, useGlobalState } from '../../../../../providers';
import moment from 'moment';
import { executeExpression, getStyle } from '../../../../../providers/form/utils';
import { getButtonGroupMenuItem } from './utils';

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

type MenuButton = ButtonGroupItemProps & {
  childItems?: MenuButton[];
};

export const ButtonGroup: FC<IButtonGroupProps> = ({ items, id, size, spaceSize = 'middle' }) => {
  const { formMode, formData, form } = useForm();
  const { anyOfPermissionsGranted } = useAuth();
  const { globalState } = useGlobalState();
  const { selectedRow } = useDataTableSelection(false) ?? {}; // todo: move to a generic context provider

  const isDesignMode = formMode === 'designer';

  const localexecuteExpression = (expression: string) => {
    const expressionArgs = {
      data: formData,
      form: form,
      formMode: formMode,
      globalState: globalState,
      moment: moment,
      context: { selectedRow },
    };
    return executeExpression<boolean>(expression,
      expressionArgs,
      true,
      (error) => {
        console.error(error);
        return true;
      });
  };

  /**
   * Return the visibility state of a button. A button is visible is it's not hidden and the user is permitted to view it
   * @param item
   * @returns
   */
  const getIsVisible = (item: ButtonGroupItemProps) => {
    const { permissions, hidden } = item;

    const isVisibleByCondition = localexecuteExpression(item.customVisibility);

    const granted = anyOfPermissionsGranted(permissions || []);

    return isVisibleByCondition && !hidden && granted;
  };

  const renderMenuButton = (props: MenuButton, isChild = false) => {
    const hasChildren = props?.childItems?.length > 0;

    const disabled = !localexecuteExpression(props.customEnabled);

    return getButtonGroupMenuItem(
      renderButtonItem(props, props?.id, disabled),
      props.id,
      disabled,
      hasChildren ? props?.childItems?.filter(getIsVisible)?.map(props => renderMenuButton(props, isChild)) : null
    );
  };

  const renderButtonItem = (item: ButtonGroupItemProps, uuid: string, disabled = false, isChild = false) => {
    const itemProps = item as IButtonGroupButton;

    return (
      <ConfigurableButton
        formComponentId={id}
        key={uuid}
        {...itemProps}
        size={size}
        style={getStyle(item?.style, formData)}
        disabled={disabled}
        buttonType={isChild ? 'link' : item.buttonType}
      />
    );
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
    <div className="sha-responsive-button-group-container">
      <Menu
        mode="horizontal"
        items={items?.filter(getIsVisible)?.map(props => renderMenuButton(props))}
        className={`sha-responsive-button-group space-${spaceSize}`}
        onClick={event => {
          console.log('LOGS:: event.key ', event.key);
        }}
      />
    </div>
  );
};

export default ButtonGroupComponent;
