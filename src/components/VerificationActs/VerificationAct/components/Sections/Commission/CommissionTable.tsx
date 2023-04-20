import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AgGridTable } from "components/AgGridTable";
import { AgGridColumn } from "ag-grid-react";
import { IdType, StateType } from "../../../../../../types";
import { VerificationActStore } from "../../../../../../slices/verificationActs/verificationAct/types";
import { getVerificationActSectionPageThunk, removeVerificationCommissionItemThunk } from "../../../../../../thunks/verificationActs/verificationAct";
import { TableActions } from "./TableActions";
import { VerificationActSection } from "containers/VerificationActs/VerificationAct/types";

export const CommissionTable: FC = () => {
  const dispatch = useDispatch();
  const state = useSelector<StateType, VerificationActStore>(
    state => state.verificationAct
  );

  const actId = state.act?.id;
  const commission = state.commission;

  const handleDelete = async (id: IdType) => {
    if (actId) {
      await dispatch(
        removeVerificationCommissionItemThunk({
          actId,
          id: id as string
        })
      );
      await dispatch(
        getVerificationActSectionPageThunk({
          actId,
          sectionType: VerificationActSection.Commission
        })
      );
    }
  };

  return (
    <AgGridTable
      rowData={commission}
      stateStorageKey="verification-act-commission-table"
      defaultColDef={{ resizable: true }}
      isAutoSizeColumns={false}
    >
      <AgGridColumn
        headerName="От (Наименование организации)"
        field="organizationName"
        minWidth={275}
        tooltipField="organizationName"
      />
      <AgGridColumn
        headerName="ФИО"
        field="fullName"
        minWidth={523}
        tooltipField="fullName"
      />
      <AgGridColumn
        headerName="Должность"
        field="jobTitle"
        minWidth={656}
        tooltipField="jobTitle"
      />
      <AgGridColumn
        headerName="В присутствии"
        field="isInPresenceTxt"
        minWidth={150}
        tooltipField="isInPresenceTxt"
      />
      <AgGridColumn
        headerName="Действия"
        pinned="right"
        cellRendererParams={{ onDelete: handleDelete }}
        cellRendererFramework={TableActions}
      />
    </AgGridTable>
  );
};
