import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import classNames from "classnames/bind";
import { AgGridColumn } from "ag-grid-react";
import { AgGridTable } from "../../../../../components/AgGridTable";
import { StateType } from "../../../../../types";
import { FullWidthCell } from "./components/FullWidthCell";
import { ActionsColumn } from "./components/ActionsColumn";
import { IEliminationOfTypicalViolationsStore } from "../../../../../slices/pspControl/eliminationOfTypicalViolations/types";
import { ModalAddValidationInformation } from "../ModalAddValidationInformation";
import { getTypicalViolationsThunk } from "../../../../../thunks/pspControl/eliminationOfTypicalViolations";
import {
  IdentifiedTypicalViolationRowSpan,
  IdentifiedTypicalViolationCellClassRules,
  TypicalViolationRowSpan,
  TypicalViolationCellClassRules,
} from "./utils";
import { dateValueFormatter } from "../../../../../utils";
import {
  setListFilter,
  setSelectedIdentifiedTypicalViolations,
} from "slices/pspControl/eliminationOfTypicalViolations";
import { IModalAddValidationInformationInfo } from "./types";
import { ModalVerificationInformation } from "../ModalVerificationInformation";
import styles from "./typicalViolationsTable.module.css";

const cx = classNames.bind(styles);

export const TypicalViolationsTable: React.FC = () => {
  const { pspId } = useParams<{ pspId: string }>();
  const dispatch = useDispatch();

  const { identifiedTypicalViolations, listFilter } = useSelector<
    StateType,
    IEliminationOfTypicalViolationsStore
  >((state) => state.eliminationOfTypicalViolations);

  React.useEffect(() => {
    const adjustedFilter = {
      ...listFilter,
      filter: { ...listFilter.filter, ostRnuPspId: pspId },
    };
    dispatch(setListFilter(adjustedFilter));
    dispatch(getTypicalViolationsThunk(adjustedFilter));
  }, []);

  const [
    modalAddValidationInformationInfo,
    setModalAddValidationInformationInfo,
  ] = React.useState<IModalAddValidationInformationInfo>({
    visible: false,
    typicalViolation: null,
  });

  const [
    modalVerificationInformationInfo,
    setModalVerificationInformationInfo,
  ] = React.useState<IModalAddValidationInformationInfo>({
    visible: false,
    typicalViolation: null,
  });

  const toggleModalAddValidationInformationVisibility = (
    typicalViolation: any = null
  ) => {
    setModalAddValidationInformationInfo({
      visible: !modalAddValidationInformationInfo.visible,
      typicalViolation,
    });
  };

  const toggleModalVerificationInformationInfoVisibility = (
    typicalViolation: any = null
  ) => {
    setModalVerificationInformationInfo({
      visible: !modalVerificationInformationInfo.visible,
      typicalViolation,
    });
  };

  const onSelectionChanged = (selectedRows) => {
    dispatch(setSelectedIdentifiedTypicalViolations(selectedRows));
  };

  return (
    <React.Fragment>
      <AgGridTable
        rowData={identifiedTypicalViolations}
        defaultColDef={{ resizable: true }}
        fullWidthCellRendererFramework={FullWidthCell}
        isFullWidthCell={(rowNode) => rowNode.data?._isFullWidthRow}
        onSelectionChanged={onSelectionChanged}
        isRowSelectable={(rowNode) => rowNode.data._isSelectedRow}
        rowClass={cx("row")}
        rowSelection="multiple"
        columnsIgnoringAutoSize={["actionPlan_actionText", "actions"]}
        rowHeight={60}
        rowBuffer={1000}
        suppressRowClickSelection
        suppressRowTransform
        isAutoSizeColumns={false}
      //suppressColumnVirtualisation
      >
        <AgGridColumn
          headerName="№ пп"
          field="identifiedTypicalViolation_index"
          rowSpan={IdentifiedTypicalViolationRowSpan}
          cellClassRules={IdentifiedTypicalViolationCellClassRules}
          headerTooltip="№ пп"
          headerCheckboxSelection
          checkboxSelection
          lockPosition
          minWidth={105}
        />
        {/* Группа столбцов нарушения */}
        <AgGridColumn
          headerName="№ типового нарушения"
          field="identifiedTypicalViolation_identifiedViolationsSerial"
          rowSpan={IdentifiedTypicalViolationRowSpan}
          cellClassRules={IdentifiedTypicalViolationCellClassRules}
          headerTooltip="№ типового нарушения"
          minWidth={75}
        />
        {/* Конец группы столбцов нарушения */}

        {/* Группа столбцов подпунктов нарушения */}
        <AgGridColumn
          headerName="№ подпункта"
          field="typicalViolation_typicalViolationSerial"
          rowSpan={TypicalViolationRowSpan}
          cellClassRules={TypicalViolationCellClassRules}
          headerTooltip="№ подпункта"
          minWidth={75}
        />
        <AgGridColumn
          headerName="Наличие нарушения"
          field="identifiedTypicalViolation_currentStatus"
          rowSpan={IdentifiedTypicalViolationRowSpan}
          cellClassRules={IdentifiedTypicalViolationCellClassRules}
          headerTooltip="Наличие нарушения"
          minWidth={130}
          cellRendererFramework={(props) => (
            props.value === "Выявлено" ?
              <div style={{ color: "red" }}>
                {props.value}
              </div>
              :
              <div>
                {props.value}
              </div>
          )}
        />
        <AgGridColumn
          headerName="Проверка в текущем месяце"
          field="identifiedTypicalViolation_isActiveLastMonthText"
          rowSpan={IdentifiedTypicalViolationRowSpan}
          cellClassRules={IdentifiedTypicalViolationCellClassRules}
          headerTooltip="Проверка в текущем месяце"
          filter={true}
          minWidth={135}
          cellRendererFramework={(props) => (
            props.data.identifiedTypicalViolation_isActiveLastMonth ?
              <div>
                {props.value}
              </div>
              :
              <div style={{ color: "red" }}>
                {props.value}
              </div>
          )}
        />
        <AgGridColumn
          headerName="Содержание нарушения (рекомендации)"
          field="typicalViolation_typicalViolationText"
          rowSpan={TypicalViolationRowSpan}
          cellClassRules={TypicalViolationCellClassRules}
          headerTooltip="Содержание нарушения (рекомендации)"
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
          minWidth={270}
        />
        <AgGridColumn
          headerName="Пункт НД и/или ОРД"
          field="typicalViolation_pointNormativeDocuments"
          rowSpan={TypicalViolationRowSpan}
          cellClassRules={TypicalViolationCellClassRules}
          headerTooltip="Пункт НД и/или ОРД"
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
          minWidth={175}
        />
        {/* Конец группы столбцов подпунктов нарушения */}

        {/* Группа столбцов мероприятий для устранения нарушения */}
        <AgGridColumn
          headerName="№ пункта мероприятия"
          field="actionPlan_serialFull"
          headerTooltip="№ пункта мероприятия"
          minWidth={75}
        />
        <AgGridColumn
          headerName="Содержание мероприятия"
          field="actionPlan_actionText"
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
          minWidth={215}
        />
        {/* Конец группы столбцов мероприятий для устранения нарушения */}

        {/* Группа столбцов нарушения */}
        <AgGridColumn
          headerName="Срок исполнения"
          field="actionPlan_eliminationText"
          headerTooltip="Срок исполнения"
          minWidth={135}
        />
        <AgGridColumn
          headerName="Действия"
          field="actions"
          pinned="right"
          cellRendererFramework={ActionsColumn}
          cellRendererParams={{
            openModalAddValidationInformation:
              toggleModalAddValidationInformationVisibility,
            openModalVerificationInformation:
              toggleModalVerificationInformationInfoVisibility,
          }}
          rowSpan={IdentifiedTypicalViolationRowSpan}
          cellClassRules={IdentifiedTypicalViolationCellClassRules}
          lockPosition
          minWidth={125}
        />
        {/* Конец группы столбцов нарушения */}
      </AgGridTable>

      <ModalVerificationInformation
        typicalViolation={modalVerificationInformationInfo.typicalViolation}
        isVisible={modalVerificationInformationInfo.visible}
        onCancel={toggleModalVerificationInformationInfoVisibility}
      />
      <ModalAddValidationInformation
        typicalViolation={modalAddValidationInformationInfo.typicalViolation}
        isVisible={modalAddValidationInformationInfo.visible}
        onCancel={toggleModalAddValidationInformationVisibility}
      />
    </React.Fragment>
  );
};
