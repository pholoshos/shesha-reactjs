import React, { FC, PropsWithChildren } from 'react';
import { GlobalStateProvider, ShaApplicationProvider, SidebarMenuDefaultsProvider } from '../../providers';
import AuthContainer from '../authedContainer';

const DEFAULT_ROUTER = {
  route: '',
  pathname: '',
  query: {},
  asPath: '',
  basePath: '',
  components: {},
  sde: {},
  clc: null,
  pageLoader: undefined,
  push(url: string) {
    return new Promise(resolve => {
      if (url) {
        resolve(true);
      }
    });
  },
};

export const StoryApp: FC<PropsWithChildren<{ layout?: boolean }>> = ({ children, layout = true }) => {
  const renderChildren = () => {
    try {
      const getLayout = (children as Array<any>)[0]?.type?.getLayout;

      return typeof getLayout === 'function' ? getLayout(children) : children;
    } catch (error) {
      return children;
    }
  };

  return (
    <GlobalStateProvider>
      <ShaApplicationProvider backendUrl={process.env.STORYBOOK_BASE_URL || 'https://houghtonh-his-api-test.azurewebsites.net'} router={DEFAULT_ROUTER as any}>
        <AuthContainer layout={layout}>
          <SidebarMenuDefaultsProvider items={[]}>{renderChildren()}</SidebarMenuDefaultsProvider>
        </AuthContainer>
      </ShaApplicationProvider>
    </GlobalStateProvider>
  );
};

export default StoryApp;
