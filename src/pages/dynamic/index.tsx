import { LoadingOutlined } from '@ant-design/icons';
import { Button, Form, message, notification, Result, Spin } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GetDataError, useGet, useMutate } from 'restful-react';
import { axiosHttp } from '../../apis/axios';
import { ConfigurableForm, ValidationErrors } from '../../components';
import { useSubscribe, usePubSub } from '../../hooks';
import { PageWithLayout } from '../../interfaces';
import { IAjaxResponseBase } from '../../interfaces/ajaxResponse';
import { useGlobalState, useSheshaApplication } from '../../providers';
import { useFormConfiguration } from '../../providers/form/api';
import { ConfigurableFormInstance, ISetFormDataPayload } from '../../providers/form/contexts';
import { FormIdentifier } from '../../providers/form/models';
import { asFormFullName, evaluateComplexString, removeZeroWidthCharsFromString } from '../../providers/form/utils';
import { getQueryParams, isValidSubmitVerb } from '../../utils/url';
import { EntityAjaxResponse, IDynamicPageProps, IDynamicPageState } from './interfaces';
import { DynamicFormPubSubConstants } from './pubSub';

const DynamicPage: PageWithLayout<IDynamicPageProps> = props => {
  const { backendUrl } = useSheshaApplication();
  const [state, setState] = useState<IDynamicPageState>({});
  const formRef = useRef<ConfigurableFormInstance>();
  const { globalState } = useGlobalState();

  const { publish } = usePubSub();

  const { id, formId, entityPathId } = state;

  const { 
    refetch: fetchFormMarkup,
    formConfiguration,
    loading: isFetchingMarkup,
    error: fetchMarkupError
   } = useFormConfiguration({ formId, lazy: true });
  const formMarkup = formConfiguration?.markup;
  const formSettings = formConfiguration?.settings;
  
  const [form] = Form.useForm();

  // url that is used to get form data
  const fetchDataPath = useMemo(() => {
    const pathToReturn = (removeZeroWidthCharsFromString(formSettings?.getUrl) || '').trim();

    if (entityPathId) {
      return pathToReturn?.endsWith('/') ? `${pathToReturn}${entityPathId}` : `${pathToReturn}/${entityPathId}`;
    }

    return pathToReturn?.trim();
  }, [formSettings, entityPathId, props, state]);

  // form data fetcher
  const { refetch: fetchData, error: fetchDataError, loading: isFetchingData, data: fetchDataResponse } = useGet<
    EntityAjaxResponse
  >({
    path: fetchDataPath,
    // queryParams: { id },
    lazy: true, // We wanna make sure we have both the id and the state?.markup?.formSettings?.getUrl before fetching data
  });

  // submit verb (PUT/POST)
  const submitVerb = useMemo(() => {
    const verb = state?.submitVerb?.toUpperCase() as typeof state.submitVerb;

    const defaultSubmitVerb = id || Boolean(state?.fetchedData) ? 'PUT' : 'POST';

    return verb && isValidSubmitVerb(verb) ? verb : defaultSubmitVerb;
  }, [state?.fetchedData]);

  // submit URL
  const submitUrl = useMemo(() => {
    const url = formSettings 
      ? formSettings[`${submitVerb?.toLocaleLowerCase()}Url`] 
      : null;

    if (!url && formSettings) {
      console.warn(`Please make sure you have specified the '${submitVerb}' URL`);
    }

    return url
      ? evaluateComplexString(url, [
          { match: 'query', data: getQueryParams() },
          { match: 'globalState', data: globalState },
        ])
      : '';
  }, [formSettings, submitVerb]);

  // custom event executed on data loaded
  const onDataLoaded = formSettings?.onDataLoaded;

  // effect that executes onDataLoaded handler
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

  const sameForm = (formId: FormIdentifier, name: string, module: string): boolean => {
    const safeStringsEqual = (a: string, b: string) => (a ?? '').toLowerCase() === (b ?? '').toLowerCase();

    const fullName = asFormFullName(formId);
    return fullName && safeStringsEqual(fullName.name, name) && safeStringsEqual(fullName.module, module);
  }

  //#region get form data
  useEffect(() => {
    // The mismatch happens if you're drilled down to a page and then click the back button on the browser
    // When you land, because you'd still be having the formResponse, before the correct form is being fetched
    // Data/Entity will be fetched with the previous value of the response. That is why we have to check that we don't have the old form response
    //const isPathMismatch = props?.path !== formResponse?.path;
    const correctForm = formConfiguration && sameForm(props.formId, formConfiguration.name, formConfiguration.module);
    
    // note: fetch data if `getUrl` is set even when Id is not provided. Dynamic page can be used not only for entities
    if (fetchDataPath && correctForm) {
      fetchData({ queryParams: entityPathId || !id ? {} : { id } });
    }
  }, [id, formSettings?.getUrl, entityPathId, fetchDataPath]);

  const onChangeId = (localId: string) => {
    setState(prev => ({ ...prev, id: localId }));
  };

  const onChangeFormData = (payload: ISetFormDataPayload) => {
    form?.setFieldsValue(payload?.values);
    formRef?.current?.setFormData({ values: payload?.values, mergeValues: payload?.mergeValues });
  };

  useEffect(() => {
    if (!isFetchingMarkup && fetchDataResponse) {
      setState(prev => ({ ...prev, fetchedData: fetchDataResponse?.result }));
    }
  }, [isFetchingMarkup, fetchDataResponse]);
  //#endregion

  //#region Fetch form and set the state
  useEffect(() => {
    if (formId) {
      fetchFormMarkup();
      return;
    }
  }, [formId]);

  useEffect(() => {
    setState(prev => ({ ...prev, formMarkup: formMarkup, formSettings: formSettings }));
  }, [formMarkup, formSettings]);
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
    if (fetchMarkupError) {
      displayNotificationError(fetchMarkupError);
    }
  }, [fetchMarkupError]);

  //#endregion

  const displayNotificationError = (error: GetDataError<IAjaxResponseBase>) => {
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

  const isLoading = isFetchingData || isFetchingMarkup || isPostingData;

  const markupErrorCode = fetchMarkupError
    ? (fetchMarkupError.data as IAjaxResponseBase)?.error?.code
    : null;

  if (!isLoading && markupErrorCode === 404) {
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
      case isFetchingMarkup:
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
        markup={{ components: state?.formMarkup, formSettings: state?.formSettings }} // pass empty markup to prevent unneeded form fetching
        formId={formId}
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
