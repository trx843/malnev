import { FC, useCallback, useEffect, useState } from "react";
import { AgGridColumn } from "ag-grid-react";
import { useSelector } from "react-redux";
import { Button, Modal } from "antd";

import { AgGridTable } from "components/AgGridTable";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import { StateType } from "types";
import { useTableDragNDrop } from "../../../../../../../customHooks/useTableDragNDrop";
import { IVerificationScheduleCardStore } from "slices/pspControl/verificationScheduleCard";
import { ICommissionVerificationModel } from "slices/pspControl/verificationScheduleCard/types";

const cx = classNames.bind(styles);

interface ModalProps {
  visible?: boolean;
  onClose?: () => void;
  onSave?: (items: ICommissionVerificationModel[]) => Promise<void>;
}

export const SortCommissionModal: FC<ModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [pending, setPending] = useState(false);
  const {
    props,
    state: { rowData, setRowData },
    events,
    gridApi,
  } = useTableDragNDrop<ICommissionVerificationModel>({
    transform: (rows) =>
      rows.map((row, index) => ({ ...row, serial: index + 1 })),
  });

  const { commissions } = useSelector<
    StateType,
    IVerificationScheduleCardStore
  >((state) => state.verificationScheduleCard);

  const handleLoadViolations = useCallback(() => {
    if (visible) {
      setRowData(commissions);
    }
  }, [visible, commissions]);

  useEffect(() => {
    handleLoadViolations();
  }, [handleLoadViolations]);

  useEffect(() => {
    if (!visible) {
      setRowData([]);
    }
  }, [visible]);

  const handleOnClose = () => {
    onClose?.();
  };

  const handleSave = useCallback(async () => {
    try {
      setPending(true);
      await onSave?.(rowData);
    } finally {
      setPending(false);
    }
  }, [rowData]);

  return (
    <Modal
      title="Согласующие"
      visible={visible}
      maskClosable={false}
      onCancel={handleOnClose}
      width={780}
      destroyOnClose
      footer={
        <Button
          type="primary"
          disabled={pending}
          loading={pending}
          onClick={handleSave}
        >
          Сохранить
        </Button>
      }
    >
      <AgGridTable
        rowData={rowData}
        className={cx("table")}
        suppressRowTransform={true}
        hasLoadingOverlayComponentFramework
        isAutoSizeColumns={false}
        {...props}
        {...events}
      >
        <AgGridColumn headerName="№ пп" field="serial" rowDrag />
        <AgGridColumn headerName="Организация" field="organizationName" />
        <AgGridColumn headerName="ФИО" field="fullName" />
        <AgGridColumn headerName="Должность" field="jobTitle" />
        <AgGridColumn
          headerName="Сторонняя организация"
          field="isOutsideOrganizationText"
        />
        <AgGridColumn
          headerName="Согласующий/Утверждающий"
          field="commisionTypesText"
        />
      </AgGridTable>
    </Modal>
  );
};
