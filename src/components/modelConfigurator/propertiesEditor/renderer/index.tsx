import React, { FC, useMemo } from 'react';
import { Button, Tabs } from 'antd';
import { CodeEditor, SidebarContainer } from '../../../';
import { ToolbarItemProperties } from './itemProperties';
import ItemsContainer from './itemsContainer';
import { usePropertiesEditor } from '../provider';

export interface IModelConfiguratorProps { }

const { TabPane } = Tabs;

export const PropertiesEditorRenderer: FC<IModelConfiguratorProps> = () => {
  const { items, addItem, selectedItemRef } = usePropertiesEditor();

const onAddClick = () => {
  addItem().then(_item => {
    const element = selectedItemRef?.current;
    if (element) {
      const offset = 0;
      
      //get how much pixels left to scrolling our ReactElement
      const top = element.getBoundingClientRect().top;
      const isVisible = top + offset >= 0 && top - offset <= window.innerHeight;
      if (!isVisible)
        element?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    }
  });
}

  const jsonSchema = useMemo(() => {
    return JSON.stringify(items, null, 2);
  }, [items]);

  return (
    <Tabs>
      <TabPane tab="Designer" key="1">
        <div className="sha-action-buttons" style={{ marginBottom: '8px' }}>
          <Button onClick={onAddClick} type="primary">
            Add Property
          </Button>
        </div>
        <div className="sha-sidebar-configurator">
          <SidebarContainer
            rightSidebarProps={{
              open: true,
              title: 'Properties',
              content: <ToolbarItemProperties />,
            }}
          >
            <ItemsContainer items={items} index={[]} />
          </SidebarContainer>
        </div>
      </TabPane>
      <TabPane tab="Schema" key="2">
        <CodeEditor value={jsonSchema} readOnly={true} width='100%' />
      </TabPane>
    </Tabs>
  );
};