import React from 'react';
import { QuickView, IQuickViewProps } from '../..';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import { Button } from 'antd';
import StoryApp from '../storyBookApp';

// #region Storybook Metadata & Configuration

export default {
  title: 'Components/QuickView',
  component: QuickView,
} as Meta;

// #endregion

// #region Base Mapping Template and Props

const BaseTemplate: Story<IQuickViewProps> = props => {
  return (
    <StoryApp>
      <QuickView {...props}>
        <Button type="link">Hello</Button>
      </QuickView>
    </StoryApp>
  );
};

const baseProps: IQuickViewProps = {
  entityId: '0cdad6b0-a3b2-4cf6-9b7d-238d753f0657',
  formPath: 'quickview-his-health-facilities-details',
  getEntityUrl: '/api/services/Common/HisHealthFacility/Get',
  displayProperty: null,
};

export const Base = BaseTemplate.bind({});
Base.args = { ...baseProps };

// #endregion
