import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import { SidebarMenuDefaultsProvider } from '../../providers';
import MainLayout, { IMainLayoutProps } from './';
import { SIDEBAR_MENU_ITEMS } from './menuItems';
import StoryApp from '../storyBookApp';

export default {
  title: 'Components/MainLayout',
  component: MainLayout,
  argTypes: {},
} as Meta;

const defaultProps: IMainLayoutProps = {
  title: 'Default layout',
  heading: 'This is the header',
};

// Create a master template for mapping args to render the Button component
const Template: Story<IMainLayoutProps> = args => {
  return (
    <StoryApp>
      <SidebarMenuDefaultsProvider items={SIDEBAR_MENU_ITEMS}>
        <MainLayout {...args} title="Any title">
          <div>This is a div</div>
        </MainLayout>
      </SidebarMenuDefaultsProvider>
    </StoryApp>
  );
};
export const Default = Template.bind({});

Default.args = { ...defaultProps };

// // Create a master template for mapping args to render the Button component
// const WithIndexTable: Story<IMainLayoutProps> = () => (
//   <ShaApplicationProvider backendUrl={backendUrl}>
//     <AuthContainer layout={true}>
//       <SidebarMenuDefaultsProvider items={SIDEBAR_MENU_ITEMS}>
//         <SimpleIndexPage loading={false} tableConfigId="Users_Index" title="Invoice Allocations" />
//       </SidebarMenuDefaultsProvider>
//     </AuthContainer>
//   </ShaApplicationProvider>
// );

// export const IndexPage = WithIndexTable.bind({});
