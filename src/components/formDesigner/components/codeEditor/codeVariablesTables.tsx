import { Table, Tag } from 'antd';
import React, { FC } from 'react';
import { ICodeExposedVariable } from './models';

const columns = [
  {
    title: 'Variable name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Datatype',
    key: 'type',
    dataIndex: 'type',
    render: tag => <Tag key={tag}>{tag?.toUpperCase()}</Tag>,
  },
];

export interface ICodeVariablesTableProps {
  data?: ICodeExposedVariable[];
}

export const CodeVariablesTables: FC<ICodeVariablesTableProps> = ({ data }) => (
  <Table columns={columns} dataSource={data} pagination={false} />
);
