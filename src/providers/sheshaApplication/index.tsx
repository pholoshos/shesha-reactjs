import React, { FC, useReducer, useContext, PropsWithChildren } from 'react';
import appConfiguratorReducer from './reducer';
import {
  DEFAULT_ACCESS_TOKEN_NAME,
  DEFAULT_SHESHA_ROUTES,
  ISheshaRutes,
  SheshaApplicationActionsContext,
  SheshaApplicationStateContext,
  SHESHA_APPLICATION_CONTEXT_INITIAL_STATE,
} from './contexts';
import { RestfulProvider } from 'restful-react';
import IRequestHeaders from '../../interfaces/requestHeaders';
import { setBackendUrlAction, setHeadersAction } from './actions';
import { Router } from 'next/router';

import AuthProvider from '../auth';
import AuthorizationSettingsProvider from '../authorizationSettings';
import ShaRoutingProvider from '../shaRouting';
import { AppConfiguratorProvider } from '../appConfigurator';
import { DynamicModalProvider } from '../dynamicModal';
import { UiProvider } from '../ui';
import { MetadataDispatcherProvider } from '../metadataDispatcher';
import { IToolboxComponentGroup, ThemeProvider, ThemeProviderProps } from '../..';
import { ReferenceListDispatcherProvider } from '../referenceListDispatcher';
import { StackedNavigationProvider } from '../../pages/dynamic/navigation/stakedNavigation';
import { ConfigurableActionDispatcherConsumer, ConfigurableActionDispatcherProvider } from '../configurableActionsDispatcher';
import { IConfigurableActionDispatcherActionsContext } from '../configurableActionsDispatcher/contexts';
import { executeScriptArgumentsForm, IExecuteScriptArguments } from './configurable-actions/execute-script';
import { executeScript } from '../form/utils';
import { SheshaActionOwners } from '../configurableActionsDispatcher/models';

export interface IShaApplicationProviderProps {
  backendUrl: string;
  applicationName?: string;
  accessTokenName?: string;
  router?: Router; // todo: replace with IRouter
  toolboxComponentGroups?: IToolboxComponentGroup[];
  unauthorizedRedirectUrl?: string;
  whitelistUrls?: string[];
  themeProps?: ThemeProviderProps;
  routes?: ISheshaRutes;
}

const ShaApplicationProvider: FC<PropsWithChildren<IShaApplicationProviderProps>> = (props) => {
  const {
    children,
    backendUrl,
    applicationName,
    accessTokenName,
    router,
    toolboxComponentGroups = [],
    unauthorizedRedirectUrl,
    whitelistUrls,
    themeProps,
    routes,
  } = props;
  const [state, dispatch] = useReducer(appConfiguratorReducer, {
    ...SHESHA_APPLICATION_CONTEXT_INITIAL_STATE,
    routes: routes ?? DEFAULT_SHESHA_ROUTES,
    backendUrl,
    applicationName,
    toolboxComponentGroups,
  });

  const setRequestHeaders = (headers: IRequestHeaders) => {
    dispatch(setHeadersAction(headers));
  };

  const changeBackendUrl = (newBackendUrl: string) => {
    dispatch(setBackendUrlAction(newBackendUrl));
  };

  const registerSystemActions = (dispatcherContext: IConfigurableActionDispatcherActionsContext) => {
    dispatcherContext.registerAction<IExecuteScriptArguments>({
      owner: 'Common',
      ownerUid: SheshaActionOwners.Common,
      name: 'Execute Script',
      hasArguments: true,
      argumentsFormMarkup: executeScriptArgumentsForm,
      executer: (actionArgs, context) => {
        if (!actionArgs.expression)
          return Promise.reject('Expected expression to be defined but it was found to be empty.');

        console.log('context is: ', context);

        return executeScript(actionArgs.expression, context);
      }
    });
  }

  return (
    <SheshaApplicationStateContext.Provider value={state}>
      <SheshaApplicationActionsContext.Provider
        value={{
          changeBackendUrl,
          setRequestHeaders,
        }}
      >
        <RestfulProvider
          base={state.backendUrl}
          requestOptions={{
            headers: state.httpHeaders,
          }}
        >
          <ConfigurableActionDispatcherProvider>
            <UiProvider>
              <ThemeProvider {...(themeProps || {})}>
                <ShaRoutingProvider router={router}>
                  <AuthProvider
                    tokenName={accessTokenName || DEFAULT_ACCESS_TOKEN_NAME}
                    onSetRequestHeaders={setRequestHeaders}
                    unauthorizedRedirectUrl={unauthorizedRedirectUrl}
                    whitelistUrls={whitelistUrls}
                  >
                    <AuthorizationSettingsProvider>
                      <AppConfiguratorProvider>
                        <ReferenceListDispatcherProvider>
                          <MetadataDispatcherProvider>
                           <StackedNavigationProvider>
                            <DynamicModalProvider>
                              <ConfigurableActionDispatcherConsumer>
                                {configurableActions => {
                                  registerSystemActions(configurableActions);
                                  return <>{children}</>
                                }}
                              </ConfigurableActionDispatcherConsumer>
                            </DynamicModalProvider>
                          </StackedNavigationProvider>
                          </MetadataDispatcherProvider>
                        </ReferenceListDispatcherProvider>
                      </AppConfiguratorProvider>
                    </AuthorizationSettingsProvider>
                  </AuthProvider>
                </ShaRoutingProvider>
              </ThemeProvider>
            </UiProvider>
          </ConfigurableActionDispatcherProvider>
        </RestfulProvider>
      </SheshaApplicationActionsContext.Provider>
    </SheshaApplicationStateContext.Provider>
  );
};

function useSheshaApplication(require: boolean = true) {
  const stateContext = useContext(SheshaApplicationStateContext);
  const actionsContext = useContext(SheshaApplicationActionsContext);

  if (require && (stateContext === undefined || actionsContext === undefined)) {
    throw new Error('useSheshaApplication must be used within a SheshaApplicationStateContext');
  }

  return { ...stateContext, ...actionsContext };
}

export { ShaApplicationProvider, useSheshaApplication };