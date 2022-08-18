import { createContext } from 'react';

export interface ISubFormStateContext {
  items?: any[];
  errors?: {
    get: any;
    post: any;
  };
}

export interface ISubFormActionsContext {
  get: () => void;
  post: () => void;
  put: () => void;
  delete: () => void;
}

export const THEME_CONTEXT_INITIAL_STATE: ISubFormStateContext = { items: [] };

export const SubFormContext = createContext<ISubFormStateContext>(THEME_CONTEXT_INITIAL_STATE);

export const SubFormActionsContext = createContext<ISubFormActionsContext>(undefined);
