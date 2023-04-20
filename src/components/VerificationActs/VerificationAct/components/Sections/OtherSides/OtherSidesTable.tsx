import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

import { IdType, ObjectFields, StateType } from "../../../../../../types";
import { ItemsTable } from "../../../../../ItemsTable";
import { OtherSideItem } from "../../../classes";
import { VerificationActStore } from "../../../../../../slices/verificationActs/verificationAct/types";
import { TableActions } from "./TableActions";
import { removeVerificationOtherPartItemThunk } from "../../../../../../thunks/verificationActs/verificationAct";
import { VerificationActSection } from "../../../../../../containers/VerificationActs/VerificationAct/types";
import { GridLoading } from "../../../../../GridLoading";

export const OtherSidesTable: FC = () => {
  const dispatch = useDispatch();
  const state = useSelector<StateType, VerificationActStore>(
    state => state.verificationAct
  );
  const handleDelete = async (id: IdType) => {
    if (state.currentId) {
      await dispatch(
        removeVerificationOtherPartItemThunk({
          actId: state.currentId,
          id: id as string
        })
      );
    }
  };
  if (!state.currentId) {
    return null;
  }
  if (
    state.sectionPending[state.currentId][VerificationActSection.OtherSides]
  ) {
    return <GridLoading />;
  }
  return (
    <ItemsTable<OtherSideItem>
      items={state.memoizePages[state.currentId]?.otherSides.items || []}
      fields={new ObjectFields(OtherSideItem).getFields()}
      height="100%"
      hiddenColumns={["id"]}
      selectionCallback={(items: OtherSideItem[]) => {}}
      frameworkComponents={{
        tableOtherPartiesActActions: props => (
          <TableActions {...props} onDelete={handleDelete} />
        )
      }}
      actionColumns={[
        {
          headerName: "Действия",
          pinned: "right",
          cellRenderer: "tableOtherPartiesActActions",
          minWidth: 100
        }
      ]}
    />
  );
};
