import { createAction } from 'redux-actions';
import { ISubFormStateContext } from './contexts';

export enum ThemeActionEnums {
  SetTheme = 'SET_THEME',
  /* NEW_ACTION_TYPE_GOES_HERE */
}

export const setThemeAction = createAction<ISubFormStateContext>(ThemeActionEnums.SetTheme, () => ({}));

/* NEW_ACTION_GOES_HERE */
