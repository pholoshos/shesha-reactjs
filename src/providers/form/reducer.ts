import {
  FORM_CONTEXT_INITIAL_STATE,
  IFormStateContext,
  IComponentAddPayload,
  IComponentDeletePayload,
  IComponentUpdatePayload,
  ISetVisibleComponentsPayload,
  IFormLoadPayload,
  IFormLoadByIdPayload,
  IFormLoadByPathPayload,
  IUpdateChildComponentsPayload,
  ISetFormDataPayload,
  IRegisterActionsPayload,
  IFormSettings,
  ISetSelectedComponentPayload,
  IComponentUpdateSettingsValidationPayload,
  IAddDataPropertyPayload,
  ISetEnabledComponentsPayload,
  IHasComponentGroups,
} from './contexts';
import {
  IConfigurableFormComponent,
  IFormProps,
  FormMode,
  IFlatComponentsStructure,
  IComponentRelations,
} from './models';
import { FormActionEnums } from './actions';
import { handleActions } from 'redux-actions';
import {
  camelize,
  cloneComponents,
  convertActions,
  createComponentModelForDataProperty,
  findToolboxComponent,
  getCustomEnabledFunc,
  getCustomVisibilityFunc,
  processRecursive,
} from './utils';
import undoable, { includeAction } from 'redux-undo';
import { IFormValidationErrors } from '../../interfaces';
import { IDataSource } from '../formDesigner/models';
import { nanoid } from 'nanoid/non-secure';

const addComponentToFlatStructure = (
  structure: IFlatComponentsStructure & IHasComponentGroups,
  formComponents: IConfigurableFormComponent[],
  containerId: string,
  index: number
): IFlatComponentsStructure => {
  // build all components dictionary
  const allComponents = { ...structure.allComponents };

  const childRelations: IComponentRelations = {};

  formComponents.forEach(component => {
    processRecursive(structure.toolboxComponentGroups, containerId, component, (cmp, parentId) => {
      allComponents[cmp.id] = cmp;

      if (parentId !== containerId) {
        const relations = childRelations[parentId] ?? [];
        childRelations[parentId] = [...relations, cmp.id];
      }
    });
  });

  const currentLevel = containerId;

  // add component(s) to the parent container
  const containerComponents = structure.componentRelations[currentLevel]
    ? [...structure.componentRelations[currentLevel]]
    : [];
  formComponents.forEach(component => {
    containerComponents.splice(index, 0, component.id);
  });
  const componentRelations = {
    ...structure.componentRelations,
    [currentLevel]: containerComponents,
    ...childRelations,
  };

  return {
    allComponents,
    componentRelations,
  };
};

