import React, { FC, useState } from 'react';
import { Button, message } from 'antd';
import {
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  BugOutlined,
  EyeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useForm } from '../../providers/form';
import { useFormPersister } from '../../providers/formPersisterProvider';
import { useFormDesigner } from '../../providers/formDesigner';
import { componentsFlatStructureToTree, useFormDesignerComponents } from '../../providers/form/utils';
import { FormMarkupWithSettings } from '../../providers/form/models';
import FormSettingsEditor from './formSettingsEditor';

export interface IProps { }

export const FormDesignerToolbar: FC<IProps> = () => {
  const { saveForm } = useFormPersister();
  const { setFormMode, formMode } = useForm();
  const { setDebugMode, isDebug, undo, redo, canUndo, canRedo, readOnly } = useFormDesigner();
  const [settingsVisible, setSettingsVisible] = useState(false);

  const { allComponents, componentRelations, formSettings } = useFormDesigner();
  const toolboxComponents = useFormDesignerComponents();

  const onSaveClick = () => {
    const payload: FormMarkupWithSettings = {
      components: componentsFlatStructureToTree(toolboxComponents, { allComponents, componentRelations }),
      formSettings: formSettings,
    };
    saveForm(payload)
      .then(() => message.success('Form saved successfully'))
      .catch(() => message.error('Failed to save form'));
  };

  const onUndoClick = () => {
    undo();
  };

  const onRedoClick = () => {
    redo();
  };

  const onSettingsClick = () => {
    setSettingsVisible(true);
  };

  return (
    <div className="sha-designer-toolbar">
      <div className="sha-designer-toolbar-left">
        {!readOnly && (
          <Button key="save" onClick={onSaveClick} type="primary">
            <SaveOutlined /> Save
          </Button>
        )}

      </div>
      <div className="sha-designer-toolbar-right">
        <Button icon={<SettingOutlined />} type="link" onClick={onSettingsClick}>
          Settings
        </Button>
        <FormSettingsEditor
          readOnly={readOnly}
          isVisible={settingsVisible}
          close={() => {
            setSettingsVisible(false);
          }}
        />
        <Button
          onClick={() => {
            setFormMode(formMode === 'designer' ? 'edit' : 'designer');
          }}
          type={formMode === 'designer' ? 'default' : 'primary'}
          shape="circle"
          title='Preview'
        >
          <EyeOutlined />
        </Button>
        <Button
          key="debug"
          onClick={() => {
            setDebugMode(!isDebug);
          }}
          title="Debug"
          type={isDebug ? 'primary' : 'ghost'}
          shape="circle"
        >
          <BugOutlined />
        </Button>

        {!readOnly && (
          <>
            <Button key="undo" shape="circle" onClick={onUndoClick} disabled={!canUndo} title="Undo">
              <UndoOutlined />
            </Button>
            <Button key="redo" shape="circle" onClick={onRedoClick} disabled={!canRedo} title="Redo">
              <RedoOutlined />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default FormDesignerToolbar;
