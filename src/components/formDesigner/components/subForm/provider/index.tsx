import React, { FC, useReducer, useContext, PropsWithChildren, useEffect, useMemo } from 'react';

import Get, { Mutate, useGet, useMutate } from 'restful-react';
import { useForm } from '../../../../../providers/form';
import { SubFormActionsContext, SubFormContext, SUB_FORM_CONTEXT_INITIAL_STATE } from './contexts';
import { useSubscribe } from '../../../../../hooks';
import { SubFormProps } from './interfaces';
import { useFormGet } from '../../../../../apis/form';
import { SUB_FORM_EVENT_NAMES } from './constants';
import { uiReducer } from './reducer';
import { useGlobalState } from '../../../../../providers';
import { evaluateComplexString } from '../../../../../formDesignerUtils';
import { getQueryParams } from '../../../../../utils/url';
import { IFormDto } from '../../../../../providers/form/models';
import { setComponentsActions } from './actions';

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
  const { formMode, formData } = useForm();
  const { globalState } = useGlobalState();
  const { refetch: fetchForm, loading: isFetchingForm, data: fetchFormResponse, error: fetchFormError } = useFormGet({
    queryParams: { id: formId },
  });

  const getEvaluatedUrl = (url: string) => {
    if (!url) return '';

    return evaluateComplexString(url, [
      { match: 'data', data: formData },
      { match: 'globalState', data: globalState },
      { match: 'query', data: getQueryParams() },
    ]);
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
    postHttp(value).then(submittedValue => {
      if (onCreated) {
        const evaluateOnCreated = () => {
          // tslint:disable-next-line:function-constructor
          return new Function('data, globalState, submittedValue', onCreated)(
            formData,
            globalState,
            submittedValue?.result,
            value
          );
        };

        evaluateOnCreated();
      }
    });
  };

  const postData = () => {
    postHttp(value).then(submittedValue => {
      if (onCreated) {
        const evaluateOnCreated = () => {
          // tslint:disable-next-line:function-constructor
          return new Function('data, globalState, submittedValue', onCreated)(
            formData,
            globalState,
            submittedValue?.result,
            value
          );
        };

        evaluateOnCreated();
      }
    });
  };

  const putData = () => {
    putHttp(value).then(submittedValue => {
      if (onUpdated) {
        const evaluateOnUpdated = () => {
          // tslint:disable-next-line:function-constructor
          return new Function('data, globalState, submittedValue', onCreated)(
            formData,
            globalState,
            submittedValue?.result,
            value
          );
        };

        evaluateOnUpdated();
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
      const result = (fetchFormResponse as any)?.result;

      const markup = result?.markup;

      const formDto = result as IFormDto;

      if (markup) formDto.markup = JSON.parse(markup);

      dispatch(setComponentsActions({ components: formDto?.markup?.components }));
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
