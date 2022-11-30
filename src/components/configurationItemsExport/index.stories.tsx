import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import ConfigurationItemsExport from './';
import StoryApp from '../storyBookApp';
//import { addStory } from '../../stories/utils';

export default {
  title: 'Components/ConfigurationItemsExport',
  component: ConfigurationItemsExport,
} as Meta;

export interface IConfigurationItemsExportStoryProps {
  //backendUrl: string;
}

// Create a master template for mapping args to render the component
const Template: Story<IConfigurationItemsExportStoryProps> = () => (
  <StoryApp>
    <ConfigurationItemsExport></ConfigurationItemsExport>
  </StoryApp>
);

/*
export const Base = addStory(Template, {
  
});*/

export const Basic = Template.bind({});
Basic.args = {};