import axios from 'axios';
import FileSaver from 'file-saver';
import qs from 'qs';
import React, { FC } from 'react';
import { useMutate } from 'restful-react';
import { IAjaxResponseBase } from '../../../../../interfaces/ajaxResponse';
import { IErrorInfo } from '../../../../../interfaces/errorInfo';
import { useSheshaApplication } from '../../../../../providers';
import { ISelectionProps } from '../../../../../providers/dataTableSelection/models';
import { getFileNameFromResponse } from '../../../../../utils/fetchers';
import { getEntityFilterByIds } from '../../../../../utils/graphQl';
import { confirm, CONFIRM_BODY, getRowIds, onMessageDisplay } from './util';

export interface IConfigureModalProps {
  onRefresh: () => void;
  selectedRow: any;
  uniqueStateId: string;
}

export interface IUseConfigArgs {
  selectedRow: ISelectionProps;
  selectedRows: any;
  onRefresh: () => void;
}
export const useConfig = (args: IUseConfigArgs) => {
  const { selectedRow, selectedRows, onRefresh } = args;
  const { backendUrl, httpHeaders } = useSheshaApplication();
  const selectedRowIds = getRowIds(selectedRows);

  const { mutate: deleteConfigsAsync } = useMutate({
    verb: 'DELETE',
    path: `/api/services/Forms/Delete`,
  });

  const { mutate: duplicateConfigsAsync } = useMutate({
    verb: 'POST',
    path: `/api/services/Forms/Duplicate`,
  });

  const confirmer = (key: number, callback: (args) => void) => () =>
    confirm(callback, CONFIRM_BODY[key].title, CONFIRM_BODY[key].content);

  const deleteConfigs = confirmer(0, () => {
    onMessageDisplay('loading', 'Deleting in progress..');

    deleteConfigsAsync({ components: selectedRowIds })
      .then(() => {
        onMessageDisplay('success', 'Configs deleted successfully');
        onRefresh();
      })
      .catch(e => onMessageDisplay('error', 'An error occurred. Message:' + e));
  });

  const duplicateConfigs = confirmer(1, () => {
    onMessageDisplay('loading', 'Duplication in progress..');

    duplicateConfigsAsync({ id: selectedRowIds.at(0) })
      .then(response => {
        onMessageDisplay('success', 'Configs duplicated successfully');
        onRefresh();
        console.log(response?.result);
      })
      .catch(e => onMessageDisplay('error', 'An error occurred. Message:' + e));
  });

  const exportConfigs = () => {
    const filter = selectedRowIds?.length > 0
      ? getEntityFilterByIds(selectedRowIds)
      : null;
    const url = `${backendUrl}/api/services/Shesha/FormConfiguration/Export?${qs.stringify(
      { filter }
    )}`;

    axios({
      url: url,
      method: 'GET',
      responseType: 'blob', // important
      headers: httpHeaders,
    })
      .then(response => {
        const fileName = getFileNameFromResponse(response) ?? `forms${Date.now()}.json`;

        FileSaver.saveAs(new Blob([response.data]), fileName);
      })
      .catch(e => console.error(e));
  };

  const publishConfigs = () => {
    if (!selectedRow) {
      onMessageDisplay('error', 'Please select a configuration');
      return;
    }

    const executer = confirmer(2, () => {
      if (!selectedRow)
        throw 'Configuration not selected';
      
      onMessageDisplay('loading', 'Publishing in progress..');
  
      const url = `${backendUrl}/api/services/Shesha/FormConfiguration/Publish`;
      const payload = { filter: getEntityFilterByIds([ selectedRow.id ]) };
      axios({
        url: url,
        method: 'PUT',
        data: payload,
        headers: httpHeaders,
      })
        .then(_response => {
          onMessageDisplay('success', 'Configs published successfully');
          onRefresh();
        })
        .catch(e => onMessageDisplay('error', 'An error occurred. Message:' + e));
    });

    executer();
  };

  const setConfigsReady = () => {
    if (!selectedRow) {
      onMessageDisplay('error', 'Please select a configuration');
      return;
    }
    const executer = confirmer(3, () => {
      if (!selectedRow)
        throw 'Configuration not selected';
  
      onMessageDisplay('loading', 'Set config ready in progress..');
  
      const url = `${backendUrl}/api/services/Shesha/FormConfiguration/UpdateStatus`;
      const payload = { filter: getEntityFilterByIds([ selectedRow.id ]), status: 2 /* ready */ };
  
      axios({
        url: url,
        method: 'PUT',
        data: payload,
        headers: httpHeaders,
      })
        .then(_response => {
          onMessageDisplay('success', 'Configs marked as ready successfully');
          onRefresh();
        })
        .catch(e => {
          const response = (e.response?.data as IAjaxResponseBase);
          if (response && response.error){
            onMessageDisplay('error', <ErrorDetails error={response.error} />);
          } else 
            onMessageDisplay('error', 'An error occurred. Message:' + e);
        });
    });

    executer();
  }

  return { deleteConfigs, duplicateConfigs, exportConfigs, publishConfigs, setConfigsReady };
};


interface IErrorDetailsProps {
  error: IErrorInfo;
}
const ErrorDetails: FC<IErrorDetailsProps> = ({ error }) => {
  return (
    <div>
      <strong>{error.details}</strong>
      <ul>
        {error.validationErrors?.map((e, i) => (
          <li key={i}>{e.message}</li>
        ))}
      </ul>
    </div>
  );
}