import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import { GenericDetailsPage, IGenericDetailsPageProps } from '../..';
import { usePersonTestGet } from '../../apis/personTest';
import { addStory } from '../../stories/utils';
import StoryApp from '../storyBookApp';

export default {
  title: 'Components/CrudViews/DetailsView',
  component: GenericDetailsPage,
} as Meta;

// Create a master template for mapping args to render the Button component
const Template: Story<IGenericDetailsPageProps> = props => {
  return (
    <StoryApp>
      <GenericDetailsPage
        title={() => 'User Details'}
        id={props.id}
        fetcher={props.fetcher}
        formPath={props.formPath}
      />
    </StoryApp>
  );
};

export const Base = addStory(Template, {
  id: 'B3B60F2E-5B88-4F44-B8EB-D3987A8483D9',
  formPath: '/persons/details',
  fetcher: usePersonTestGet,
});
