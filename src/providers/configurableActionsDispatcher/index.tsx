import React, { FC, useContext, PropsWithChildren, useRef } from 'react';
import metadataReducer from './reducer';
import {
  ConfigurableActionDispatcherActionsContext,
  ConfigurableActionDispatcherStateContext,
  CONFIGURABLE_ACTION_DISPATCHER_CONTEXT_INITIAL_STATE,
  IConfigurableActionDispatcherStateContext,
  IConfigurableActionDispatcherActionsContext,
  IGetConfigurableActionPayload,
  IRegisterActionPayload,
  IExecuteActionPayload,
} from './contexts';
import useThunkReducer from 'react-hook-thunk-reducer';
import { IConfigurableActionDictionary } from './models';
import { IConfigurableActionDescriptor } from '../../interfaces/configurableAction';
import { genericActionArgumentsEvaluator } from '../form/utils';

export interface IConfigurableActionDispatcherProviderProps { }

const ConfigurableActionDispatcherProvider: FC<PropsWithChildren<IConfigurableActionDispatcherProviderProps>> = ({ children }) => {
  const initial: IConfigurableActionDispatcherStateContext = {
    ...CONFIGURABLE_ACTION_DISPATCHER_CONTEXT_INITIAL_STATE,
  };

  const actions = useRef<IConfigurableActionDictionary>({});

  const [state, _dispatch] = useThunkReducer(metadataReducer, initial);

  const getConfigurableAction = (payload: IGetConfigurableActionPayload): IConfigurableActionDescriptor => {
    const { owner, name } = payload;

    if (!owner || !name) {
      console.error("Owner and action name must be specified");
      return null;
    }

    // todo: search action in the dictionary and return action
    const ownerActions = actions.current[owner];
    if (!ownerActions)
      throw `Action owner '${owner}' not found.`;

    const action = ownerActions.find(a => a.name === name);
    if (!action)
      throw `Action '${name}' in the owner '${owner}' not found.`;

    return action;
  };

  const getActions = () => {
    return actions.current;
  }

  const registerAction = (payload: IRegisterActionPayload) => {
    //console.log('registerAction')
    const ownerActions = actions.current[payload.owner] ?? [];
    const newActions = ownerActions.filter(action => action.name !== payload.name);
    newActions.push(payload);

    actions.current = { ...actions.current, [payload.owner]: newActions };
  };

  const prepareArguments =  (_actionArguments: any) => {

  }

  const executeAction = (payload: IExecuteActionPayload) => {
    const { actionConfiguration, argumentsEvaluationContext } = payload;
    if (!actionConfiguration)
      return Promise.reject('Action configuration is mandatory');
    const { actionOwner, actionName, actionArguments, handleSuccess, onSuccess, handleFail, onFail } = actionConfiguration;
    if (!actionName)
      return Promise.reject('Action name is mandatory');
    
    const action = getConfigurableAction({ owner: actionOwner, name: actionName });
    if (!action)
      return Promise.reject(`Action '${actionOwner}:${actionName}' not found`);

    const argumentsEvaluator = action.evaluateArguments ?? genericActionArgumentsEvaluator;

    console.log('evaluate action arguments', { actionArguments, argumentsEvaluationContext })
    return argumentsEvaluator(actionArguments, argumentsEvaluationContext) //getFormActionArguments(actionArguments, argumentsEvaluationContext)
      .then(preparedActionArguments => {
        console.log('preparedActionArguments', preparedActionArguments);
        return action.executer(preparedActionArguments, argumentsEvaluationContext)
        .then(actionResponse => {
          console.log(`Action '${actionOwner}:${actionName}' executed successfully, response:`, actionResponse);
          if (handleSuccess){
            if (onSuccess){
              const onSuccessContext = { ...argumentsEvaluationContext, actionResponse: actionResponse };
              executeAction({ actionConfiguration: onSuccess, argumentsEvaluationContext: onSuccessContext });
            } else
              console.warn(`onSuccess handled is not defined for action '${actionOwner}:${actionName}'`);
          }
        })
        .catch(error => {
          console.error(`Failed to execute action '${actionOwner}:${actionName}', error:`, error);
          if (handleFail){
            if (onFail){
              const onFailContext = { ...argumentsEvaluationContext, actionError: error };
              executeAction({ actionConfiguration: onFail, argumentsEvaluationContext: onFailContext });
            } else
              console.warn(`onSuccess handled is not defined for action '${actionOwner}:${actionName}'`);
            }
        });
      });
  };

  const configurableActionActions: IConfigurableActionDispatcherActionsContext = {
    registerAction,
    getConfigurableAction,
    getActions,
    prepareArguments,
    executeAction,
  };

  return (
    <ConfigurableActionDispatcherStateContext.Provider value={state}>
      <ConfigurableActionDispatcherActionsContext.Provider value={configurableActionActions}>
        {children}
      </ConfigurableActionDispatcherActionsContext.Provider>
    </ConfigurableActionDispatcherStateContext.Provider>
  );
};

function useConfigurableActionDispatcherState(require: boolean) {
  const context = useContext(ConfigurableActionDispatcherStateContext);

  if (context === undefined && require) {
    throw new Error('useConfigurableActionDispatcherState must be used within a ConfigurableActionDispatcherProvider');
  }

  return context;
}

function useConfigurableActionDispatcherActions(require: boolean) {
  const context = useContext(ConfigurableActionDispatcherActionsContext);

  if (context === undefined && require) {
    throw new Error('useConfigurableActionDispatcherActions must be used within a ConfigurableActionDispatcherProvider');
  }

  return context;
}

function useConfigurableActionDispatcher(require: boolean = true) {
  const actionsContext = useConfigurableActionDispatcherActions(require);
  const stateContext = useConfigurableActionDispatcherState(require);

  // useContext() returns initial state when provider is missing
  // initial context state is useless especially when require == true
  // so we must return value only when both context are available
  return actionsContext !== undefined && stateContext !== undefined
    ? { ...actionsContext, ...stateContext }
    : undefined;
}

/*
const useConfigurableAction = (owner: string, name: string): ILoadingState<IConfigurableAction> => {
  console.log()
}
*/

export {
  ConfigurableActionDispatcherProvider,
  useConfigurableActionDispatcher,
  //useConfigurableAction
};
