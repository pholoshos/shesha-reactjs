import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { ButtonType } from 'antd/lib/button';
import { IConfigurableFormComponent } from "../../../../../../interfaces";
import { IKeyValue } from '../../../../../../interfaces/keyValue';

export interface IToolbarPropsV0 extends IConfigurableFormComponent {
    items: ToolbarItemPropsV0[];
}

type ToolbarItemTypeV0 = 'item' | 'group';

type ButtonGroupTypeV0 = 'inline' | 'dropdown';

export type ToolbarItemPropsV0 = IToolbarButtonV0 | IButtonGroupV0;

type ToolbarItemSubTypeV0 = 'button' | 'separator' | 'line';
type ButtonActionTypeV0 =
    | 'navigate'
    | 'dialogue'
    | 'executeScript'
    | 'executeFormAction' // This is the old one which is now only being used for backward compatibility. The new one is 'customAction' to be consistent with the ButtonGroup
    | 'customAction' // This is the new one. Old one is 'executeFormAction'
    | 'submit'
    | 'reset'
    | 'startFormEdit'
    | 'cancelFormEdit';

export interface IToolbarItemBaseV0 {
    id: string;
    name: string;
    label: string;
    tooltip?: string;
    sortOrder: number;
    danger?: boolean;
    itemType: ToolbarItemTypeV0;
    groupType?: ButtonGroupTypeV0;
    icon?: string;
    buttonType?: ButtonType;
    customVisibility?: string;
    customEnabled?: string;
    permissions?: string[];
}

export interface IToolbarButtonV0 extends IToolbarItemBaseV0 {
    itemSubType: ToolbarItemSubTypeV0;
    buttonAction?: ButtonActionTypeV0;
    refreshTableOnSuccess?: boolean;
    targetUrl?: string;

    /**
     * @deprecated - use customAction. It is named that way to be consistent with the 
     */
    formAction?: string;
    customAction?: string;
    customActionParameters?: string;
    actionScript?: string;
    size?: SizeType;
    modalFormId?: string;
    modalTitle?: string;
    modalWidth?: number;
    modalActionOnSuccess?: 'keepOpen' | 'navigateToUrl' | 'close' | undefined;
    showConfirmDialogBeforeSubmit?: boolean;
    modalConfirmDialogMessage?: string;

    onSuccessScript?: string;

    onErrorScript?: string;
}

export interface IButtonGroupV0 extends IToolbarItemBaseV0 {
    childItems?: ToolbarItemPropsV0[];
}

export interface IToolbarButtonTableDialogPropsV0 extends Omit<IModalPropsV0, 'formId' | 'isVisible'>, IToolbarButtonV0 {
    modalProps?: IModalPropsV0;
    additionalProperties?: IKeyValue[];
  }

export interface IModalPropsV0 {
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
  
    /**
     * If passed, the user will be redirected to this url on success
     */
    onSuccessRedirectUrl?: string;
  
    /**
     * If specified, the form data will not be fetched, even if the GET Url has query parameters that can be used to fetch the data.
     * This is useful in cases whereby one form is used both for create and edit mode
     */
    skipFetchData?: boolean;
  
    submitLocally?: boolean;
  
    width?: number;
  
    modalConfirmDialogMessage?: string;
  
    /**
     * If passed and the form has `getUrl` defined, you can use this function to prepare `fetchedData` for as `initialValues`
     * If you want to use only `initialValues` without combining them with `fetchedData` and then ignore `fetchedData`
     *
     * If not passed, `fetchedData` will be used as `initialValues`
     *
     * Whenever the form has a getUrl and that url has queryParams, buy default, the `dynamicModal` will fetch the form and, subsequently, the data
     * for that form
     */
    prepareInitialValues?: (fetchedData: any) => any;
  
    onCancel?: () => void;
  }
  