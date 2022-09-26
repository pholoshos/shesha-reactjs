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

const ShaApplicationProvider: FC<PropsWithChildren<IShaApplicationProviderProps>> = ({
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
}) => {
  const [state, dispatch] = useReducer(appConfiguratorReducer, {
    ...SHESHA_APPLICATION_CONTEXT_INITIAL_STATE,
    routes: routes ?? DEFAULT_SHESHA_ROUTES,
    backendUrl,
    applicationName,
    toolboxComponentGroups,
  });

  const onSetRequestHeaders = (headers: IRequestHeaders) => {
    dispatch(setHeadersAction(headers));
  };

  const changeBackendUrl = (newBackendUrl: string) => {
    dispatch(setBackendUrlAction(newBackendUrl));
  };

  return (
    <SheshaApplicationStateContext.Provider value={state}>
      <SheshaApplicationActionsContext.Provider
        value={{
          changeBackendUrl,
        }}
      >
        <RestfulProvider
          base={state.backendUrl}
          requestOptions={{
            headers: state.httpHeaders,
          }}
        >
          <UiProvider>
            <ThemeProvider {...(themeProps || {})}>
              <ShaRoutingProvider router={router}>
                <AuthProvider
                  tokenName={accessTokenName || DEFAULT_ACCESS_TOKEN_NAME}
                  onSetRequestHeaders={onSetRequestHeaders}
                  unauthorizedRedirectUrl={unauthorizedRedirectUrl}
                  whitelistUrls={whitelistUrls}
                >
                  <AuthorizationSettingsProvider>
                    <AppConfiguratorProvider>
                      <ReferenceListDispatcherProvider>
                        <MetadataDispatcherProvider>
                          <DynamicModalProvider>{children}</DynamicModalProvider>
                        </MetadataDispatcherProvider>
                      </ReferenceListDispatcherProvider>
                    </AppConfiguratorProvider>
                  </AuthorizationSettingsProvider>
                </AuthProvider>
              </ShaRoutingProvider>
            </ThemeProvider>
          </UiProvider>
        </RestfulProvider>
      </SheshaApplicationActionsContext.Provider>
    </SheshaApplicationStateContext.Provider>
  );
};

function useSheshaApplication(require: boolean = true) {
  const context = useContext(SheshaApplicationStateContext);

  if (context === undefined && !require) {
    throw new Error('useSheshaApplication must be used within a SheshaApplicationStateContext');
  }

  return context;
}

export { ShaApplicationProvider, useSheshaApplication };
