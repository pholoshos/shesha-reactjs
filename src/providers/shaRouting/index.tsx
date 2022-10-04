import React, { FC, useReducer, useContext, PropsWithChildren, useEffect } from 'react';
import { shaRoutingReducer } from './reducer';
import { ShaRoutingActionsContext, ShaRoutingStateContext, SHA_ROUTING_CONTEXT_INITIAL_STATE } from './contexts';
import { getFlagSetters } from '../utils/flagsSetters';
import { Router } from 'next/router';
import { useConfigurableActionDispatcher } from '../configurableActionsDispatcher';
import { navigateArgumentsForm } from './actions/navigate-arguments';

export interface IRoutingProviderProvider {
  router: Router;
}

interface INavigateActoinArguments {
  target: string;
}

const ShaRoutingProvider: FC<PropsWithChildren<any>> = ({ children, router }) => {
  const [state, dispatch] = useReducer(shaRoutingReducer, { ...SHA_ROUTING_CONTEXT_INITIAL_STATE, router });
  const { registerAction } = useConfigurableActionDispatcher();
  
  /* NEW_ACTION_DECLARATION_GOES_HERE */
  const goingToRoute = (route: string) => {
    state?.router?.push(route);
  };

  useEffect(() => {
    console.log('register navigate action', { router, stateRoute: state.router })
    registerAction<INavigateActoinArguments>({
      name: 'Navigate',
      owner: 'Common',
      hasArguments: true,
      executer: (request) => {
        console.log('execute navigate', request)
        return state?.router
          ? state?.router?.push(request.target)
          : Promise.reject('Router is not available');
      },
      argumentsFormMarkup: navigateArgumentsForm
    });
  }, [state, state?.router]);

  return (
    <ShaRoutingStateContext.Provider value={state}>
      <ShaRoutingActionsContext.Provider
        value={{
          ...getFlagSetters(dispatch),
          goingToRoute,
        }}
      >
        {children}
      </ShaRoutingActionsContext.Provider>
    </ShaRoutingStateContext.Provider>
  );
};

function useShaRoutingState(require: boolean = true) {
  const context = useContext(ShaRoutingStateContext);

  if (require && context === undefined) {
    throw new Error('useShaRoutingState must be used within a ShaRoutingProvider');
  }

  return context;
}

function useShaRoutingActions(require: boolean = true) {
  const context = useContext(ShaRoutingActionsContext);

  if (require && context === undefined) {
    throw new Error('useShaRoutingActions must be used within a ShaRoutingProvider');
  }

  return context;
}

function useShaRouting(require: boolean = true) {
  const actionsContext = useShaRoutingActions(require);
  const stateContext = useShaRoutingState(require);

  // useContext() returns initial state when provider is missing
  // initial context state is useless especially when require == true
  // so we must return value only when both context are available
  return actionsContext !== undefined && stateContext !== undefined
    ? { ...actionsContext, ...stateContext }
    : undefined;
}

export default ShaRoutingProvider;

export { ShaRoutingProvider, useShaRoutingState, useShaRoutingActions, useShaRouting };
