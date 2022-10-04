import { ExclamationCircleOutlined } from "@ant-design/icons";
import { message, Modal, notification } from "antd";
import axios from "axios";
import React, { FC } from "react";
import { useSubscribe } from "../../hooks";
import { IAjaxResponseBase } from "../../interfaces/ajaxResponse";
import { IErrorInfo } from "../../interfaces/errorInfo";
import { IPubSubPayload } from "../../interfaces/pubsub";
import IRequestHeaders from "../../interfaces/requestHeaders";
import { ConfigurationFrameworkEvents } from "../../providers/sheshaApplication/models";
import { getEntityFilterByIds } from "../graphQl";
import { ConfigurationItemVersionStatus } from "./models";

export interface ItemWithIdPayload {
    id: string;
}

export interface IConfigurationFrameworkHookArguments {
    backendUrl: string;
    httpHeaders: IRequestHeaders;
}

interface IHasHttpSettings {
    backendUrl: string;
    httpHeaders: IRequestHeaders;
}

interface UpdateItemStatusArgs extends IHasHttpSettings {
    id: string;
    status: ConfigurationItemVersionStatus;
}
const updateItemStatus = (props: UpdateItemStatusArgs) => {
    const url = `${props.backendUrl}/api/services/Shesha/FormConfiguration/UpdateStatus`;
    const httpPayload = {
        filter: getEntityFilterByIds([props.id]),
        status: ConfigurationItemVersionStatus.Live
    };
    return axios({
        url: url,
        method: 'PUT',
        data: httpPayload,
        headers: props.httpHeaders,
    })
        .then(_response => {
            message.destroy();
            message.info('Configs published successfully', 3);
            //onRefresh();
        })
        .catch(e => {
            message.destroy();
            message.error('An error occurred. Message:' + e)
        });
}

//#region Publish
const publishItem = (app: IConfigurationFrameworkHookArguments, payload: ItemWithIdPayload) => {
    if (!payload.id)
        throw 'Id must not be null';

    const onOk = () => {
        message.loading('Publishing in progress..', 0);
        updateItemStatus({
            backendUrl: app.backendUrl,
            httpHeaders: app.httpHeaders,
            id: payload.id,
            status: ConfigurationItemVersionStatus.Live,
        });
    }
    Modal.confirm({
        title: 'Set Ready',
        icon: <ExclamationCircleOutlined />,
        content: 'Are you sure you want to set this form ready?',
        okText: 'Yes',
        //okType: 'danger',
        cancelText: 'No',
        onOk
    });
}

export const usePublishItemEvent = (props: IConfigurationFrameworkHookArguments) => {
    return useSubscribe<IPubSubPayload<ItemWithIdPayload>>(ConfigurationFrameworkEvents.ItemPublish, data => {
        publishItem(props, data.state);
    });
}
//#endregion

//#region Set item ready
const setItemReady = (app: IConfigurationFrameworkHookArguments, payload: ItemWithIdPayload) => {
    // todo: return a promise and handle completion on upper level
    const onOk = () => {
        updateItemStatus({
            backendUrl: app.backendUrl,
            httpHeaders: app.httpHeaders,
            id: payload.id,
            status: ConfigurationItemVersionStatus.Ready,
        });

    }
    Modal.confirm({
        title: 'Set Ready',
        icon: <ExclamationCircleOutlined />,
        content: 'Are you sure you want to set this form ready?',
        okText: 'Yes',
        //okType: 'danger',
        cancelText: 'No',
        onOk
    });
}

export const useSetItemReadyEvent = (props: IConfigurationFrameworkHookArguments) => {
    return useSubscribe<IPubSubPayload<ItemWithIdPayload>>(ConfigurationFrameworkEvents.ItemSetReady, data => {
        setItemReady(props, data.state);
    });
}
//#endregion

//#region Create new version
const createNewVersion = (app: IConfigurationFrameworkHookArguments, payload: ItemWithIdPayload) => {
    // todo: return a promise and handle completion on upper level
    const onOk = () => {
        const url = `${app.backendUrl}/api/services/Shesha/FormConfiguration/CreateNewVersion`;
        const httpPayload = {
            id: payload.id
        };
        return axios({
            url: url,
            method: 'POST',
            data: httpPayload,
            headers: app.httpHeaders,
        })
            .then(_response => {
                message.destroy();
                message.info('New version created successfully', 3);
            })
            .catch(e => {
                message.destroy();
                const response = (e.response?.data as IAjaxResponseBase);
                if (response && response.error) {
                    //message.error(<ErrorDetails error={response.error} />, 0)
                    console.log('error:', response.error)
                    notification.error({
                        message: 'Sorry! An error occurred.',
                        icon: null,
                        description: <ErrorDetails error={response.error} />
                        //description: <ValidationErrors error={response.error} renderMode="raw" />,
                      });
                } else
                message.error('An error occurred. Message:' + e);
            });
    }
    Modal.confirm({
        title: 'Create New Version',
        icon: <ExclamationCircleOutlined />,
        content: 'Are you sure you want to create new version of the form?',
        okText: 'Yes',
        //okType: 'danger',
        cancelText: 'No',
        onOk
    });
}

export const useItemCreateNewVersionEvent = (props: IConfigurationFrameworkHookArguments) => useSubscribe<IPubSubPayload<ItemWithIdPayload>>(ConfigurationFrameworkEvents.ItemCreateNewVersion, data => {
    createNewVersion(props, data.state);
});
//#endregion

//#region Cancel version
const itemCancelVersion = (app: IConfigurationFrameworkHookArguments, payload: ItemWithIdPayload) => {
    // todo: return a promise and handle completion on upper level
    const onOk = () => {
        const url = `${app.backendUrl}/api/services/Shesha/FormConfiguration/CancelVersion`;
        const httpPayload = {
            id: payload.id
        };
        return axios({
            url: url,
            method: 'POST',
            data: httpPayload,
            headers: app.httpHeaders,
        })
            .then(_response => {
                message.destroy();
                message.info('Version cancelled successfully', 3);
            })
            .catch(e => {
                message.destroy();
                message.error('An error occurred. Message:' + e)
            });
    }
    Modal.confirm({
        title: 'Cancel form version',
        icon: <ExclamationCircleOutlined />,
        content: 'Are you sure you want to cancel current version of the form?',
        okText: 'Yes',
        //okType: 'danger',
        cancelText: 'No',
        onOk
    });
    console.log('createNewVersion id: ', payload?.id)
}

export const useItemCancelVersionEvent = (props: IConfigurationFrameworkHookArguments) => useSubscribe<IPubSubPayload<ItemWithIdPayload>>(ConfigurationFrameworkEvents.ItemCancelVersion, data => {
    itemCancelVersion(props, data.state);
});
//#endregion

interface IErrorDetailsProps {
    error: IErrorInfo;
  }
  const ErrorDetails: FC<IErrorDetailsProps> = ({ error }) => {
    return (
      <div>
        {/* <strong>{error.details}</strong> */}
        <ul>
          {error.validationErrors?.map((e, i) => (
            <li key={i}>{e.message}</li>
          ))}
        </ul>
      </div>
    );
  }