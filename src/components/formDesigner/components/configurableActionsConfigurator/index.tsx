import React, { FC, useMemo } from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { ThunderboltOutlined } from '@ant-design/icons';
import { Collapse, Form, Switch, TreeSelect } from 'antd';
import { useForm } from '../../../../providers';
import { useConfigurableActionDispatcher } from '../../../../providers/configurableActionsDispatcher';
import { validateConfigurableComponentSettings } from '../../../..';
import { configurableActionsConfiguratorSettingsForm } from './settings';
import { IConfigurableActionConfiguration } from '../../../../interfaces/configurableAction';
import { IConfigurableActionDictionary } from '../../../../providers/configurableActionsDispatcher/models';
import ActionArgumentsEditor from './actionArgumensEditor';

export interface IConfigurableActionNamesComponentProps extends IConfigurableFormComponent {

}

const { Panel } = Collapse;

const ConfigurableActionConfiguratorComponent: IToolboxComponent<IConfigurableActionNamesComponentProps> = {
  type: 'configurableActionConfigurator',
  name: 'Configurable Action Configurator',
  icon: <ThunderboltOutlined />,
  isHidden: true,
  factory: (model: IConfigurableActionNamesComponentProps) => {
    const { isComponentHidden } = useForm();

    const isHidden = isComponentHidden(model);

    if (isHidden) return null;

    return (
      <Form.Item name={model.name} labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} noStyle>
        <ConfigurableActionConfigurator editorConfig={model} level={1} />
      </Form.Item>
    );
    // return (
    //   <ConfigurableFormItem model={model}>
    //     <ConfigurableActionConfigurator editorConfig={model} />
    //   </ConfigurableFormItem>
    // );
  },
  settingsFormMarkup: configurableActionsConfiguratorSettingsForm,
  validateSettings: model => validateConfigurableComponentSettings(configurableActionsConfiguratorSettingsForm, model),
};

//interface IConfigurableActionConfiguratorProps extends IFormItem { }

interface IConfigurableActionConfiguratorProps {
  editorConfig: IConfigurableActionNamesComponentProps;
  value?: IConfigurableActionConfiguration;
  onChange?: (value: IConfigurableActionConfiguration) => void;
  level: number;
}

interface IActionFormModel extends Omit<IConfigurableActionConfiguration, 'actionOwner' | 'actionName'> {
  actionFullName: string;
}

const getActionFullName = (actionOwner: string, actionName: string): string => {
  return actionName
    ? `${actionOwner}:${actionName}`
    : null;
}
interface IActionIdentifier {
  actionName: string;
  actionOwner: string;
}
const parseActionFullName = (fullName: string): IActionIdentifier => {
  const parts = fullName?.split(':') ?? [];
  return parts && parts.length === 2
    ? { actionOwner: parts[0], actionName: parts[1] }
    : null;
}

