import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { AgGridColumn } from "ag-grid-react";

import { AgGridTable } from "../../../../../../components/AgGridTable";
import { StateType } from "../../../../../../types";
import { ActionsColumn } from "./ActionColumn";
import styles from "./styles.module.css";
import { IVerificationScheduleCardStore } from "slices/pspControl/verificationScheduleCard";
import { removeVerificationCommissionThunk } from "thunks/pspControl/verificationScheduleCard";

const cx = classNames.bind(styles);

export const CommissionsTable: FC = () => {
  const dispatch = useDispatch();
  const { commissions, verificationScheduleCardInfo } = useSelector<
    StateType,
    IVerificationScheduleCardStore
  >((state) => state.verificationScheduleCard);

  const handleDelete = async (id: string) => {
    await dispatch(removeVerificationCommissionThunk(id));
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
        minWidth={103}
      />
      <AgGridColumn
        headerName="Организация"
        field="organizationName"
        minWidth={371}
        tooltipField={"organizationName"}
      />
      <AgGridColumn
        headerName="ФИО"
        field="fullName"
        minWidth={408}
        tooltipField={"fullName"}
      />
      <AgGridColumn
        headerName="Должность"
        field="jobTitle"
        minWidth={241}
        tooltipField={"jobTitle"}
      />
      <AgGridColumn
        headerName="Согласующий/Утверждающий"
        field="commisionTypesText"
        minWidth={265}
      />
      <AgGridColumn
        headerName="Сторонняя организация"
        field="isOutsideOrganizationText"
        minWidth={219}
      />
      <AgGridColumn
        headerName="Действия"
        pinned="right"
        cellRendererFramework={ActionsColumn}
        cellRendererParams={{
          verificationStatusId:
            verificationScheduleCardInfo?.verificationStatusId,
          onDelete: handleDelete,
        }}
      />
    </AgGridTable>
  );
};
