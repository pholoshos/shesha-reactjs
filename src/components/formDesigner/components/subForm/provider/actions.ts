import { createAction } from 'redux-actions';
import { ISubFormStateContext } from './contexts';

export enum ThemeActionEnums {
  SetComponents = 'SET_COMPONENTS',
  /* NEW_ACTION_TYPE_GOES_HERE */
}

export const setComponentsActions = createAction<ISubFormStateContext, ISubFormStateContext>(
  ThemeActionEnums.SetComponents,
  () => ({})
);

/* NEW_ACTION_GOES_HERE */
