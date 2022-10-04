import React, { FC } from 'react';
import { Modal, Form, ModalProps } from 'antd';
import { useDynamicModals } from '../../providers';
import { ConfigurableForm } from '../';
import { FormIdentifier, FormMode } from '../../providers/form/models';
import { IModalProps } from '../../providers/dynamicModal/models';
import { evaluateString, useShaRouting } from '../..';
import _ from 'lodash';
import { useMedia } from 'react-use';

export interface IDynamicModalProps extends Omit<IModalProps, 'fetchUrl'> {
  id: string;
  title?: string;
  isVisible: boolean;

  // todo: move to a separate object
  formId: FormIdentifier;
  mode: FormMode;
  onSubmitted?: (response: any) => void;
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
    skipFetchData,
    submitLocally,
    onCancel,
  } = props;

  const [form] = Form.useForm();
  const { hide, removeModal } = useDynamicModals();
  const { router } = useShaRouting();
  const isSmall = useMedia('(max-width: 480px)');

  const onOk = () => {
    //console.log('LOG:onOk')
    if (submitLocally) {
      const formValues = form?.getFieldsValue();

      onSubmitted(null, formValues);
    } else {
      if (showModalFooter) {
        form?.submit();
      } else {
        hideForm();
      }
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
    debugger
    console.log('LOG:onSubmitted')
    if (onSuccessRedirectUrl) {
      const computedRedirectUrl = evaluateString(onSuccessRedirectUrl, response);

      router?.push(computedRedirectUrl);
    }

    if (props.onSubmitted) {
      props.onSubmitted(response);
    }

    hideForm();

    form.resetFields();
  };

  const handleCancel = () => {
    hideForm();

    if (onCancel) {
      onCancel();
    }
  };

  const hideForm = () => {
    hide(id);

    if (destroyOnClose) {
      removeModal(id);
    }
  };

  const footerProps: ModalProps = showModalFooter ? {} : { footer: null };

  return (
    <Modal
      key={id}
      title={title}
      visible={isVisible}
      onOk={onOk} // not used
      onCancel={hideForm} // not used
      {...footerProps}
      destroyOnClose
      width={isSmall ? width : '60%'}
      maskClosable={false}
    >
      <ConfigurableForm
        formId={formId}
        form={form}
        mode={mode}
        actions={{
          close: handleCancel,
        }}
        onFinish={onSubmitted}
        prepareInitialValues={prepareInitialValues}
        onFinishFailed={onFailed}
        beforeSubmit={beforeSubmit}
        httpVerb={submitHttpVerb}
        initialValues={initialValues}
        parentFormValues={parentFormValues}
        skipFetchData={skipFetchData}
      />
    </Modal>
  );
};

export default DynamicModal;