const reducer = handleActions<IFormStateContext, any>(
  {
    [FormActionEnums.DataPropertyAdd]: (
      state: IFormStateContext,
      action: ReduxActions.Action<IAddDataPropertyPayload>
    ) => {
      const {
        payload: { propertyMetadata, index, containerId },
      } = action;

      const formComponent = createComponentModelForDataProperty(state.toolboxComponentGroups, propertyMetadata);
      if (!Boolean(formComponent)) return state;

      formComponent.parentId = containerId; // set parent
      const newStructure = addComponentToFlatStructure(state, [formComponent], containerId, index);

      return {
        ...state,
        allComponents: newStructure.allComponents,
        componentRelations: newStructure.componentRelations,
        selectedComponentId: formComponent.id,
      };
    },
    [FormActionEnums.ComponentAdd]: (state: IFormStateContext, action: ReduxActions.Action<IComponentAddPayload>) => {
      const { payload } = action;

      // create component instance
      const { componentType, index, containerId } = payload;

      // access to the list of toolbox  components
      const toolboxComponent = findToolboxComponent(state.toolboxComponentGroups, c => c.type === componentType);

      if (!toolboxComponent) return state;

      let newComponents: IConfigurableFormComponent[] = [];
      if (toolboxComponent.isTemplate) {
        newComponents = cloneComponents(state.toolboxComponentGroups, toolboxComponent.build());
      } else {
        // create new component
        let count = 0;
        for (const key in state.allComponents) {
          if (state.allComponents[key].type === toolboxComponent.type) count++;
        }
        const componentName = `${toolboxComponent.name}${count + 1}`;

        let formComponent: IConfigurableFormComponent = {
          id: nanoid(),
          type: toolboxComponent.type,
          name: camelize(componentName),
          label: componentName,
          labelAlign: 'right',
          parentId: containerId,
          hidden: false,
          visibility: 'Yes',
          customVisibility: null,
          visibilityFunc: _data => true,
          enabledFunc: _data => true,
          isDynamic: false,
        };
        if (toolboxComponent.initModel) formComponent = toolboxComponent.initModel(formComponent);

        newComponents.push(formComponent);
      }

      const newStructure = addComponentToFlatStructure(state, newComponents, containerId, index);

      return {
        ...state,
        allComponents: newStructure.allComponents,
        componentRelations: newStructure.componentRelations,
        selectedComponentId: newComponents[0]?.id,
      };
    },

    [FormActionEnums.ComponentDelete]: (
      state: IFormStateContext,
      action: ReduxActions.Action<IComponentDeletePayload>
    ) => {
      const { payload } = action;

      const { [payload.componentId]: component, ...allComponents } = state.allComponents;

      // delete self as parent
      const componentRelations = { ...state.componentRelations };
      delete componentRelations[payload.componentId];

      // delete self as child
      if (component.parentId) {
        const parentRelations = [...componentRelations[component.parentId]];
        const childIndex = parentRelations.indexOf(payload.componentId);
        parentRelations.splice(childIndex, 1);

        componentRelations[component.parentId] = parentRelations;
      } else console.warn(`component ${payload.componentId} has no parent`);

      return {
        ...state,
        allComponents,
        componentRelations,
        selectedComponentId: state.selectedComponentId === payload.componentId ? null : state.selectedComponentId, // clear selection if we delete current component
      };
    },

    [FormActionEnums.ComponentUpdate]: (
      state: IFormStateContext,
      action: ReduxActions.Action<IComponentUpdatePayload>
    ) => {
      const { payload } = action;

      const component = state.allComponents[payload.componentId];
      const newComponent = { ...component, ...payload.settings } as IConfigurableFormComponent;
      newComponent.visibilityFunc = getCustomVisibilityFunc(newComponent);
      newComponent.enabledFunc = getCustomEnabledFunc(newComponent);

      const toolboxComponent = findToolboxComponent(state.toolboxComponentGroups, c => c.type === component.type);

      const newComponents = { ...state.allComponents, [payload.componentId]: newComponent };
      const componentRelations = { ...state.componentRelations };

      if (toolboxComponent.getContainers) {
        // update child components

        const oldContainers = toolboxComponent.getContainers(component);
        const newContainers = toolboxComponent.getContainers(newComponent);

        // remove deleted containers
        oldContainers.forEach(oldContainer => {
          if (!newContainers.find(nc => nc.id === oldContainer.id)) {
            delete newComponents[oldContainer.id];

            delete componentRelations[oldContainer.id];
          }
        });

        // create or update new containers
        newContainers.forEach(c => {
          const existingContainer = newComponents[c.id] || { name: '', type: '', isDynamic: false };
          newComponents[c.id] = { ...existingContainer, ...c };
        });

        // update component child ids
        componentRelations[payload.componentId] = newContainers.map(c => c.id);
      }

      return {
        ...state,
        allComponents: newComponents,
        componentRelations,
      };
    },

    [FormActionEnums.LoadRequest]: (state: IFormStateContext, action: ReduxActions.Action<IFormLoadPayload>) => {
      const { payload } = action;

      return {
        ...state,
        id: (payload as IFormLoadByIdPayload)?.id || state.id,
        path: (payload as IFormLoadByPathPayload)?.path || state.id,
      };
    },

    [FormActionEnums.LoadSuccess]: (state: IFormStateContext, action: ReduxActions.Action<IFormProps>) => {
      const { payload } = action;

      return {
        ...state,
        id: payload.id,
        path: payload.path,
        name: payload.name,
        description: payload.description,
        allComponents: payload.allComponents,
        componentRelations: payload.componentRelations,
        formSettings: payload.formSettings,
        type: payload.type,
      };
    },

    [FormActionEnums.SetFormMode]: (state: IFormStateContext, action: ReduxActions.Action<FormMode>) => {
      const { payload } = action;

      return {
        ...state,
        formMode: payload,
      };
    },

    [FormActionEnums.SetDebugMode]: (state: IFormStateContext, action: ReduxActions.Action<boolean>) => {
      const { payload } = action;

      return {
        ...state,
        isDebug: payload,
      };
    },

    [FormActionEnums.StartDragging]: (state: IFormStateContext) => {
      return {
        ...state,
        isDragging: true,
      };
    },
    [FormActionEnums.EndDragging]: (state: IFormStateContext) => {
      return {
        ...state,
        isDragging: false,
      };
    },

    [FormActionEnums.SetVisibleComponents]: (
      state: IFormStateContext,
      action: ReduxActions.Action<ISetVisibleComponentsPayload>
    ) => {
      const { payload } = action;

      return {
        ...state,
        visibleComponentIds: payload.componentIds,
      };
    },

    [FormActionEnums.SetEnabledComponents]: (
      state: IFormStateContext,
      action: ReduxActions.Action<ISetEnabledComponentsPayload>
    ) => {
      const { payload } = action;

      return {
        ...state,
        enabledComponentIds: payload.componentIds,
      };
    },

    [FormActionEnums.SetFormData]: (state: IFormStateContext, action: ReduxActions.Action<ISetFormDataPayload>) => {
      const { payload } = action;

      // note: merge is used to keep initial values of fields which have no corresponding components on the form (e.g. id, parentId)
      const newData = payload.mergeValues && state.formData ? { ...state.formData, ...payload.values } : payload.values;

      return {
        ...state,
        formData: newData,
      };
    },

    [FormActionEnums.SetValidationErrors]: (
      state: IFormStateContext,
      action: ReduxActions.Action<IFormValidationErrors>
    ) => {
      const { payload } = action;

      return {
        ...state,
        validationErrors: payload ? { ...payload } : null,
      };
    },

    [FormActionEnums.UpdateChildComponents]: (
      state: IFormStateContext,
      action: ReduxActions.Action<IUpdateChildComponentsPayload>
    ) => {
      const { payload } = action;

      // 2. update parentId in new components list
      const updatedComponents = {};
      const updatedRelations: { [index: string]: string[] } = {
        [payload.containerId]: payload.componentIds,
      };

      payload.componentIds.forEach(id => {
        const component = state.allComponents[id];
        if (component.parentId !== payload.containerId) {
          // NOTE: we don't need it because when the user moves a component from one container to another the react-sortable make two calls to update new parent and old parent
          // update old parent
          // const oldParentKey = component.parentId || ROOT_COMPONENT_KEY;
          // updatedRelations[oldParentKey] = state.componentRelations[oldParentKey].filter(i => i !== id);

          // update parent in the current component
          const newComponent: IConfigurableFormComponent = { ...component, parentId: payload.containerId };
          updatedComponents[id] = newComponent;
        }
      });
      const allComponents = { ...state.allComponents, ...updatedComponents };
      const componentRelations = { ...state.componentRelations, ...updatedRelations };

      return {
        ...state,
        componentRelations,
        allComponents,
      };
    },

    [FormActionEnums.SetSelectedComponent]: (
      state: IFormStateContext,
      action: ReduxActions.Action<ISetSelectedComponentPayload>
    ) => {
      const { payload } = action;

      return {
        ...state,
        selectedComponentId: payload.id,
        selectedComponentRef: payload.componentRef,
        activeDataSourceId: payload.dataSourceId,
      };
    },

    [FormActionEnums.ChangeMarkup]: (
      state: IFormStateContext,
      action: ReduxActions.Action<IFlatComponentsStructure>
    ) => {
      const { payload } = action;

      return {
        ...state,
        allComponents: payload.allComponents,
        componentRelations: payload.componentRelations,
      };
    },

    [FormActionEnums.RegisterActions]: (
      state: IFormStateContext,
      action: ReduxActions.Action<IRegisterActionsPayload>
    ) => {
      const {
        payload: { id, actions: actionsToRegister },
      } = action;

      const componentActions = convertActions(id, actionsToRegister);
      const otherActions = state.actions.filter(a => a.owner !== id);

      return {
        ...state,
        actions: [...otherActions, ...componentActions],
      };
    },

    [FormActionEnums.UpdateFormSettings]: (state: IFormStateContext, action: ReduxActions.Action<IFormSettings>) => {
      const { payload } = action;

      return {
        ...state,
        formSettings: payload,
      };
    },

    [FormActionEnums.ComponentUpdateSettingsValidation]: (
      state: IFormStateContext,
      action: ReduxActions.Action<IComponentUpdateSettingsValidationPayload>
    ) => {
      const { payload } = action;

      const component = state.allComponents[payload.componentId];
      const newComponent: IConfigurableFormComponent = {
        ...component,
        settingsValidationErrors: payload.validationErrors,
      };

      return {
        ...state,
        allComponents: { ...state.allComponents, [payload.componentId]: newComponent },
      };
    },

    [FormActionEnums.AddDataSource]: (state: IFormStateContext, action: ReduxActions.Action<IDataSource>) => {
      const { payload } = action;

      return {
        ...state,
        dataSources: [...state.dataSources, payload],
      };
    },

    [FormActionEnums.RemoveDataSource]: (state: IFormStateContext, action: ReduxActions.Action<string>) => {
      const { payload } = action;

      const newDataSources = state.dataSources.filter(ds => ds.id !== payload);

      return {
        ...state,
        dataSources: [...newDataSources],
      };
    },
  },

  FORM_CONTEXT_INITIAL_STATE
);

const undoableReducer = undoable(reducer, {
  filter: includeAction([
    FormActionEnums.DataPropertyAdd,
    FormActionEnums.ComponentAdd,
    FormActionEnums.ComponentDelete,
    FormActionEnums.ComponentUpdate,
    FormActionEnums.EndDragging,
    FormActionEnums.LoadSuccess,
  ]),
  limit: 20, // set a limit for the size of the history
});

export default undoableReducer;
