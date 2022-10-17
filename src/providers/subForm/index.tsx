import React, { FC, useReducer, useContext, useEffect, useMemo, useRef } from 'react';
import { useGet, useMutate } from 'restful-react';
import { useForm } from '../form';
import { SubFormActionsContext, SubFormContext, SUB_FORM_CONTEXT_INITIAL_STATE } from './contexts';
import { usePubSub, useSubscribe } from '../../hooks';
import { useFormGet } from '../../apis/form';
import { SUB_FORM_EVENT_NAMES } from './constants';
import { uiReducer } from './reducer';
import { getQueryParams } from '../../utils/url';
import { IFormDto } from '../form/models';
import { setMarkupWithSettingsAction } from './actions';
import { ISubFormProps } from './interfaces';
import { ColProps, message, notification } from 'antd';
import { useGlobalState } from '../globalState';
import { EntitiesGetQueryParams, useEntitiesGet } from '../../apis/entities';
import { useDebouncedCallback } from 'use-debounce';
import { usePrevious } from 'react-use';

export interface SubFormProviderProps extends Omit<ISubFormProps, 'name' | 'value'> {
  uniqueStateId?: string;
  name?: string;
  markup?: IFormDto['markup'];
  value?: string | { id: string; [key: string]: any };
}

const SubFormProvider: FC<SubFormProviderProps> = ({
  children,
  value,
  formPath,
  getUrl,
  postUrl,
  putUrl,
  beforeGet,
  onCreated,
  onUpdated,
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
  const getEvaluatedUrl = (url: string) => {
    if (!url) return '';
    return (() => {
      // tslint:disable-next-line:function-constructor
      return new Function('data, query, globalState', url)(formData, getQueryParams(), globalState); // Pass data, query, globalState
    })();
  };
  const [state, dispatch] = useReducer(uiReducer, SUB_FORM_CONTEXT_INITIAL_STATE);
  const { publish } = usePubSub();
  const { formData = {}, formMode } = useForm();
  const { globalState } = useGlobalState();
  const { refetch: fetchForm, loading: isFetchingForm, data: fetchFormResponse, error: fetchFormError } = useFormGet({
    queryParams: { id: formPath?.id },
    lazy: true,
  });
  const {
    refetch: fetchEntity,
    data: fetchEntityResponse,
    loading: isFetchingEntity,
    error: fetchEntityError,
  } = useEntitiesGet({ lazy: true });
  const { initialValues } = useSubForm();
  const {
    refetch: fetchDataByUrlHttp,
    data: fetchDataByUrl,
    loading: isFetchingDataByUrl,
    error: errorFetchingData,
  } = useGet({
    path: getEvaluatedUrl(getUrl),
    // queryParams:
  });
  const previousValue = useRef(value);
  useEffect(() => {
    if (typeof value === 'string' && typeof previousValue === 'string' && previousValue !== value) {
      handleFetchData(value);
    }
  }, [value, globalState, formData]);

  useEffect(() => {
    if (!isFetchingDataByUrl && fetchDataByUrl) {
      onChange(fetchDataByUrl?.result);
    }
  }, [isFetchingDataByUrl, fetchDataByUrl]);
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

  const previousGetUrl = usePrevious(getUrl);

  useEffect(() => {
    if (dataSource === 'api' && getUrl && previousGetUrl !== getUrl) {
      fetchDataByUrlHttp();
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
    if (formPath?.id && !markup) {
      fetchForm();
    }

    if (!formPath?.id && markup) {
      dispatch(setMarkupWithSettingsAction(markup));
    }
  }, [formPath?.id, markup]); //

  useEffect(() => {
    if (!isFetchingForm && fetchFormResponse) {
      const result = (fetchFormResponse as any)?.result;

      const markup = result?.markup;

      const formDto = result as IFormDto;
     
      if (markup) formDto.markup = JSON.parse(markup);

      dispatch(setMarkupWithSettingsAction(formDto?.markup));
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
          getData: fetchEntityError || errorFetchingData,
          putData: updateError,
        },
        loading: {
          getForm: isFetchingForm,
          postData: isPosting,
          getData: isFetchingEntity || isFetchingDataByUrl,
          putData: isUpdating,
        },
        components: state?.components,
        formSettings: {
          ...state?.formSettings,
          labelCol: getColSpan(labelCol) || getColSpan(state?.formSettings?.labelCol),
          wrapperCol: getColSpan(wrapperCol) || getColSpan(state?.formSettings?.wrapperCol), // Override with the incoming one
        },
        name,
        value:value
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
