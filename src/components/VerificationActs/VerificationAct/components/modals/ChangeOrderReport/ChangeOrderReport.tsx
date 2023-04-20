import { FC, useCallback, useEffect, useState } from "react";
import { AgGridColumn } from "ag-grid-react";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { Button, Modal, Tooltip, Typography } from "antd";

import { AgGridTable } from "components/AgGridTable";
import { RendererProps } from "components/ItemsTable";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import { StateType } from "types";
import {
  ReportItemModel,
  VerificationActStore,
} from "slices/verificationActs/verificationAct/types";
import { useTableDragNDrop } from "../../../../../../customHooks/useTableDragNDrop";

const cx = classNames.bind(styles);

interface ModalProps {
  visible?: boolean;
  onClose?: () => void;
  onSave?: (items: ReportItemModel[]) => Promise<void>;
}

export const ChangeOrderReport: FC<ModalProps> = ({
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
  } = useTableDragNDrop<ReportItemModel>({
    transform: (rows) =>
      rows.map((row, index) => ({ ...row, serial: index + 1 })),
  });

  const verificationAct = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const handleLoadViolations = useCallback(() => {
    if (visible) {
      const actId = verificationAct.act?.id;

      if (!actId) {
        return;
      }

      const items = verificationAct.compositionOfAppendicesToReport

      if (isEmpty(items)) {
        return;
      }

      if (!items || isEmpty(items)) {
        return;
      }

      setRowData(items);
    }
  }, [visible, verificationAct]);

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
      title="Нарушении"
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
        <AgGridColumn headerName="№" field="serial" rowDrag />
        <AgGridColumn headerName="Наименование приложения" field="name" />
        <AgGridColumn headerName="Количество листов" field="pageCount" />
      </AgGridTable>
    </Modal>
  );
};
