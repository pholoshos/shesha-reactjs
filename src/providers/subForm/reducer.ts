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
    case ThemeActionEnums.SetComponents:
      return {
        ...state,
        components: payload?.components,
      };

    default: {
      return state;
    }
  }
}
