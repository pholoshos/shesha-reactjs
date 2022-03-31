import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import StoryApp from '../../components/storyBookApp';
import DynamicPage, { IDynamicPageProps } from '.';

export default {
  title: 'Pages/DynamicPage',
  component: DynamicPage,
  argTypes: {},
} as Meta;

const DEFAULT_ARGS: IDynamicPageProps = {
  path: 'details-view-demo',
  id: '09be9a31-6697-4c50-9d15-0b381ee01030',
};

// Create a master template for mapping args to render the Button component
const Template: Story<IDynamicPageProps> = args => (
  <StoryApp>
    <DynamicPage {...args} />
  </StoryApp>
);

// Reuse that template for creating different stories
export const Basic = Template.bind({});

Basic.args = DEFAULT_ARGS;
