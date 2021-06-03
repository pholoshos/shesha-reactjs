import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import StoredFileUpload from './';
import { ShaApplicationProvider, StoredFileProvider } from '../../providers';
import AuthContainer2 from '../authedContainer2';
import { ICustomFileProps } from '../customFile';
import { FileUpload } from '..';

export default {
  title: 'Components/Temp/StoredFileUpload',
  component: StoredFileUpload,
} as Meta;

const customFileProps: ICustomFileProps = {};

const backendUrl = 'http://localhost:21021'; // TODO: Make this configurable

// Create a master template for mapping args to render the Button component
const Template: Story<ICustomFileProps> = args => (
  <ShaApplicationProvider backendUrl={backendUrl}>
    <AuthContainer2>
      <StoredFileProvider
        ownerId="32e2b3dd-4d99-4542-af71-134ec7c0e2ce"
        ownerType="Shesha.Core.Person"
        propertyName="Photo"
        baseUrl={backendUrl}
        {...args}
      >
        <FileUpload />
      </StoredFileProvider>
    </AuthContainer2>
  </ShaApplicationProvider>
);

export const Basic = Template.bind({});
Basic.args = { ...customFileProps };
