import React from 'react';
import { IToolboxComponent } from '../../../../interfaces';
import { OrderedListOutlined } from '@ant-design/icons';
import { validateConfigurableComponentSettings } from '../../../../providers/form/utils';
import { useForm, useFormItem } from '../../../../providers';
import { listSettingsForm } from './settings';
import ConfigurableFormItem from '../formItem';
import './styles/index.less';
import { ListControlSettings } from './settingsv2';
import { IListComponentProps, IListItemsProps } from './models';
import { nanoid } from 'nanoid';
import ListControl from './listControl';

const ListComponent: IToolboxComponent<IListComponentProps> = {
  type: 'list',
  name: 'List',
  icon: <OrderedListOutlined />,
  factory: ({ ...model }: IListComponentProps) => {
    const { isComponentHidden } = useForm();

    const isHidden = isComponentHidden(model);

    const { namePrefix } = useFormItem();

    if (isHidden) return null;

    return (
      <ConfigurableFormItem
        model={{ ...model }}
        className="sha-list-component"
        labelCol={{ span: model?.hideLabel ? 0 : model?.labelCol }}
        wrapperCol={{ span: model?.hideLabel ? 24 : model?.wrapperCol }}
      >
        <ListControl {...model} containerId={model?.id} namePrefix={namePrefix || ''} />
      </ConfigurableFormItem>
    );
  },
  // settingsFormMarkup: listSettingsForm,
  settingsFormFactory: ({ model, onSave, onCancel, onValuesChange }) => {
    return (
      <ListControlSettings
        model={(model as unknown) as IListItemsProps}
        onSave={onSave as any}
        onCancel={onCancel}
        onValuesChange={onValuesChange as any}
      />
    );
  },
  initModel: model => {
    const uniqueStateId = `FORM_LIST_${nanoid()}`;

    const customProps: IListComponentProps = {
      ...model,
      showPagination: true,
      hideLabel: true,
      uniqueStateId,
      labelCol: 5,
      wrapperCol: 13,
      selectionMode: 'single',
      deleteConfirmMessage: 'Are you sure you want to delete this item? Please note this action cannot be reversed',
      buttons: [
        {
          id: nanoid(),
          itemType: 'item',
          sortOrder: 0,
          name: 'button1',
          label: ' ',
          itemSubType: 'button',
          uniqueStateId,
          buttonAction: 'dispatchAnEvent',
          eventName: 'refreshListItems',
          chosen: false,
          selected: false,
          icon: 'ReloadOutlined',
          buttonType: 'link',
        },
      ],
    };
    return customProps;
  },
  validateSettings: model => validateConfigurableComponentSettings(listSettingsForm, model),
};

export default ListComponent;
