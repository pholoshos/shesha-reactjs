import { createContext } from 'react';
import { FormIdentifier, IFormDto } from '../form/models';

export interface IConfigurationItemsLoaderStateContext {
  activeProvider?: string;
}

export interface IGetFormPayload {
  formId: FormIdentifier;
}

export interface IConfigurationItemsLoaderActionsContext {
  getForm: (payload: IGetFormPayload) => Promise<IFormDto>;
}

/** initial state */
export const CONFIGURATION_ITEMS_LOADER_CONTEXT_INITIAL_STATE: IConfigurationItemsLoaderStateContext = {
};

export const ConfigurationItemsLoaderStateContext = createContext<IConfigurationItemsLoaderStateContext>(CONFIGURATION_ITEMS_LOADER_CONTEXT_INITIAL_STATE);

export const ConfigurationItemsLoaderActionsContext = createContext<IConfigurationItemsLoaderActionsContext>(undefined);