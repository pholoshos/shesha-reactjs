import React, { FC, useReducer, useContext, PropsWithChildren, useEffect, useMemo } from 'react';
import { uiReducer } from './reducer';
import {
  setThemeAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import { UiActionsContext, UiStateContext, THEME_CONTEXT_INITIAL_STATE, IApplicationTheme } from './contexts';
import { ConfigProvider } from 'antd';
import { THEME_CONFIG_ID } from '../../constants';
import { useConfigurableComponentGet, useConfigurableComponentUpdateSettings } from '../../apis/configurableComponent';
import { useDebouncedCallback } from 'use-debounce';

export interface ThemeProviderProps {
  prefixCls?: string;
  iconPrefixCls?: string;
  themeConfigKey?: string;
}

const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({
  children,
  iconPrefixCls,

  // TODO: Later this to be configurable so that. Currently if you change it the layout fails because the styling references the `--ant prefixCls`
  prefixCls = 'ant',
}) => {
  const [state, dispatch] = useReducer(uiReducer, THEME_CONTEXT_INITIAL_STATE);

  const { data: loadedThemeResponse, refetch } = useConfigurableComponentGet({ id: THEME_CONFIG_ID, lazy: true });
  const { mutate: saveTheme } = useConfigurableComponentUpdateSettings({ id: THEME_CONFIG_ID });

  const debouncedSave = useDebouncedCallback(themeToSave => {
    saveTheme({ id: THEME_CONFIG_ID, settings: JSON.stringify(themeToSave) });
  }, 300);

  useEffect(() => {
    refetch;
  }, []);

  const loadedTheme = useMemo(() => {
    if (!loadedThemeResponse) return THEME_CONTEXT_INITIAL_STATE.theme;
    const themeJson = JSON.parse(loadedThemeResponse.result.settings) as IApplicationTheme;

    return themeJson;
  }, [loadedThemeResponse]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    changeTheme(loadedTheme);
  }, [loadedTheme]);

  // Persist the theme
  useEffect(() => {
    // if (state && !isEqual(state?.theme, loadedTheme)) debouncedSave(state?.theme);

    ConfigProvider.config({
      prefixCls,
      theme: state?.theme?.application,
      iconPrefixCls,
    });
  }, [state?.theme]);

  // Make an API Call to fetch the theme
  const changeTheme = (theme: IApplicationTheme) => {
    dispatch(setThemeAction(theme));

    debouncedSave(theme);
  };

  /* NEW_ACTION_DECLARATION_GOES_HERE */
  return (
    <UiStateContext.Provider value={state}>
      <UiActionsContext.Provider
        value={{
          changeTheme,

          /* NEW_ACTION_GOES_HERE */
        }}
      >
        <ConfigProvider prefixCls={prefixCls}>{children}</ConfigProvider>
      </UiActionsContext.Provider>
    </UiStateContext.Provider>
  );
};

function useThemeState() {
  const context = useContext(UiStateContext);

  if (context === undefined) {
    throw new Error('useUiState must be used within a UiProvider');
  }
  return context;
}

function useThemeActions() {
  const context = useContext(UiActionsContext);

  if (context === undefined) {
    throw new Error('useUiActions must be used within a UiProvider');
  }

  return context;
}

function useTheme() {
  return { ...useThemeState(), ...useThemeActions() };
}

export { ThemeProvider, useThemeState, useThemeActions, useTheme };
