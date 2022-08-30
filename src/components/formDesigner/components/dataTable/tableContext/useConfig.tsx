import { useMutate } from 'restful-react';
import { getRowIds, onMessageDisplay } from './util';

export interface IConfigureModalProps {
  onRefresh: () => void;
  selectedRow: any;
  uniqueStateId: string;
}

export const useConfig = (selectedRow: any, onRefresh: () => void) => {
  const selectedRowIds = getRowIds(selectedRow);

  const { mutate: deleteConfigsAsync } = useMutate({
    verb: 'DELETE',
    path: `/api/services/Forms/Delete`,
  });

  const { mutate: duplicateConfigsAsync } = useMutate({
    verb: 'POST',
    path: `/api/services/Forms/Duplicate`,
  });

  const { mutate: exportJsonConfigs } = useMutate({
    verb: 'POST',
    path: `/api/services/Forms/Export`,
  });

  const deleteConfigs = () => {
    onMessageDisplay('loading', 'Deleting in progress..');

    deleteConfigsAsync({ components: selectedRowIds })
      .then(() => {
        onMessageDisplay('success', 'Configs deleted successfully');
        onRefresh();
      })
      .catch(e => onMessageDisplay('error', 'An error occurred. Message:' + e));
  };

  const duplicateConfigs = () => {
    onMessageDisplay('loading', 'Duplication in progress..');

    duplicateConfigsAsync({ id: selectedRowIds.at(0) })
      .then(response => {
        onMessageDisplay('success', 'Configs duplicated successfully');
        onRefresh();
        console.log(response?.result);
      })
      .catch(e => onMessageDisplay('error', 'An error occurred. Message:' + e));
  };

  const exportConfigs = () => {
    exportJsonConfigs({ components: selectedRowIds }).then(response => {
      const url = window.URL.createObjectURL(new Blob([JSON.stringify(response)]));
      const link = document.createElement('a');
      link.href = url;
      const timestamp = Date.now();
      const fileName = `exportJsonConfig` + timestamp + `.json`;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    });
  };

  return { deleteConfigs, duplicateConfigs, exportConfigs };
};
