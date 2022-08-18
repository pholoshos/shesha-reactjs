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
      id: 'Fu9-DJa-YGamqAkXBBpck',
      type: 'container',
      name: 'container1',
      label: 'Container1',
      labelAlign: 'right',
      parentId: '4M-aYa7aFRgpYvGOx2pKg',
      hidden: false,
      visibility: 'Yes',
      customVisibility: null,
      isDynamic: false,
      // @ts-ignore
      direction: 'vertical',
      justifyContent: 'left',
      components: [
        {
          textType: 'text',
          id: 'sxdo1ibINtJcnUfUk338j',
          type: 'textField',
          name: 'firstName',
          label: 'First name',
          labelAlign: 'right',
          parentId: 'Fu9-DJa-YGamqAkXBBpck',
          hidden: false,
          visibility: 'Yes',
          customVisibility: null,
          isDynamic: false,
          placeholder: '',
          description: '',
          prefix: '',
          suffix: '',
          initialValue: '',
          validate: {
            minLength: '',
            maxLength: '',
            message: '',
          },
          quickviewWidth: '',
          settingsValidationErrors: [],
        },
        {
          textType: 'text',
          id: '49TKeIR9_KTB_dOUgxdmz',
          type: 'textField',
          name: 'lastName',
          label: 'Surname',
          labelAlign: 'right',
          parentId: 'Fu9-DJa-YGamqAkXBBpck',
          hidden: false,
          visibility: 'Yes',
          customVisibility: null,
          isDynamic: false,
          placeholder: '',
          description: '',
          prefix: '',
          suffix: '',
          initialValue: '',
          validate: {
            minLength: '',
            maxLength: '',
            message: '',
          },
          quickviewWidth: '',
          settingsValidationErrors: [],
        },
        {
          textType: 'text',
          id: '0-ooh94_81VdtTeDPL1rX',
          type: 'textField',
          name: 'emailAddress',
          label: 'Email Address',
          labelAlign: 'right',
          parentId: 'Fu9-DJa-YGamqAkXBBpck',
          hidden: false,
          visibility: 'Yes',
          customVisibility: null,
          isDynamic: false,
          placeholder: '',
          description: '',
          prefix: '',
          suffix: '',
          initialValue: '',
          validate: {
            minLength: '',
            maxLength: '',
            message: '',
          },
          quickviewWidth: '',
          settingsValidationErrors: [],
        },
      ],
    },
  ],
};

export const SubFormContext = createContext<ISubFormStateContext>(SUB_FORM_CONTEXT_INITIAL_STATE);

export const SubFormActionsContext = createContext<ISubFormActionsContext>(undefined);
