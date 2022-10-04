import { createContext } from 'react';
import { IConfigurableActionArguments, IConfigurableActionConfiguration, IConfigurableActionDescriptor } from '../../interfaces/configurableAction';
import { GenericDictionary } from '../form/models';
import { IConfigurableActionDictionary } from './models';

export interface IConfigurableActionDispatcherStateContext {
}

export interface IGetConfigurableActionPayload {
  owner: string;
  name: string;
}

export interface IExecuteActionPayload {
  actionConfiguration: IConfigurableActionConfiguration;
  argumentsEvaluationContext: GenericDictionary;
}

export interface IRegisterActionPayload<TArguments = IConfigurableActionArguments, TReponse = any> extends IConfigurableActionDescriptor<TArguments, TReponse> {
}

export interface RegisterActionType {
  <TArguments = IConfigurableActionArguments, TResponse = any>(arg: IRegisterActionPayload<TArguments, TResponse>): void;
}


export interface IConfigurableActionDispatcherActionsContext {
  getConfigurableAction: (payload: IGetConfigurableActionPayload) => IConfigurableActionDescriptor;
  getActions: () => IConfigurableActionDictionary;
  registerAction: RegisterActionType;//(payload: IRegisterActionPayload) => void;
  prepareArguments: (actionArguments: any) => void;
  executeAction: (payload: IExecuteActionPayload) => Promise<void>;
}

/** initial state */
export const CONFIGURABLE_ACTION_DISPATCHER_CONTEXT_INITIAL_STATE: IConfigurableActionDispatcherStateContext = {
};

export const ConfigurableActionDispatcherStateContext = createContext<IConfigurableActionDispatcherStateContext>(CONFIGURABLE_ACTION_DISPATCHER_CONTEXT_INITIAL_STATE);

export const ConfigurableActionDispatcherActionsContext = createContext<IConfigurableActionDispatcherActionsContext>(undefined);