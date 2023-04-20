import React from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { AgGridColumn } from "ag-grid-react";
import { AgGridTable } from "../../../../../components/AgGridTable";
import { getViolationsThunk } from "../../../../../thunks/pspControl/eliminationOfViolations";
import { Nullable, StateType } from "../../../../../types";
import { IEliminationOfViolationsStore } from "../../../../../slices/pspControl/eliminationOfViolations/types";
import { FullWidthCell } from "./components/FullWidthCell";
import {
  dateValueFormatter,
  identifiedViolationCellClassRules,
  identifiedViolationRowSpan,
  violationCellClassRules,
  violationRowSpan,
} from "./utils";
import { ModalVerificationInformation } from "../ModalVerificationInformation";
import { IModalOfOperationsInfo, IVerificationInformationInfo } from "./types";
import { ActionsColumn } from "./components/ActionsColumn";
import { ModalOfOperations } from "../ModalOfOperations";
import { TypesOfOperations } from "../ModalOfOperations/constants";
import { ModalEliminationProgressInformation } from "../ModalEliminationProgressInformation";
import { CriticalityColumn } from "./components/CriticalityColumn";
import styles from "./violationsTable.module.css";
import { StatusColumn } from "./components/StatusColumn";

const cx = classNames.bind(styles);

