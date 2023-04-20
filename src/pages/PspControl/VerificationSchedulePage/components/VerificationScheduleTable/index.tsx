import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgGridTable } from "../../../../../components/AgGridTable";
import { StateType } from "../../../../../types";
import {
  IVerificationScheduleStore,
  setAppliedFilter,
} from "slices/pspControl/verificationSchedule";
import {
  DefaultColDef,
  DefaultIsAsc,
  DefaultSortedFieldValue,
  SortableFields,
  TableColumns,
} from "./constants";
import { GridReadyEvent, SortChangedEvent } from "ag-grid-community";
import { initSortingAndFiltering } from "components/AgGridTable/utils";
import { SortTypes } from "enums";
import update from "immutability-helper";
import { ListFilterBase } from "interfaces";
import CustomTextTableFilter from "components/CustomTextTableFilter";
import { IVerificationSchedulesModel } from "slices/pspControl/verificationSchedule/types";

export const VerificationScheduleTable: React.FC = () => {
  const dispatch = useDispatch();

  const { verificationScheduleList, appliedFilter } = useSelector<
    StateType,
    IVerificationScheduleStore
  >((state) => state.verificationSchedule);

  const onTableFilterChanged = (filterModel) => {
    const updatedFilter: ListFilterBase = update(appliedFilter, {
      filter: { filterModel: { $set: filterModel } },
      pageIndex: { $set: 1 },
    });

    dispatch(setAppliedFilter(updatedFilter));
  };

  const onTableSortChanged = (event: SortChangedEvent) => {
    const columnState = event.columnApi.getColumnState();
    const sortableColumn = columnState.find((column) => column.sort);

    if (sortableColumn) {
      const orderField = SortableFields[sortableColumn.colId as string];
      const isAsc = sortableColumn.sort === SortTypes.asc;
      if (orderField) {
        const updatedFilter = update(appliedFilter, {
          sortedField: { $set: `${orderField}` },
          isSortAsc: { $set: isAsc },
        });
        dispatch(setAppliedFilter(updatedFilter));
      }
    } else {
      const updatedFilter = update(appliedFilter, {
        sortedField: { $set: DefaultSortedFieldValue },
        isSortAsc: { $set: DefaultIsAsc },
      });
      dispatch(setAppliedFilter(updatedFilter));
    }
  };
  const onGridReady = (e: GridReadyEvent) =>
    initSortingAndFiltering(e, appliedFilter, SortableFields, {
      isSorting: true,
      isFiltering: true,
    });
  return (
    <React.Fragment>
      <AgGridTable
        onGridReady={onGridReady}
        defaultColDef={DefaultColDef}
        rowData={verificationScheduleList}
        columnDefs={TableColumns}
        filterChangedCallback={onTableFilterChanged}
        onSortChanged={onTableSortChanged}
        frameworkComponents={{
          customTextTableFilter: CustomTextTableFilter,
        }}
        isAutoSizeColumns={false}
      />
    </React.Fragment>
  );
};
