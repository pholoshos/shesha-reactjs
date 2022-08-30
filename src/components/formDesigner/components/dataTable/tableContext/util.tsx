import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import { LegacyButtonType } from 'antd/lib/button/button';
import { ArgsProps, MessageApi } from 'antd/lib/message';
import React from 'react';

interface IOptions {
  okText?: string;
  okType?: LegacyButtonType;
  cancelText?: string;
}

export const confirm = (
  onOk: (...args: any[]) => any,
  title: string,
  content: string,
  onCancel?: (...args: any[]) => any,
  options?: IOptions
) =>
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    okText: options?.okText || 'Yes',
    okType: options?.okType || 'danger',
    cancelText: options?.cancelText || 'No',
    onOk,
    onCancel,
  });

export const getRowIds = (rows: any): string[] => rows.map(i => i?.id);

export const onMessageDisplay = (type: keyof MessageApi, content: ArgsProps | any) => {
  message.destroy();

  const duration = type === 'loading' ? 0 : 3;
  message[type](content, duration);
};
