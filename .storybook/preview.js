import '../src/styles/index.less';
// import 'antd/dist/antd.less';
import './themeVariables.css';

import React from 'react';
import { RestfulProvider } from 'restful-react';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  // layout: 'centered',
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    expanded: true,
  },
};

export const decorators = [
  Story => (
    <RestfulProvider base={process.env.STORYBOOK_BASE_URL}>
      <Story />
    </RestfulProvider>
  ),
];
