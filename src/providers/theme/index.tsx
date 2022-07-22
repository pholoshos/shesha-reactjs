import React, { FC, useReducer, useContext, PropsWithChildren, useEffect } from 'react';
import { uiReducer } from './reducer';
import {
  setThemeAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import { UiActionsContext, UiStateContext, THEME_CONTEXT_INITIAL_STATE } from './contexts';
import { ConfigProvider } from 'antd';
import { useLocalStorage } from 'react-use';
import { THEME_CONFIG_KEY } from '../../constants';
import { Theme } from 'antd/lib/config-provider/context';
import { isEqual } from 'lodash';

export interface ThemeProviderProps {
  prefixCls?: string;
  iconPrefixCls?: string;
  themeConfigKey?: string;
}

const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({
  children,
  iconPrefixCls,
  themeConfigKey = THEME_CONFIG_KEY,

  // TODO: Later this to be configurable so that. Currently if you change it the layout fails because the styling references the `--ant prefixCls`
  prefixCls = 'ant', 
}) => {
  const [state, dispatch] = useReducer(uiReducer, THEME_CONTEXT_INITIAL_STATE);

  const [persistedTheme, setPersistedTheme] = useLocalStorage<Theme>(themeConfigKey);

  // Set the theme to the store if not set
  useEffect(() => {
    if (!state?.theme) {
      changeTheme(persistedTheme);
    }
  }, [persistedTheme]);

  // Persist the theme
  useEffect(() => {
    if (state && !isEqual(state?.theme, persistedTheme)) {
      setPersistedTheme(state?.theme);
    }

    ConfigProvider.config({
      prefixCls,
      theme: state?.theme,
      iconPrefixCls,
    });
  }, [state?.theme]);

  // Make an API Call to fetch the theme
  const changeTheme = (theme: Theme) => {
    dispatch(setThemeAction(theme));
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
