import React, { FC, useEffect } from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { IConfigurableFormComponent } from '../../../../providers/form/models';
import { OrderedListOutlined } from '@ant-design/icons';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useForm } from '../../../../providers';
import { alertSettingsForm } from './settings';
import ComponentsContainer from '../../componentsContainer';
import ConfigurableFormComponent from '../../configurableFormComponent';
import { List, Form } from 'antd';
import { ItemInterface } from 'react-sortablejs';

export interface IListComponentProps extends IConfigurableFormComponent {}

const ListComponent: IToolboxComponent<IListComponentProps> = {
  type: 'list',
  name: 'List',
  icon: <OrderedListOutlined />,
  factory: (model: IListComponentProps) => {
    const { isComponentHidden, formData, formMode, setFormData } = useForm();

    useEffect(() => {
      if (formData?.creationTime) {
        setFormData({
          values: {
            items: [
              {
                name: 'Phil',
                surname: 'Mashiane',
              },
              {
                name: 'Mazi',
                surname: 'Muhlari',
              },
              {
                name: 'Ian',
                surname: 'Houvet',
              },
            ],
          },
          mergeValues: true,
        });
      }
    }, [formData?.creationTime]);

    console.log('formData: ', formData);

    const isHidden = isComponentHidden(model);

    if (isHidden) return null;

    if (formMode !== 'designer') {
      return <ListComponentRender containerId={model.id} />;
    }

    return <ComponentsContainer containerId={model.id} itemsLimit={1} />;
  },
  settingsFormMarkup: alertSettingsForm,
  validateSettings: model => validateConfigurableComponentSettings(alertSettingsForm, model),
};

interface IListComponentRenderProps {
  containerId: string;
  value?: any[];
}

const ListComponentRender: FC<IListComponentRenderProps> = ({ containerId, value }) => {
  // const {
  //   getChildComponents,
  //   updateChildComponents,
  //   addComponent,
  //   addDataProperty,
  //   startDragging,
  //   endDragging,
  //   formMode,
  //   setFormData,
  //   formData,
  //   // type,
  // } = useForm();

  return (
    <List
      size="small"
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={['firstName', 'lastName', 'age']}
      renderItem={(_, index) => {
        console.log('List renderItem, _, index', _, index);

        return (
          <List.Item>
            <ComponentsContainer containerId={containerId} listFormComponentIndex={index} />
          </List.Item>
        );
      }}
    />
  );
};

export default ListComponent;
