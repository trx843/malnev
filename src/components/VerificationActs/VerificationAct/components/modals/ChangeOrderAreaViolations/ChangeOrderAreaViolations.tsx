import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { AgGridColumn } from "ag-grid-react";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { Button, Modal, Tooltip, Typography } from "antd";
import maxBy from "lodash/maxBy";
import minBy from "lodash/minBy";
import classNames from "classnames/bind";

import { AgGridTable } from "components/AgGridTable";
import { RendererProps } from "components/ItemsTable";
import styles from "./styles.module.css";
import { StateType } from "types";
import {
  IViolationListModel,
  VerificationActStore,
} from "slices/verificationActs/verificationAct/types";
import { useTableDragNDrop } from "../../../../../../customHooks/useTableDragNDrop";
import { CheckBoxCell } from "components/cellRenderers/CheckBoxCell";
import {
  groupdViolationsCell,
  groupedViolationsRowsByCell,
} from "../../Sections/IdentifiedViolationsOrRecommendations/helpers";

const cx = classNames.bind(styles);

interface ModalProps {
  visible?: boolean;
  area: string | null;
  onClose?: () => void;
  onSave?: (params: {
    area: string;
    violations: IViolationListModel[];
  }) => Promise<void>;
}

const getRowSpan = (params: any) => {
  return params.data.isRow ? params.data.violations.length : 1;
};

export const ChangeOrderAreaViolations: FC<ModalProps> = ({
  visible,
  onClose,
  area,
  onSave,
}) => {
  const [pending, setPending] = useState(false);
  const {
    props,
    state: { rowData, setRowData },
    events,
    gridApi,
  } = useTableDragNDrop<IViolationListModel>({
    transform: (rows) =>
      rows.map((row, index) => ({ ...row, serial: index + 1 })),
    getRowNodeId: (data: any) => {
      return data.index;
    },
  });

  const state = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const handleLoadViolations = useCallback(() => {
    if (area && visible) {
      const actId = state.act?.id;

      if (!actId) {
        return;
      }

      const items = state.identifiedViolationsOrRecommendations;

      if (isEmpty(items)) {
        return;
      }

      const violations = items.find(
        (v) => v.areaOfResponsibility === area
      )?.violations;

      if (!violations || isEmpty(violations)) {
        return;
      }

      setRowData(violations);
    }
  }, [area, visible, state]);

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
    if (!area) {
      return;
    }
    try {
      setPending(true);
      await onSave?.({ violations: rowData, area });
    } finally {
      setPending(false);
    }
  }, [rowData, area]);

  const renderViolationText = (field: RendererProps<IViolationListModel>) => {
    return (
      <div className={cx("violation-text__container")}>
        {field.data.violations.map((v) => (
          <div key={v.id} className={cx("violation-text")}>
            {`${v.violationText}/${v.pointNormativeDocuments}`}
          </div>
        ))}
      </div>
    );
  };

  const getRowHeight = (params) => {
    return params.data.violations.length * 80;
  };


  return (
    <Modal
      title={`Нарушении ${area}`}
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
      <div className={cx("body__violation")}>
        <div className={cx("table__container")}>
          <AgGridTable
            rowData={rowData}
            className={cx("table")}
            hasLoadingOverlayComponentFramework
            getRowHeight={getRowHeight}
            defaultColDef={{
              resizable: true,
            }}
            suppressRowTransform={true}
            isAutoSizeColumns={false}
            suppressRowClickSelection={true}
            {...props}
            {...events}
          >
            <AgGridColumn
              minWidth={100}
              width={100}
              headerName="№ пп"
              field="serial"
              rowDrag
            />
            <AgGridColumn
              minWidth={260}
              wrapText
              autoHeight
              headerName="Выявленное нарушение и Пункт НД и/или ОРД"
              field="violationText"
              cellClass={cx("violation-text__wrapper")}
              cellRendererFramework={renderViolationText}
            />
          </AgGridTable>
        </div>
      </div>
    </Modal>
  );
};
