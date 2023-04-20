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
  IViolationListItemModel,
  VerificationActStore,
} from "slices/verificationActs/verificationAct/types";
import { useTableDragNDrop } from "../../../../../../customHooks/useTableDragNDrop";

const cx = classNames.bind(styles);

interface ModalProps {
  visible?: boolean;
  id: string | null;
  area: string | null;
  onClose?: () => void;
  onSave?: (params: {
    id: string;
    violations: IViolationListItemModel[];
    area: string;
  }) => Promise<void>;
}

export const ChangeOrderViolationsModal: FC<ModalProps> = ({
  visible,
  onClose,
  id,
  area,
  onSave,
}) => {
  const [pending, setPending] = useState(false);
  const {
    props,
    state: { rowData, setRowData },
    events,
    gridApi,
  } = useTableDragNDrop<IViolationListItemModel>({
    transform: (rows) =>
      rows.map((row, index) => ({ ...row, serial: index + 1 })),
  });

  const state = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const handleLoadViolations = useCallback(() => {
    if (id && visible) {
      const actId = state.act?.id;

      if (!actId) {
        return;
      }

      const items = state.identifiedViolationsOrRecommendations;

      if (isEmpty(items)) {
        return;
      }
      const group = items.find(
        (item) => item.areaOfResponsibility === area
      )?.violations;

      if (!group) {
        return;
      }

      const violations = group.find((item) => item.id === id)?.violations;

      if (!violations || isEmpty(violations)) {
        return;
      }

      setRowData(violations);
    }
  }, [id, visible, state]);

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
    if (!id || !area) {
      return;
    }
    try {
      setPending(true);
      await onSave?.({ area, id, violations: rowData });
    } finally {
      setPending(false);
    }
  }, [rowData, id, area]);

  const staticCellStyle = { wordBreak: "break-word", lineHeight: "23px" };

  return (
    <Modal
      title="Нарушения"
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
        defaultColDef={{
          resizable: true,
          wrapText: true,
          cellStyle: staticCellStyle,
        }}
        {...props}
        {...events}
      >
        <AgGridColumn
          headerName="№ пп"
          field="serial"
          rowDrag
          minWidth={70}
          width={100}
        />
        <AgGridColumn
          headerName="Выявленное нарушение"
          field="violationText"
          minWidth={100}
          width={310}
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
        />
        <AgGridColumn
          headerName="Пункт НД и/или ОРД"
          field="pointNormativeDocuments"
          minWidth={100}
          width={300}
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
        />
      </AgGridTable>
    </Modal>
  );
};
