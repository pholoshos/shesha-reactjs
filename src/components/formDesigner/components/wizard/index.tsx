import { IToolboxComponent } from '../../../../interfaces';
import { FormMarkup, IFormComponentContainer } from '../../../../providers/form/models';
import { DoubleRightOutlined } from '@ant-design/icons';
import { Steps, Button, Space } from 'antd';
import ComponentsContainer from '../../componentsContainer';
import settingsFormJson from './settingsForm.json';
import React, { Fragment, useState } from 'react';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useAuth, useForm, useGlobalState } from '../../../../providers';
import { nanoid } from 'nanoid/non-secure';
import TabSettings from './settings';
import { ITabsComponentProps } from './models';
import ShaIcon from '../../../shaIcon';
import moment from 'moment';

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
      const evaluated = new Function('data, formMode, globalState, moment', expression)(
        formData,
        formMode,
        globalState,
        moment
      );

      // tslint:disable-next-line:function-constructor
      return typeof evaluated === 'boolean' ? evaluated : true;
    };

    const next = () => {
      setCurrent(current + 1);
      setComponent(tabs[current].components);
    };

    const previous = () => {
      setCurrent(current - 1);
      setComponent(tabs[current].components);
    };

    return (
      <>

        <Steps
          type={wizardType}
          current={current}>
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

        <ComponentsContainer containerId={tabs[current].id} dynamicComponents={model?.isDynamic ? component : []} />

        <div>
          <Space size={'middle'}>
            {current > 0 && (
              <Button style={{ margin: '0 8px' }} onClick={() => previous()}>
                Previous
              </Button>
            )}
            {current === tabs.length - 1 && (
              <Button type="primary">
                Done
              </Button>
            )}
            {current < tabs.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
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
