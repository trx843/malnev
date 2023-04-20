import { FC, useCallback, useEffect, useState } from "react";
import { AgGridColumn } from "ag-grid-react";
import { useSelector } from "react-redux";
import { Button, Modal } from "antd";

import { AgGridTable } from "components/AgGridTable";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import { StateType } from "types";
import { useTableDragNDrop } from "../../../../../../../customHooks/useTableDragNDrop";
import { ICommissionPlanModel } from "slices/pspControl/planCard/types";
import { IPlanCardStore } from "slices/pspControl/planCard";

const cx = classNames.bind(styles);

interface ModalProps {
  visible?: boolean;
  onClose?: () => void;
  onSave?: (items: ICommissionPlanModel[]) => Promise<void>;
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
  } = useTableDragNDrop<ICommissionPlanModel>({
    transform: (rows) =>
      rows.map((row, index) => ({ ...row, serial: index + 1 })),
  });

  const { commissions } = useSelector<StateType, IPlanCardStore>(
    (state) => state.planCard
  );

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
      width={950}
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
        defaultColDef={{ resizable: true }}
        isAutoSizeColumns={false}
        {...props}
        {...events}
      >
        <AgGridColumn
          headerName="№ пп"
          field="serial"
          rowDrag
          minWidth={89}
        />
        <AgGridColumn
          headerName="Организация"
          field="organizationName"
          minWidth={240}
          tooltipField="organizationName"
        />
        <AgGridColumn
          headerName="ФИО"
          field="fullName"
          minWidth={200}
          tooltipField="fullName"
        />
        <AgGridColumn
          headerName="Должность"
          field="jobTitle"
          minWidth={200}
          tooltipField="jobTitle"
        />
        <AgGridColumn
          headerName="Согласующий/утверждающий/разработал"
          field="commisionTypesText"
          minWidth={167}
          tooltipField="commisionTypesText"
          headerTooltip="Согласующий/утверждающий/разработал"
        />
      </AgGridTable>
    </Modal>
  );
};
