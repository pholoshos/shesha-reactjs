import { LoadingOutlined } from '@ant-design/icons';
import { Button, Form, message, notification, Result, Spin } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GetDataError, useGet, useMutate } from 'restful-react';
import { axiosHttp } from '../../apis/axios';
import { FormDto, useFormGet, useFormGetByPath } from '../../apis/form';
import { AjaxResponseBase } from '../../apis/user';
import { ConfigurableForm, ValidationErrors } from '../../components';
import { useSubscribe, usePubSub } from '../../hooks';
import { PageWithLayout } from '../../interfaces';
import { useGlobalState, useSheshaApplication } from '../../providers';
import { ConfigurableFormInstance, ISetFormDataPayload } from '../../providers/form/contexts';
import { IFormDto } from '../../providers/form/models';
import { evaluateComplexString, removeZeroWidthCharsFromString } from '../../providers/form/utils';
import { getQueryParams, isValidSubmitVerb } from '../../utils/url';
import { EntityAjaxResponse, IDynamicPageProps, IDynamicPageState } from './interfaces';
import { DynamicFormPubSubConstants } from './pubSub';

const DynamicPage: PageWithLayout<IDynamicPageProps> = props => {
  const { backendUrl } = useSheshaApplication();
  const [state, setState] = useState<IDynamicPageState>({});
  const formRef = useRef<ConfigurableFormInstance>();
  const { globalState } = useGlobalState();

  const { publish } = usePubSub();

  const { id, path, formId, entityPathId } = state;

  const {
    refetch: fetchFormByPath,
    data: dataByPath,
    loading: isFetchingFormByPath,
    error: fetchFormByPathError,
  } = useFormGetByPath({ queryParams: { path }, lazy: true });

  const [form] = Form.useForm();

  const {
    refetch: fetchFormById,
    data: dataById,
    loading: isFetchingFormById,
    error: fetchFormByIdError,
  } = useFormGet({ queryParams: { id: formId }, lazy: true });

  const formResponse: IFormDto = useMemo(() => {
    if (isFetchingFormByPath || isFetchingFormById) {
      return null;
    }

    console.log('[dataByPath, dataById, props], ', [dataByPath, dataById, props]);

    let result: FormDto;
    if (dataByPath) {
      result = (dataByPath as any).result;
    }

    if (dataById) {
      result = (dataById as any).result;
    }

    if (result) {
      const localFormResponse: IFormDto = { ...(result as any) };
      localFormResponse.markup = JSON.parse(result.markup);

      return localFormResponse;
    }

    return null;
  }, [isFetchingFormByPath, isFetchingFormById, props]);

  const fetchDataPath = useMemo(() => {
    const pathToReturn = (removeZeroWidthCharsFromString(formResponse?.markup?.formSettings?.getUrl) || '').trim();

    if (entityPathId) {
      return pathToReturn?.endsWith('/') ? `${pathToReturn}${entityPathId}` : `${pathToReturn}/${entityPathId}`;
    }

    return pathToReturn?.trim();
  }, [formResponse, entityPathId, props, state]);

  const { refetch: fetchData, error: fetchDataError, loading: isFetchingData, data: fetchDataResponse } = useGet<
    EntityAjaxResponse
  >({
    path: fetchDataPath,
    // queryParams: { id },
    lazy: true, // We wanna make sure we have both the id and the state?.markup?.formSettings?.getUrl before fetching data
  });

  const submitVerb = useMemo(() => {
    const verb = state?.submitVerb?.toUpperCase() as typeof state.submitVerb;

    const defaultSubmitVerb = id || Boolean(state?.fetchedData) ? 'PUT' : 'POST';

    return verb && isValidSubmitVerb(verb) ? verb : defaultSubmitVerb;
  }, [state?.fetchedData]);

  const submitUrl = useMemo(() => {
    const url = formResponse?.markup?.formSettings[`${submitVerb?.toLocaleLowerCase()}Url`];

    if (!url && formResponse?.markup?.formSettings) {
      console.warn(`Please make sure you have specified the '${submitVerb}' URL`);
    }

    return url
      ? evaluateComplexString(url, [
          { match: 'query', data: getQueryParams() },
          { match: 'globalState', data: globalState },
        ])
      : '';
  }, [formResponse?.markup?.formSettings, submitVerb]);

  const onDataLoaded = formResponse?.markup?.formSettings?.onDataLoaded;

  useEffect(() => {
    if (onDataLoaded && state?.fetchedData) {
      getExpressionExecutor(onDataLoaded);
    }
  }, [onDataLoaded, state?.fetchedData]);

  const { mutate: postData, loading: isPostingData } = useMutate({
    path: submitUrl,
    verb: submitVerb,
  });

  useEffect(() => {
    setState(() => ({ ...props }));
  }, [props]);

  //#region get form data
  useEffect(() => {
    // The mismatch happens if you're drilled down to a page and then click the back button on the browser
    // When you land, because you'd still be having the formResponse, before the correct form is being fetched
    // Data/Entity will be fetched with the previous value of the response. That is why we have to check that we don't have the old form response
    const isPathMismatch = props?.path !== formResponse?.path;

    // note: fetch data if `getUrl` is set even when Id is not provided. Dynamic page can be used not only for entities
    if (fetchDataPath && !isPathMismatch) {
      // clear form data
      //formRef?.current?.setFormData({ values: null, mergeValues: false });

      fetchData({ queryParams: entityPathId || !id ? {} : { id } });
    }
  }, [id, formResponse?.markup?.formSettings?.getUrl, entityPathId, fetchDataPath]);

  const onChangeId = (localId: string) => {
    setState(prev => ({ ...prev, id: localId }));
  };

  const onChangeFormData = (payload: ISetFormDataPayload) => {
    form?.setFieldsValue(payload?.values);
    formRef?.current?.setFormData({ values: payload?.values, mergeValues: payload?.mergeValues });
  };

  useEffect(() => {
    if (!isFetchingFormByPath && fetchDataResponse) {
      setState(prev => ({ ...prev, fetchedData: fetchDataResponse?.result }));
    }
  }, [isFetchingFormByPath, fetchDataResponse]);
  //#endregion

  //#region Fetch form and set the state
  useEffect(() => {
    if (path) {
      fetchFormByPath();
      return;
    }

    if (formId) {
      fetchFormById();
    }
  }, [path, formId, fetchFormByPath, fetchFormById]);

  useEffect(() => {
    let result: FormDto;
    if (dataByPath) {
      result = (dataByPath as any)?.result;
    }

    if (dataById) {
      result = (dataById as any)?.result;
    }

    if (result) {
      const localFormResponse: IFormDto = { ...(result as any) };

      localFormResponse.markup = JSON.parse(result.markup);

      setState(prev => ({ ...prev, formResponse: localFormResponse }));
    }
  }, [dataByPath, dataById]);
  //#endregion

  const onFinish = (values: any, _response?: any, options?: any) => {
    postData(values)
      .then(() => {
        message.success('Data saved successfully!');

        publish(DynamicFormPubSubConstants.DataSaved);

        formRef?.current?.setFormMode('readonly');
      })
      .catch(error => {
        if (options?.setValidationErrors) {
          options.setValidationErrors(error);
        }
      });
  };

  //#region Error messages
  useEffect(() => {
    if (fetchDataError) {
      displayNotificationError(fetchDataError);
    }
  }, [fetchDataError]);

  useEffect(() => {
    if (fetchFormByPathError) {
      displayNotificationError(fetchFormByPathError);
    }
  }, [fetchFormByPathError]);

  useEffect(() => {
    if (fetchFormByIdError) {
      displayNotificationError(fetchFormByIdError);
    }
  }, [fetchFormByIdError]);
  //#endregion

  const displayNotificationError = (error: GetDataError<AjaxResponseBase>) => {
    notification.error({
      message: 'Sorry! An error occurred.',
      icon: null,
      description: <ValidationErrors error={error} renderMode="raw" />,
    });
  };

  useSubscribe(DynamicFormPubSubConstants.CancelFormEdit, () => {
    form?.setFieldsValue(state?.fetchedData);

    formRef?.current?.setFormData({ values: state?.fetchedData, mergeValues: true });

    formRef?.current?.setFormMode('readonly');
  });

  useEffect(() => {
    if (formResponse && !formResponse?.markup && state?.path) {
      notification.error({
        message: 'Form not found',
        description: (
          <span>
            Could not find a form with the path <strong>{state?.path}</strong>. Please make sure the path is correct or
            that it hasn't been changed
          </span>
        ),
      });
    }
  }, [formResponse]);

  //#region Expression executor
  const getExpressionExecutor = (expression: string) => {
    if (!expression) {
      return null;
    }

    // tslint:disable-next-line:function-constructor
    return new Function('data, globalState, moment, http, message', expression)(
      state?.fetchedData,
      globalState,
      moment,
      axiosHttp(backendUrl),
      message
    );
  };
  //#endregion

  const isLoading = isFetchingData || isFetchingFormByPath || isFetchingFormById || isPostingData;

  console.log('formResponse?.markup', props, formResponse);

  if (state && !formResponse?.markup && !isLoading) {
    return (
      <Result
        status="404"
        style={{ height: '100vh - 55px' }}
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary">
            <Link href={'/'}>
              <a>Back Home</a>
            </Link>
          </Button>
        }
      />
    );
  }

  const getLoadingHint = () => {
    switch (true) {
      case isFetchingData:
        return 'Fetching data...';
      case isFetchingFormByPath:
      case isFetchingFormById:
        return 'Fetching form...';
      case isPostingData:
        return 'Saving data...';
      default:
        return 'Loading...';
    }
  };

  return (
    <Spin spinning={isLoading} tip={getLoadingHint()} indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}>
      <ConfigurableForm
        path={path}
        id={formId}
        formRef={formRef}
        mode={state?.mode}
        form={form}
        actions={{ onChangeId, onChangeFormData }}
        onFinish={onFinish}
        initialValues={state?.fetchedData}
        skipPostOnFinish
        skipFetchData
        className="sha-dynamic-page"
      />
    </Spin>
  );
};
export default DynamicPage;