export const ViolationsTable: React.FC = () => {
  const dispatch = useDispatch();

  const { isViolationsLoading, identifiedViolations, appliedFilter } =
    useSelector<StateType, IEliminationOfViolationsStore>(
      (state) => state.eliminationOfViolations
    );

  React.useEffect(() => {
    dispatch(getViolationsThunk(appliedFilter));
  }, []);

  const [verificationInformationInfo, setVerificationInformationInfo] =
    React.useState<Nullable<IVerificationInformationInfo>>(null);

  const [modalOfOperationsInfo, setModalOfOperationsInfo] =
    React.useState<IModalOfOperationsInfo>({
      violation: null,
      visible: false,
      typeOfOperation: TypesOfOperations.none,
    });

  const [
    progressInformationEliminationId,
    setProgressInformationEliminationId,
  ] = React.useState<Nullable<string>>(null);

  const [
    isModalVerificationInformationVisible,
    setModalVerificationInformationVisibility,
  ] = React.useState(false);

  const [
    isModalEliminationProgressInformationVisible,
    setModalEliminationProgressInformationVisibility,
  ] = React.useState(false);

  const toggleModalVerificationInformationVisibility = () => {
    setModalVerificationInformationVisibility(
      !isModalVerificationInformationVisible
    );
  };

  const toggleModalEliminationProgressInformationVisibility = () => {
    setModalEliminationProgressInformationVisibility(
      !isModalEliminationProgressInformationVisible
    );
  };

  const handleToggleModalVerificationInformation = (
    info: Nullable<IVerificationInformationInfo>
  ) => {
    setVerificationInformationInfo(info);
    toggleModalVerificationInformationVisibility();
  };

  const handleOpenModalEliminationProgressInformation = (
    id: Nullable<string>
  ) => {
    setProgressInformationEliminationId(id);
    toggleModalEliminationProgressInformationVisibility();
  };

  const handleSetModalOfOperationsInfo = (
    violation: Nullable<null> = null,
    typeOfOperation: TypesOfOperations = TypesOfOperations.none
  ) => {
    setModalOfOperationsInfo({
      violation,
      visible: !modalOfOperationsInfo.visible,
      typeOfOperation: typeOfOperation,
    });
  };
  const staticCellStyle = { wordBreak: "break-word", lineHeight: "23px" };

  return (
    <React.Fragment>
      {!isViolationsLoading && (
        <AgGridTable
          rowData={identifiedViolations}
          // onGridReady={handleReady}
          fullWidthCellRendererFramework={FullWidthCell}
          fullWidthCellRendererParams={{
            handleToggleModalVerificationInformation,
          }}
          isFullWidthCell={(rowNode) => rowNode.data?._isFullWidthRow}
          suppressRowTransform={true}
          defaultColDef={{
            resizable: true,
            wrapText: true,
            cellStyle: staticCellStyle,
          }}
          isAutoSizeColumns={false}
          rowHeight={100}
        >
          <AgGridColumn
            headerName="№ пп"
            minWidth={70}
            field="identifiedViolation_identifiedViolationsSerial"
            rowSpan={identifiedViolationRowSpan}
            cellClassRules={identifiedViolationCellClassRules}
            pinned={"left"}
          />
          <AgGridColumn
            headerName="Зона ответственности"
            field="identifiedViolation_areaOfResponsibility"
            rowSpan={identifiedViolationRowSpan}
            cellClassRules={identifiedViolationCellClassRules}
            minWidth={167}
            tooltipField="identifiedViolation_areaOfResponsibility"
            pinned={"left"}
            cellClass={cx("action-text-wrapper")}
            cellRendererFramework={(props) => (
              <div className={cx("action-text")}>{props.value}</div>
            )}
          />
          <AgGridColumn
            headerName="Тип несоответствия"
            field="identifiedViolation_typeMismatch"
            rowSpan={identifiedViolationRowSpan}
            cellClassRules={identifiedViolationCellClassRules}
            minWidth={158}
            headerTooltip="Тип несоответствия"
            pinned={"left"}
          />
          <AgGridColumn
            headerName="№ подпункта"
            field="violation_serial"
            rowSpan={violationRowSpan}
            cellClassRules={violationCellClassRules}
            minWidth={80}
            headerTooltip="№ подпункта"
            pinned={"left"}
          />
          <AgGridColumn
            headerName="Содержание нарушения (рекомендации)"
            field="violation_violationText"
            minWidth={240}
            rowSpan={violationRowSpan}
            cellClassRules={violationCellClassRules}
            headerTooltip="Содержание нарушения (рекомендации)"
            tooltipField="violation_violationText"
            cellClass={cx("action-text-wrapper")}
            cellRendererFramework={(props) => (
              <div className={cx("action-text")}>{props.value}</div>
            )}
            filter={"agTextColumnFilter"}
            pinned={"left"}
          />
          <AgGridColumn
            headerName="№ пункта мероприятия"
            field="_actionPlan_serial"
            minWidth={100}
            headerTooltip="№ пункта мероприятия"
          />
          <AgGridColumn
            headerName="Содержание мероприятия"
            minWidth={180}
            field="actionPlan_actionPlanText"
            tooltipField="actionPlan_actionPlanText"
            cellClass={cx("action-text-wrapper")}
            cellRendererFramework={(props) => (
              <div className={cx("action-text")}>{props.value}</div>
            )}
          />
          <AgGridColumn
            headerName="Срок устранения (план)"
            field="actionPlan_eliminatePlan"
            valueFormatter={dateValueFormatter}
            minWidth={130}
          />
          <AgGridColumn
            headerName="Срок устранения (факт)"
            field="actionPlan_eliminateFact"
            valueFormatter={dateValueFormatter}
            minWidth={130}
            headerTooltip="Срок устранения (факт)"
          />
          {/* Материалы подтверждающие устранение нарушений/рекомендаций (ссылка на сетевой ресурс Реестра ПСП) */}
          <AgGridColumn
            headerName="Статус"
            minWidth={135}
            field="actionPlan_eliminateStatusText"
            cellRendererFramework={StatusColumn}
          />
          {/* Примечание */}

          <AgGridColumn
            headerName="Классификация нарушения"
            minWidth={160}
            field="identifiedViolation_classifficationTypeName"
            rowSpan={identifiedViolationRowSpan}
            cellClassRules={identifiedViolationCellClassRules}
            tooltipField="identifiedViolation_classifficationTypeName"
            headerTooltip="Классификация нарушения"
          />
          <AgGridColumn
            headerName="Отметка о типовом нарушении"
            field="identifiedViolation_typical"
            rowSpan={identifiedViolationRowSpan}
            cellClassRules={identifiedViolationCellClassRules}
            minWidth={127}
            headerTooltip="Отметка о типовом нарушении"
            tooltipField="identifiedViolation_typical"
          />
          <AgGridColumn
            headerName="Отметка о повторяющемся нарушении"
            field="identifiedViolation_isDouble"
            minWidth={165}
            rowSpan={identifiedViolationRowSpan}
            cellClassRules={identifiedViolationCellClassRules}
            headerTooltip="Отметка о повторяющемся нарушении"
            tooltipField="identifiedViolation_isDouble"
          />
          <AgGridColumn
            headerName="Срок устранение (перенос)"
            field="actionPlan_eliminatePost"
            valueFormatter={dateValueFormatter}
            minWidth={137}
          />
          {/* Основание переноса */}
          {/* Ответственный за выполнение */}
          {/* Источник фиксирования */}
          <AgGridColumn
            headerName="Ответственный за контроль"
            field="actionPlan_fullNameController"
            minWidth={157}
            tooltipField="actionPlan_fullNameController"
            cellClass={cx("action-text-wrapper")}
            cellRendererFramework={(props) => (
              <div className={cx("action-text")}>{props.value}</div>
            )}
          />
          <AgGridColumn
            minWidth={130}
            headerName="Критичность"
            cellRendererFramework={CriticalityColumn}
          />
          <AgGridColumn
            minWidth={150}
            headerName="Действия"
            pinned="right"
            cellRendererFramework={ActionsColumn}
            cellRendererParams={{
              handleSetModalOfOperationsInfo,
              handleOpenModalEliminationProgressInformation,
            }}
          />
        </AgGridTable>
      )}

      <ModalOfOperations
        isVisible={modalOfOperationsInfo.visible}
        typeOfOperation={modalOfOperationsInfo.typeOfOperation}
        actionPlanId={modalOfOperationsInfo.violation?.actionPlan_eliminationId}
        termOfElimination={
          modalOfOperationsInfo.violation?.actionPlan_eliminatePlan
        }
        onCancel={handleSetModalOfOperationsInfo}
      />

      <ModalVerificationInformation
        verificationInformationInfo={verificationInformationInfo}
        isVisible={isModalVerificationInformationVisible}
        onCancel={() => handleToggleModalVerificationInformation(null)}
      />

      <ModalEliminationProgressInformation
        eliminationId={progressInformationEliminationId}
        isVisible={isModalEliminationProgressInformationVisible}
        onCancel={() => {
          toggleModalEliminationProgressInformationVisibility();
          setProgressInformationEliminationId(null);
        }}
      />
    </React.Fragment>
  );
};
