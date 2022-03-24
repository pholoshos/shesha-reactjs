import React, { FC } from 'react';
import { ButtonGroupItem } from './buttonGroupItem';
import { ButtonGroupItemsGroup } from './buttonGrouptemsGroup';
import { useToolbarConfigurator } from '../../../../providers/toolbarConfigurator';
import { IButtonGroup, IToolbarButton, ToolbarItemProps } from '../../../../providers/toolbarConfigurator/models';
import { ReactSortable, ItemInterface } from 'react-sortablejs';

export interface IToolbarItemsSortableProps {
  index?: number[];
  id?: string;
  items: ToolbarItemProps[];
}

export const ButtonGroupItemsContainer: FC<IToolbarItemsSortableProps> = props => {
  const { updateChildItems } = useToolbarConfigurator();

  const renderItem = (item: ToolbarItemProps, index: number) => {
    switch (item.itemType) {
      case 'item':
        const itemProps = item as IToolbarButton;
        return <ButtonGroupItem key={index} index={[...props.index, index]} {...itemProps} />;

      case 'group':
        const groupProps = item as IButtonGroup;
        return <ButtonGroupItemsGroup key={index} {...groupProps} index={[...props.index, index]} />;
    }
  };

  const onSetList = (newState: ItemInterface[], _sortable, _store) => {
    const listChanged = !newState.some(item => item.chosen !== null && item.chosen !== undefined);

    if (listChanged) {
      const newChilds = newState.map<ToolbarItemProps>(item => item as ToolbarItemProps);

      updateChildItems({ index: props.index, id: props.id, childs: newChilds });
    }

    return;
  };

  return (
    <ReactSortable
      // onStart={onDragStart}
      // onEnd={onDragEnd}
      list={props.items}
      setList={onSetList}
      fallbackOnBody={true}
      swapThreshold={0.5}
      group={{
        name: 'toolbarItems',
      }}
      sort={true}
      draggable=".sha-toolbar-item"
      animation={75}
      ghostClass="sha-toolbar-item-ghost"
      emptyInsertThreshold={20}
      handle=".sha-toolbar-item-drag-handle"
      scroll={true}
      bubbleScroll={true}
    >
      {props.items.map((item, index) => renderItem(item, index))}
    </ReactSortable>
  );
};
export default ButtonGroupItemsContainer;
