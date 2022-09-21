import React, { FC } from 'react';
import { Button, Radio, message } from 'antd';
import {
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  BugOutlined,
  EyeOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useForm } from '../../providers/form';
import { useShaRouting } from '../../providers/shaRouting';

export interface IProps {}

export const FormDesignerToolbar: FC<IProps> = () => {
  const { saveForm, setFormMode, setDebugMode, formMode, isDebug, undo, redo, canUndo, canRedo } = useForm();
  const { router } = useShaRouting();

  const onSaveClick = () => {
    saveForm()
      .then(() => message.success('Form saved successfully'))
      .catch(() => message.error('Failed to save form'));
  };

  const onModeChange = e => {
    setFormMode(e.target.value);
  };

  const onUndoClick = () => {
    undo();
  };

  const onRedoClick = () => {
    redo();
  };

  const onCancelClick = () => {
    router?.back();
  };

  return (
    <div className="sha-designer-toolbar">
      <div className="sha-designer-toolbar-left">
        <Button key="undo" shape="circle" onClick={onUndoClick} disabled={!canUndo} title="Undo">
          <UndoOutlined />
        </Button>
        <Button key="redo" shape="circle" onClick={onRedoClick} disabled={!canRedo} title="Redo">
          <RedoOutlined />
        </Button>
      </div>
      <div className="sha-designer-toolbar-right">
        <Button
          onClick={() => {
            setFormMode(formMode === 'designer' ? 'edit' : 'designer');
          }}
          type={formMode === 'designer' ? 'default' : 'primary'}
        >
          <EyeOutlined /> Preview
        </Button>
        <Button
          onClick={() => {
            setFormMode(formMode === 'designer' ? 'edit' : 'designer');
          }}
          type={formMode === 'designer' ? 'default' : 'primary'}
        >
          <EyeOutlined /> JSON
        </Button>
        <Button onClick={onCancelClick} type="primary" danger>
          <CloseCircleOutlined /> Cancel
        </Button>
        <Button key="save" onClick={onSaveClick} type="primary">
          <SaveOutlined /> Save
        </Button>
      </div>

      {false && (
        <Radio.Group value={formMode} onChange={onModeChange}>
          <Radio.Button value="designer">designer</Radio.Button>
          <Radio.Button value="edit">edit</Radio.Button>
          <Radio.Button value="readonly">readonly</Radio.Button>
        </Radio.Group>
      )}
      {true && (
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
      )}
    </div>
  );
};

export default FormDesignerToolbar;
