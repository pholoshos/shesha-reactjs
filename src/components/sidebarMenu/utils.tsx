import { MenuProps } from 'antd';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { ISidebarMenuItem } from '../../providers/sidebarMenu';
import ShaIcon, { IconType } from '../shaIcon';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  target: string,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  isParent?: boolean
): MenuItem {
  return {
    key,
    icon,
    children,
    label: (
      <a className={classNames('nav-links-renderer', { 'is-parent-menu': isParent })} href={target}>
        {label}
      </a>
    ),
  } as MenuItem;
}

const getIcon = (icon: ReactNode, isParent?: boolean) => {
  if (typeof icon === 'string')
    return <ShaIcon iconName={icon as IconType} className={classNames({ 'is-parent-menu': isParent })} />;

  if (React.isValidElement(icon)) return icon;
  return null;
};

export interface IProps extends ISidebarMenuItem {
  isSubMenu?: boolean;
  isItemVisible: (item: ISidebarMenuItem) => boolean;
}

// Note: Have to use function instead of react control. It's a known issue, you can only pass MenuItem or MenuGroup as Menu's children. See https://github.com/ant-design/ant-design/issues/4853
export const renderSidebarMenuItem = (props: IProps) => {
  const { id: key, title, icon, childItems, target, isItemVisible } = props;

  if (typeof isItemVisible === 'function' && !isItemVisible(props)) return null;

  const hasChildren = childItems?.length > 0;

  return getItem(
    title,
    target,
    key,
    getIcon(icon, hasChildren),
    hasChildren ? childItems?.map(renderSidebarMenuItem) : null,
    hasChildren
  );
};

export default renderSidebarMenuItem;
