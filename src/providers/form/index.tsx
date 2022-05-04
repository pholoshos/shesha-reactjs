import React, { FC, useContext, PropsWithChildren, useEffect, MutableRefObject, useMemo } from 'react';
import formReducer from './reducer';
import {
  FormActionsContext,
  FormStateContext,
  UndoableFormStateContext,
  FORM_CONTEXT_INITIAL_STATE,
  IComponentAddPayload,
  IComponentDeletePayload,
  IComponentUpdatePayload,
  ISetVisibleComponentsPayload,
  IUpdateChildComponentsPayload,
  ISetFormDataPayload,
  IFormStateContext,
  ConfigurableFormInstance,
  IFormActionsContext,
  IFormSettings,
  DEFAULT_FORM_SETTINGS,
  IAddDataPropertyPayload,
  ISetEnabledComponentsPayload,
  IComponentAddFromTemplatePayload,
} from './contexts';
import { IFormProps, IFormActions, FormMarkup, FormMarkupWithSettings, IFormSections, FormMode } from './models';
import { getFlagSetters } from '../utils/flagsSetters';
import {
  componentAddAction,
  componentDeleteAction,
  componentUpdateAction,
  componentUpdateSettingsValidationAction,
  loadRequestAction,
  loadSuccessAction,
  loadErrorAction,
  saveRequestAction,
  saveSuccessAction,
  saveErrorAction,
  setFormModeAction,
  setDebugModeAction,
  startDraggingAction,
  endDraggingAction,
  setVisibleComponentsAction,
  updateChildComponentsAction,
  setFormDataAction,
  setValidationErrorsAction,
  setSelectedComponentAction,
  changeMarkupAction,
  registerComponentActionsAction,
  updateFormSettingsAction,
  addDataSourceAction,
  removeDataSourceAction,
  setActiveDataSourceAction,
  dataPropertyAddAction,
  setEnabledComponentsAction,
  componentAddFromTemplateAction,
  /* NEW_ACTION_IMPORT_GOES_HERE */
} from './actions';
import { useFormGet, useFormGetByPath, useFormUpdateMarkup, FormUpdateMarkupInput } from '../../apis/form';
import {
  componentsTreeToFlatStructure,
  componentsFlatStructureToTree,
  convertActions,
  getVisibleComponentIds,
  toolbarGroupsToComponents,
  getComponentsAndSettings,
  convertSectionsToList,
  getEnabledComponentIds,
  sheshaApplication,
} from './utils';
import { FormInstance } from 'antd';
import { ActionCreators } from 'redux-undo';
import useThunkReducer from 'react-hook-thunk-reducer';
import { useDebouncedCallback } from 'use-debounce';
import {
  IAsyncValidationError,
  IConfigurableFormComponent,
  IFormValidationErrors,
  IToolboxComponent,
} from '../../interfaces';
import { IDataSource } from '../formDesigner/models';
import { useMetadataDispatcher } from '../../providers';
import { FormPubsubConstants } from './pubSub';
import { useSubscribe } from '../../hooks';

export interface IFormProviderProps {
  id?: string;
  path?: string;
  uniqueStateId?: string;
  markup?: FormMarkup;
  mode: FormMode;
  form?: FormInstance<any>;
  actions?: IFormActions;
  sections?: IFormSections;
  context?: any; // todo: make generic
  formRef?: MutableRefObject<Partial<ConfigurableFormInstance> | null>;
  onValuesChange?: (changedValues: any, values: any /*Values*/) => void;
}

