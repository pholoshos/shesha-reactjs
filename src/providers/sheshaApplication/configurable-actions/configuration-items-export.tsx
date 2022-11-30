import { ExportOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { nanoid } from "nanoid";
import React, { FC, MutableRefObject, useRef, useState } from "react";
import { useAppConfiguratorState, useDynamicModals } from "../../..";
import ConfigurationItemsExport, { IExportInterface } from "../../../components/configurationItemsExport";
import { useConfigurableAction } from "../../configurableActionsDispatcher";
import { SheshaActionOwners } from "../../configurableActionsDispatcher/models";
import { ICommonModalProps } from "../../dynamicModal/models";

const actionsOwner = 'Configuration Framework';

export const useConfigurationItemsExportAction = () => {
  const { createModal, removeModal } = useDynamicModals();
  const appConfigState = useAppConfiguratorState();
  const exporterRef = useRef<IExportInterface>();

  useConfigurableAction({
    name: 'Export items',
    owner: actionsOwner,
    ownerUid: SheshaActionOwners.ConfigurationFramework,
    hasArguments: false,
    executer: (actionArgs) => {
      const modalId = nanoid();

      return new Promise((resolve, _reject) => {

        const hideModal = () => {
          removeModal(modalId);
        }

        const onExported = () => {
          console.log('onExported');
          removeModal(modalId);
          resolve(true);
        }

        const modalProps: ICommonModalProps = {
          ...actionArgs,
          id: modalId,
          title: "Export Configuration Items",
          isVisible: true,
          showModalFooter: false,
          content: <ConfigurationItemsExport onExported={onExported} exportRef={exporterRef}/>,
          footer: <ConfigurationItemsExportFooter hideModal={hideModal} exporterRef={exporterRef} />
        };
        createModal({ ...modalProps, isVisible: true });
      });
    },
  }, [appConfigState]);
};


interface IConfigurationItemsExportFooterProps {
  hideModal: () => void;
  exporterRef: MutableRefObject<IExportInterface>;
}
export const ConfigurationItemsExportFooter: FC<IConfigurationItemsExportFooterProps> = (props) => {
  const [inProgress, setInProgress] = useState(false);
  const { hideModal, exporterRef } = props;

  const onExport = () => {
    setInProgress(true);

    exporterRef.current.exportExecuter().then(() => {
      hideModal();
    }).catch(() => {
      setInProgress(false);
    });
  }

  return (
    <>
      <Button type='default' onClick={hideModal}>Cancel</Button>
      <Button type='primary' icon={<ExportOutlined />} onClick={onExport} loading={inProgress}>Export</Button>
    </>
  );
}