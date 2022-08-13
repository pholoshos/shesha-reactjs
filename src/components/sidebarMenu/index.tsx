import React, { FC } from 'react';
import { Menu } from 'antd';
import { MenuTheme } from 'antd/lib/menu/MenuContext';
import { useLocalStorage } from '../../hooks';
import { ISidebarMenuItem, useSidebarMenu } from '../../providers/sidebarMenu';
import { getCurrentUrl, normalizeUrl } from '../../utils/url';
import { renderSidebarMenuItem } from './utils';

export interface ISidebarMenuProps {
  isCollapsed?: boolean;
  theme?: MenuTheme;
}

const findItem = (target: string, array: ISidebarMenuItem[]): ISidebarMenuItem => {
  for (const item of array) {
    if (item.target === target) return item;
    if (item.childItems) {
      const child = findItem(target, item.childItems);
      if (child) return child;
    }
  }
  return null;
};

export const SidebarMenu: FC<ISidebarMenuProps> = ({ theme = 'dark' }) => {
  const [openedKeys, setOpenedKeys] = useLocalStorage('openedSidebarKeys', null);
  const { getItems, isItemVisible } = useSidebarMenu();

  const items = getItems();

  if ((items ?? []).length === 0) return null;

  const currentPath = normalizeUrl(getCurrentUrl());
  const selectedItem = findItem(currentPath, items);
  const selectedKey = selectedItem?.id;

  const onOpenChange = (openKeys: React.Key[]) => {
    setOpenedKeys(openKeys);
  };

  const keys = openedKeys && openedKeys.length > 0 ? openedKeys : undefined;

  return (
    <Menu
      mode="inline"
      className="nav-links-renderer sha-sidebar-menu"
      defaultSelectedKeys={selectedKey ? [selectedKey] : []}
      defaultOpenKeys={keys}
      onOpenChange={onOpenChange}
      theme={theme}
      items={items.map(item => renderSidebarMenuItem({ ...item, isItemVisible }))}
    />
  );
};

export default SidebarMenu;
