import { useState, useCallback, useEffect } from "react";
import { ColumnApi, GridApi, GridReadyEvent } from "ag-grid-community";

const reorder = <T = Array<unknown>>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const normalizeRowData = (data) =>
  data.map((item: any, index) => ({
    ...item,
    index,
  }));

interface UseTableDragNDrop<T = unknown> {
  transform?: (data: Array<T>) => Array<T>;
  getRowNodeId?: (data: T) => any;
}

export const useTableDragNDrop = <T = unknown>(
  props?: UseTableDragNDrop<T>
) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null);
  const [rowData, setRowData] = useState<Array<T>>([]);

  useEffect(() => {
    return () => {

      gridApi?.destroy()
      setGridApi(null);
      setGridColumnApi(null);
      setRowData([]);
    };
  }, []);

  const handleReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }, []);

  const onRowDragMove = (event) => {
    if (!gridApi) {
      return;
    }
    const movingNode = event.node;
    const overNode = event.overNode;
    const rowNeedsToMove = movingNode !== overNode;

    if (rowNeedsToMove) {
      const store = [...rowData];
      const movingData = movingNode.data;
      if (!overNode) {
        return
      }
      const overData = overNode.data;
      const fromIndex = store.indexOf(movingData);
      const toIndex = store.indexOf(overData);
      
      const newStore = reorder<T>(store, fromIndex, toIndex);

      const transformed = props?.transform?.(newStore) || newStore;
      // gridApi.setRowData(newStore);
      setRowData(transformed);
      gridApi?.clearFocusedCell();
    }
  };

  const getRowNodeId = (data) => {
    return props?.getRowNodeId?.(data) || data.index;
  };

  const handleSet = (data) => {
    const updated = normalizeRowData(data);
    const transformed = props?.transform?.(updated) || updated;
    setRowData(transformed);
    if (gridApi) {
      // gridApi.setRowData(updated);
    }
  };

  return {
    props: {
      immutableData: true,
      animateRows: true,
    },
    events: {
      onGridReady: handleReady,
      onRowDragMove,
      getRowNodeId,
    },
    state: { setRowData: handleSet, rowData },
    gridApi,
    gridColumnApi,
  };
};
