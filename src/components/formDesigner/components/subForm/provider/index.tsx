import React, { FC, useReducer, useContext, PropsWithChildren, useEffect, useMemo } from 'react';

import Get, { Mutate, useGet, useMutate } from 'restful-react';
import { useForm } from '../../../../../providers/form';
import { SubFormActionsContext, SubFormContext, SUB_FORM_CONTEXT_INITIAL_STATE } from './contexts';
import { useSubscribe } from '../../../../../hooks';
import { SubFormProps } from './interfaces';
import { useFormGet } from '../../../../../apis/form';
import { SUB_FORM_EVENT_NAMES } from './constants';
import { uiReducer } from './reducer';

export interface SubFormProviderProps extends SubFormProps {
  uniqueStateId?: string;
  containerId: string;
}

const SubFormProvider: FC<PropsWithChildren<SubFormProviderProps>> = ({
  children,
  value,
  name,
  formId,
  getUrl,
  postUrl,
  putUrl,
  deleteUrl,
  containerId,
  beforeGet,
  onCreated,
  onUpdated,
  uniqueStateId,
  dataSource,
}) => {
  const [state, dispatch] = useReducer(uiReducer, SUB_FORM_CONTEXT_INITIAL_STATE);
  const { formMode } = useForm();
  const { refetch: fetchForm, loading: isFetchingForm, data: fetchFormResponse, error: fetchFormError } = useFormGet({
    queryParams: { id: formId },
  });

  const getEvaluatedUrl = (url: string) => {
    return '';
  };

  const { refetch: fetchFormData, loading: isFetchingData, error: fetchDataError, data: fetchedFormData } = useGet({
    path: getEvaluatedUrl(getUrl),
  });

  const { mutate: postHttp, loading: isPosting, error: postError } = useMutate({
    path: getEvaluatedUrl(postUrl),
    verb: 'POST',
  });

  const { mutate: deleteHttp, loading: isDeleting, error: deleteError } = useMutate({
    path: getEvaluatedUrl(deleteUrl),
    verb: 'DELETE',
  });
  const { mutate: putHttp, loading: isUpdating, error: updateError } = useMutate({
    path: getEvaluatedUrl(putUrl),
    verb: 'PUT',
  });

  const getData = () => {
    postHttp(value).then(() => {
      if (beforeGet) {
        // Execute beforeGet expression
      }
    });
  };

  const postData = () => {
    postHttp(value).then(() => {
      if (onCreated) {
        // Execute onCreated expression
      }
    });
  };

  const putData = () => {
    putHttp(value).then(() => {
      if (onUpdated) {
        // Execute onUpdated expression
      }
    });
  };

  const deleteData = () => {
    deleteHttp(value).then(() => {
      if (onUpdated) {
        // Execute onUpdated expression
      }
    });
  };

  //#region Fetch Form
  useEffect(() => {
    if (formId) {
      fetchForm();
    }
  }, [formId]);

  useEffect(() => {
    if (!isFetchingForm && fetchFormResponse) {
      // Update the main form
    }
  }, [fetchFormResponse, isFetchingForm]);
  //#endregion

  useSubscribe(SUB_FORM_EVENT_NAMES.getFormData, ({ stateId }) => {
    if (stateId === uniqueStateId) {
      getData();
    }
  });

  useSubscribe(SUB_FORM_EVENT_NAMES.postFormData, ({ stateId }) => {
    if (stateId === uniqueStateId) {
      postData();
    }
  });

  useSubscribe(SUB_FORM_EVENT_NAMES.updateFormData, ({ stateId }) => {
    if (stateId === uniqueStateId) {
      putData();
    }
  });

  useSubscribe(SUB_FORM_EVENT_NAMES.deleteFormData, ({ stateId }) => {
    if (stateId === uniqueStateId) {
      deleteData();
    }
  });

  return (
    <SubFormContext.Provider
      value={{
        errors: {
          getForm: fetchFormError,
          postData: postError,
          deleteData: deleteError,
          getData: fetchDataError,
          putData: updateError,
        },
        loading: {
          getForm: isFetchingForm,
          postData: isPosting,
          deleteData: isDeleting,
          getData: isFetchingData,
          putData: isUpdating,
        },
        components: state?.components,
      }}
    >
      <SubFormActionsContext.Provider
        value={{
          getData,
          postData,
          putData,
          deleteData,
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
