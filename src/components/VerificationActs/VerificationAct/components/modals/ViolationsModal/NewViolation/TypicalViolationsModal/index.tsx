import { useState, useEffect, FC, useMemo, useCallback } from "react";
import { Button, Modal } from "antd";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import { AgGridColumn } from "ag-grid-react";

import styles from "./TypicalViolationsModal.module.css";
import { AgGridTable } from "components/AgGridTable";
import {
  IFormViolation,
  IViolationListModel,
} from "slices/pspControl/actionPlanTypicalViolations/types";
import { StateType } from "../../../../../../../../types";
import {
  ModalConfigTypes,
  VerificationActStore,
} from "slices/verificationActs/verificationAct/types";
import { getFilterViolationScheduleThunk } from "thunks/verificationActs/verificationAct";
import { isFirstColumn } from "components/AgGridTable/utils";
import { FullWidthCell } from "pages/PspControl/PlanCardPage/components/FullWidthCell";
import { groupedTypicalViolationsRowsByCell } from "components/VerificationActs/VerificationAct/helpers";

const cx = classNames.bind(styles);

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (
    number: string,
    id: string,
    violations: Array<IFormViolation>
  ) => void;
}

const getRowSpan = (params: any) => {
  return params.data.isRow ? params.data.typicalViolations.length : 1;
};

export const TypicalViolationsModal: FC<ModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const dispatch = useDispatch();
  const { currentId: actId, modalConfigs } = useSelector<
    StateType,
    VerificationActStore
  >((state) => state.verificationAct);

  const [selectedViolations, setSelectedViolations] = useState<
    IViolationListModel[]
  >([]);

  const getViolations = useCallback(async () => {
    if (visible) {
      dispatch(
        getFilterViolationScheduleThunk({
          modalType: ModalConfigTypes.TypicalViolation,
        })
      );
    }
  }, [visible]);

  useEffect(() => {
    getViolations();
  }, [getViolations, modalConfigs.TypicalViolation.listFilter]);

  const handleCloseModal = () => {
    setSelectedViolations([]);
    onClose?.();
  };

  const handleSelectionChanged = (selectedRows: IViolationListModel[]) =>
    setSelectedViolations(selectedRows);

  const selctedViolationTypicalViolationsHandler = (
    typicalViolations: Array<any>
  ) => {
    let violations: Array<IFormViolation> = [];
    for (let violation of typicalViolations) {
      violations.push({
        pointNormativeDocuments: violation.pointNormativeDocuments,
        violationText: violation.typicalViolationText,
      });
    }
    return violations;
  };

  const handleClick = () => {
    const selectedViolation = selectedViolations[0] as any;
    onSelect(
      selectedViolation.identifiedViolationSerial,
      selectedViolation.id,
      selctedViolationTypicalViolationsHandler(
        selectedViolation.typicalViolations
      )
    );
    handleCloseModal();
  };

  const items = useMemo(() => {
    const violations =
      modalConfigs[ModalConfigTypes.TypicalViolation].violations;
    const updated = violations
      .map((item) =>
        item.typicalViolations.reduce(
          (acc: any[], violation, index) => [
            ...acc,
            {
              ...violation,
              ...item,
              id: item.id,
              violationId: item.id,
              isRow:
                (item as any).id !== acc[index - 1]?.violationId || index === 0,
            },
          ],
          []
        )
      )
      .flat();
    const updatedResult = groupedTypicalViolationsRowsByCell(updated);
    return updatedResult;
  }, [modalConfigs]);

  const staticCellStyle = { wordBreak: "break-word", lineHeight: "23px" };

  return (
    <Modal
      title="Типовые нарушения"
      visible={visible}
      maskClosable={false}
      onCancel={handleCloseModal}
      destroyOnClose
      width={850}
      footer={
        <Button type="primary" onClick={handleClick}>
          Выбрать
        </Button>
      }
    >
      <AgGridTable
        className={cx("table")}
        rowData={items}
        suppressRowClickSelection={true}
        suppressRowTransform={true}
        rowSelection={"single"}
        fullWidthCellRendererFramework={FullWidthCell}
        isFullWidthCell={(rowNode) => rowNode.data?._isFullWidthRow}
        onSelectionChanged={handleSelectionChanged}
        defaultColDef={{
          checkboxSelection: isFirstColumn,
          wrapText: true,
          resizable: true,
          cellStyle: staticCellStyle,
          filter: true,
          sortable: true,
        }}
        isAutoSizeColumns={false}
      >
        <AgGridColumn
          headerName={"№ типового нарушения"}
          field={"identifiedViolationSerial"}
          rowSpan={getRowSpan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
          }}
          minWidth={100}
          width={146}
        />
        <AgGridColumn
          headerName={"№ подпункта"}
          field={"typicalViolationSerial"}
          minWidth={100}
          width={143}
        />
        <AgGridColumn
          headerName={"Содержание нарушения"}
          field={"typicalViolationText"}
          minWidth={220}
          width={240}
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
          tooltipField={"typicalViolationText"}
        />
        <AgGridColumn
          headerName={"Требование НД"}
          field={"pointNormativeDocuments"}
          minWidth={170}
          width={243}
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
          tooltipField={"pointNormativeDocuments"}
        />
      </AgGridTable>
    </Modal>
  );
};