const ConfigurableActionConfigurator: FC<IConfigurableActionConfiguratorProps> = props => {
  const [form] = Form.useForm();
  const { formSettings } = useForm();
  const { value, onChange } = props;
  const { getActions, getConfigurableAction } = useConfigurableActionDispatcher();
  const actions = getActions();

  /*
    get parent form settings
    draw nested form with the same layout settings
    fetch arguments editor
    hide arguments if not applicable
  */
  /*
    layout: props.layout ?? formSettings.layout,
    labelCol: props.labelCol ?? formSettings.labelCol,
    wrapperCol: props.wrapperCol ?? formSettings.wrapperCol,
    colon: formSettings.colon,
    */
  const formValues = useMemo<IActionFormModel>(() => {
    if (!value)
      return null;

    const { actionName, actionOwner, ...restProps } = value;
    const result: IActionFormModel = {
      ...restProps,
      actionFullName: getActionFullName(actionOwner, actionName)
    };
    return result;
  }, [value]);
  const onValuesChange = (_value, values) => {
    if (onChange) {
      const { actionFullName, ...restProps } = values;
      const actionId = parseActionFullName(actionFullName);

      const formValues = {
        actionName: actionId?.actionName,
        actionOwner: actionId?.actionOwner,
        ...restProps,
      };

      onChange(formValues);
    }
  }

  /*
  const selectedActionFullName = form.getFieldValue('actionFullName');
  const selectedAction = useMemo(() => {
    const actionId = parseActionFullName(selectedActionFullName);
    return actionId
      ? getConfigurableAction({ owner: actionId.actionOwner, name: actionId.actionName })
      : null;
  }, [selectedActionFullName]);
  */
  const { actionName, actionOwner } = value ?? {};
  const selectedAction = useMemo(() => {
    return actionName
      ? getConfigurableAction({ owner: actionOwner, name: actionName })
      : null;
  }, [actionName, actionOwner]);  

  console.log('LOG: render action', { actionName, actionOwner, selectedAction })
  return (
    <div
      style={{ paddingLeft: 10 }} className="sha-action-props"
    >
      <Form
        form={form}
        layout='vertical'
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        colon={formSettings.colon}
        onValuesChange={onValuesChange}
        initialValues={formValues}
      >
        <Form.Item name="actionFullName" label="Action Name">
          <ActionSelect actions={actions}></ActionSelect>
        </Form.Item>
        {selectedAction && selectedAction.hasArguments && (
          <Form.Item name="actionArguments" label={null}>
            <ActionArgumentsEditor action={selectedAction}></ActionArgumentsEditor>
          </Form.Item>
        )}
        <Form.Item name="handleSuccess" label="Handle Success" valuePropName='checked'>
          <Switch />
        </Form.Item >
        {
          value?.handleSuccess && (
            <Collapse defaultActiveKey={['1']}>
              <Panel header="On Success handler" key="1">
                <Form.Item name="onSuccess">
                  <ConfigurableActionConfigurator editorConfig={props.editorConfig} level={props.level + 1} />
                </Form.Item >
              </Panel>
            </Collapse>
          )
        }
        <Form.Item name="handleFail" label="Handle Fail" valuePropName='checked'>
          <Switch />
        </Form.Item>
        {
          value?.handleFail && (
            <Collapse defaultActiveKey={['1']}>
              <Panel header="On Fail handler" key="1">
                <Form.Item name="onFail">
                  <ConfigurableActionConfigurator editorConfig={props.editorConfig} level={props.level + 1} />
                </Form.Item>
              </Panel>
            </Collapse>
          )
        }
      </Form >
    </div>
  );
};

const getConfigurableActionFullName = (owner: string, name: string) => {
  return owner
    ? `${owner}:${name}`
    : name;
}

interface IActionSelectProps {
  actions: IConfigurableActionDictionary;
  value?: string;
  onChange?: () => void;
}
interface IActionSelectItem {
  title: string;
  value: string;
  displayText: string;
  children: IActionSelectItem[];
  selectable: boolean;
}
const ActionSelect: FC<IActionSelectProps> = ({ value, onChange, actions }) => {

  const treeData = useMemo<IActionSelectItem[]>(() => {
    const result: IActionSelectItem[] = [];

    for (const owner in actions) {
      const ownerActions = actions[owner];
      const ownerNodes: IActionSelectItem[] = [];
      ownerActions.forEach(action => {
        ownerNodes.push({
          title: action.name,
          displayText: `${owner}: ${action.name}`,
          value: getConfigurableActionFullName(owner, action.name),
          children: null,
          selectable: true,
        });
      });

      result.push({
        title: owner,
        value: null,
        displayText: owner,
        children: ownerNodes,
        selectable: false,
      });
    }
    return result;
  }, [actions]);

  return (
    <TreeSelect
      showSearch
      style={{
        width: '100%',
      }}
      value={value}
      dropdownStyle={{
        maxHeight: 400,
        overflow: 'auto',
      }}
      placeholder="Please select"
      allowClear
      treeDefaultExpandAll
      onChange={onChange}
      treeNodeLabelProp='displayText'
      treeData={treeData}
    >
    </TreeSelect>
  );
}

export default ConfigurableActionConfiguratorComponent;