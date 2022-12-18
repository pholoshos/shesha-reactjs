import { createAction } from 'redux-actions';
import { IFormValidationErrors } from '../../interfaces';
import { IDataSource } from '../formDesigner/models';
import {
  IComponentAddPayload,
  IComponentDeletePayload,
  IComponentUpdatePayload,
  IUpdateChildComponentsPayload,
  ISetSelectedComponentPayload,
  IComponentUpdateSettingsValidationPayload,
  IAddDataPropertyPayload,
  IComponentAddFromTemplatePayload,
  IComponentDuplicatePayload,
} from './contexts';
import { IFlatComponentsStructure, IFormSettings } from '../form/models';

export enum FormActionEnums {
  /*
  component: add delete update move
  */
  DataPropertyAdd = 'DATA_PROPERTY_ADD',
  ComponentAdd = 'COMPONENT_ADD',
  ComponentDelete = 'COMPONENT_DELETE',
  ComponentDuplicate = 'COMPONENT_DUPLICATE',
  ComponentUpdate = 'COMPONENT_UPDATE',
  ComponentUpdateSettingsValidation = 'COMPONENT_UPDATE_SETTINGS_VALIDATION',

  ComponentAddFromTemplate = 'COMPONENT_ADD_FROM_TEMPLATE',

  ChangeMarkup = 'CHANGE_MARKUP',
  SetReadOnly = 'SET_READ_ONLY',

  SetFlatComponentsAction = 'SET_FLAT_COMPONENTS',
  SetDebugMode = 'SET_DEBUG_MODE',
  SetDragging = 'SET_DRAGGING',
  StartDragging = 'START_DRAGGING',
  EndDragging = 'END_DRAGGING',
  UpdateChildComponents = 'UPDATE_CHILD_COMPONENTS',
  SetValidationErrors = 'SET_VALIDATION_ERRORS',
  SetSelectedComponent = 'SET_SELECTED_COMPONENT',
  UpdateFormSettings = 'UPDATE_FORM_SETTINGS',

  AddDataSource = 'ADD_DATA_SOURCE',
  RemoveDataSource = 'REMOVE_DATA_SOURCE',
  SetActiveDataSource = 'SET_ACTIVE_DATA_SOURCE',

  /* NEW_ACTION_TYPE_GOES_HERE */
}

export const setReadOnlyAction = createAction<boolean, boolean>(
  FormActionEnums.SetReadOnly,
  p => p
);

export const dataPropertyAddAction = createAction<IAddDataPropertyPayload, IAddDataPropertyPayload>(
  FormActionEnums.DataPropertyAdd,
  p => p
);

export const componentAddAction = createAction<IComponentAddPayload, IComponentAddPayload>(
  FormActionEnums.ComponentAdd,
  p => p
);

export const componentAddFromTemplateAction = createAction<
  IComponentAddFromTemplatePayload,
  IComponentAddFromTemplatePayload
>(FormActionEnums.ComponentAddFromTemplate, p => p);

export const componentDeleteAction = createAction<IComponentDeletePayload, IComponentDeletePayload>(
  FormActionEnums.ComponentDelete,
  p => p
);

export const componentDuplicateAction = createAction<IComponentDuplicatePayload, IComponentDuplicatePayload>(
  FormActionEnums.ComponentDuplicate,
  p => p
);

export const componentUpdateAction = createAction<IComponentUpdatePayload, IComponentUpdatePayload>(
  FormActionEnums.ComponentUpdate,
  p => p
);

export const componentUpdateSettingsValidationAction = createAction<
  IComponentUpdateSettingsValidationPayload,
  IComponentUpdateSettingsValidationPayload
>(FormActionEnums.ComponentUpdateSettingsValidation, p => p);

export const changeMarkupAction = createAction<IFlatComponentsStructure, IFlatComponentsStructure>(
  FormActionEnums.ChangeMarkup,
  p => p
);

export const setFlatComponentsAction = createAction<IFlatComponentsStructure, IFlatComponentsStructure>(FormActionEnums.SetFlatComponentsAction, p => p);

export const setDebugModeAction = createAction<boolean, boolean>(FormActionEnums.SetDebugMode, p => p);
export const startDraggingAction = createAction(FormActionEnums.StartDragging);
export const endDraggingAction = createAction(FormActionEnums.EndDragging);

export const setValidationErrorsAction = createAction<IFormValidationErrors, IFormValidationErrors>(
  FormActionEnums.SetValidationErrors,
  p => p
);

export const updateChildComponentsAction = createAction<IUpdateChildComponentsPayload, IUpdateChildComponentsPayload>(
  FormActionEnums.UpdateChildComponents,
  p => p
);

export const setSelectedComponentAction = createAction<ISetSelectedComponentPayload, ISetSelectedComponentPayload>(
  FormActionEnums.SetSelectedComponent,
  p => p
);

export const updateFormSettingsAction = createAction<IFormSettings, IFormSettings>(
  FormActionEnums.UpdateFormSettings,
  p => p
);

//#region
export const addDataSourceAction = createAction<IDataSource, IDataSource>(FormActionEnums.AddDataSource, p => p);

export const removeDataSourceAction = createAction<string, string>(FormActionEnums.RemoveDataSource, p => p);

export const setActiveDataSourceAction = createAction<string, string>(FormActionEnums.SetActiveDataSource, p => p);
//#endregion
