import React, { FC, useReducer, useContext, useEffect, useMemo, useRef } from 'react';
import { useMutate } from 'restful-react';
import { useForm } from '../form';
import { SubFormActionsContext, SubFormContext, SUB_FORM_CONTEXT_INITIAL_STATE } from './contexts';
import { usePubSub, useSubscribe } from '../../hooks';
import { SUB_FORM_EVENT_NAMES } from './constants';
import { uiReducer } from './reducer';
import { getQueryParams } from '../../utils/url';
import { FormMarkupWithSettings } from '../form/models';
import { setMarkupWithSettingsAction } from './actions';
import { ISubFormProps } from './interfaces';
import { ColProps, message, notification } from 'antd';
import { useGlobalState } from '../globalState';
import { EntitiesGetQueryParams, useEntitiesGet } from '../../apis/entities';
import { useDebouncedCallback } from 'use-debounce';
import { useFormConfiguration } from '../form/api';

export interface SubFormProviderProps extends Omit<ISubFormProps, 'name' | 'value'> {
  uniqueStateId?: string;
  name?: string;
  markup?: FormMarkupWithSettings;
  value?: string | { id: string; [key: string]: any };
}

const SubFormProvider: FC<SubFormProviderProps> = ({
  children,
  value,
  formName,
  formModule,
  getUrl,
  postUrl,
  putUrl,
  deleteUrl,
  beforeGet,
  onCreated,
  onUpdated,
  onDeleted,
  uniqueStateId,
  dataSource,
  markup,
  properties,
  name,
  labelCol,
  wrapperCol,
  queryParams,
  entityType,
  onChange,
}) => {
  const [state, dispatch] = useReducer(uiReducer, SUB_FORM_CONTEXT_INITIAL_STATE);
  const { publish } = usePubSub();
  const { formData = {}, formMode } = useForm();
  const { globalState } = useGlobalState();

  const {
    refetch: fetchForm,
    formConfiguration: fetchFormResponse,
    loading: isFetchingForm,
    error: fetchFormError
   } = useFormConfiguration({ formId: { module: formModule, name: formName }, lazy: true });

  const {
    refetch: fetchEntity,
    data: fetchEntityResponse,
    loading: isFetchingEntity,
    error: fetchEntityError,
  } = useEntitiesGet({ lazy: true });
  const { initialValues } = useSubForm();

  const getEvaluatedUrl = (url: string) => {
    if (!url) return '';

    return (() => {
      // tslint:disable-next-line:function-constructor
      return new Function('data, query, globalState', url)(formData, getQueryParams(), globalState); // Pass data, query, globalState
    })();
  };

  const previousValue = useRef(value);

  useEffect(() => {
    if (typeof value === 'string' && typeof previousValue === 'string' && previousValue !== value) {
      handleFetchData(value);
    }
  }, [value, globalState, formData]);

  const evaluatedQueryParams = useMemo(() => {
    if (formMode === 'designer') return {};

    let params: EntitiesGetQueryParams = {
      entityType,
    };

    params.properties = ['id', ...Array.from(new Set(properties || []))].join(' '); // Always include the `id` property/. Useful for deleting

    if (queryParams) {
      const getOnSubmitPayload = () => {
        try {
          // tslint:disable-next-line:function-constructor
          return new Function('data, query, globalState', queryParams)(formData, getQueryParams(), globalState); // Pass data, query, globalState
        } catch (error) {
          console.warn('SubFormProvider: ', error);
          return {};
        }
      };

      params = { ...params, ...(typeof getOnSubmitPayload() === 'object' ? getOnSubmitPayload() : {}) };
    }

    return params;
  }, [queryParams, formMode, globalState]);

  const handleFetchData = (id?: string) =>
    fetchEntity({ queryParams: id ? { ...evaluatedQueryParams, id } : evaluatedQueryParams });

  useEffect(() => {
    if (queryParams && formMode !== 'designer' && dataSource === 'api') {
      if (evaluatedQueryParams?.id || getUrl) {
        // Only fetch when there's an `Id`. Ideally an API that is used to fetch data should have an id
        handleFetchData();
      } else {
        onChange({});
      }
    }
  }, [queryParams, evaluatedQueryParams]);

  useEffect(() => {
    if (dataSource === 'api' && getUrl) {
      getData();
    }
  }, [properties, getUrl, dataSource]);

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

  //#region get data
  useEffect(() => {
    if (!isFetchingEntity && fetchEntityResponse) {
      onChange(fetchEntityResponse?.result);
    }
  }, [isFetchingEntity, fetchEntityResponse]);
  //#endregion

  //#region CRUD functions
  const getData = useDebouncedCallback(() => {
    if (dataSource === 'api') {
      if (beforeGet) {
        const evaluateBeforeGet = () => {
          // tslint:disable-next-line:function-constructor
          return new Function('data, initialValues, globalState', beforeGet)(formData, initialValues, globalState);
        };

        const evaluatedData = evaluateBeforeGet();

        onChange(evaluatedData);
      }

      handleFetchData();
    }
  }, 300);

  const postData = useDebouncedCallback(() => {
    if (!postUrl) {
      notification.error({
        placement: 'top',
        message: 'postUrl missing',
        description: 'Please make sure you have specified the POST URL',
      });
    } else {
      postHttp(value).then(submittedValue => {
        if (onCreated) {
          const evaluateOnCreated = () => {
            // tslint:disable-next-line:function-constructor
            return new Function('data, globalState, submittedValue, message, publish', onCreated)(
              formData,
              globalState,
              submittedValue?.result,
              message,
              publish
            );
          };

          evaluateOnCreated();
        }
      });
    }
  }, 300);

  const putData = useDebouncedCallback(() => {
    if (!putUrl) {
      notification.error({
        placement: 'top',
        message: 'putUrl missing',
        description: 'Please make sure you have specified the PUT URL',
      });
    } else {
      putHttp(value).then(submittedValue => {
        if (onUpdated) {
          const evaluateOnUpdated = () => {
            // tslint:disable-next-line:function-constructor
            return new Function('data, globalState, response, message, publish', onUpdated)(
              formData,
              globalState,
              submittedValue?.result,
              message,
              publish
            );
          };

          evaluateOnUpdated();
        }
      });
    }
  }, 300);

  const deleteData = useDebouncedCallback(() => {
    if (!deleteUrl) {
      notification.error({
        placement: 'top',
        message: 'deleteUrl missing',
        description: 'Please make sure you have specified the Delete URL',
      });
    } else {
      deleteHttp('', { queryParams: { id: typeof value === 'string' ? value : value?.id } }).then(() => {
        if (onDeleted) {
          const evaluateOnUpdated = () => {
            // tslint:disable-next-line:function-constructor
            return new Function('data, globalState, message', onDeleted)(formData, globalState, message);
          };

          evaluateOnUpdated();
        }
      });
    }
  }, 300);
  //#endregion

  //#region Fetch Form
  useEffect(() => {
    if (formName && !markup) {
      fetchForm();
    }

    if (!formName && markup) {
      dispatch(setMarkupWithSettingsAction(markup));
    }
  }, [formName, markup]); //

  useEffect(() => {
    if (!isFetchingForm && fetchFormResponse) {
      dispatch(setMarkupWithSettingsAction({ components: fetchFormResponse.markup, formSettings: fetchFormResponse.settings }));
    }
  }, [fetchFormResponse, isFetchingForm]);

  useEffect(() => {
    if (markup) {
      dispatch(setMarkupWithSettingsAction(markup));
    }
  }, [markup]);
  //#endregion

  useSubscribe(SUB_FORM_EVENT_NAMES.getFormData, ({ stateId }) => {
    if (stateId === uniqueStateId) {
      getData();
    }
  });

  //#region Events
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
  //#endregion

  const getColSpan = (span: number | ColProps): ColProps => {
    if (!span) return null;

    return typeof span === 'number' ? { span } : span;
  };

  return (
    <SubFormContext.Provider
      value={{
        initialValues: value,
        errors: {
          getForm: fetchFormError,
          postData: postError,
          deleteData: deleteError,
          getData: fetchEntityError,
          putData: updateError,
        },
        loading: {
          getForm: isFetchingForm,
          postData: isPosting,
          deleteData: isDeleting,
          getData: isFetchingEntity,
          putData: isUpdating,
        },
        components: state?.components,
        formSettings: {
          ...state?.formSettings,
          labelCol: getColSpan(labelCol) || getColSpan(state?.formSettings?.labelCol),
          wrapperCol: getColSpan(wrapperCol) || getColSpan(state?.formSettings?.wrapperCol), // Override with the incoming one
        },
        name,
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

  // if (context === undefined) {
  //   throw new Error('useSubFormState must be used within a SubFormProvider');
  // }

  return context;
}

function useSubFormActions() {
  const context = useContext(SubFormActionsContext);

  // if (context === undefined) {
  //   throw new Error('useSubFormActions must be used within a SubFormProvider');
  // }

  return context;
}

function useSubForm() {
  return { ...useSubFormState(), ...useSubFormActions() };
}

export { SubFormProvider, useSubFormState, useSubFormActions, useSubForm };
