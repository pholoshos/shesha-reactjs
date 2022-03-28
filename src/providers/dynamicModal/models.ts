import { ValidateErrorEntity } from '../../interfaces';
import { IKeyValue } from '../../interfaces/keyValue';

/**
 * Dynamic Modal properties
 */
export interface IModalProps {
  /**
   * Id of the form to be rendered on the markup
   */
  formId: string;

  /**
   * Url to be used to fetch form data
   */
  fetchUrl?: string;

  /**
   * Whether the modal footer should be shown. The modal footer shows default buttons Submit and Cancel.
   *
   * The url to use will be found in the form settings and the correct verb to use is specified by submitHttpVerb
   */
  showModalFooter?: boolean;

  /**
   * What http verb to use when submitting the form. Used in conjunction with `showModalFooter`
   */
  submitHttpVerb?: 'POST' | 'PUT';

  /**
   * Title to display on the modal
   */
  title?: string;
  // path | id | markup

  /**
   * Id of the modal to be shown
   */
  id: string;

  /**
   * Whether the modal is visible
   */
  isVisible: boolean;

  /**
   * A callback to execute when the form has been submitted
   */
  onSubmitted?: (values?: any) => void;

  onFailed?: (errorInfo: ValidateErrorEntity<any>) => void;

  /**
   * If passed, the user will be redirected to this url on success
   */
  onSuccessRedirectUrl?: string;

  /**
   * Initial values of the modal
   */
  initialValues?: any;

  parentFormValues?: any;

  destroyOnClose?: boolean;

  width?: number;

  modalConfirmDialogMessage?: string;
}

/**
 * Modal dialog instance
 */
export interface IModalInstance {
  id: string;
  isVisible: boolean;
  props: IModalProps;
}

/**
 * An interface for configuring the modal on the form designer for buttons, toolbarItem and columns
 */
export interface IModalProperties {
  modalTitle?: string;
  modalFormId?: string;
  submitHttpVerb?: 'POST' | 'PUT';
  onSuccessRedirectUrl?: string;
  additionalProperties?: IKeyValue[];
  modalWidth?: number;
  showModalFooter?: boolean;
}
