import { ColProps } from 'antd';
import { createContext } from 'react';
import { GetDataError } from 'restful-react';
import { IConfigurableFormComponent } from '../../interfaces';

export interface ISubFormStateContext {
  initialValues?: any;
  prefixName?: string;
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
  layout?: {
    labelCol?: ColProps;
    wrapperCol?: ColProps;
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
};

export const SubFormContext = createContext<ISubFormStateContext>(SUB_FORM_CONTEXT_INITIAL_STATE);

export const SubFormActionsContext = createContext<ISubFormActionsContext>(undefined);
