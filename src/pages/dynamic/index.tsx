import { LoadingOutlined } from '@ant-design/icons';
import { Button, Form, message, notification, Result, Spin } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { nanoid } from 'nanoid/non-secure';
import Link from 'next/link';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { GetDataError, useGet, useMutate } from 'restful-react';
import { axiosHttp } from '../../apis/axios';
import { ConfigurableForm, ValidationErrors } from '../../components';
import { usePubSub, usePrevious } from '../../hooks';
import { PageWithLayout } from '../../interfaces';
import { IAjaxResponseBase } from '../../interfaces/ajaxResponse';
import {
  useGlobalState,
  useSheshaApplication,
  MetadataProvider,
  useMetadataDispatcher,
  useShaRouting,
} from '../../providers';
import { useFormConfiguration } from '../../providers/form/api';
import { ConfigurableFormInstance, ISetFormDataPayload } from '../../providers/form/contexts';
import { FormIdentifier, IFormSettings } from '../../providers/form/models';
import {
  asFormFullName,
  evaluateComplexString,
  getComponentsFromMarkup,
  removeZeroWidthCharsFromString,
  useFormDesignerComponents,
} from '../../providers/form/utils';
import { getQueryParams, isValidSubmitVerb } from '../../utils/url';
import { EntityAjaxResponse, IDynamicPageProps, IDynamicPageState, INavigationState } from './interfaces';
import { DynamicFormPubSubConstants } from './pubSub';
import { IModelMetadata, IPropertyMetadata } from '../../interfaces/metadata';
import { componentsTreeToFlatStructure } from '../..';
import { useStackedModal } from './navigation/stackedNavigationModalProvider';
import isDeepEqual from 'fast-deep-equal/react';
import { useStackedNavigation } from './navigation/stakedNavigation';
import StackedNavigationModal from './navigation/stackedNavigationModal';

