import React, { CSSProperties, FC } from 'react';
import ConfigurableFormComponent from './configurableFormComponent';
import { useForm } from '../../providers/form';
import { TOOLBOX_COMPONENT_DROPPABLE_KEY, TOOLBOX_DATA_ITEM_DROPPABLE_KEY } from '../../providers/form/models';
import { ItemInterface, ReactSortable } from 'react-sortablejs';

export type Direction = 'horizontal' | 'vertical';

export interface IProps {
  containerId: string;
  direction?: Direction;
  justifyContent?: string;
  alignItems?: string;
  justifyItems?: string;
  className?: string;
}
const ComponentsContainer: FC<IProps> = ({
  containerId,
  children,
  direction = 'vertical',
  justifyContent,
  alignItems,
  justifyItems,
  className,
}) => {
  const {
    getChildComponents,
    updateChildComponents,
    addComponent,
    addDataProperty,
    startDragging,
    endDragging,
    formMode,
    // type,
  } = useForm();

  const isDesignerMode = formMode === 'designer';

  // const isViewTemplateComponent =
  //   type === 'dashboard' || type === 'details' || type === 'masterDetails' || type === 'table' || type === 'menu';

  const components = getChildComponents(containerId);

  const componentsMapped = components.map<ItemInterface>(c => ({
    id: c.id,
  }));

  const onSetList = (newState: ItemInterface[], _sortable, _store) => {
    // temporary commented out, the behavoiur of the sortablejs differs sometimes
    const listChanged = true; //!newState.some(item => item.chosen !== null && item.chosen !== undefined);

    if (listChanged) {
      const newDataItemIndex = newState.findIndex(item => item['type'] === TOOLBOX_DATA_ITEM_DROPPABLE_KEY);
      if (newDataItemIndex > -1) {
        // dropped data item
        const draggedItem = newState[newDataItemIndex];

        addDataProperty({
          propertyMetadata: draggedItem.metadata,
          containerId,
          index: newDataItemIndex,
        });
      } else {
        const newComponentIndex = newState.findIndex(item => item['type'] === TOOLBOX_COMPONENT_DROPPABLE_KEY);
        if (newComponentIndex > -1) {
          // add new component
          const toolboxComponent = newState[newComponentIndex];

          addComponent({
            containerId,
            componentType: toolboxComponent.id.toString(),
            index: newComponentIndex,
          });
        } else {
          // reorder existing components
          const newIds = newState.map<string>(item => item.id.toString());
          updateChildComponents({ containerId, componentIds: newIds });
        }
      }
    }
    return;
  };

  const onDragStart = () => {
    startDragging();
  };

  const onDragEnd = _evt => {
    endDragging();
  };

  const renderComponents = () => {
    return components.map((c, index) => <ConfigurableFormComponent id={c.id} index={index} key={c.id} />);
  };

  const style: CSSProperties = {};
  if (direction === 'horizontal' && justifyContent) {
    style['justifyContent'] = justifyContent;
    style['alignItems'] = alignItems;
    style['justifyItems'] = justifyItems;
  }

  return (
    <div className={`sha-components-container ${direction} ${className}`}>
      {isDesignerMode ? (
        <>
          {components.length === 0 && <div className="sha-drop-hint">Drag and Drop form component</div>}
          <ReactSortable
            // disabled
            disabled={!isDesignerMode}
            onStart={onDragStart}
            onEnd={onDragEnd}
            list={componentsMapped}
            setList={onSetList}
            fallbackOnBody={true}
            swapThreshold={0.5}
            group={{
              name: 'shared',
            }}
            sort={true}
            draggable=".sha-component"
            animation={75}
            ghostClass="sha-component-ghost"
            emptyInsertThreshold={20}
            handle=".sha-component-drag-handle"
            scroll={true}
            bubbleScroll={true}
            direction={direction}
            className={`sha-components-container-inner`}
            style={style}
            /* note: may be used form horizontal containers like toolbar or action buttons
      direction={(evt: SortableEvent, _target: HTMLElement, _dragEl: HTMLElement) => {
        const insideColumn = evt.target.className.includes('sha-designer-column');
        return insideColumn
          ? 'horizontal'
          : 'vertical';
      }}
      */
          >
            {renderComponents()}
          </ReactSortable>
        </>
      ) : (
        <div className="sha-components-container-inner" style={style}>
          {renderComponents()}
        </div>
      )}
      {children}
    </div>
  );
};

export default ComponentsContainer;
