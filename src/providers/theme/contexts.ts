import { createContext } from 'react';
import { Theme } from 'antd/lib/config-provider/context';

export interface IThemeStateContext {
  readonly theme?: Theme;
}

export interface IThemeActionsContext {
  changeTheme: (theme: Theme) => void;

  /* NEW_ACTION_ACTION_DECLARATIO_GOES_HERE */
}

export const THEME_CONTEXT_INITIAL_STATE: IThemeStateContext = {
  theme: null,
};

export const UiStateContext = createContext<IThemeStateContext>(THEME_CONTEXT_INITIAL_STATE);

export const UiActionsContext = createContext<IThemeActionsContext>(undefined);
