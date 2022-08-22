import { createContext } from 'react';
import { GetDataError } from 'restful-react';
import { IConfigurableFormComponent } from '../../../../../interfaces';

export interface ISubFormStateContext {
  items?: any[];
  components?: IConfigurableFormComponent[];
  errors?: {
    getData?: GetDataError<unknown>;
    getForm?: GetDataError<unknown>;
    postData?: GetDataError<unknown>;
    putData?: GetDataError<unknown>;
    deleteData?: GetDataError<unknown>;
  };
  loading?: {
    getData?: boolean;
    getForm?: boolean;
    postData?: boolean;
    putData?: boolean;
    deleteData?: boolean;
  };
}

export interface ISubFormActionsContext {
  getData?: () => void;
  postData?: () => void;
  putData?: () => void;
  deleteData?: () => void;
}

export const SUB_FORM_CONTEXT_INITIAL_STATE: ISubFormStateContext = {
  items: [],
  components: [
    {
      id: 'su3HqOLGDavNea8OugP7n',
      type: 'collapsiblePanel',
      name: 'collapsiblePanel1',
      label: 'Collapsible Panel1',
      labelAlign: 'right',
      parentId: 'root',
      hidden: false,
      visibility: 'Yes',
      customVisibility: null,
      isDynamic: false,
      expandIconPosition: 'right',
      components: [
        {
          id: 'TmCfyWmkNHZ0WdzjPIN1S',
          type: 'dateField',
          name: 'dateOfBirth',
          label: 'Date Of Birth',
          labelAlign: 'right',
          hidden: false,
          visibility: 'Yes',
          customVisibility: null,
          isDynamic: false,
          picker: 'date',
          showTime: false,
          dateFormat: 'DD/MM/YYYY',
          timeFormat: 'HH:mm:ss',
          defaultToMidnight: true,
          parentId: 'su3HqOLGDavNea8OugP7n',
        },
        {
          id: '-T0HG4CqnxqfhFT9ayone',
          type: 'radio',
          name: 'preferredLanguages',
          label: 'Preferred Languages',
          labelAlign: 'right',
          hidden: false,
          visibility: 'Yes',
          customVisibility: null,
          isDynamic: false,
          dataSourceType: 'values',
          direction: 'horizontal',
          parentId: 'su3HqOLGDavNea8OugP7n',
        },
        {
          textType: 'text',
          id: 'anDPBsCCjwy097JRTjR5t',
          type: 'textField',
          name: 'emailAddress1',
          label: 'Email Address',
          labelAlign: 'right',
          hidden: false,
          visibility: 'Yes',
          customVisibility: null,
          isDynamic: false,
          maxLength: null,
          parentId: 'su3HqOLGDavNea8OugP7n',
        },
        {
          textType: 'text',
          id: '6cyM28a168h1B27_2xnQS',
          type: 'textField',
          name: 'identityNumber',
          label: 'Identity Number',
          labelAlign: 'right',
          hidden: false,
          visibility: 'Yes',
          customVisibility: null,
          isDynamic: false,
          maxLength: null,
          parentId: 'su3HqOLGDavNea8OugP7n',
        },
        {
          id: 'D20sacFrJUjmyV95vX4Q8',
          type: 'checkboxGroup',
          name: 'title',
          label: 'Title',
          labelAlign: 'right',
          hidden: false,
          visibility: 'Yes',
          customVisibility: null,
          isDynamic: false,
          dataSourceType: 'referenceList',
          direction: 'horizontal',
          mode: 'single',
          referenceListNamespace: 'Shesha.Core',
          referenceListName: 'PersonTitles',
          parentId: 'su3HqOLGDavNea8OugP7n',
        },
        {
          id: 'zoiDin_hrXbLf3VCDHGG1',
          type: 'checkboxGroup',
          name: 'gender',
          label: 'Gender',
          labelAlign: 'right',
          hidden: false,
          visibility: 'Yes',
          customVisibility: null,
          isDynamic: false,
          dataSourceType: 'referenceList',
          direction: 'horizontal',
          mode: 'single',
          referenceListNamespace: 'Shesha.Core',
          referenceListName: 'Gender',
          parentId: 'su3HqOLGDavNea8OugP7n',
        },
      ],
    },
    {
      textType: 'text',
      id: 'CE6baRHcDr3sTl4nTBYtC',
      type: 'textField',
      name: 'emailAddress2',
      label: 'Alternative Email Address',
      labelAlign: 'right',
      hidden: false,
      visibility: 'Yes',
      customVisibility: null,
      isDynamic: false,
      maxLength: null,
      parentId: 'root',
    },
    {
      textType: 'text',
      id: 'F7WYMNNiXAeB4HFQosetW',
      type: 'textField',
      name: 'fullName',
      label: 'Full Name',
      labelAlign: 'right',
      hidden: false,
      visibility: 'Yes',
      customVisibility: null,
      isDynamic: false,
      maxLength: null,
      parentId: 'root',
    },
    {
      textType: 'text',
      id: 'n5zDu_cDP9FVQfuPgn79p',
      type: 'textField',
      name: 'firstName',
      label: 'First Name',
      labelAlign: 'right',
      hidden: false,
      visibility: 'Yes',
      customVisibility: null,
      isDynamic: false,
      maxLength: null,
      parentId: 'root',
    },
    {
      id: 'YyxedepXwcHw5tpw-MERX',
      type: 'radio',
      name: 'preferredLanguages',
      label: 'Preferred Languages',
      labelAlign: 'right',
      hidden: false,
      visibility: 'Yes',
      customVisibility: null,
      isDynamic: false,
      dataSourceType: 'values',
      direction: 'horizontal',
      parentId: 'root',
    },
    {
      textType: 'text',
      id: 'kWJtrw_aOUi-yCxqzZ3ZH',
      type: 'textField',
      name: 'customShortName',
      label: 'Custom Short Name',
      labelAlign: 'right',
      hidden: false,
      visibility: 'Yes',
      customVisibility: null,
      isDynamic: false,
      maxLength: null,
      parentId: 'root',
    },
    {
      textType: 'text',
      id: 'wSbN2Kt94sXrkGmj4ar9c',
      type: 'textField',
      name: 'homeNumber',
      label: 'Home Number',
      labelAlign: 'right',
      hidden: false,
      visibility: 'Yes',
      customVisibility: null,
      isDynamic: false,
      maxLength: null,
      parentId: 'root',
    },
    {
      id: 't2jI2DMF5OKcD5jKMynbd',
      type: 'autocomplete',
      name: 'photo',
      label: 'Photo',
      labelAlign: 'right',
      hidden: false,
      visibility: 'Yes',
      customVisibility: null,
      isDynamic: false,
      dataSourceType: 'entitiesList',
      useRawValues: true,
      entityTypeShortAlias: 'Shesha.Framework.StoredFile',
      parentId: 'root',
    },
    {
      textType: 'text',
      id: 'fTrzkH0cEYjvFoQqrT5rX',
      type: 'textField',
      name: 'emailAddress1',
      label: 'Email Address',
      labelAlign: 'right',
      hidden: false,
      visibility: 'Yes',
      customVisibility: null,
      isDynamic: false,
      maxLength: null,
      parentId: 'root',
    },
  ],
};

export const SubFormContext = createContext<ISubFormStateContext>(SUB_FORM_CONTEXT_INITIAL_STATE);

export const SubFormActionsContext = createContext<ISubFormActionsContext>(undefined);
