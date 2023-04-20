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
  RecommendationItemModel,
  VerificationActStore,
} from "slices/verificationActs/verificationAct/types";
import { useTableDragNDrop } from "../../../../../../customHooks/useTableDragNDrop";

const cx = classNames.bind(styles);

interface ModalProps {
  visible?: boolean;
  onClose?: () => void;
  onSave?: (values: RecommendationItemModel[]) => Promise<void>;
}

export const ChangeOrderRecommendationModal: FC<ModalProps> = ({
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
  } = useTableDragNDrop<RecommendationItemModel>({
    transform: (rows) =>
      rows.map((row, index) => ({ ...row, serial: index + 1 })),
  });

  const verificationAct = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const handleLoadViolations = useCallback(() => {
    if (visible) {
      const actId = verificationAct.act?.id

      if (!actId) {
        return;
      }

      const recommendations = verificationAct.recommendations

      if (!recommendations || isEmpty(recommendations)) {
        return;
      }

      setRowData(recommendations);
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
      setPending(true)
      await onSave?.(rowData);
    } finally {
      setPending(false)
    }
  }, [rowData]);

  const renderField = (field: RendererProps<any>) => (
    <Tooltip
      arrowPointAtCenter
      title={<span style={{ color: "black" }}>{field.value}</span>}
      color="#ffffff"
      placement="bottomLeft"
    >
      <Typography.Text className={cx("cell_text")}>
        {field.value}
      </Typography.Text>
    </Tooltip>
  );

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
        <AgGridColumn
          headerName="Рекомендации"
          field="recommendationsText"
          cellRendererFramework={renderField}
          cellStyle={{ alignItems: "baseline" }}
        />
      </AgGridTable>
    </Modal>
  );
};
