import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IdType, StateType } from "../../../../../../types";
import { VerificationActStore } from "../../../../../../slices/verificationActs/verificationAct/types";
import { TableActions } from "./TableActions";
import { getVerificationActSectionPageThunk, removeVerificationRecommendationItemThunk } from "../../../../../../thunks/verificationActs/verificationAct";
import { VerificationActSection } from "../../../../../../containers/VerificationActs/VerificationAct/types";
import { AgGridTable } from "components/AgGridTable";
import { AgGridColumn } from "ag-grid-react";

export const RecommendationsTable: FC = () => {
  const dispatch = useDispatch();
  const state = useSelector<StateType, VerificationActStore>(
    state => state.verificationAct
  );

  const actId = state.act?.id
  const recommendations = state.recommendations

  const handleDelete = async (id: IdType) => {
    if (actId) {
      await dispatch(
        removeVerificationRecommendationItemThunk({
          actId,
          id: id as string
        })
      );
      await dispatch(
        getVerificationActSectionPageThunk({
          actId,
          sectionType: VerificationActSection.Recommendations
        })
      );
    }
  };

  return (
    <AgGridTable
      rowData={recommendations}
      suppressRowTransform={true}
      hasLoadingOverlayComponentFramework
      stateStorageKey="verification-act-recommendations-table"
      defaultColDef={{ resizable: true }}
      isAutoSizeColumns={false}
    >
      <AgGridColumn
        headerName="№"
        field="serial"
        minWidth={77}
      />
      <AgGridColumn
        headerName="Рекомендации"
        field="recommendationsText"
        minWidth={1528}
        tooltipField="recommendationsText"
      />
      <AgGridColumn
        headerName="Действия"
        pinned="right"
        maxWidth={380}
        width={200}
        minWidth={200}
        cellRendererParams={{ onDelete: handleDelete }}
        cellRendererFramework={TableActions}
      />
    </AgGridTable>
  );
};
