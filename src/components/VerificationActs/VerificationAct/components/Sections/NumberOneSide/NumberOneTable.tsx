import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgGridTable } from "components/AgGridTable";
import { IdType, StateType } from "../../../../../../types";
import { VerificationActStore, VerificationOsuItem } from "../../../../../../slices/verificationActs/verificationAct/types";
import {
  getVerificationActPageThunk,
  removeVerificationOsuItemThunk,
} from "../../../../../../thunks/verificationActs/verificationAct";
import { getTableColumns } from "./utils";
import { RendererProps } from "components/ItemsTable";
import "./styles.css";

export const NumberOneTable: FC = () => {
  const dispatch = useDispatch();
  const state = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const actId = state.act?.id;
  const checkingObjects = state.act?.checkingObjects;

  const handleDelete = async (id: IdType) => {
    if (actId) {
      await dispatch(
        removeVerificationOsuItemThunk({
          actId,
          id: id as string,
        })
      );
      await dispatch(getVerificationActPageThunk(actId));
    }
  };

  const staticCellStyle = { wordBreak: "break-word", lineHeight: "23px" };

  return (
    <AgGridTable
      rowData={checkingObjects || []}
      columnDefs={getTableColumns(handleDelete)}
      rowHeight={65}
      frameworkComponents={{
        WrapText: (item: RendererProps<VerificationOsuItem>) => (
          <div className="verification-act-number-one-table__action-text">
            {item.value}
          </div>
        ),
      }}
      defaultColDef={{
        wrapText: true,
        cellStyle: staticCellStyle,
        resizable: true,
      }}
      suppressRowTransform={true}
      stateStorageKey="verification-act-number-one-table"
    />
  );
};
