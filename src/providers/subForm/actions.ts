import { createAction } from 'redux-actions';
import { ISetComponentsPayload } from './interfaces';

export enum ThemeActionEnums {
  SetComponents = 'SET_COMPONENTS',
  /* NEW_ACTION_TYPE_GOES_HERE */
}

export const setComponentsActions = createAction<ISetComponentsPayload, ISetComponentsPayload>(
  ThemeActionEnums.SetComponents,
  components => components
);

/* NEW_ACTION_GOES_HERE */
