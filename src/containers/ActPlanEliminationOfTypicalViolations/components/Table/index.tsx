import React, { FC } from "react";
import { AgGridColumn } from "ag-grid-react";
import classNames from "classnames/bind";
import { Pagination } from "antd";
import { useSelector } from "react-redux";

import { AgGridTable } from "../../../../components/AgGridTable";

import { FullWidthCell } from "../../../../pages/PspControl/PlanCardPage/components/FullWidthCell";
import styles from "./styles.module.css";
import { ActionColumn } from "./ActionColumn";
import { TypicalPlanCardItem } from "../Sections/classes";
import { ModalModes } from "../modals/ModalForAddingOrEditingEvent/constants";
import { TargetFormNames } from "components/ModalForAddingOrEditingEvent/constants";
import { IModalForAddingOrEditingEventInfo } from "./types";
import { ITypicalViolationValues } from "components/ModalForAddingOrEditingEvent/types";
import { Nullable, StateType } from "types";
import { ActionPlanTypicalViolationsStore } from "slices/pspControl/actionPlanTypicalViolations/types";
import { ModalForAddingOrEditingEvent } from "components/ModalForAddingOrEditingEvent";


const cx = classNames.bind(styles);

interface TableViolationsParams {
  data: TypicalPlanCardItem[];
  onPageChange: (page: number, pageSize?: number | undefined) => void;
  pageInfo?: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  onDelete: (values: { id: string; violationsId: string }) => Promise<void>;
  getViolationsByFilterData: any;
}

export const TableViolations: FC<TableViolationsParams> = ({
  data,
  pageInfo,
  onPageChange,
  onDelete,
  getViolationsByFilterData,
}) => {
  const { currentId, typicalPlanCard } = useSelector<
    StateType,
    ActionPlanTypicalViolationsStore
  >((state) => state.actionPlanTypicalViolations);

  const [
    modalForAddingOrEditingEventInfo,
    setModalForAddingOrEditingEventInfo,
  ] = React.useState<IModalForAddingOrEditingEventInfo>({
    values: null,
    visible: false,
    type: ModalModes.none,
  });

  const toggleModalForAddingOrEditingEventInfo = (
    values: Nullable<ITypicalViolationValues> = null,
    type: ModalModes = ModalModes.none
  ) => {
    setModalForAddingOrEditingEventInfo({
      values,
      visible: !modalForAddingOrEditingEventInfo.visible,
      type,
    });
  };

  const getRowSpan = (params: any) => {
    const rowSpan = params.data.isRowSpan ? params.data.actionPlan.length : 1;

    return rowSpan;
  };

  const getRowSpanPlan = (params: any) => {
    const rowSpan = params.data.isRowSpanPlan ? params.data.subLength : 1;

    return rowSpan;
  };

  return (
    <div className="typical-violation__table">
      <AgGridTable
        rowData={data}
        frameworkComponents={{ FullWidthCell }}
        fullWidthCellRenderer="FullWidthCell"
        isFullWidthCell={(rowNode) => rowNode.data?._isFullWidthRow}
        suppressRowTransform={true}
      >
        <AgGridColumn
          headerName="№ пп"
          field="_identifiedViolationsSerial"
          rowSpan={getRowSpan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => getRowSpan(params) > 1,
          }}
        />
        <AgGridColumn
          headerName="№пп"
          field="_violationSerial"
          rowSpan={getRowSpanPlan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => getRowSpanPlan(params) > 1,
          }}
        />
        <AgGridColumn
          headerName="Содержание нарушения"
          field="_violationText"
          rowSpan={getRowSpanPlan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => getRowSpanPlan(params) > 1,
          }}
        />
        <AgGridColumn
          headerName="Требование НД"
          field="_pointNormativeDocuments"
          rowSpan={getRowSpanPlan}
          cellClassRules={{
            [cx("row-span-cell")]: (params: any) => getRowSpanPlan(params) > 1,
          }}
        />

        <AgGridColumn headerName="№мероприятия" field="_actionPlanSerial" />
        <AgGridColumn
          headerName="Мероприятия по устранению нарушений "
          field="eliminationText"
        />
        <AgGridColumn
          headerName="Действия"
          pinned="right"
          cellRendererFramework={ActionColumn}
          cellRendererParams={{
            handleAddingOrEditingEvent: toggleModalForAddingOrEditingEventInfo,
            length: data.length,
            onDelete,
            status: typicalPlanCard?.planStatusId
          }}
        />
      </AgGridTable>
      <div className="typical-violation__table-pagination">
        <Pagination
          current={pageInfo?.pageNumber}
          total={pageInfo?.totalItems}
          pageSize={pageInfo?.pageSize}
          onChange={onPageChange}
          showSizeChanger={false}
          size={"small"}
        />
      </div>

      <ModalForAddingOrEditingEvent
        isVisible={modalForAddingOrEditingEventInfo.visible}
        onCancel={toggleModalForAddingOrEditingEventInfo}
        mode={modalForAddingOrEditingEventInfo.type}
        planId={currentId as string}
        entityValues={modalForAddingOrEditingEventInfo.values}
        onSubmitForm={getViolationsByFilterData}
        targetForm={TargetFormNames.EliminationOfTypicalViolations}
      />
    </div>
  );
};
