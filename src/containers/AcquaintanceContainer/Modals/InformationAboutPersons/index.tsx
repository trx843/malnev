import { FC, useCallback, useEffect, useState } from "react";
import Modal from "antd/lib/modal/Modal";
import { AgGridColumn } from "ag-grid-react/lib/agGridColumn";
import { GridApi } from "ag-grid-community";
import Text from "antd/lib/typography/Text";
import moment from "moment";

import { AgGridTable } from "components/AgGridTable";
import { FullWidthCell } from "pages/PspControl/PlanCardPage/components/FullWidthCell";
import { getAcquaintanceVerificationActByActId } from "api/requests/pspControl/acquaintance";
import { AcquaintanceVerificationAct } from "api/requests/pspControl/acquaintance/types";
import { IdType } from "types";
import { RendererProps } from "components/ItemsTable";
import { Tooltip } from "antd";

interface ModalProps {
  visible: boolean;
  verificationActId: IdType | null | undefined;
  onClose: () => void;
}

export const InformationAboutPersonsModal: FC<ModalProps> = ({
  visible,
  verificationActId,
  onClose,
}) => {
  const [items, setItems] = useState<AcquaintanceVerificationAct[]>([]);
  const handleClose = () => {
    onClose?.();
    setItems([]);
  };

  const handleFetch = useCallback(async () => {
    if (!verificationActId) {
      return;
    }
    if (verificationActId) {
      const data = await getAcquaintanceVerificationActByActId(
        verificationActId
      );
      setItems(data);
    }
  }, [verificationActId]);

  useEffect(() => {
    if (visible) {
      handleFetch();
    }
  }, [visible, handleFetch]);

  const renderFullname = (name: string, jobTitle: string) => {
    let fullName = name;
    if (jobTitle) fullName += `, ${jobTitle}`;
    return (
      <Tooltip title={fullName}>
        <Text>{fullName}</Text>
      </Tooltip>
    );
  };
  return (
    <Modal
      title="Информация о лицах, ознакомившихся с документом"
      visible={visible}
      maskClosable={false}
      onCancel={handleClose}
      width={900}
      destroyOnClose
      footer={null}
    >
      <div className="acquaintance-modal-info__body">
        <div className="acquaintance__table">
          <AgGridTable
            hasLoadingOverlayComponentFramework
            rowData={items}
            suppressRowTransform={true}
            defaultColDef={{ resizable: true }}
            isAutoSizeColumns={false}
          >
            <AgGridColumn
              headerName="Дата ознакомления"
              field="acquaintanceDate"
              cellRendererFramework={(
                props: RendererProps<AcquaintanceVerificationAct>
              ) => <Text>{moment(props.value).format("DD.MM.YYYY")}</Text>}
              minWidth={186}
            />
            <AgGridColumn
              headerName="Акт (отчет)"
              field="acquaintedWithAct"
              minWidth={147}
            />
            <AgGridColumn
              headerName="План мероприятий"
              field="acquaintedWithPlan"
              minWidth={181}
            />
            <AgGridColumn
              headerName="ФИО, должность"
              field="verificationLevel"
              cellRendererFramework={(
                props: RendererProps<AcquaintanceVerificationAct>
              ) => renderFullname(props.data.fullName, props.data.jobTitle)}
              minWidth={322}
            />
          </AgGridTable>
        </div>
      </div>
    </Modal>
  );
};
