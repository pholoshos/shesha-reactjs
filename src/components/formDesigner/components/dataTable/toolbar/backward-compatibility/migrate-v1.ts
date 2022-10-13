import { IConfigurableActionConfiguration } from "../../../../../../interfaces/configurableAction";
import { IKeyValue } from "../../../../../../interfaces/keyValue";
import { FormIdentifier } from "../../../../../../providers/form/models";
import { ToolbarItemProps } from "../../../../../../providers/toolbarConfigurator/models";
import { IToolbarProps } from "../models";
import { IToolbarButtonTableDialogPropsV0, IToolbarButtonV0, IToolbarPropsV0 } from "./models-v1";

interface IShowModalactionArguments {
    modalTitle: string;
    formId: FormIdentifier;
    showModalFooter: boolean;
    additionalProperties?: IKeyValue[];
    modalWidth?: number;
    /**
     * What http verb to use when submitting the form
     */
    submitHttpVerb?: 'POST' | 'PUT';
}

export const migrateV0toV2 = (model: IToolbarPropsV0): IToolbarProps => {

    const items = (model.items ?? []).map<ToolbarItemProps>(item => {
        if (item.itemType === "item") {
            if (item['actionConfiguration'])
                return item;
            const buttonProps = item as IToolbarButtonV0;
            if (buttonProps.itemSubType === 'button') {
                let actionConfig: IConfigurableActionConfiguration = null;
                switch (buttonProps.buttonAction) {
                    case "cancelFormEdit": {
                        actionConfig = {
                            actionOwner: 'Form',
                            actionName: 'Cancel Edit',
                            handleFail: false,
                            handleSuccess: false,
                        }
                    }
                    case "reset": {
                        actionConfig = {
                            actionOwner: 'Form',
                            actionName: 'Reset',
                            handleFail: false,
                            handleSuccess: false,
                        }
                    }
                    case "submit": {
                        actionConfig = {
                            actionOwner: 'Form',
                            actionName: 'Submit',
                            handleFail: false,
                            handleSuccess: false,
                        }
                    }
                    case "startFormEdit": {
                        actionConfig = {
                            actionOwner: 'Form',
                            actionName: 'Start Edit',
                            handleFail: false,
                            handleSuccess: false,
                        }
                    }
                    case "navigate": {
                        actionConfig = {
                            actionOwner: 'Common',
                            actionName: 'Navigate',
                            handleFail: false,
                            handleSuccess: false,
                            actionArguments: {
                                target: buttonProps.targetUrl
                            },
                        }
                    }
                    case "dialogue": {
                        actionConfig = {
                            actionOwner: 'Common',
                            actionName: 'Show Dialog',
                            handleFail: false,
                            handleSuccess: false,
                        }

                        const propsWithModal = buttonProps as IToolbarButtonTableDialogPropsV0;

                        const modalArguments: IShowModalactionArguments = {
                            modalTitle: buttonProps.modalTitle,
                            formId: buttonProps.modalFormId,

                            showModalFooter: propsWithModal.showModalFooter,
                            submitHttpVerb: propsWithModal.submitHttpVerb,
                            additionalProperties: propsWithModal.additionalProperties,
                            modalWidth: propsWithModal.width,
                        };
                        actionConfig.actionArguments = modalArguments;

                        if (propsWithModal.onSuccessRedirectUrl){
                            actionConfig.handleSuccess = true;
                            actionConfig.onSuccess = {
                                actionOwner: 'Common',
                                actionName: 'Navigate',
                                actionArguments: {
                                    target: propsWithModal.onSuccessRedirectUrl
                                },
                                handleSuccess: false,
                                handleFail: false,
                            };
                        }
                        if (propsWithModal.refreshTableOnSuccess){
                            actionConfig.handleSuccess = true;
                            actionConfig.onSuccess = {
                                actionOwner: null,//propsWithModal.uni,
                                actionName: 'Refresh table',
                                handleSuccess: false,
                                handleFail: false,
                            };
                        }
                    }
                    case "executeScript": {

                    }
                    case "executeFormAction": {
                        //buttonProps.event
                        //eventName
                    }
                    case "customAction": {

                    }
                }

                return {
                    ...item,
                    actionConfiguration: actionConfig
                }
            }
        }

        return item;
    });

    return { ...model, items: items };
}