import { createContext } from 'react';
import { ConfigurationItemsViewMode } from '../appConfigurator/models';
import { FormFullName, FormIdentifier, IFormDto } from '../form/models';

export interface IConfigurationItemsLoaderStateContext {
  activeProvider?: string;
}

export interface IGetFormPayload {
  formId: FormIdentifier;
  configurationItemMode?: ConfigurationItemsViewMode;
  skipCache: boolean;
}

export interface IClearItemCachePayload {
  formId: FormIdentifier;
}

export interface IConfigurationItemsLoaderActionsContext {
  getForm: (payload: IGetFormPayload) => Promise<IFormDto>;
  clearItemCache: (payload: IClearItemCachePayload) => void;
  getEntityFormId: (className: string, formType: string, action: (formId: FormFullName) => void) => void;
}

/** initial state */
export const CONFIGURATION_ITEMS_LOADER_CONTEXT_INITIAL_STATE: IConfigurationItemsLoaderStateContext = {
};

export const ConfigurationItemsLoaderStateContext = createContext<IConfigurationItemsLoaderStateContext>(CONFIGURATION_ITEMS_LOADER_CONTEXT_INITIAL_STATE);

export const ConfigurationItemsLoaderActionsContext = createContext<IConfigurationItemsLoaderActionsContext>(undefined);