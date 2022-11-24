import { SHESHA_APPLICATION_CONTEXT_INITIAL_STATE, ISheshaApplicationStateContext } from './contexts';
import { handleActions } from 'redux-actions';
import { SheshaApplicationActionEnums } from './actions';
import IRequestHeaders from '../../interfaces/requestHeaders';

export default handleActions<ISheshaApplicationStateContext, any>(
  {
    [SheshaApplicationActionEnums.SetRequestHeaders]: (
      state: ISheshaApplicationStateContext,
      action: ReduxActions.Action<IRequestHeaders>
    ) => {
      const { payload } = action;
      const { httpHeaders } = state;

      const newHeaders = { ...httpHeaders, ...payload };

      return {
        ...state,
        httpHeaders: newHeaders,
        headers: newHeaders,
      };
    },

    [SheshaApplicationActionEnums.SetBackendUrl]: (
      state: ISheshaApplicationStateContext,
      action: ReduxActions.Action<string>
    ) => {
      const { payload } = action;

      return {
        ...state,
        backendUrl: payload,
      };
    },
  },

  SHESHA_APPLICATION_CONTEXT_INITIAL_STATE
);
