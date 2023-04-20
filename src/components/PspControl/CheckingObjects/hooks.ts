import { useState, useEffect } from "react";
import { GridApi } from "ag-grid-community";
import _ from "lodash";
import { Nullable } from "types";
import { CheckingObjectsItem } from "./classes";

export function useInitSelectedRows(
  checkingObjectsItems: CheckingObjectsItem[],
  gridApi: Nullable<GridApi>
) {
  const [selectedCheckingObjectsItems, setSelectedCheckingObjectsItems] =
    useState<CheckingObjectsItem[]>([]);

  useEffect(() => {
    const initItems = _.intersectionBy(
      selectedCheckingObjectsItems,
      checkingObjectsItems,
      "id"
    );

    if (!gridApi?.['destroyCalled']) {
      gridApi?.forEachNode((node) => {
        const isNodeSelected = !!initItems.find(
          (initItem) => initItem.id === node.data.id
        );
        node.setSelected(isNodeSelected);
      });
    }
  }, [checkingObjectsItems, gridApi]);

  return [
    selectedCheckingObjectsItems,
    setSelectedCheckingObjectsItems,
  ] as const;
}
