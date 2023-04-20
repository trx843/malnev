import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import classNames from "classnames/bind";
import { AgGridColumn } from "ag-grid-react";
import { AgGridTable } from "../../../../../components/AgGridTable";
import { IPlanCardStore } from "../../../../../slices/pspControl/planCard";
import { Nullable, StateType } from "../../../../../types";
import { IModalForAddingOrEditingEventInfo } from "./types";
import { getController, getExecutor } from "../../utils";
import { ActionsColumn } from "../ActionsColumn";
import { getRecommendationCellClass, getRecommendationRowSpan } from "./utils";
import { IRecommendationValues } from "components/ModalForAddingOrEditingEvent/types";
import {
  ModalEntityTypes,
  ModalModes,
  TargetFormNames,
} from "components/ModalForAddingOrEditingEvent/constants";
import { getPlanCardThunk } from "thunks/pspControl/planCard";
import { ModalForAddingOrEditingEvent } from "components/ModalForAddingOrEditingEvent";
import styles from "./recommendationsTable.module.css";
import { tableBorderRowSpanHandler } from "utils";

const cx = classNames.bind(styles);

export const RecommendationsTable: React.FC = () => {
  const dispatch = useDispatch();
  const { planId } = useParams<{ planId: string }>();

  const { planCardInfo, recommendations } = useSelector<
    StateType,
    IPlanCardStore
  >((state) => state.planCard);

  const [
    modalForAddingOrEditingEventInfo,
    setModalForAddingOrEditingEventInfo,
  ] = React.useState<IModalForAddingOrEditingEventInfo>({
    values: null,
    visible: false,
    type: ModalModes.none,
  });

  const toggleModalForAddingOrEditingEventInfo = (
    values: Nullable<IRecommendationValues> = null,
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
        rowData={recommendations}
        suppressRowTransform={true}
        defaultColDef={{ resizable: true }}
        columnsIgnoringAutoSize={["actionPlan_actionText"]}
        rowHeight={100}
        suppressColumnVirtualisation
        getRowStyle={(param) =>
          tableBorderRowSpanHandler(param.data._isLastActionPlan)
        }
        isAutoSizeColumns={false}
      >
        <AgGridColumn
          headerName="№ пп"
          field="recommendation_serial"
          rowSpan={getRecommendationRowSpan}
          cellClass={getRecommendationCellClass}
          minWidth={88}
        />
        <AgGridColumn
          headerName="Рекомендации"
          field="recommendation_recommendationText"
          rowSpan={getRecommendationRowSpan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => getRecommendationRowSpan(params) > 1,
            [cx("row-span-cell-border")]: (params: any) => params.data._isFirstRowWithRowSpan,
          }}
          minWidth={390}
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
          minWidth={352}
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
        />
        <AgGridColumn
          headerName="Сроки устранения"
          field="actionPlan_eliminationText"
          minWidth={180}
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
            entityType: ModalEntityTypes.recommendation,
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
