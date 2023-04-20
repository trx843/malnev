import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { AgGridColumn } from "ag-grid-react";

import { AgGridTable } from "../../../../../../components/AgGridTable";
import { IPlanCardStore } from "../../../../../../slices/pspControl/planCard";
import { StateType } from "../../../../../../types";
import { ActionsColumn } from "./components/ActionsColumn";
import { removeCommissionThunk } from "thunks/pspControl/planCard";
import styles from "./recommendationsTable.module.css";

const cx = classNames.bind(styles);

export const MatchingsTable: FC = () => {
  const dispatch = useDispatch();
  const { planCardInfo, commissions } = useSelector<StateType, IPlanCardStore>(
    (state) => state.planCard
  );

  const handleDelete = async (id: string) => {
    await dispatch(removeCommissionThunk(id));
  };

  return (
    <AgGridTable
      rowData={commissions}
      suppressRowTransform={true}
      defaultColDef={{ resizable: true }}
      isAutoSizeColumns={false}
    >
      <AgGridColumn
        headerName="№ пп"
        field="serial"
        minWidth={84}
      />
      <AgGridColumn
        headerName="Организация"
        field="organizationName"
        minWidth={300}
        tooltipField="organizationName"
      />
      <AgGridColumn
        headerName="ФИО"
        field="fullName"
        minWidth={279}
        tooltipField="fullName"
      />
      <AgGridColumn
        headerName="Должность"
        field="jobTitle"
        minWidth={279}
        tooltipField="jobTitle"
      />
      <AgGridColumn
        headerName="Согласующий/утверждающий/разработал"
        field="commisionTypesText"
        minWidth={166}
        headerTooltip="Согласующий/утверждающий/разработал"
      />
      <AgGridColumn
        headerName="Сторонняя организация"
        field="isOutsideOrganizationText"
        minWidth={218}
      />
      <AgGridColumn
        headerName="Действия"
        pinned="right"
        cellRendererFramework={ActionsColumn}
        cellRendererParams={{
          planStatusId: planCardInfo?.planStatusId,
          onDelete: handleDelete,
        }}
      />
    </AgGridTable>
  );
};
