import { createContext } from 'react';
import { IReferenceList } from '../../interfaces/referenceList';
import { PromisedValue } from '../../utils/promises';
import { ConfigurationItemsViewMode } from '../appConfigurator/models';
import { FormIdentifier, IFormDto } from '../form/models';
import { IReferenceListIdentifier } from '../referenceListDispatcher/models';

export interface IConfigurationItemsLoaderStateContext {
  activeProvider?: string;
}

export interface IGetFormPayload {
  formId: FormIdentifier;
  configurationItemMode?: ConfigurationItemsViewMode;
  skipCache: boolean;
}

export interface IGetRefListPayload {
  refListId: IReferenceListIdentifier;
  configurationItemMode?: ConfigurationItemsViewMode;
  skipCache: boolean;
}

export interface IClearItemCachePayload {
  formId: FormIdentifier;
}

export interface IConfigurationItemsLoaderActionsContext {
  getForm: (payload: IGetFormPayload) => Promise<IFormDto>;
  getRefList: (payload: IGetRefListPayload) => PromisedValue<IReferenceList>;
  clearItemCache: (payload: IClearItemCachePayload) => void;
}

/** initial state */
export const CONFIGURATION_ITEMS_LOADER_CONTEXT_INITIAL_STATE: IConfigurationItemsLoaderStateContext = {
};

export const ConfigurationItemsLoaderStateContext = createContext<IConfigurationItemsLoaderStateContext>(CONFIGURATION_ITEMS_LOADER_CONTEXT_INITIAL_STATE);

export const ConfigurationItemsLoaderActionsContext = createContext<IConfigurationItemsLoaderActionsContext>(undefined);