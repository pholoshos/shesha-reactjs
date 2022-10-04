import React, { FC, useReducer, useContext, PropsWithChildren, useEffect } from 'react';
import DynamicModalReducer from './reducer';
import {
  DynamicModalActionsContext,
  DynamicModalInstanceContext,
  DynamicModalStateContext,
  DYNAMIC_MODAL_CONTEXT_INITIAL_STATE,
} from './contexts';
import {
  openAction,
  toggleAction,
  createModalAction,
  removeModalAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import { IModalProps } from './models';
import { DynamicModal } from '../../components/dynamicModal';
import { useConfigurableActionDispatcher } from '../configurableActionsDispatcher';
import { dialogArgumentsForm } from './actions/show-dialog-arguments';
import { FormIdentifier } from '../form/models';
import { IKeyValue } from '../../interfaces/keyValue';
import { nanoid } from 'nanoid/non-secure';
import { evaluateKeyValuesToObject } from '../form/utils';

export interface IDynamicModalProviderProps {}

export interface IShowModalactionArguments {
  modalTitle: string;
  formId: FormIdentifier;
  showModalFooter: boolean;
  additionalProperties?: IKeyValue[];
  modalWidth?: number;
}

const DynamicModalProvider: FC<PropsWithChildren<IDynamicModalProviderProps>> = ({ children }) => {
  const [state, dispatch] = useReducer(DynamicModalReducer, {
    ...DYNAMIC_MODAL_CONTEXT_INITIAL_STATE,
  });

  const { registerAction } = useConfigurableActionDispatcher();
  useEffect(() => {
    registerAction<IShowModalactionArguments>({
      name: 'Show Dialog',
      owner: 'Common',
      hasArguments: true,
      executer: (actionArgs, context) => {
        console.log('show dialog') 
        const modalId = nanoid();

        const formData = context?.formData ?? {};
        const initialValues = evaluateKeyValuesToObject(actionArgs.additionalProperties, formData);
        const parentFormValues = formData;

        return new Promise((resolve, reject) => {
          

          const modalProps: IModalProps = {
            ...actionArgs,
            id: modalId,
            initialValues: initialValues,
            parentFormValues: parentFormValues,
            isVisible: true,
            onSubmitted: (values) => {
              removeModal(modalId);
              
              console.log('dialog success:', { values });
              resolve(values); // todo: return result e.g. we may need to handle created entity id and navigate to edit/details page
            },
            /*
            onFailed: (error) => {
              removeModal(modalId);

              console.log('dialog failed:', { error });
              reject(); // todo: return error
            },*/
          };
          console.log('modalProps', modalProps)
          createModal({ ...modalProps, isVisible: true });
          
          // wait for modal completion and resolve the promise
          // if submit failed - reject it
        });
      },
      argumentsFormMarkup: dialogArgumentsForm
    });
  }, []);
  /*
      const modalProps: IModalProps = {
      id: props.id, // link modal to the current form component by id
      isVisible: false,
      formId: props.modalFormId,
      title: props.modalTitle,
      showModalFooter: convertedProps?.showModalFooter,
      submitHttpVerb: convertedProps?.submitHttpVerb,
      onSuccessRedirectUrl: convertedProps?.onSuccessRedirectUrl,
      destroyOnClose: true,
      width: props?.modalWidth,
      initialValues: evaluateKeyValuesToObject(convertedProps?.additionalProperties, formData),
      parentFormValues: formData,
    };
 */
  /* NEW_ACTION_DECLARATION_GOES_HERE */

  const toggle = (id: string, isVisible: boolean) => {
    dispatch(toggleAction({ id, isVisible }));
  };
  const show = (id: string) => {
    toggle(id, true);
  };
  const hide = (id: string) => {
    toggle(id, false);
  };

  const open = (modalProps: IModalProps) => {
    dispatch(openAction(modalProps));
  };

  const createModal = (modalProps: IModalProps) => {
    dispatch(createModalAction({ modalProps }));
  };

  const removeModal = (id: string) => {
    dispatch(removeModalAction(id));
  };

  const modalExists = (id: string) => {
    return Boolean(state.instances[id]);
  };

  const renderInstances = () => {
    const rendered = [];
    for (const id in state.instances) {
      if (state.instances.hasOwnProperty(id)) {
        const instance = state.instances[id];
        rendered.push(
          <DynamicModalInstanceContext.Provider
            key={instance.id}
            value={{
              instance,
              show: () => show(instance.id),
              hide: () => hide(instance.id),
              close: () => removeModal(instance.id),
            }}
          >
            <DynamicModal
              key={instance.id}
              id={instance.id}
              title={instance.props.title}
              isVisible={instance.isVisible}
              mode={instance?.props?.mode}
              formId={instance.props.formId}
              onSubmitted={instance.props.onSubmitted}
              onFailed={instance.props.onFailed}
              showModalFooter={instance?.props?.showModalFooter}
              submitHttpVerb={instance?.props?.submitHttpVerb}
              onSuccessRedirectUrl={instance?.props?.onSuccessRedirectUrl}
              initialValues={instance?.props?.initialValues}
              parentFormValues={instance?.props?.parentFormValues}
              destroyOnClose={instance?.props?.destroyOnClose}
              skipFetchData={instance?.props?.skipFetchData}
              width={instance?.props?.width}
              submitLocally={instance?.props?.submitLocally}
              modalConfirmDialogMessage={instance?.props?.modalConfirmDialogMessage}
              prepareInitialValues={instance?.props?.prepareInitialValues}
              onCancel={instance?.props?.onCancel}
            />
          </DynamicModalInstanceContext.Provider>
        );
      }
    }
    return rendered;
  };

  return (
    <DynamicModalStateContext.Provider value={state}>
      <DynamicModalActionsContext.Provider
        value={{
          toggle,
          show,
          hide,
          open,
          createModal,
          removeModal,
          modalExists,
          /* NEW_ACTION_GOES_HERE */
        }}
      >
        {renderInstances()}
        {children}
      </DynamicModalActionsContext.Provider>
    </DynamicModalStateContext.Provider>
  );
};

function useDynamicModalState() {
  const context = useContext(DynamicModalStateContext);

  if (context === undefined) {
    throw new Error('useDynamicModalState must be used within a DynamicModalProvider');
  }

  return context;
}

function useDynamicModalActions() {
  const context = useContext(DynamicModalActionsContext);

  if (context === undefined) {
    throw new Error('useDynamicModalActions must be used within a DynamicModalProvider');
  }

  return context;
}

function useDynamicModals() {
  return { ...useDynamicModalState(), ...useDynamicModalActions() };
}

function useModal(modalProps: IModalProps) {
  const context = useDynamicModals();

  if (!modalProps) return null;

  const instance = {
    open: () => {
      if (!context.modalExists(modalProps.id)) context.createModal({ ...modalProps, isVisible: true });
      else context.show(modalProps.id);
    },
    close: () => {
      context.removeModal(modalProps.id);
    },
    show: () => context.show(modalProps.id),
    hide: () => context.hide(modalProps.id),
  };

  return instance;
}

function useClosestModal() {
  const context = useContext(DynamicModalInstanceContext);
  return context;
}

export { DynamicModalProvider, useDynamicModals, useModal, useClosestModal };
