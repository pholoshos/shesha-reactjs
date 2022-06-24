import React, { FC } from 'react';
import { Modal, Form, ModalProps } from 'antd';
import { useDynamicModals } from '../../providers';
import { ConfigurableForm } from '../';
import { FormMode } from '../../providers/form/models';
import { IModalProps } from '../../providers/dynamicModal/models';
import { evaluateString, useShaRouting } from '../..';
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
    onCancel,
  } = props;

  const [form] = Form.useForm();
  const { hide, removeModal } = useDynamicModals();
  const { router } = useShaRouting();

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
      width={width} // Hardcoded for now. This will be configurable very shortly
    >
      <ConfigurableForm
        id={formId}
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
