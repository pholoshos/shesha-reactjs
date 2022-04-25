import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import PermissionedObjectsConfigurator from '.';
import { ShaApplicationProvider } from '../..';
import AuthContainer from '../authedContainer';
/*import { usePermissionedObjectGet, usePermissionedObjectUpdate } from '../../apis/permissionedObject';
import GenericEditPage, { IGenericEditPageProps } from '../crudViews/editPage';*/
import { addStory } from '../../stories/utils';

export default {
  title: 'Components/PermissionedObjectsConfigurator',
  component: PermissionedObjectsConfigurator,
} as Meta;

export interface IPermissionedObjectsConfiguratorStoryProps {
  type?: string 
}

const backendUrl = process.env.STORYBOOK_BASE_URL; // TODO: Make this configurable

// Create a master template for mapping args to render the component
//const Template: Story<IPermissionedObjectsConfiguratorStoryProps> =  (props) => (
const Template: Story<IPermissionedObjectsConfiguratorStoryProps> = (props) => {
  return (    
    <ShaApplicationProvider backendUrl={backendUrl}>
      <AuthContainer layout={true}>
        <PermissionedObjectsConfigurator type={props.type}></PermissionedObjectsConfigurator>  
      </AuthContainer>
    </ShaApplicationProvider>
  );
}

export const Base = addStory(Template, {
  type: "Shesha.WebApi"
});
