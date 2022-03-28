import React, { useRef } from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { Story } from '@storybook/react';
import ChildDataTable, { IndexTableFull } from './';
import DataTableProvider from '../../providers/dataTable';
import { SearchOutlined } from '@ant-design/icons';
import { IShaDataTableProps } from '../..';
import StoryApp from '../storyBookApp';

export default {
  title: 'Components/IndexTableFull',
  component: ChildDataTable,
  argTypes: {},
} as Meta;

const tableProps: IShaDataTableProps = {
  id: 'Persons_Index',
  header: 'List of People',
  crud: {
    update: true,
    create: true,
  },
  actionColumns: [
    {
      icon: <SearchOutlined />,
      onClick: id => {
        alert('clicked row with Id = ' + id);
      },
    },
  ],
  onExportSuccess: () => {
    console.log('Components/IndexTableFull export succeeded');
  },
  onExportError: () => {
    console.log('Components/IndexTableFull export error');
  },
};

// Create a master template for mapping args to render the Button component
const Template: Story<IShaDataTableProps> = args => {
  const tableRef = useRef();

  return (
    <StoryApp>
      <DataTableProvider tableId={args.id} title="Users" {...args}>
        {/* <TableHack></TableHack> */}
        <IndexTableFull
          {...tableProps}
          {...args}
          tableRef={tableRef}
          useMultiselect
          onSelectedIdsChanged={ids => {
            console.log('onSelectedIdsChanged ids :>> ', ids);
          }}
        />
      </DataTableProvider>
    </StoryApp>
  );
};

export const SimpleChildTable = Template.bind({});
SimpleChildTable.args = { ...tableProps };
