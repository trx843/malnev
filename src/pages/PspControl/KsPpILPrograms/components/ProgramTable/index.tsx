import React from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { AgGridTable } from "../../../../../components/AgGridTable";
import { GridReadyEvent, SortChangedEvent } from "ag-grid-community";
import { Nullable, StateType } from "../../../../../types";
import { getTableColumns } from "./utils";
import {
  IKsPpILProgramsStore,
  setListFilter,
} from "../../../../../slices/pspControl/ksPpILPrograms";
import { getKsPpILProgramsThunk } from "../../../../../thunks/pspControl/ksPpILPrograms";
import { ModalTypes } from "../ModalForCreatingAndReplacingProgram/constants";
import update from "immutability-helper";
import CustomTextTableFilter from "components/CustomTextTableFilter";
import { ListFilterBase } from "interfaces";
import { SortTypes } from "enums";
import { initSortingAndFiltering } from "components/AgGridTable/utils";
import { DefaultColDef, DefaultIsAsc, DefaultSortedFieldValue, SortableFields } from "../../constants";

interface IProps {
  openProgramReplacementModal: (type: ModalTypes, id: Nullable<string>) => void;
}

export const ProgramTable: React.FC<IProps> = ({
  openProgramReplacementModal,
}) => {
  const dispatch = useDispatch();

  const { ksPpILProgramList, listFilter } = useSelector<
    StateType,
    IKsPpILProgramsStore
  >((state) => state.ksPpILPrograms);

  React.useEffect(() => {
    dispatch(getKsPpILProgramsThunk(listFilter));
  }, [listFilter]);

  const onTableFilterChanged = (filterModel) => {
    const updatedFilter: ListFilterBase = {
      ...listFilter,
      filter: {
        ...listFilter.filter,
        filterModel,
      },
    };
    dispatch(setListFilter(updatedFilter));
  };

  const onTableSortChanged = (event: SortChangedEvent) => {
    const columnState = event.columnApi.getColumnState();
    const sortableColumn = columnState.find((column) => column.sort);

    if (sortableColumn) {
      const orderField = SortableFields[sortableColumn.colId as string];
      const isAsc = sortableColumn.sort === SortTypes.asc;
      if (orderField) {
        const updatedFilter = update(listFilter, {
          sortedField: { $set: `${orderField}` },
          isSortAsc: { $set: isAsc },
        });
        dispatch(setListFilter(updatedFilter));
      }
    } else {
      const updatedFilter = update(listFilter, {
        sortedField: { $set: DefaultSortedFieldValue },
        isSortAsc: { $set: DefaultIsAsc },
      });
      dispatch(setListFilter(updatedFilter));
    }
  };
  const onGridReady = (e: GridReadyEvent) =>
    initSortingAndFiltering(e, listFilter, SortableFields, {
      isSorting: true,
      isFiltering: true,
    });

  return (
    <AgGridTable
      onGridReady={onGridReady}
      rowData={ksPpILProgramList}
      defaultColDef={DefaultColDef}
      columnDefs={getTableColumns(openProgramReplacementModal)}
      filterChangedCallback={onTableFilterChanged}
      onSortChanged={onTableSortChanged}
      frameworkComponents={{
        customTextTableFilter: CustomTextTableFilter,
      }}
      isAutoSizeColumns={false}
    />
  );
};
