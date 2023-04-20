import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import classNames from "classnames/bind";
import { AgGridColumn } from "ag-grid-react";
import { AgGridTable } from "../../../../../components/AgGridTable";
import { FullWidthCell } from "../FullWidthCell";
import { ActionsColumn } from "../ActionsColumn";
import { IPlanCardStore } from "../../../../../slices/pspControl/planCard";
import { Nullable, StateType } from "../../../../../types";
import { getController, getExecutor } from "../../utils";
import { IModalForAddingOrEditingEventInfo } from "./types";
import { ModalForAddingOrEditingEvent } from "components/ModalForAddingOrEditingEvent";
import {
  ModalEntityTypes,
  TargetFormNames,
  ModalModes,
} from "components/ModalForAddingOrEditingEvent/constants";
import { getPlanCardThunk } from "thunks/pspControl/planCard";
import { IViolationValues } from "components/ModalForAddingOrEditingEvent/types";
import styles from "./planTable.module.css";
import { dateValueFormatter, tableBorderRowSpanHandler } from "utils";

const cx = classNames.bind(styles);

export const PlanTable: React.FC = () => {
  const dispatch = useDispatch();
  const { planId } = useParams<{ planId: string }>();

  const { tableData, planCardInfo } = useSelector<StateType, IPlanCardStore>(
    (state) => state.planCard
  );

  const [
    modalForAddingOrEditingEventInfo,
    setModalForAddingOrEditingEventInfo,
  ] = React.useState<IModalForAddingOrEditingEventInfo>({
    values: null,
    visible: false,
    type: ModalModes.none,
  });

  const toggleModalForAddingOrEditingEventInfo = (
    values: Nullable<IViolationValues> = null,
    type: ModalModes = ModalModes.none
  ) => {
    setModalForAddingOrEditingEventInfo({
      values,
      visible: !modalForAddingOrEditingEventInfo.visible,
      type,
    });
  };

  return (
    <React.Fragment>
      <AgGridTable
        defaultColDef={{ resizable: true }}
        rowData={tableData}
        fullWidthCellRendererFramework={FullWidthCell}
        isFullWidthCell={(rowNode) => rowNode.data?._isFullWidthRow}
        suppressRowTransform={true}
        columnsIgnoringAutoSize={["actionPlan_actionText"]}
        rowHeight={100}
        getRowStyle={(param) => {
          if (param.data._isLastActionPlan) {
            return { "border-bottom": "2px solid #e2e2e2" };
          }
        }}
        isAutoSizeColumns={false}
      >
        <AgGridColumn
          headerName="№ пп"
          field="violation_identifiedViolationsSerial"
          rowSpan={(params) => {
            const rowSpan = params.data._rowSpanPointColumn;

            return rowSpan ? rowSpan : 1;
          }}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => {
              return params.data._rowSpanPointColumn > 1;
            },
          }}
          minWidth={75}
        />
        <AgGridColumn
          headerName="№ подпункта"
          field="_violationSerial"
          rowSpan={(params) => {
            const rowSpan = params.data._rowSpanSubPointColumn;

            return rowSpan ? rowSpan : 1;
          }}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => {
              return params.data._rowSpanSubPointColumn > 1;
            },
          }}
          minWidth={75}
        />
        <AgGridColumn
          headerName="Выявленное нарушение"
          field="violation_violationText"
          rowSpan={(params) => {
            const rowSpan = params.data._rowSpanSubPointColumn;

            return rowSpan ? rowSpan : 1;
          }}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => {
              return params.data._rowSpanSubPointColumn > 1;
            },
          }}
          minWidth={415}
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
        />
        <AgGridColumn
          headerName="№ мероприятия"
          field="_actionPlanSerial"
          minWidth={159}
        />
        <AgGridColumn
          headerName="Мероприятия по устранению нарушений"
          field="actionPlan_actionText"
          minWidth={335}
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
        />
        <AgGridColumn
          headerName="Сроки устранения"
          field="actionPlan_eliminationOrDoneText"
          minWidth={178}
        />
        <AgGridColumn
          headerName="Ответственные за выполнение"
          valueGetter={getExecutor}
          minWidth={283}
          tooltipField="actionPlan_fullNameExecutor"
        />
        <AgGridColumn
          headerName="Ответственные за контроль"
          valueGetter={getController}
          minWidth={261}
          tooltipField="actionPlan_fullNameController"
        />
        <AgGridColumn
          headerName="Действия"
          pinned="right"
          cellRendererFramework={ActionsColumn}
          cellRendererParams={{
            planStatusId: planCardInfo?.planStatusId,
            handleAddingOrEditingEvent: toggleModalForAddingOrEditingEventInfo,
            entityType: ModalEntityTypes.violation,
          }}
        />
      </AgGridTable>

      <ModalForAddingOrEditingEvent
        isVisible={modalForAddingOrEditingEventInfo.visible}
        onCancel={toggleModalForAddingOrEditingEventInfo}
        mode={modalForAddingOrEditingEventInfo.type}
        planId={planId}
        entityValues={modalForAddingOrEditingEventInfo.values}
        verificatedOn={planCardInfo?.verificatedOn}
        verificationTypeCode={planCardInfo?.verificationTypeCode}
        onSubmitForm={() => dispatch(getPlanCardThunk(planId))}
        targetForm={TargetFormNames.PlanCardPage}
      />
    </React.Fragment>
  );
};