const FormProvider: FC<PropsWithChildren<IFormProviderProps>> = ({
  children,
  id,
  path,
  markup,
  mode = 'readonly',
  form,
  actions,
  sections,
  context,
  formRef,
  uniqueStateId,
}) => {
  const { toolboxComponentGroups } = sheshaApplication();
  const formProps = getComponentsAndSettings(markup);
  const formComponents = formProps?.components;

  const actualComponentGroups = [
    ...(FORM_CONTEXT_INITIAL_STATE.toolboxComponentGroups || []),
    ...(toolboxComponentGroups || []),
  ];

  const toolboxComponents = useMemo(() => toolbarGroupsToComponents(actualComponentGroups), [toolboxComponentGroups]);

  const getToolboxComponent = (type: string) => toolboxComponents[type];

  const flatComponents = componentsTreeToFlatStructure(toolboxComponents, formComponents || []);

  const initial: IFormStateContext = {
    ...FORM_CONTEXT_INITIAL_STATE,
    id,
    path,
    formMode: mode,
    components: formComponents || [],
    form,
    actions: convertActions(null, actions),
    sections: convertSectionsToList(null, sections),
    context,
    toolboxComponentGroups: actualComponentGroups,
    ...flatComponents,
  };

  const { activateProvider } = useMetadataDispatcher(false) ?? {};

  const [state, dispatch] = useThunkReducer(formReducer, {
    past: [],
    present: initial,
    future: [],
  });

  const fetcherById = useFormGet({ lazy: true, id });
  const fetcherByPath = useFormGetByPath({ lazy: true });
  const { loading: isFetchingFormInfo, error: fetchingFormInfoError, data: fetchingFormInfoResponse } = path
    ? fetcherByPath
    : fetcherById;

  const doFetchFormInfo = () => {
    if (id) {
      dispatch(loadRequestAction({ id }));
      fetcherById.refetch({});
    } else if (path) {
      dispatch(loadRequestAction({ path }));
      fetcherByPath.refetch({ queryParams: { path } });
    }
  };

  useEffect(() => {
    if (markup) return;

    doFetchFormInfo();
  }, [id, path, markup]);

  const EMPTY_PARSED_FORM: FormMarkupWithSettings = {
    components: [],
    formSettings: DEFAULT_FORM_SETTINGS,
  };

  const parseForm = (formJson: string): FormMarkupWithSettings => {
    try {
      const parsed = formJson ? JSON.parse(formJson) : null;

      if (parsed) {
        // old format: array of components
        if (Array.isArray(parsed)) {
          return {
            components: parsed,
            formSettings: DEFAULT_FORM_SETTINGS,
          } as FormMarkupWithSettings;
        }

        // new format
        if (parsed.components && parsed.formSettings) {
          return {
            components: parsed.components,
            formSettings: parsed.formSettings,
          } as FormMarkupWithSettings;
        }
      }

      return EMPTY_PARSED_FORM;
    } catch (error) {
      console.error('Failed to parse form. Error: ' + error);
      return EMPTY_PARSED_FORM;
    }
  };

  useEffect(() => {
    if (markup) {
      const newFormProps = getComponentsAndSettings(markup);
      const newFlatComponents = componentsTreeToFlatStructure(toolboxComponents, newFormProps.components);
      dispatch(changeMarkupAction(newFlatComponents));
    } else {
      if (!isFetchingFormInfo) {
        if (fetchingFormInfoResponse) {
          const fetchedForm = fetchingFormInfoResponse?.result;
          if (fetchedForm) {
            const parsedForm = parseForm(fetchedForm.markup);

            const newFlatComponents = componentsTreeToFlatStructure(toolboxComponents, parsedForm.components);

            const formContent: IFormProps = {
              // todo: use partial for loading
              id: fetchedForm.id,
              path: fetchedForm.path,
              name: fetchedForm.name,
              description: fetchedForm.description,
              components: parsedForm.components,
              formSettings: parsedForm.formSettings,
              ...newFlatComponents,
            };

            // parse json content
            dispatch((dispatchThunk, _getState) => {
              dispatchThunk(loadSuccessAction(formContent));
              dispatchThunk(ActionCreators.clearHistory());
            });
          }
        }

        if (fetchingFormInfoError) {
          // todo: handle error messages
          dispatch(loadErrorAction());
        }
      }
    }
  }, [isFetchingFormInfo, fetchingFormInfoResponse, fetchingFormInfoError, markup]);

  useEffect(() => {
    if (mode !== state.present.formMode) {
      setFormMode(mode);
    }
  }, [mode]);

  /* NEW_ACTION_DECLARATION_GOES_HERE */

  const addDataProperty = (payload: IAddDataPropertyPayload) => {
    dispatch(dataPropertyAddAction(payload));
  };

  const addComponent = (payload: IComponentAddPayload) => {
    dispatch(componentAddAction(payload));
  };

  const addComponentsFromTemplate = (payload: IComponentAddFromTemplatePayload) => {
    dispatch(componentAddFromTemplateAction(payload));
  };

  const deleteComponent = (payload: IComponentDeletePayload) => {
    dispatch(componentDeleteAction(payload));
  };

  const getComponentModel = componentId => {
    return state.present.allComponents[componentId];
  };

  const isComponentDisabled = (model: Pick<IConfigurableFormComponent, 'id' | 'isDynamic' | 'disabled'>): boolean => {
    const disabledByCondition =
      model.isDynamic !== true &&
      state.present.enabledComponentIds &&
      !state.present.enabledComponentIds.includes(model.id);

    return state.present.formMode !== 'designer' && (model.disabled || disabledByCondition);
  };

  const isComponentHidden = (model: Pick<IConfigurableFormComponent, 'id' | 'isDynamic' | 'hidden'>): boolean => {
    const hiddenByCondition =
      model.isDynamic !== true &&
      state.present.visibleComponentIds &&
      !state.present.visibleComponentIds.includes(model.id);

    return state.present.formMode !== 'designer' && hiddenByCondition;
  };

  const updateComponent = (payload: IComponentUpdatePayload) => {
    dispatch(componentUpdateAction(payload));

    const component = getComponentModel(payload.componentId);
    const toolboxComponent = getToolboxComponent(component.type) as IToolboxComponent;
    if (toolboxComponent.validateSettings) {
      toolboxComponent
        .validateSettings(payload.settings)
        .then(() => {
          dispatch(componentUpdateSettingsValidationAction({ componentId: payload.componentId, validationErrors: [] }));
        })
        .catch(({ errors }) => {
          const validationErrors = errors as IAsyncValidationError[];
          dispatch(
            componentUpdateSettingsValidationAction({
              componentId: payload.componentId,
              validationErrors,
            })
          );
        });
    }
  };

  const loadForm = () => {
    doFetchFormInfo();
  };

  // todo: review usage of useFormUpdateMarkup after
  const { mutate: saveFormHttp /*, loading: saveFormInProgress, error: saveFormError*/ } = useFormUpdateMarkup({
    id,
  });

  const saveForm = (): Promise<void> => {
    if (!state.present.id) return Promise.reject();

    dispatch(saveRequestAction());

    const currentMarkup: FormMarkupWithSettings = {
      components: componentsFlatStructureToTree(toolboxComponents, state.present),
      formSettings: state.present.formSettings,
    };

    const dto: FormUpdateMarkupInput = {
      id: state.present.id,
      markup: JSON.stringify(currentMarkup, null, 2),
    };
    return saveFormHttp(dto, {})
      .then(_response => {
        dispatch(saveSuccessAction());
      })
      .catch(_error => {
        dispatch(saveErrorAction());
      });
  };

  const getChildComponents = (componentId: string) => {
    const childIds = state.present.componentRelations[componentId];
    if (!childIds) return [];
    const components = childIds.map(childId => {
      return state.present.allComponents[childId];
    });
    return components;
  };

  const setFormMode = (formMode: FormMode) => {
    dispatch(setFormModeAction(formMode));
  };

  const setDebugMode = (isDebug: boolean) => {
    dispatch(setDebugModeAction(isDebug));
  };

  const startDragging = () => {
    dispatch(startDraggingAction());
  };

  const endDragging = () => {
    dispatch(endDraggingAction());
  };

  //#region Set visible components
  const setVisibleComponents = (payload: ISetVisibleComponentsPayload) => {
    dispatch(setVisibleComponentsAction(payload));
  };

  const updateVisibleComponents = (formContext: IFormStateContext) => {
    const visibleComponents = getVisibleComponentIds(formContext.allComponents, formContext.formData);
    setVisibleComponents({ componentIds: visibleComponents });
  };

  const debouncedUpdateVisibleComponents = useDebouncedCallback<(context: IFormStateContext) => void>(
    formContext => {
      updateVisibleComponents(formContext);
    },
    // delay in ms
    200
  );
  //#endregion

  //#region Set enabled components
  const setEnabledComponents = (payload: ISetEnabledComponentsPayload) => {
    dispatch(setEnabledComponentsAction(payload));
  };

  const updateEnabledComponents = (formContext: IFormStateContext) => {
    const enabledComponents = getEnabledComponentIds(formContext.allComponents, formContext.formData);

    setEnabledComponents({ componentIds: enabledComponents });
  };

  const debouncedUpdateEnabledComponents = useDebouncedCallback<(context: IFormStateContext) => void>(
    formContext => {
      updateEnabledComponents(formContext);
    },
    // delay in ms
    200
  );
  //#endregion

  const setFormData = (payload: ISetFormDataPayload) => {
    dispatch((dispatchThunk, getState) => {
      dispatchThunk(setFormDataAction(payload));
      const newState = getState().present;

      // Update visible components. Note: debounced version is used to improve performance and prevent unneeded re-rendering

      if (!newState.visibleComponentIds || newState.visibleComponentIds.length === 0) {
        updateVisibleComponents(newState);
      } else {
        debouncedUpdateVisibleComponents(newState);
      }
      // Update enabled components. Note: debounced version is used to improve performance and prevent unneeded re-rendering
      if (!newState.enabledComponentIds || newState.enabledComponentIds.length === 0) {
        updateEnabledComponents(newState);
      } else {
        debouncedUpdateEnabledComponents(newState);
      }
    });
  };

  const setValidationErrors = (payload: IFormValidationErrors) => {
    dispatch(setValidationErrorsAction(payload));
  };

  const updateChildComponents = (payload: IUpdateChildComponentsPayload) => {
    dispatch(updateChildComponentsAction(payload));
  };

  const undo = () => {
    dispatch(ActionCreators.undo());
  };

  const redo = () => {
    dispatch(ActionCreators.redo());
  };

  const setSelectedComponent = (componentId: string, dataSourceId: string, componentRef?: MutableRefObject<any>) => {
    if (activateProvider)
      activateProvider(dataSourceId);
    dispatch(setSelectedComponentAction({ id: componentId, dataSourceId, componentRef }));
  };

  const registerActions = (ownerId: string, actionsToRegister: IFormActions) => {
    dispatch(registerComponentActionsAction({ id: ownerId, actions: actionsToRegister }));
  };

  const getAction = (componentId: string, name: string) => {
    // search requested action in all parents and fallback to form
    let currentId = componentId;
    do {
      const component = state.present.allComponents[currentId];

      const action = state.present.actions.find(a => a.owner === (component?.parentId ?? null) && a.name === name);
      if (action) return (data, parameters) => action.body(data, parameters);

      currentId = component?.parentId;
    } while (currentId);

    return null;
  };

  const getSection = (componentId: string, name: string) => {
    // search requested section in all parents and fallback to form
    let currentId = componentId;

    do {
      const component = state.present.allComponents[currentId];

      const section = state.present.sections.find(a => a.owner === (component?.parentId ?? null) && a.name === name);
      if (section) return data => section.body(data);

      currentId = component?.parentId;
    } while (currentId);

    return null;
  };

  const updateFormSettings = (settings: IFormSettings) => {
    dispatch(updateFormSettingsAction(settings));
  };

  //#region move to designer
  const addDataSource = (dataSource: IDataSource) => {
    dispatch(addDataSourceAction(dataSource));
  };
  const removeDataSource = (datasourceId: string) => {
    dispatch(removeDataSourceAction(datasourceId));
  };

  const setActiveDataSource = (datasourceId: string) => {
    dispatch(setActiveDataSourceAction(datasourceId));
  };

  const getActiveDataSource = () => {
    return state.present.activeDataSourceId
      ? state.present.dataSources.find(ds => ds.id === state.present.activeDataSourceId)
      : null;
  };
  //#endregion

  //#region PubSub
  useSubscribe(FormPubsubConstants.setToEditMode, data => {
    if (data.stateId === uniqueStateId) {
      setFormMode('edit');
    }
  });

  useSubscribe(FormPubsubConstants.exitEditMode, data => {
    if (data.stateId === uniqueStateId) {
      setFormMode('readonly');
    }
  });
  //#endregion

  const configurableFormActions: IFormActionsContext = {
    ...getFlagSetters(dispatch),
    addDataProperty,
    addComponent,
    addComponentsFromTemplate,
    deleteComponent,
    getComponentModel,
    isComponentDisabled,
    isComponentHidden,
    updateComponent,
    loadForm,
    saveForm,
    getChildComponents,
    setFormMode,
    setDebugMode,
    startDragging,
    endDragging,
    setVisibleComponents,
    setFormData,
    setValidationErrors,
    updateChildComponents,
    undo,
    redo,
    setSelectedComponent,
    registerActions,
    getAction,
    getSection,
    updateFormSettings,
    getToolboxComponent,
    addDataSource,
    removeDataSource,
    setActiveDataSource,
    getActiveDataSource,
    /* NEW_ACTION_GOES_HERE */
  };
  if (formRef) formRef.current = { ...configurableFormActions, ...state.present };

  return (
    <UndoableFormStateContext.Provider value={state}>
      <FormStateContext.Provider value={state.present}>
        <FormActionsContext.Provider value={configurableFormActions}>{children}</FormActionsContext.Provider>
      </FormStateContext.Provider>
    </UndoableFormStateContext.Provider>
  );
};

function useFormState(require: boolean = true) {
  const context = useContext(FormStateContext);

  if (require && context === undefined) {
    throw new Error('useFormState must be used within a FormProvider');
  }

  return context;
}

function useFormActions(require: boolean = true) {
  const context = useContext(FormActionsContext);

  if (require && context === undefined) {
    throw new Error('useFormActions must be used within a FormProvider');
  }

  return context;
}

function useUndoableState(require: boolean = true) {
  const context = useContext(UndoableFormStateContext);

  if (require && context === undefined) {
    throw new Error('useUndoableState must be used within a FormProvider');
  }

  return {
    canUndo: context.past.length > 0,
    canRedo: context.future.length > 0,
  };
}

function useForm(require: boolean = true) {
  return { ...useFormState(require), ...useFormActions(require), ...useUndoableState(require) };
}

const isInDesignerMode = () => {
  const context = useContext(FormStateContext);
  return context ? context.formMode === 'designer' : false;
};

export { FormProvider, useFormState, useFormActions, useForm, isInDesignerMode };
