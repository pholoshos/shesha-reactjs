import { ColProps } from 'antd';
import { createContext } from 'react';
import { GetDataError } from 'restful-react';
import { IConfigurableFormComponent } from '../../interfaces';
import { IFormSettings } from '../form/contexts';

export interface ISubFormStateContext {
  initialValues?: any;
  components?: IConfigurableFormComponent[];
  formSettings?: IFormSettings;
  name?: string;
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
  components: [],
  formSettings: null,
};

export const SubFormContext = createContext<ISubFormStateContext>(SUB_FORM_CONTEXT_INITIAL_STATE);

export const SubFormActionsContext = createContext<ISubFormActionsContext>(undefined);