const DynamicPage: PageWithLayout<IDynamicPageProps> = props => {
  const { backendUrl } = useSheshaApplication();
  const [state, setState] = useState<IDynamicPageState>({});
  const formRef = useRef<ConfigurableFormInstance>();
  const { globalState } = useGlobalState();
  const { router } = useShaRouting();

  const { publish } = usePubSub();

  const { getMetadata: fetchMeta } = useMetadataDispatcher();
  const [metadata, setMetadata] = useState<IModelMetadata>();
  const [metadataFetchCount, setMetadataFetchCount] = useState<number>(null);

  const { id, formId, entityPathId } = state;

  const {
    refetch: fetchFormMarkup,
    formConfiguration,
    loading: isFetchingMarkup,
    error: fetchMarkupError,
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
    const url = formSettings ? formSettings[`${submitVerb?.toLocaleLowerCase()}Url`] : null;

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

  //#region routing
  const { setCurrentNavigator, navigator } = useStackedNavigation();
  const [navigationState, setNavigationState] = useState<INavigationState>();
  const { parentId } = useStackedModal(); // If the parentId is null, we're in the root page
  const closing = useRef(false);

  useEffect(() => {
    const stackId = nanoid();

    if (props?.navMode === 'stacked' || navigationState) {
      const isInitialized = state?.formId || state?.entityPathId;

      if (!isInitialized) {
        setState({ ...props, stackId });
        setCurrentNavigator(stackId);
      } else if (navigationState && navigationState?.closing) {
        setNavigationState(null); // We're closing the dialog
      }
    } else {
      setState({ ...props, stackId });
      setCurrentNavigator(stackId);
    }
  }, [props]);

  const previousProps = usePrevious(props);
  const previousRouter = usePrevious(router?.query);

  useEffect(() => {
    if (!router?.query?.navMode && !navigationState) {
      return;
    } else if (!parentId && !router?.query?.navMode) {
      setNavigationState(null);
      setCurrentNavigator(state?.stackId);

      setState(prev => ({ ...prev, ...router?.query }));
      closing.current = false;
      return;
    }

    if (
      navigator &&
      state?.stackId === navigator &&
      !navigationState &&
      !closing?.current &&
      !isDeepEqual(previousProps, router?.query) &&
      !isDeepEqual(previousRouter, router?.query)
    ) {
      const fullPath =
        props && Array.isArray(props.path)
          ? props.path.length === 1
            ? [null, props.path[0]]
            : props.path.length === 2
            ? [props.path[0], props.path[1]]
            : [null, null]
          : [null, null];

      setNavigationState({
        ...router?.query,
        formId: {
          module: fullPath[0],
          name: fullPath[1],
        },
      });
      closing.current = false;
    }
    closing.current = false;
  }, [router]);

  useEffect(() => {
    if (navigationState?.closing) {
      router?.back();
    }
  }, [navigationState?.closing]);

  const onStackedDialogClose = () => {
    closing.current = true;

    setNavigationState(prev => ({ ...prev, closing: true }));
    setCurrentNavigator(state?.stackId);
  };

  const hasDialog = Boolean(props?.onCloseDialog);
  //#endregion

  const sameForm = (formId: FormIdentifier, name: string, module: string): boolean => {
    const safeStringsEqual = (a: string, b: string) => (a ?? '').toLowerCase() === (b ?? '').toLowerCase();

    const fullName = asFormFullName(formId);
    return fullName && safeStringsEqual(fullName.name, name) && safeStringsEqual(fullName.module, module);
  };

  useEffect(() => {
    if (formSettings?.modelType)
      fetchMeta({ modelType: formSettings?.modelType }).then(meta => {
        setMetadata(meta);
      });
  }, [formSettings?.modelType]);

  // just for intrenal use
  interface IFieldData {
    name: string;
    child: IFieldData[];
    property: IPropertyMetadata;
  }

  const getProperties = (field: IFieldData) => {
    if (field.property?.dataType == 'entity') {
      setMetadataFetchCount(count => (count == null ? 1 : count + 1));
      fetchMeta({ modelType: field.property.entityType }).then(meta => {
        field.child.forEach(item => {
          item.property = meta.properties.find(p => p.path.toLowerCase() == item.name.toLowerCase());
          getProperties(item);
        });
        setMetadataFetchCount(count => count - 1);
      });
    } else {
    }
  };

  const getFieldsFromCustomEvents = (code: string) => {
    if (!code) return [];
    const reg = new RegExp('(?<![_a-zA-Z0-9.])data.[_a-zA-Z0-9.]+', 'g');
    const matchAll = code.matchAll(reg);
    if (!matchAll) return [];
    const match = Array.from(matchAll);
    return match.map(item => item[0].replace('data.', ''));
  };

  const toolboxComponent = useFormDesignerComponents();

  const gqlFields = useMemo(() => {
    if (!metadata || !formMarkup) return null;

    let fields: IFieldData[] = [];
    const components = componentsTreeToFlatStructure(toolboxComponent, getComponentsFromMarkup(formMarkup))
      .allComponents;
    let fieldNames = [];
    for (const key in components) {
      fieldNames.push(components[key].name);
    }

    fieldNames = fieldNames.concat(formSettings?.fieldsToFetch ?? []);

    formMarkup.forEach(item => {
      fieldNames = fieldNames.concat(getFieldsFromCustomEvents(item.customEnabled));
      fieldNames = fieldNames.concat(getFieldsFromCustomEvents(item.customVisibility));
      fieldNames = fieldNames.concat(getFieldsFromCustomEvents(item.onBlurCustom));
      fieldNames = fieldNames.concat(getFieldsFromCustomEvents(item.onChangeCustom));
      fieldNames = fieldNames.concat(getFieldsFromCustomEvents(item.onFocusCustom));
    });
    fieldNames.push('id');

    fieldNames = fieldNames.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    let prevItem = null;
    fieldNames.forEach(item => {
      if (item && prevItem != item) {
        item = item.trim();
        prevItem = item;
        let path = item.split('.');

        if (path.length == 1) {
          fields.push({
            name: item,
            child: [],
            property: metadata?.properties.find(p => p.path.toLowerCase() == path[0].toLowerCase()),
          });
          return;
        }

        let i = 0;
        let parent: IFieldData = null;
        while (i < path.length) {
          let fs = parent?.child ?? fields;
          let field = fs.find(f => f.name == path[i]);
          if (!field) {
            field = {
              name: path[i],
              child: [],
              property:
                i == 0
                  ? metadata?.properties.find(p => p.path.toLowerCase() == path[0].toLowerCase())
                  : parent?.property?.dataType == 'object'
                  ? parent.property.properties?.find(p => p.path.toLowerCase() == path[i].toLowerCase())
                  : null,
            };
            fs.push(field);
          }
          parent = field;
          i++;
        }
      }
    });

    setMetadataFetchCount(0);
    fields.forEach(item => {
      getProperties(item);
    });
    return fields;
  }, [metadata, formMarkup]);

  const fetchFields = useMemo(() => {
    if (metadataFetchCount == 0) {
      let resf = (items: IFieldData[]) => {
        let s = '';
        items.forEach(item => {
          if (!item.property) return;
          s += s ? ',' + item.name : item.name;
          if (item.child.length > 0) {
            s += '{' + resf(item.child) + '}';
          }
        });

        return s;
      };

      return resf(gqlFields);
    }
    return null;
  }, [metadataFetchCount]);

  //#region get form data

  const fetcherRef = useRef<() => Promise<EntityAjaxResponse>>();
  const fetchFormData = () => {
    return fetchData({ queryParams: entityPathId || !id ? {} : { id, properties: fetchFields } });
  };

  useEffect(() => {
    // The mismatch happens if you're drilled down to a page and then click the back button on the browser
    // When you land, because you'd still be having the formResponse, before the correct form is being fetched
    // Data/Entity will be fetched with the previous value of the response. That is why we have to check that we don't have the old form response
    //const isPathMismatch = props?.path !== formResponse?.path;
    const correctForm = formConfiguration && sameForm(formId, formConfiguration.name, formConfiguration.module);

    // note: fetch data if `getUrl` is set even when Id is not provided. Dynamic page can be used not only for entities
    if (fetchDataPath && correctForm && fetchFields) {
      fetcherRef.current = fetchFormData;
      fetchFormData();
    }
  }, [id, fetchFields, formSettings?.getUrl, entityPathId, fetchDataPath]);

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
    setState(prev => ({
      ...prev,
      formMarkup: formMarkup,
      formSettings: formSettings,
      formProps: formConfiguration,
    }));
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

  useEffect(() => {
    if (state?.formSettings?.onInitialized) {
      getExpressionExecutor(state?.formSettings?.onInitialized);
    }
  }, [state?.formSettings?.onInitialized]);

  //#endregion

  const displayNotificationError = (error: GetDataError<IAjaxResponseBase>) => {
    notification.error({
      message: 'Sorry! An error occurred.',
      icon: null,
      description: <ValidationErrors error={error} renderMode="raw" />,
    });
  };

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

  const markupErrorCode = fetchMarkupError ? (fetchMarkupError.data as IAjaxResponseBase)?.error?.code : null;

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

  const refetchFormData = () => {
    return fetcherRef.current ? fetcherRef.current() : Promise.reject('Fetcher is not ready');
  };

  return (
    <Fragment>
      <div id="modalContainerId" className={classNames('sha-dynamic-page', { 'has-dialog': hasDialog })}>
        <Spin spinning={isLoading} tip={getLoadingHint()} indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}>
          <MetadataProvider id="dynamic" modelType={formSettings?.modelType}>
            <ConfigurableForm
              markup={{
                components: state?.formMarkup,
                formSettings: state?.formSettings ? { ...state?.formSettings, onInitialized: null } : null,
              }} // pass empty markup to prevent unneeded form fetching
              formId={formId}
              formProps={state?.formProps}
              formRef={formRef}
              mode={state?.mode}
              form={form}
              actions={{ onChangeId, onChangeFormData }}
              onFinish={onFinish}
              initialValues={state?.fetchedData}
              skipPostOnFinish
              skipFetchData
              refetchData={() => refetchFormData()}
              className="sha-dynamic-page"
            />
          </MetadataProvider>
        </Spin>
      </div>

      <StackedNavigationModal
        onCancel={onStackedDialogClose}
        title="NAVIGATE"
        visible={Boolean(navigationState)}
        parentId={state?.stackId}
      >
        <DynamicPage onCloseDialog={onStackedDialogClose} {...navigationState} />
      </StackedNavigationModal>
    </Fragment>
  );
};
export default DynamicPage;
