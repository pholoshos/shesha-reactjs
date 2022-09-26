import {
  FORM_PERSISTER_CONTEXT_INITIAL_STATE,
  IFormPersisterStateContext,
  IFormLoadPayload,
} from './contexts';
import { FormPersisterActionEnums } from './actions';
import { handleActions } from 'redux-actions';
import { IFormSettings } from '../form/models';
import { IPersistedFormProps } from './models';

const reducer = handleActions<IFormPersisterStateContext, any>(
  {
    [FormPersisterActionEnums.LoadRequest]: (state: IFormPersisterStateContext, action: ReduxActions.Action<IFormLoadPayload>) => {
      const { payload } = action;

      return {
        ...state,
        formId: payload.formId,
      };
    },

    [FormPersisterActionEnums.LoadSuccess]: (state: IFormPersisterStateContext, action: ReduxActions.Action<IPersistedFormProps>) => {
      const { payload } = action;

      return {
        ...state,
        formProps: {
          id: payload.id,
          module: payload.module,
          name: payload.name,
          label: payload.label,
          description: payload.description,
        },
        markup: payload.markup,
        formSettings: payload.formSettings
      };
    },

    [FormPersisterActionEnums.UpdateFormSettings]: (state: IFormPersisterStateContext, action: ReduxActions.Action<IFormSettings>) => {
      const { payload } = action;

      return {
        ...state,
        formSettings: payload,
      };
    },

  },

  FORM_PERSISTER_CONTEXT_INITIAL_STATE
);

export default reducer;
