import React, { FC, useReducer, useContext, PropsWithChildren, useEffect, useRef } from 'react';
import appConfiguratorReducer from './reducer';
import { AppConfiguratorActionsContext, AppConfiguratorStateContext, APP_CONTEXT_INITIAL_STATE } from './contexts';
import { ApplicationMode, IComponentSettings, IComponentSettingsDictionary } from './models';
import {
  switchApplicationModeAction,
  toggleEditModeConfirmationAction,
  toggleCloseEditModeConfirmationAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import { configurableComponentGet } from '../../apis/configurableComponent';
import { useSheshaApplication } from '../sheshaApplication';

export interface IAppConfiguratorProviderProps {}

const AppConfiguratorProvider: FC<PropsWithChildren<IAppConfiguratorProviderProps>> = ({ children }) => {
  const [state, dispatch] = useReducer(appConfiguratorReducer, {
    ...APP_CONTEXT_INITIAL_STATE,
  });

  const settingsDictionary = useRef<IComponentSettingsDictionary>({});

  const { backendUrl, httpHeaders } = useSheshaApplication();

  useEffect(() => {
    if (!document) return;

    if (state.mode === 'live') {
      document.body.classList.remove('sha-app-editmode');
    }
    if (state.mode === 'edit') {
      document.body.classList.add('sha-app-editmode');
    }
  }, [state.mode]);

  /* NEW_ACTION_DECLARATION_GOES_HERE */

  const switchApplicationMode = (mode: ApplicationMode) => {
    dispatch(switchApplicationModeAction(mode));
  };

  const toggleEditModeConfirmation = (visible: boolean) => {
    dispatch(toggleEditModeConfirmationAction(visible));
  };

  const toggleCloseEditModeConfirmation = (visible: boolean) => {
    dispatch(toggleCloseEditModeConfirmationAction(visible));
  };

  const normalizeId = (id: string) => id?.toLowerCase();

  const getSettings = (id: string) => {
    const loadedSettings = settingsDictionary.current[normalizeId(id)];
    return loadedSettings;
  };

  const fetchSettings = (id: string) => {
    const loadedSettings = getSettings(id);
    if (loadedSettings) return Promise.resolve(loadedSettings);

    const result = new Promise<IComponentSettings>((resolve, reject) => {
      configurableComponentGet({ id, base: backendUrl, headers: httpHeaders })
        .then(response => {
          if (!response.success) {
            reject(response.error);
          }

          const settings: IComponentSettings = {
            id: response.result.id,
            name: response.result.name,
            description: response.result.description,
            settings: response.result.settings ? JSON.parse(response.result.settings) : null,
          };

          settingsDictionary.current[normalizeId(id)] = settings;
          resolve(settings);
        })
        .catch(error => {
          reject(error);
        });
    });

    return result;
  };

  const invalidateSettings = (id: string) => {
    const normalizedId = normalizeId(id);
    delete settingsDictionary.current[normalizedId];
  };

  return (
    <AppConfiguratorStateContext.Provider value={state}>
      <AppConfiguratorActionsContext.Provider
        value={{
          switchApplicationMode,
          toggleEditModeConfirmation,
          toggleCloseEditModeConfirmation,
          fetchSettings,
          getSettings,
          invalidateSettings,
          /* NEW_ACTION_GOES_HERE */
        }}
      >
        {children}
      </AppConfiguratorActionsContext.Provider>
    </AppConfiguratorStateContext.Provider>
  );
};

function useAppConfiguratorState() {
  const context = useContext(AppConfiguratorStateContext);

  if (context === undefined) {
    throw new Error('useAppConfiguratorState must be used within a AppConfiguratorProvider');
  }

  return context;
}

function useAppConfiguratorActions() {
  const context = useContext(AppConfiguratorActionsContext);

  if (context === undefined) {
    throw new Error('useAppConfiguratorActions must be used within a AppConfiguratorProvider');
  }

  return context;
}

function useAppConfigurator() {
  return { ...useAppConfiguratorState(), ...useAppConfiguratorActions() };
}

export {
  AppConfiguratorProvider,
  useAppConfiguratorState,
  useAppConfiguratorActions,
  useAppConfigurator,
  ApplicationMode,
};
