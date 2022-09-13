import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IFormComponentContainer } from '../../../../providers/form/models';
import { DoubleRightOutlined } from '@ant-design/icons';
import { Steps, Button, Space } from 'antd';
import ComponentsContainer from '../../componentsContainer';
import settingsFormJson from './settingsForm.json';
import React, { Fragment, useState } from 'react';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useAuth, useForm, useGlobalState } from '../../../../providers';
import { useSheshaApplication } from '../../../../';
import { nanoid } from 'nanoid/non-secure';
import TabSettings from './settings';
import { ITabsComponentProps } from './models';
import ShaIcon from '../../../shaIcon';
import moment from 'moment';
import { usePubSub } from '../../../../hooks';
import { axiosHttp } from '../../../../apis/axios';

const { Step } = Steps;

const settingsForm = settingsFormJson as FormMarkup;

const TabsComponent: IToolboxComponent<ITabsComponentProps> = {
  type: 'wizard',
  name: 'Wizard',
  icon: <DoubleRightOutlined />,
  factory: model => {
    const { anyOfPermissionsGranted } = useAuth();
    const { isComponentHidden, formMode, formData } = useForm();
    const { globalState } = useGlobalState();
    const { backendUrl } = useSheshaApplication();
    const { publish } = usePubSub();
    const [current, setCurrent] = useState(0);
    const [component, setComponent] = useState(null);

    const { tabs, wizardType = 'default' } = model as ITabsComponentProps;

    if (isComponentHidden(model)) return null;

    const executeExpression = (expression: string, returnBoolean = true) => {
      if (!expression) {
        if (returnBoolean) {
          return true;
        } else {
          console.error('Expected expression to be defined but it was found to be empty.');
          return false;
        }
      }

      /* tslint:disable:function-constructor */
      const evaluated = new Function('data, formMode, globalState, http, moment', expression)(
        formData,
        formMode,
        globalState,
        axiosHttp(backendUrl),
        moment
      );

      // tslint:disable-next-line:function-constructor
      return typeof evaluated === 'boolean' ? evaluated : true;
    };

    /// NAVIGATION

    const next = () => {
      const buttonAction = tabs[current].nextButtonAction;
      const actionScript = tabs[current].nextButtonActionScript;
      const eventName = tabs[current].nextEventName;
      const customEventNameToDispatch = tabs[current].nextCustomEventNameToDispatch;
      const uniqueStateId = tabs[current].nextUniqueStateId;

      switch (buttonAction) {
        case 'executeScript':
          executeScript(actionScript);
          break;
        case 'dispatchAnEvent':
          dispatchAnEvent(eventName, customEventNameToDispatch, uniqueStateId);
          break;
        default:
          break;
      }

      setCurrent(current + 1);
      setComponent(tabs[current].components);
    };

    const back = () => {
      const buttonAction = tabs[current].backButtonAction;
      const actionScript = tabs[current].backButtonActionScript;
      const eventName = tabs[current].backEventName;
      const customEventNameToDispatch = tabs[current].backCustomEventNameToDispatch;
      const uniqueStateId = tabs[current].backUniqueStateId;

      switch (buttonAction) {
        case 'executeScript':
          executeScript(actionScript);
          break;
        case 'dispatchAnEvent':
          dispatchAnEvent(eventName, customEventNameToDispatch, uniqueStateId);
        default:
          break;
      }

      setCurrent(current - 1);
      setComponent(tabs[current].components);
    };

    const cancel = () => {
      const buttonAction = tabs[current].cancelButtonAction;
      const actionScript = tabs[current].cancelButtonActionScript;
      const eventName = tabs[current].cancelEventName;
      const customEventNameToDispatch = tabs[current].cancelCustomEventNameToDispatch;
      const uniqueStateId = tabs[current].cancelUniqueStateId;

      switch (buttonAction) {
        case 'executeScript':
          executeScript(actionScript);
          break;
        case 'dispatchAnEvent':
          dispatchAnEvent(eventName, customEventNameToDispatch, uniqueStateId);
        default:
          break;
      }
    };

    const done = () => {
      const buttonAction = tabs[current].doneButtonAction;
      const actionScript = tabs[current].doneButtonActionScript;
      const eventName = tabs[current].doneEventName;
      const customEventNameToDispatch = tabs[current].doneCustomEventNameToDispatch;
      const uniqueStateId = tabs[current].doneUniqueStateId;

      switch (buttonAction) {
        case 'executeScript':
          executeScript(actionScript);
          break;
        case 'dispatchAnEvent':
          dispatchAnEvent(eventName, customEventNameToDispatch, uniqueStateId);
        default:
          break;
      }
    };

    /// ACTIONS

    const executeScript = (actionScript) => {
      if (actionScript) {
        executeExpression(actionScript);
      }
    };

    const dispatchAnEvent = (eventName, customEventNameToDispatch, uniqueStateId) => {
      const EVENT_NAME =
        eventName === 'CUSTOM_EVENT' && customEventNameToDispatch
          ? customEventNameToDispatch
          : eventName;

      publish(EVENT_NAME, { stateId: uniqueStateId || 'NO_PROVIDED' });
    };

    return (
      <>

        <Steps
          type={wizardType}
          current={current}
          style={{ marginBottom: '25px' }}>
          {tabs?.map(
            ({
              key,
              title,
              subTitle,
              description,
              icon,
              permissions,
              customVisibility,
              customEnabled,
            }) => {
              const granted = anyOfPermissionsGranted(permissions || []);
              const isVisibleByCondition = executeExpression(customVisibility, true);
              const isDisabledByCondition = !executeExpression(customEnabled, true) && formMode !== 'designer';

              if ((!granted || !isVisibleByCondition) && formMode !== 'designer') return null;

              return (
                <>
                  <Step
                    key={key}
                    disabled={isDisabledByCondition}
                    title={title}
                    subTitle={subTitle}
                    description={description}
                    icon={
                      icon ? (
                        <Fragment>
                          <ShaIcon iconName={icon as any} />
                        </Fragment>
                      ) : (
                        <Fragment>
                          {icon}
                        </Fragment>
                      )
                    }
                  />
                </>
              );
            }
          )}
        </Steps>

        <ComponentsContainer
          containerId={tabs[current].id}
          dynamicComponents={model?.isDynamic ? component : []} />

        <div>
          <Space size={'middle'}>
            {tabs[current].allowCancel === true && (
              <Button onClick={() => cancel()}>
                {tabs[current].cancelButtonText ? (tabs[current].cancelButtonText) : ('Cancel')}
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => back()}>
                {tabs[current].backButtonText ? (tabs[current].backButtonText) : ('Back')}
              </Button>
            )}
            {current < tabs.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                {tabs[current].nextButtonText ? (tabs[current].nextButtonText) : ('Next')}
              </Button>
            )}
            {current === tabs.length - 1 && (
              <Button type="primary" onClick={() => done()}>
                {tabs[current].doneButtonText ? (tabs[current].doneButtonText) : ('Done')}
              </Button>
            )}
          </Space>
        </div>

      </>
    );
  },
  initModel: model => {
    const tabsModel: ITabsComponentProps = {
      ...model,
      name: 'custom Name',
      tabs: [{
        id: nanoid(),
        label: 'Tab 1',
        title: 'Tab 1',
        subTitle: 'Tab 1',
        description: 'Tab 1',
        allowCancel: false,
        cancelButtonText: 'Cancel',
        nextButtonText: 'Next',
        backButtonText: 'Back',
        doneButtonText: 'Done',
        key: 'tab1',
        components: [],
        itemType: 'item'
      }],
    };
    return tabsModel;
  },
  // settingsFormMarkup: settingsForm,
  settingsFormFactory: ({ model, onSave, onCancel, onValuesChange }) => {
    return <TabSettings model={model} onSave={onSave} onCancel={onCancel} onValuesChange={onValuesChange} />;
  },
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  customContainerNames: ['tabs'],
  getContainers: model => {
    const { tabs } = model as ITabsComponentProps;
    return tabs.map<IFormComponentContainer>(t => ({ id: t.id }));
  },
};

export default TabsComponent;
