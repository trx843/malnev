import React from "react";
import _ from "lodash";
import classNames from "classnames/bind";
import { Spin, Modal } from "antd";
import { AgGridColumn } from "ag-grid-react";
import { AgGridTable } from "components/AgGridTable";
import { ActionPlanTypicalViolationsStore, TypicalPlanListFilter } from "slices/pspControl/actionPlanTypicalViolations/types";
import { getViolations } from "api/requests/pspControl/plan-typical-violations";
import { EliminationOfTypicalViolationsTabsFilter } from "../EliminationOfTypicalViolationsTabsFilter";
import {
  mapViolations,
  ViolationCellClassRules,
  ViolationRowSpan,
} from "./utils";
import { isFirstColumn } from "components/AgGridTable/utils";
import { ModalModes } from "enums";
import { InitListFilter } from "./constants";
import { HandleViolationEditingModalInfo } from "../../types";
import styles from "./modalForAddingViolation.module.css";
import { useSelector } from "react-redux";
import { StateType } from "types";

const cx = classNames.bind(styles);

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  onOk: HandleViolationEditingModalInfo;
  isInnerCreateModalVisible: boolean;
}

export const ModalForAddingViolation: React.FC<IProps> = ({
  isVisible,
  onCancel,
  onOk,
  isInnerCreateModalVisible,
}) => {
  const [violations, setViolations] = React.useState<any[]>([]);
  const [isViolationsLoading, setViolationsLoading] = React.useState(false);
  const [listFilter, setListFilter] =
    React.useState<TypicalPlanListFilter>(InitListFilter);
  const [selectedViolations, setSelectedViolations] = React.useState<any[]>([]);

  const {
    isIL,
    reloadTableItems
  } = useSelector<StateType, ActionPlanTypicalViolationsStore>(
    (state) => state.actionPlanTypicalViolations
  );

  React.useEffect(() => {
    let currentFilter = listFilter
    currentFilter.filter.isIL = isIL
    setListFilter(currentFilter)
  }, [isIL]);

  React.useEffect(() => {
    if (isVisible) init(listFilter);
  }, [listFilter, isVisible, reloadTableItems]);

  React.useEffect(() => {
    if (!isInnerCreateModalVisible) {
      setSelectedViolations([]);
    };
  }, [isInnerCreateModalVisible]);

  const init = async (listFilter: TypicalPlanListFilter) => {
    setViolationsLoading(true);
    const violations = await getViolations(listFilter);
    setViolations(mapViolations(violations));
    setViolationsLoading(false);
  };

  const handleOk = () => {
    const selectedViolation = selectedViolations[0];

    if (selectedViolation) {
      const adjustedViolation = {
        identifiedViolationSerial: selectedViolation.identifiedViolationSerial,
        verificatedOn: selectedViolation._originalObject.createdOn,
        siknLabRsuTypeId: 1,
        typicalViolations: selectedViolation._originalObject.violations.map(
          (v) => {
            return {
              typicalViolationText: v.violationText,
              pointNormativeDocuments: v.pointNormativeDocuments,
              typicalViolationSerial: v.serial,
            };
          }
        ),
        identifiedViolationId: selectedViolation.identifiedViolationsId,
      };

      onOk(null, ModalModes.create, adjustedViolation);
    }
  };

  const handleCancel = () => {
    setSelectedViolations([]);
    onCancel();
  };

  return (
    <Modal
      width={1488}
      visible={isVisible}
      title="Добавить нарушение"
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{
        loading: isViolationsLoading,
        disabled: !selectedViolations.length,
      }}
      cancelButtonProps={{
        style: { display: "none" },
      }}
      okText="Добавить"
      maskClosable={false}
      destroyOnClose
    >
      <Spin spinning={isViolationsLoading}>
        <EliminationOfTypicalViolationsTabsFilter
          listFilter={listFilter}
          setListFilter={setListFilter}
        />
        <AgGridTable
          className={cx("table")}
          rowData={violations}
          onSelectionChanged={setSelectedViolations}
          suppressRowClickSelection={true}
          suppressRowTransform={true}
          defaultColDef={{ checkboxSelection: isFirstColumn }}
        >
          <AgGridColumn
            headerName="Зона ответственности"
            field="areaOfResponsibility"
            rowSpan={ViolationRowSpan}
            cellClassRules={ViolationCellClassRules}
          />
          <AgGridColumn
            headerName="Система учета/ИЛ"
            field="osusShortNames"
            rowSpan={ViolationRowSpan}
            cellClassRules={ViolationCellClassRules}
          />
          <AgGridColumn
            headerName="Номер по классификации"
            field="classifficationNumber"
            rowSpan={ViolationRowSpan}
            cellClassRules={ViolationCellClassRules}
          />
          <AgGridColumn
            headerName="Номер нарушения"
            field="identifiedViolationSerial"
            rowSpan={ViolationRowSpan}
            cellClassRules={ViolationCellClassRules}
          />
          <AgGridColumn
            headerName="Номер подпункта"
            field="_serial"
          />
          <AgGridColumn headerName="Нарушение" field="violationText" />
          <AgGridColumn
            headerName="Пункт НД и/или ОРД"
            field="pointNormativeDocuments"
          />
          <AgGridColumn
            headerName="Номер типового нарушения"
            field="typicalViolationNumber"
            rowSpan={ViolationRowSpan}
            cellClassRules={ViolationCellClassRules}
          />
        </AgGridTable>
      </Spin>
    </Modal>
  );
};
