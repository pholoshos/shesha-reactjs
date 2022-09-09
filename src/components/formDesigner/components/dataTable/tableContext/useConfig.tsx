import axios from 'axios';
import FileSaver from 'file-saver';
import qs from 'qs';
import { useMutate } from 'restful-react';
import { useSheshaApplication } from '../../../../../providers';
import { getFileNameFromResponse } from '../../../../../utils/fetchers';
import { getEntityFilterByIds } from '../../../../../utils/graphQl';
import { confirm, CONFIRM_BODY, getRowIds, onMessageDisplay } from './util';

export interface IConfigureModalProps {
  onRefresh: () => void;
  selectedRow: any;
  uniqueStateId: string;
}

export const useConfig = (selectedRow: any, onRefresh: () => void) => {
  const { backendUrl, httpHeaders } = useSheshaApplication();
  const selectedRowIds = getRowIds(selectedRow);

  const { mutate: deleteConfigsAsync } = useMutate({
    verb: 'DELETE',
    path: `/api/services/Forms/Delete`,
  });

  const { mutate: duplicateConfigsAsync } = useMutate({
    verb: 'POST',
    path: `/api/services/Forms/Duplicate`,
  });

  // const { mutate: exportJsonConfigs } = useMutate({
  //   verb: 'POST',
  //   path: `/api/services/Shesha/FormConfiguration/Export`,
  // });

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

  return { deleteConfigs, duplicateConfigs, exportConfigs };
};
