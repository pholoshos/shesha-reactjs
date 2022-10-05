import { ExclamationCircleOutlined } from "@ant-design/icons";
import { message, Modal, notification } from "antd";
import axios, { AxiosResponse } from "axios";
import FileSaver from "file-saver";
import React, { FC } from "react";
import { IAjaxResponseBase } from "../../interfaces/ajaxResponse";
import { IErrorInfo } from "../../interfaces/errorInfo";
import { IAbpWrappedGetEntityResponse } from "../../interfaces/gql";
import IRequestHeaders from "../../interfaces/requestHeaders";
import { FormConfigurationDto } from "../../providers/form/api";
import { getFileNameFromResponse } from "../fetchers";
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

export interface IHasConfigurableItemId {
    itemId: string;
}

interface UpdateItemStatusArgs extends IHasHttpSettings {
    id: string;
    status: ConfigurationItemVersionStatus;
    onSuccess?: (dto: FormConfigurationDto) => void;
}
const updateItemStatus = (props: UpdateItemStatusArgs) => {
    const url = `${props.backendUrl}/api/services/Shesha/FormConfiguration/UpdateStatus`;
    const httpPayload = {
        filter: getEntityFilterByIds([props.id]),
        status: props.status
    };
    return axios.put<any, AxiosResponse<IAbpWrappedGetEntityResponse<FormConfigurationDto>>>(url, httpPayload, { headers: props.httpHeaders })
        .then(response => {
            message.destroy();
            if (props.onSuccess)
                props.onSuccess(response?.data?.result);

            //message.info('Configs published successfully', 3);
            //onRefresh();
        })
        .catch(e => {
            message.destroy();
            message.error('An error occurred. Message:' + e)
        });
}

//#region Publish
export interface IPublishItemPayload extends IHasHttpSettings {
    id: string;
}
export interface IPublishItemResponse {
    id: string;
}
export const publishItem = (payload: IPublishItemPayload): Promise<IPublishItemResponse> => {
    if (!payload.id)
        throw 'Id must not be null';

    return new Promise<IPublishItemResponse>((resolve) => {
        const onOk = () => {
            message.loading('Publishing in progress..', 0);
            updateItemStatus({
                backendUrl: payload.backendUrl,
                httpHeaders: payload.httpHeaders,
                id: payload.id,
                status: ConfigurationItemVersionStatus.Live,
                onSuccess: (dto) => resolve({ id: dto.id }),
            });
        }
        Modal.confirm({
            title: 'Publish Item',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to publish this form?',
            okText: 'Yes',
            //okType: 'danger',
            cancelText: 'No',
            onOk
        });

    });
}

//#endregion

//#region Set item ready
export interface ISetItemReadyPayload extends IHasHttpSettings {
    id: string;
}
export interface ISetItemReadyResponse {
    id: string;
}
export const setItemReady = (payload: ISetItemReadyPayload): Promise<ISetItemReadyResponse> => {
    return new Promise<ISetItemReadyResponse>((resolve) => {
        const onOk = () => {
            updateItemStatus({
                backendUrl: payload.backendUrl,
                httpHeaders: payload.httpHeaders,
                id: payload.id,
                status: ConfigurationItemVersionStatus.Ready,
                onSuccess: (dto) => resolve({ id: dto.id }),
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
    });
}

//#endregion

//#region Create new version
export interface ICreateNewItemVersionPayload extends IHasHttpSettings {
    id: string;
}
export interface ICreateNewItemVersionResponse {
    id: string;
}
export const createNewVersion = (payload: ICreateNewItemVersionPayload): Promise<ICreateNewItemVersionResponse> => {
    return new Promise<ICreateNewItemVersionResponse>((resolve, _reject) => {
        // todo: return a promise and handle completion on upper level
        const onOk = () => {
            const url = `${payload.backendUrl}/api/services/Shesha/FormConfiguration/CreateNewVersion`;
            const httpPayload = {
                id: payload.id
            };
            return axios.post<any, AxiosResponse<IAbpWrappedGetEntityResponse<FormConfigurationDto>>>(url, httpPayload, { headers: payload.httpHeaders })
                .then(response => {
                    message.destroy();
                    resolve({ id: response.data.result.id });
                    //message.info('New version created successfully', 3);
                })
                .catch(e => {
                    message.destroy();
                    const response = (e.response?.data as IAjaxResponseBase);
                    if (response && response.error) {
                        // reject(response.error);
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
    });
}

//#endregion

//#region Cancel version
export interface ICancelItemVersionPayload extends IHasHttpSettings {
    id: string;
}
export interface ICancelItemVersionResponse {
    id: string;
}
export const itemCancelVersion = (payload: ICancelItemVersionPayload): Promise<ICancelItemVersionResponse> => {
    return new Promise((resolve) => {
        const onOk = () => {
            const url = `${payload.backendUrl}/api/services/Shesha/FormConfiguration/CancelVersion`;
            const httpPayload = {
                id: payload.id
            };
            return axios.post<any, AxiosResponse<IAbpWrappedGetEntityResponse<FormConfigurationDto>>>(url, httpPayload, { headers: payload.httpHeaders })
                /*return axios.post<>({
                    url: url,
                    method: 'POST',
                    data: httpPayload,
                    headers: app.httpHeaders,
                })*/
                .then(response => {
                    message.destroy();
                    //message.info('Version cancelled successfully', 3);
                    resolve({ id: response?.data?.result?.id });
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
    });
}

//#endregion

//#region Doanload as JSON
export interface IDownloadItemAsJsonPayload extends IHasHttpSettings {
    id: string;
}
export interface IDownloadItemAsJsonResponse {
    id: string;
}
export const downloadAsJson = (payload: IDownloadItemAsJsonPayload): Promise<IDownloadItemAsJsonResponse> => {
    const url = `${payload.backendUrl}/api/services/Shesha/FormConfiguration/GetJson?id=${payload.id}`;
    return axios({
        url: url,
        method: 'GET',
        responseType: 'blob', // important
        headers: payload.httpHeaders,
    })
        .then(response => {
            const fileName = getFileNameFromResponse(response) ?? 'form.json';
            FileSaver.saveAs(new Blob([response.data]), fileName);
            return { id: payload.id };
        });
}

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