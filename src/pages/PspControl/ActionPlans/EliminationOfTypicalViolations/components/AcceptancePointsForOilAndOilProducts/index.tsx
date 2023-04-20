import { AgGridColumn } from "ag-grid-react";
import { Button } from "antd";
import classNames from "classnames/bind";
import { PlusCircleFilled } from "@ant-design/icons";
import { AgGridTable } from "components/AgGridTable";
import { ModalEntityTypes } from "components/ModalForAddingOrEditingEvent/constants";
import {
  getController,
  getExecutor,
} from "pages/PspControl/PlanCardPage/utils";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionPlanTypicalViolationsStore } from "slices/pspControl/actionPlanTypicalViolations/types";
import { getViolationsByAreaOfResponsibilityThunk } from "thunks/pspControl/actionPlans/actionPlanTypicalViolations";
import { Nullable, StateType } from "types";
import { ActionsColumn } from "../ActionsColumn";

import {
  IdentifiedTypicalViolationSerialCellClassRules,
  IdentifiedTypicalViolationSerialRowSpan,
  TypicalViolationSerialCellClassRules,
  TypicalViolationSerialRowSpan,
} from "./utils";
import { AreasOfResponsibility } from "../../constants";
import { isOperationButtonDisabled } from "../../utils";
import {
  HandleSetModalForAddingOrEditingEventInfo,
  HandleSetSortingViolationsModalInfo,
} from "../../types";
import { ModalModes } from "enums";
import styles from "./acceptancePointsForOilAndOilProducts.module.css";
import { setIsIL } from "slices/pspControl/actionPlanTypicalViolations";
import { tableBorderRowSpanHandler } from "utils";

const cx = classNames.bind(styles);

interface IProps {
  handleOpenAddViolationsModal: () => void;
  handleViolationEditing: (
    payload: Nullable<string>,
    mode: ModalModes,
    violationValues: any,
  ) => void;
  handleSortingViolations: HandleSetSortingViolationsModalInfo;
  handleAddingOrEditingEvent: HandleSetModalForAddingOrEditingEventInfo;
}

export const AcceptancePointsForOilAndOilProducts: React.FC<IProps> = ({
  handleOpenAddViolationsModal,
  handleViolationEditing,
  handleSortingViolations,
  handleAddingOrEditingEvent,
}) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setIsIL(false))
  }, []);

  const { typicalPlanCard, acceptancePointsForOilAndPetroleumProducts } =
    useSelector<StateType, ActionPlanTypicalViolationsStore>(
      (state) => state.actionPlanTypicalViolations
    );

  React.useEffect(() => {
    if (typicalPlanCard) {
      dispatch(
        getViolationsByAreaOfResponsibilityThunk(
          AreasOfResponsibility.AcceptancePointsForOilAndPetroleumProducts
        )
      );
    }
  }, [typicalPlanCard]);

  return (
    <div className={cx("wrapper")}>
      <Button
        className={cx("add-violation-button")}
        onClick={handleOpenAddViolationsModal}
        icon={<PlusCircleFilled />}
        disabled={isOperationButtonDisabled(typicalPlanCard?.planStatusId)}
        type="link"
      >
        Добавить нарушение
      </Button>

      <AgGridTable
        rowData={acceptancePointsForOilAndPetroleumProducts}
        columnsIgnoringAutoSize={["actionPlan_actionText"]}
        rowHeight={100}
        getRowStyle={(param) =>
          tableBorderRowSpanHandler(param.data._isLastActionPlan)
        }
        defaultColDef={{ resizable: true }}
        isAutoSizeColumns={false}
        suppressRowTransform
      >
        <AgGridColumn
          headerName="№ пп"
          field="typicalViolation_index"
          rowSpan={IdentifiedTypicalViolationSerialRowSpan}
          cellClassRules={IdentifiedTypicalViolationSerialCellClassRules}
          minWidth={75}
        />
        {/* Группа столбцов нарушения  */}
        <AgGridColumn
          headerName="№ типового нарушения"
          field="typicalViolation_identifiedTypicalViolationSerial"
          rowSpan={IdentifiedTypicalViolationSerialRowSpan}
          cellClassRules={IdentifiedTypicalViolationSerialCellClassRules}
          minWidth={130}
        />

        {/* Группа столбцов подпунктов нарушения */}
        <AgGridColumn
          headerName="№ подпункта"
          field="typicalViolation_typicalViolationSerial"
          rowSpan={TypicalViolationSerialRowSpan}
          cellClassRules={TypicalViolationSerialCellClassRules}
          minWidth={125}
        />
        <AgGridColumn
          headerName="Содержание нарушения"
          field="typicalViolation_typicalViolationText"
          rowSpan={TypicalViolationSerialRowSpan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => TypicalViolationSerialRowSpan(params) > 1,
          }}
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
          minWidth={270}
        />
        <AgGridColumn
          headerName="Требование НД"
          field="typicalViolation_pointNormativeDocuments"
          rowSpan={TypicalViolationSerialRowSpan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => TypicalViolationSerialRowSpan(params) > 1,
          }}
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
          minWidth={245}
          tooltipField="typicalViolation_pointNormativeDocuments"
        />
        <AgGridColumn
          headerName="№ мероприятия"
          field="_actionPlanSerial"
          minWidth={143}
        />
        <AgGridColumn
          headerName="Мероприятия по устранению нарушений"
          field="actionPlan_actionText"
          minWidth={358}
          cellClass={cx("action-text-wrapper")}
          cellRendererFramework={(props) => (
            <div className={cx("action-text")}>{props.value}</div>
          )}
        />
        <AgGridColumn
          headerName="Сроки устранения"
          field="actionPlan_eliminationText"
          minWidth={177}
        />
        <AgGridColumn
          headerName="Ответственные за выполнение"
          valueGetter={getExecutor}
          minWidth={265}
          tooltipField="actionPlan_fullNameExecutor"
        />
        <AgGridColumn
          headerName="Ответственные за контроль"
          valueGetter={getController}
          minWidth={245}
          tooltipField="actionPlan_fullNameController"
        />
        <AgGridColumn
          minWidth={200}
          headerName="Действия"
          pinned="right"
          cellRendererFramework={ActionsColumn}
          cellRendererParams={{
            planStatusId: typicalPlanCard?.planStatusId,
            handleAddingOrEditingEvent,
            entityType: ModalEntityTypes.violation,
            openSortingViolationsModal: handleSortingViolations,
            areasOfResponsibility:
              AreasOfResponsibility.AcceptancePointsForOilAndPetroleumProducts,
            handleViolationEditing,
          }}
        />
      </AgGridTable>
    </div>
  );
};
