import React, { FC, useReducer, useContext, useEffect, useMemo, useRef } from 'react';
import { useMutate } from 'restful-react';
import { useForm } from '../form';
import { SubFormActionsContext, SubFormContext, SUB_FORM_CONTEXT_INITIAL_STATE } from './contexts';
import { usePubSub } from '../../hooks';
import { uiReducer } from './reducer';
import { getQueryParams } from '../../utils/url';
import { DEFAULT_FORM_SETTINGS, FormMarkupWithSettings } from '../form/models';
import { setMarkupWithSettingsAction } from './actions';
import { ISubFormProps } from './interfaces';
import { ColProps, message, notification } from 'antd';
import { useGlobalState } from '../globalState';
import { EntitiesGetQueryParams, useEntitiesGet } from '../../apis/entities';
import { useDebouncedCallback } from 'use-debounce';
import { useFormConfiguration } from '../form/api';
import { useConfigurableActionDispatcher } from '../configurableActionsDispatcher';

export interface SubFormProviderProps extends Omit<ISubFormProps, 'name' | 'value'> {
  actionsOwnerId?: string;
  actionOwnerName?: string;
  name?: string;
  markup?: FormMarkupWithSettings;
  value?: string | { id: string; [key: string]: any };
}

const SubFormProvider: FC<SubFormProviderProps> = ({
  children,
  value,
  formId,
  getUrl,
  postUrl,
  putUrl,
  beforeGet,
  onCreated,
  onUpdated,
  actionsOwnerId,
  actionOwnerName,
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
    //formConfiguration: fetchFormResponse,
    loading: isFetchingForm,
    error: fetchFormError
   } = useFormConfiguration({ formId: formId, lazy: true });

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

    params.properties =
      typeof properties === 'string' ? `id ${properties}` : ['id', ...Array.from(new Set(properties || []))].join(' '); // Always include the `id` property/. Useful for deleting

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
        onChange(submittedValue?.result);
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
        onChange(submittedValue?.result);
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
  //#endregion

  //#region Fetch Form
  useEffect(() => {
    if (formId && !markup) {
      fetchForm().then(response => {
        dispatch(setMarkupWithSettingsAction({ components: response.components, formSettings: response.formSettings }));
      });
    }

    if (!formId && markup) {
      dispatch(setMarkupWithSettingsAction(markup));
    }

    if (!formId && !markup){
      dispatch(setMarkupWithSettingsAction({ components: [], formSettings: DEFAULT_FORM_SETTINGS }));
    }      
  }, [formId, markup]); //

  useEffect(() => {
    if (markup) {
      dispatch(setMarkupWithSettingsAction(markup));
    }
  }, [markup]);
  //#endregion

  const { registerAction } = useConfigurableActionDispatcher();
  
  useEffect(() => {
    if (!actionOwnerName || !actionsOwnerId)
      return;
    registerAction({
      name: 'Get form data',
      owner: actionOwnerName,
      ownerUid: actionsOwnerId,
      hasArguments: false,
      executer: () => {
        getData(); // todo: return real promise
        return Promise.resolve();
      }
    });

    registerAction({
      name: 'Post form data',
      owner: actionOwnerName,
      ownerUid: actionsOwnerId,
      hasArguments: false,
      executer: () => {
        postData(); // todo: return real promise
        return Promise.resolve();
      }
    });

    registerAction({
      name: 'Update form data',
      owner: actionOwnerName,
      ownerUid: actionsOwnerId,
      hasArguments: false,
      executer: () => {
        putData(); // todo: return real promise
        return Promise.resolve();
      }
    });
  }, [actionsOwnerId]);

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
          getData: fetchEntityError,
          putData: updateError,
        },
        loading: {
          getForm: isFetchingForm,
          postData: isPosting,
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
