import { useState, useCallback } from "react";
import { GridApi, ColumnApi } from "ag-grid-community";
import update from "immutability-helper";
import { ColumnResizedEvent } from "ag-grid-community/dist/lib/events";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import { throttle } from "lodash";
import { autoSizeAll } from "components/AgGridTable/utils";

type TableState = {
  width: number;
};
type LocalStorageTable = Record<string, Record<string, TableState>>;

const NAME = "table-config";

const getValuesFromLocalStorage = (name: string): LocalStorageTable => {
  const storage = localStorage.getItem(NAME) as null | undefined | string;
  if (isEmpty(storage)) {
    return {
      [name]: {}
    };
  }

  const parsed = JSON.parse(storage as string) as LocalStorageTable;

  if (!isObject(parsed)) {
    return {
      [name]: {}
    };
  }

  return (
    parsed || {
      [name]: {
        width: 100
      }
    }
  );
};

export const useTableState = (name: string, save = false) => {
  const [tableState, setTableState] = useState<LocalStorageTable | null>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [gridColumnApi, setGridColumnApi] = useState<any>(null);

  const handleSetValues = useCallback(
    (api: { gridApi: GridApi; columnApi: ColumnApi }) => {
      if (!gridApi && !gridColumnApi) {
        api.gridApi.sizeColumnsToFit();
        // autoSizeAll(api.columnApi);
        setGridApi(api.gridApi);
        setGridColumnApi(api.columnApi);
        const storage = getValuesFromLocalStorage(name);

        setTableState(storage);
        handleChangeWidth(storage, name, api.columnApi);
      }
    },
    [gridApi, gridColumnApi]
  );

  const onColumnResized = (e: ColumnResizedEvent) => {
    const actualWidth = e.column?.getActualWidth();
    const key = e.column?.getColId() as string;

    if (!actualWidth) {
      return;
    }
    if (!tableState) {
      return;
    }
    const table = !tableState[name]?.[key]
      ? {
        ...tableState,
        [name]: { ...tableState[name], [key]: { width: actualWidth } }
      }
      : tableState;
    const data = update(table, {
      [name]: { [key]: { width: { $set: actualWidth } } }
    });
    setTableState(data);

    if (save) {
      localStorage.setItem(NAME, JSON.stringify(data));
    }
  };

  // after ready
  const handleChangeWidth = (
    storage: LocalStorageTable,
    tableName: string,
    columnApi: ColumnApi
  ) => {
    const table = storage[tableName];

    if (isEmpty(table)) {
      return;
    }
    let savedState = columnApi
      .getColumnState()
      .reduce((acc, item) => ({ ...acc, [item.colId as string]: item }), {});
    const state = Object.entries({ ...savedState, ...table }).map(
      (item: any[]) => ({
        ...item[1],
        colId: item[0]
      })
    );
    columnApi.applyColumnState({
      state
    });
  };

  return {
    state: {},
    isAutoSizeColumns: false,
    onColumnResized: throttle(onColumnResized, 150),
    onReady: handleSetValues
  };
};
