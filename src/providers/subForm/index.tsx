import React, { FC, useReducer, useContext, useEffect } from 'react';
import { useGet, useMutate } from 'restful-react';
import { useForm } from '../form';
import { SubFormActionsContext, SubFormContext, SUB_FORM_CONTEXT_INITIAL_STATE } from './contexts';
import { useSubscribe } from '../../hooks';
import { useFormGet } from '../../apis/form';
import { SUB_FORM_EVENT_NAMES } from './constants';
import { uiReducer } from './reducer';
import { evaluateComplexString } from '../../formDesignerUtils';
import { getQueryParams } from '../../utils/url';
import { IFormDto } from '../form/models';
import { setComponentsActions } from './actions';
import { ISubFormProps } from './interfaces';
import { message } from 'antd';
import { useGlobalState } from '../globalState';

export interface SubFormProviderProps extends Omit<ISubFormProps, 'name'> {
  uniqueStateId?: string;
  name?: string;
  markup?: IFormDto['markup'];
}

const SubFormProvider: FC<SubFormProviderProps> = ({
  children,
  value,
  formPath,
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
  onChange,
}) => {
  const [state, dispatch] = useReducer(uiReducer, SUB_FORM_CONTEXT_INITIAL_STATE);
  const { formData } = useForm();
  const { globalState } = useGlobalState();
  const { refetch: fetchForm, loading: isFetchingForm, data: fetchFormResponse, error: fetchFormError } = useFormGet({
    queryParams: { id: formPath?.id },
    lazy: true,
  });
  const { initialValues } = useSubForm();

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
    lazy: true,
    queryParams: properties?.length ? { properties: properties?.join(' ') } : {},
  });

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
  const getData = () => {
    if (getUrl && dataSource === 'api') {
      if (beforeGet) {
        const evaluateBeforeGet = () => {
          // tslint:disable-next-line:function-constructor
          return new Function('data, value, initialValues, globalState', onCreated)(
            formData,
            value,
            initialValues,
            globalState
          );
        };

        const evaluatedData = evaluateBeforeGet();

        onChange(evaluatedData);
      }

      fetchFormData();
    }
  };

  useEffect(() => {
    if (!isFetchingData && fetchedFormData) {
      onChange(fetchedFormData?.result);
    }
  }, [isFetchingData, fetchedFormData]);
  //#endregion

  const postData = () => {
    postHttp(value).then(submittedValue => {
      if (onCreated) {
        const evaluateOnCreated = () => {
          // tslint:disable-next-line:function-constructor
          return new Function('data, globalState, submittedValue, message', onCreated)(
            formData,
            globalState,
            submittedValue?.result,
            message
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
          return new Function('data, globalState, submittedValue, message', onUpdated)(
            formData,
            globalState,
            submittedValue?.result,
            message
          );
        };

        evaluateOnUpdated();
      }
    });
  };

  const deleteData = () => {
    deleteHttp('', { queryParams: { id: value?.id } }).then(() => {
      if (onDeleted) {
        const evaluateOnUpdated = () => {
          // tslint:disable-next-line:function-constructor
          return new Function('data, globalState, message', onDeleted)(formData, globalState, message);
        };

        evaluateOnUpdated();
      }
    });
  };

  //#region Fetch Form
  useEffect(() => {
    if (formPath?.id && !markup) {
      fetchForm();
    }

    if (!formPath?.id && !markup) {
      dispatch(setComponentsActions({ components: [] }));
    }
  }, [formPath?.id, markup]);

  useEffect(() => {
    if (!isFetchingForm && fetchFormResponse) {
      const result = (fetchFormResponse as any)?.result;

      const markup = result?.markup;

      const formDto = result as IFormDto;

      if (markup) formDto.markup = JSON.parse(markup);

      dispatch(setComponentsActions({ components: formDto?.markup?.components }));
    }
  }, [fetchFormResponse, isFetchingForm]);

  useEffect(() => {
    dispatch(setComponentsActions({ components: markup?.components }));
  }, [markup]);
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
        prefixName: name,
        initialValues: value,
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
        layout: {
          labelCol: markup?.formSettings?.labelCol || labelCol,
          wrapperCol: markup?.formSettings?.wrapperCol || wrapperCol,
        },
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
