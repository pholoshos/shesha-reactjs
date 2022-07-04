import { Theme } from 'antd/lib/config-provider/context';
import { createAction } from 'redux-actions';
import { IThemeStateContext } from './contexts';

export enum ThemeActionEnums {
  SetTheme = 'SET_THEME',
  /* NEW_ACTION_TYPE_GOES_HERE */
}

export const setThemeAction = createAction<IThemeStateContext, Theme>(ThemeActionEnums.SetTheme, theme => ({
  theme,
}));

/* NEW_ACTION_GOES_HERE */
