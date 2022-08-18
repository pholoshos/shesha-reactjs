import { ISubFormStateContext } from './contexts';
import { ThemeActionEnums } from './actions';

export function uiReducer(
  state: ISubFormStateContext,
  action: ReduxActions.Action<ISubFormStateContext>
): ISubFormStateContext {
  //#region Register flags reducer

  const { type, payload } = action;
  //#endregion

  switch (type) {
    case ThemeActionEnums.SetTheme:
      /* NEW_ACTION_ENUM_GOES_HERE */

      return {
        ...state,
        ...payload,
      };

    default: {
      return state;
    }
  }
}
