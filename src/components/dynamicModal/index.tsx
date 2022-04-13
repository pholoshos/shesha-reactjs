import React, { FC, useEffect, useState } from 'react';
import { Modal, Form, ModalProps } from 'antd';
import { useDynamicModals, useGlobalState } from '../../providers';
import { ConfigurableForm, Show } from '../';
import { FormMode, IFormDto } from '../../providers/form/models';
import { IModalProps } from '../../providers/dynamicModal/models';
import { evaluateString, useForm, useShaRouting } from '../..';
import { useGet } from 'restful-react';
import { useFormGet } from '../../apis/form';
import { getQueryParams } from '../../utils/url';
import { evaluateKeyValuesToObjectMatchedData } from '../../providers/form/utils';
import { IAnyObject } from '../../interfaces';
import ValidationErrors from '../validationErrors';
import _ from 'lodash';

export interface IDynamicModalProps extends Omit<IModalProps, 'fetchUrl'> {
  id: string;
  title?: string;
  isVisible: boolean;

  // todo: move to a separate object
  formId: string;
  mode: FormMode;
  onSubmitted?: (response: any) => void;
}

interface IDynamicModalState {
  formDto: IFormDto;
}

export const DynamicModal: FC<IDynamicModalProps> = props => {
  const {
    id,
    title,
    isVisible,
    formId,
    showModalFooter,
    submitHttpVerb,
    onSuccessRedirectUrl,
    initialValues,
    destroyOnClose,
    parentFormValues,
    width = 800,
    modalConfirmDialogMessage,
    onFailed,
    prepareInitialValues,
    mode = 'edit',
  } = props;

  const { globalState } = useGlobalState();
  const [state, setState] = useState<IDynamicModalState>();
  const { formData } = useForm();
  const [form] = Form.useForm();
  const { hide, removeModal } = useDynamicModals();
  const { router } = useShaRouting();

  const { refetch: fetchEntity, error: fetchEntityError, data: fetchedEntity } = useGet({
    path: state?.formDto?.markup?.formSettings?.getUrl,
    lazy: true,
  });

  const {
    refetch: fetchFormById,
    data: dataById,
    loading: isFetchingFormById,
    error: fetchFormByIdError,
  } = useFormGet({ id: formId, lazy: true });

  useEffect(() => {
    if (formId) {
      fetchFormById();
    }
  }, [formId]);

  useEffect(() => {
    if (!isFetchingFormById && dataById) {
      const result = dataById?.result;
      if (dataById) {
        const formDto: IFormDto = { ...(result as any) };

        formDto.markup = JSON.parse(result.markup);

        const getUrl = formDto?.markup?.formSettings?.getUrl;

        const urlObj = new URL(decodeURIComponent(getUrl));
        const rawQueryParamsToBeEvaluated = getQueryParams(getUrl);
        const queryParamsFromAddressBar = getQueryParams();

        let queryParams: IAnyObject;

        if (getUrl?.includes('?')) {
          if (getUrl?.includes('{{')) {
            queryParams = evaluateKeyValuesToObjectMatchedData(rawQueryParamsToBeEvaluated, [
              { match: 'data', data: formData },
              { match: 'parentFormValues', data: parentFormValues },
              { match: 'globalState', data: globalState },
              { match: 'query', data: queryParamsFromAddressBar },
            ]);
          } else {
            queryParams = rawQueryParamsToBeEvaluated;
          }
        }

        if (getUrl && !_.isEmpty(queryParams)) {
          fetchEntity({
            queryParams,
            path: urlObj?.pathname,
            base: urlObj?.origin,
          });
        }

        setState(prev => ({ ...prev, formDto }));
      }
    }
  }, [isFetchingFormById]);

  const onOk = () => {
    if (showModalFooter) {
      form?.submit();
    } else {
      hideForm();
    }
  };

  const beforeSubmit = () => {
    return new Promise<boolean>((resolve, reject) => {
      if (modalConfirmDialogMessage) {
        Modal.confirm({ content: modalConfirmDialogMessage, onOk: () => resolve(true), onCancel: () => reject(false) });
      } else {
        resolve(true);
      }
    });
  };

  const onSubmitted = (_: any, response: any) => {
    form.resetFields();

    if (onSuccessRedirectUrl) {
      const computedRedirectUrl = evaluateString(onSuccessRedirectUrl, response);

      router?.push(computedRedirectUrl);
    }

    hideForm();
    if (props.onSubmitted) props.onSubmitted(response);
  };

  const onCancel = () => {
    hideForm();
  };

  const hideForm = () => {
    hide(id);

    if (destroyOnClose) {
      removeModal(id);
    }
  };

  const footerProps: ModalProps = showModalFooter ? {} : { footer: null };

  const computedInitialValues = fetchedEntity
    ? prepareInitialValues
      ? prepareInitialValues(fetchedEntity?.result)
      : fetchedEntity?.result
    : initialValues;

  return (
    <Modal
      key={id}
      title={title}
      visible={isVisible}
      onOk={onOk} // not used
      onCancel={hideForm} // not used
      {...footerProps}
      destroyOnClose
      width={width} // Hardcoded for now. This will be configurable very shortly
    >
      <ValidationErrors error={fetchEntityError} />
      <ValidationErrors error={fetchFormByIdError} />

      <Show when={Boolean(state?.formDto?.markup)} loadingComponent={<div>Loading...</div>}>
        <ConfigurableForm
          // id={formId}
          form={form}
          markup={state?.formDto?.markup}
          mode={mode}
          actions={{
            close: onCancel,
          }}
          onFinish={onSubmitted}
          onFinishFailed={onFailed}
          beforeSubmit={beforeSubmit}
          httpVerb={submitHttpVerb}
          initialValues={computedInitialValues}
          parentFormValues={parentFormValues}
        />
      </Show>
    </Modal>
  );
};

export default DynamicModal;
