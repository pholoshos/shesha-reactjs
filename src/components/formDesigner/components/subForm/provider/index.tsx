import React, { FC, useReducer, useContext, PropsWithChildren, useEffect, useMemo } from 'react';
import { uiReducer } from './reducer';
import {
  setSubFormAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import { useGet, useMutate } from 'restful-react';
import { useForm } from '../../../../../providers/form';
import { SubFormActionsContext, SubFormContext } from './contexts';

export interface SubFormProviderProps {
  formId: string;
  value: any;
  name: string;
  getUrl?: string;
  postUrl?: string;
  putUrl?: string;
  deleteUrl?: string;
}

const SubFormProvider: FC<PropsWithChildren<SubFormProviderProps>> = ({
  children,
  name,
  formId,
  getUrl,
  postUrl,
  putUrl,
  deleteUrl,
}) => {
  const { formMode, state } = useForm();
  const { loading: isPosting, error: postingError } = useMutate({ path: '', verb: 'DELETE' });
  const { loading: isFetching, error: getError, data } = useGet({ path: '' });

  return (
    <SubFormContext.Provider value={{}}>
      <SubFormActionsContext.Provider
        value={{
          changeSubForm,

          /* NEW_ACTION_GOES_HERE */
        }}
      >
        {children}
      </SubFormActionsContext.Provider>
    </SubFormContext.Provider>
  );
};

function useSubFormState() {
  const context = useContext(SubFormContext);

  if (context === undefined) {
    throw new Error('useSubFormState must be used within a SubFormProvider');
  }
  return context;
}

function useSubFormActions() {
  const context = useContext(SubFormActionsContext);

  if (context === undefined) {
    throw new Error('useSubFormActions must be used within a SubFormProvider');
  }

  return context;
}

function useSubForm() {
  return { ...useSubFormState(), ...useSubFormActions() };
}

export { SubFormProvider, useSubFormState, useSubFormActions, useSubForm };
