import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgGridColumn } from "ag-grid-react";

import { IdType, StateType } from "../../../../../../types";
import { VerificationActStore } from "../../../../../../slices/verificationActs/verificationAct/types";
import { getVerificationActSectionPageThunk, removeVerificationReportItemThunk } from "../../../../../../thunks/verificationActs/verificationAct";
import { TableActions } from "./TableActions";
import { VerificationActSection } from "../../../../../../containers/VerificationActs/VerificationAct/types";
import { GridLoading } from "../../../../../GridLoading";
import { AgGridTable } from "components/AgGridTable";

export const CompositionTable: FC = () => {
  const dispatch = useDispatch();
  const state = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const actId = state.act?.id;
  const compositionOfAppendicesToReport = state.compositionOfAppendicesToReport;

  const handleDelete = async (id: IdType) => {
    if (actId) {
      await dispatch(
        removeVerificationReportItemThunk({
          actId,
          id: id as string,
        })
      );
      await dispatch(
        getVerificationActSectionPageThunk({
          actId,
          sectionType: VerificationActSection.CompositionOfAppendicesToReport,
        })
      );
    }
  };

  return (
    <AgGridTable
      rowData={compositionOfAppendicesToReport}
      suppressRowTransform={true}
      hasLoadingOverlayComponentFramework
      isAutoSizeColumns={false}
      defaultColDef={{ resizable: true }}
    >
      <AgGridColumn
        headerName="№"
        field="serial"
        minWidth={115}
      />
      <AgGridColumn
        headerName="Наименование приложения"
        field="name"
        minWidth={800}
        tooltipField="name"
      />
      <AgGridColumn
        headerName="Количество листов"
        field="pageCount"
        minWidth={115}
      />
      <AgGridColumn
        headerName="Действия"
        pinned="right"
        maxWidth={380}
        width={200}
        minWidth={200}
        cellRendererFramework={(props: any) => (
          <TableActions {...props} onDelete={handleDelete} />
        )}
      />
    </AgGridTable>
  );
};
