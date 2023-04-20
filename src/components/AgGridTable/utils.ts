import _ from "lodash";
import {
  ColumnApi,
  ColumnResizedEvent,
  ColumnState,
  GridReadyEvent,
} from "ag-grid-community";
import { ListFilterBase } from "interfaces";
import {
  AgGridTableStoragesName,
  DefaultSortingAndFilteringConfig,
} from "./constants";
import { AgGridTableStorages, ISortingAndFiltering } from "./types";
import { SortTypes } from "enums";

// автоматическое изменение размера всех столбцов
// для того чтобы ширина подстраивалась под содержимое ячеек
export const autoSizeAll = (
  gridColumnApi: ColumnApi,
  columnsIgnoringAutoSize?: string[],
  skipHeader: boolean = false
) => {
  const columns = gridColumnApi.getAllColumns().reduce((acc, column) => {
    const colId = column.getId();

    if (!columnsIgnoringAutoSize?.includes(colId)) {
      return [...acc, colId];
    }

    return acc;
  }, []);

  gridColumnApi.autoSizeColumns(columns, skipHeader);
};

// чтобы столбец, в котором отображается флажок выбора, всегда является первым столбцом.
// это можно увидеть, перетащив столбцы, чтобы изменить их порядок.
export const isFirstColumn = (params: any) => {
  const displayedColumns = params.columnApi.getAllDisplayedColumns();
  const thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
};

export const initAgGridTableStorage = async (
  columnApi: ColumnApi,
  stateStorageKey: string
) => {
  const storage = JSON.parse(
    localStorage.getItem(AgGridTableStoragesName) || "{}"
  ) as AgGridTableStorages;

  if (storage) {
    const state = storage[stateStorageKey];
    await columnApi.applyColumnState({ state: state, applyOrder: true });
  }
};

export const updateStateStorageKey = (
  columnState: ColumnState[],
  stateStorageKey: string
) => {
  const storage = JSON.parse(
    localStorage.getItem(AgGridTableStoragesName) || "{}"
  ) as AgGridTableStorages;

  if (storage && columnState) {
    localStorage.setItem(
      AgGridTableStoragesName,
      JSON.stringify({
        ...(storage && { ...storage }),
        [stateStorageKey]: columnState.map((c) => ({
          ...c,
          colId: c.colId,
          width: c.width,
          hide: c.hide,
        })),
      })
    );
  }
};

export const initSortingAndFiltering = <T extends object>(
  gridApi: GridReadyEvent,
  listFilter: ListFilterBase,
  sortableFields: T, // объект с енамом полей сортировки({ [field столбца на фронте]: значение по которому сортирует бэк })
  config: ISortingAndFiltering = DefaultSortingAndFilteringConfig,
  sortableFieldsSeparator: string = ","
) => {
  if (config.isFiltering) {
    const listFilterModel = listFilter.filter.filterModel;
    const filterModel = gridApi.api.getFilterModel();

    if (listFilterModel && !_.isEqual(listFilterModel, filterModel)) {
      gridApi.api.setFilterModel(listFilterModel);
    }
  }

  if (config.isSorting) {
    const columnState = gridApi.columnApi.getColumnState();

    if (columnState) {
      const sortedFieldValues = listFilter.sortedField
        .split(sortableFieldsSeparator)
        .map((i) => i.trim());

      const adjustedColumnState = columnState.map((columnState) => {
        const columnId = columnState.colId;

        if (!columnId) return columnState;

        const column = gridApi.columnApi.getColumn(columnId);
        const isColumnSortable = column.getColDef().sortable;

        // получаем название поля по которому происходит сортировка на бэке
        const sortableFieldsValue = sortableFields[columnId];

        // проверям содержит ли такое значение атрибут стора sortedField
        if (
          sortedFieldValues.includes(sortableFieldsValue) &&
          isColumnSortable
        ) {
          return {
            ...columnState,
            sort: listFilter.isSortAsc ? SortTypes.asc : SortTypes.desc,
          };
        }

        return columnState;
      });

      gridApi.columnApi.applyColumnState({
        state: adjustedColumnState,
        applyOrder: true,
      });
    }
  }
};
