import React, { FC, useState } from 'react';
import { SidebarContainer } from '../../components';
import { usePermissionedObjectGet, usePermissionedObjectUpdate } from '../../apis/permissionedObject';
import GenericEditPanel from '../crudViews/editPanel';
import ToolboxObjects from './toolboxObjects';

export interface IPermissionedObjectsConfiguratorProps {
  type?: string;
}

export const PermissionedObjectsConfigurator: FC<IPermissionedObjectsConfiguratorProps> = (props) => {

  const [widgetsOpen, setWidgetOpen] = useState(true);

  const [objectId, setObjectId] = useState("");

  const toggleWidgetSidebar = () => setWidgetOpen(widget => !widget);

  return (
    <>
      <SidebarContainer
        leftSidebarProps={{
          open: widgetsOpen,
          onOpen: toggleWidgetSidebar,
          onClose: toggleWidgetSidebar,
          title: 'Builder Widgets',
          content: () => (
            <ToolboxObjects type={props.type} onChange={(id) => {setObjectId(id)} } />
          ),
          placeholder: 'Builder Widgets',
        }}
        //header={() => <FormDesignerToolbar />}
      >
        <div style={{width: "80%"}}>
          <GenericEditPanel
            title={() => 'User Edit'}
            id={objectId}
            fetcher={usePermissionedObjectGet}
            updater={usePermissionedObjectUpdate}
            formPath={'/permissionedObject/edit'}
            //onDataLoaded={onDataLoaded}
          />
        </div>
      </SidebarContainer>
    </>
  )
};

export default PermissionedObjectsConfigurator;
