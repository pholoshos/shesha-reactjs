import { LoadingOutlined } from '@ant-design/icons';
import { Button, Form, message, notification, Result, Spin } from 'antd';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { GetDataError, useGet, useMutate } from 'restful-react';
import { FormDto, useFormGet, useFormGetByPath } from '../../apis/form';
import { AjaxResponseBase } from '../../apis/user';
import { ConfigurableForm, ValidationErrors } from '../../components';
import { useSubscribe } from '../../hooks';
import { PageWithLayout } from '../../interfaces';
import { ConfigurableFormInstance } from '../../providers/form/contexts';
import { FormMarkupWithSettings } from '../../providers/form/models';
import { removeZeroWidthCharsFromString } from '../../providers/form/utils';
import { DynamicFormPubSubConsants as DynamicFormPubSubConstants } from './pubSub';

type FormMode = 'designer' | 'edit' | 'readonly';

export interface IDynamicPageProps {
  /**
   * Form path. You can pass either this or `formId`. This is required if `formId` is not provided
   */
  path?: string;

  /**
   * Entity id. This should not be confused with the form id
   */
  id?: string;

  /**
   * Form id. You can pass either this or the `path`. This is required if `path` is not provided
   */
  formId?: string;

  /**
   * form mode.
   */
  mode?: FormMode;
}

export interface EntityAjaxResponse {
  targetUrl?: string | null;
  success?: boolean;
  error?: unknown;
  unAuthorizedRequest?: boolean;
  __abp?: boolean;
  result?: IEntity;
}

interface IFormDto extends Omit<FormDto, 'markup'> {
  markup: FormMarkupWithSettings;
}

interface IEntity {
  id: string;
  [name: string]: unknown;
}

interface IDynamicPageState extends IDynamicPageProps {
  formResponse?: IFormDto;
  fetchedEntity?: IEntity;
  mode?: FormMode;
}

const DynamicPage: PageWithLayout<IDynamicPageProps> = props => {
  const [state, setState] = useState<IDynamicPageState>({});
  const formRef = useRef<ConfigurableFormInstance>();

  const { id, path, formId, mode } = state;

  const {
    refetch: fetchEntity,
    error: fetchEntityError,
    loading: isFetchingEntity,
    data: fetchEntityResponse,
  } = useGet<EntityAjaxResponse>({
    path: removeZeroWidthCharsFromString(state?.formResponse?.markup?.formSettings?.getUrl) || '',
    // queryParams: { id },
    lazy: true, // We wanna make sure we have both the id and the state?.markup?.formSettings?.getUrl before fetching data
  });

  const {
    refetch: fetchFormByPath,
    data: dataByPath,
    loading: isFetchingFormByPath,
    error: fetchFormByPathError,
  } = useFormGetByPath({ queryParams: { path }, lazy: true });

  const { mutate: postEntity, loading: isPostingData } = useMutate({
    path: removeZeroWidthCharsFromString(state?.formResponse?.markup?.formSettings?.putUrl),
    verb: id ? 'PUT' : 'POST',
  });

  const [form] = Form.useForm();

  const {
    refetch: fetchFormById,
    data: dataById,
    loading: isFetchingFormById,
    error: fetchFormByIdError,
  } = useFormGet({ id: formId, lazy: true });

  useEffect(() => {
    setState(prev => ({ ...prev, ...props, mode: props?.mode || 'readonly' }));
  }, [props]);

  //#region get form data
  useEffect(() => {
    // Avoid fetching entity if we're displaying index table
    if (id && props?.id) {
      fetchEntity({ queryParams: { id } });
    }
  }, [id, state?.formResponse?.markup?.formSettings?.getUrl]);

  useEffect(() => {
    if (!isFetchingFormByPath && fetchEntityResponse) {
      setState(prev => ({ ...prev, fetchedEntity: fetchEntityResponse?.result }));
    }
  }, [isFetchingFormByPath, fetchEntityResponse]);
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
      result = dataByPath.result;
    }

    if (dataById) {
      result = dataById.result;
    }

    if (result) {
      const formResponse: IFormDto = { ...(result as any) };
      formResponse.markup = JSON.parse(result.markup);

      setState(prev => ({ ...prev, formResponse }));
    }
  }, [dataByPath, dataById]);
  //#endregion

  const onFinish = (values: any) => {
    postEntity(values)
      .then(() => {
        message.success('Data saved successfully!');

        formRef?.current?.setFormMode('readonly');
      })
      .catch(error => {
        console.log('onFinish error :>> ', error);
      });
  };

  //#region Error messages
  useEffect(() => {
    if (fetchEntityError) {
      displayNotificationError(fetchEntityError);
    }
  }, [fetchEntityError]);

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
    form?.setFieldsValue(state?.fetchedEntity);

    formRef?.current?.setFormData({ values: state?.fetchedEntity, mergeValues: true });

    formRef?.current?.setFormMode('readonly');
  });

  useEffect(() => {
    if (state && !state?.formResponse?.markup && state?.path) {
      notification.error({
        message: 'Form not found',
        description: (
          <span>
            Could not firm with the path <strong>{state?.path}</strong>. Please make sure the path is correct or that it
            hasn't been changed
          </span>
        ),
      });
    }
  }, [state?.formResponse?.markup]);

  const isLoading = isFetchingEntity || isFetchingFormByPath || isFetchingFormById || isPostingData;

  if (state && !state?.formResponse?.markup && !isLoading) {
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
      case isFetchingEntity:
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
        mode={mode}
        form={form}
        onFinish={onFinish}
        initialValues={state?.fetchedEntity}
        skipPostOnFinish
        className="sha-dynamic-page"
      />
    </Spin>
  );
};

export default DynamicPage;
