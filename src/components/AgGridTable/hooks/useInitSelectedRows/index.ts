import React from "react";
import { GridApi } from "ag-grid-community";
import _ from "lodash";
import { Nullable } from "types";
import { getSelectedItems } from "./utils";

export function useInitSelectedRows<T = any>(
  items: T[], // массив текущих элементов в таблице
  gridApiRef?: Nullable<GridApi>,
  accessor: string = "id" // уникальное средство доступа по которому будут сопоставляться элементы для инициализции выбранных строк таблицы
) {
  const [gridApi, setGridApi] = React.useState<Nullable<GridApi>>(
    gridApiRef || null
  );
  // выбранные элементы таблицы на текущей странице/при текущем значении фильтра
  const [selectedItemsOnCurrentPage, setSelectedItemsOnCurrentPage] =
    React.useState<T[]>([]);
  // все выбранные элементы таблицы
  const [selectedItems, setSelectedItems] = React.useState<T[]>([]);

  React.useEffect(() => {
    const initSelectedItems = _.intersectionBy(selectedItems, items, accessor);

    if (!gridApi?.["destroyCalled"]) {
      gridApi?.forEachNode((node) => {
        const initSelectedItem = initSelectedItems.find(
          (initItem) => initItem[accessor] === node.data[accessor]
        );
        node.setSelected(!!initSelectedItem);
      });
    }
  }, [items, gridApi]);

  const onSelectionChanged = (newSelectedItems: T[]) => {
    // для предотвращения лишних ререндов при инициализации выбранных элементов из-за смены страницы/значения фильтра
    if (selectedItemsOnCurrentPage.length === newSelectedItems.length) return;

    const data = getSelectedItems<T>(
      newSelectedItems,
      selectedItemsOnCurrentPage,
      selectedItems,
      accessor
    );

    setSelectedItemsOnCurrentPage(data.selectedItemsOnCurrentPage);
    setSelectedItems(data.selectedItems);
  };

  return {
    selectedItemsOnCurrentPage,
    setSelectedItemsOnCurrentPage,
    selectedItems,
    setSelectedItems,
    onSelectionChanged,
    gridApi,
    setGridApi,
  } as const;
}
