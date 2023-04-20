import { ColumnApi, ValueFormatterParams } from "ag-grid-community";
import { TableColumnInfo } from "components/TableColumnSettingsModal/types";
import _ from "lodash";
import moment from "moment";

export function getSelectedData<T>(
  selectedItems: T[], // массив выбранных/отмененных
  selectedTableDataCurrentPage: T[], // выбранные элементы таблицы на странице
  selectedTableData: T[] // список всех выбранных элементы таблицы
) {
  // если пользователь отменил все на странице(deselect all)
  if (!selectedItems.length) {
    // получаем оставшиеся все выбранные элементы таблицы
    const remainingInitSelectedTableItems = _.differenceBy(
      selectedTableData,
      selectedTableDataCurrentPage,
      "id"
    );

    return {
      selectedTableItemsCurrentPage: selectedItems,
      selectedTableItems: remainingInitSelectedTableItems,
    };
  }

  // если пользователь отменил строку(deselect item)
  if (selectedItems.length < selectedTableDataCurrentPage.length) {
    // получаем массив с отменненым элементом
    const diff = _.differenceBy(
      selectedTableDataCurrentPage,
      selectedItems,
      "id"
    );

    // убираем элемент из исходного массива всех выбранных элементов таблицы
    const remainingInitSelectedTableItems = _.xorBy(
      diff,
      selectedTableData,
      "id"
    );

    return {
      selectedTableItemsCurrentPage: selectedItems,
      selectedTableItems: remainingInitSelectedTableItems,
    };
  }

  // получаем новый массив с новым выбранным элементом
  const diff = _.differenceBy(selectedItems, selectedTableData, "id");

  return {
    selectedTableItemsCurrentPage: selectedItems,
    selectedTableItems: [...selectedTableData, ...diff],
  };
}

export const dateValueFormatter = (params: ValueFormatterParams) => {
  const date = params.value;

  if (!date) return "";

  const momentDateObj = moment(date);

  if (momentDateObj.isValid()) return momentDateObj.format("DD.MM.YYYY");

  return "";
};

export const getTableInfo = (columnApi: ColumnApi) => {
  const colDefs = columnApi.getAllColumns().map((c) => c.getColDef());
  const colStates = columnApi.getColumnState();
  const tableState = colStates.map((colState) => {
    const columnDef = colDefs.filter((colDef) => colState.colId === colDef.field)[0];
    if (columnDef) {
      const columnInfo: TableColumnInfo = {
        headerName: columnDef.headerName,
        field: columnDef.field,
        hide: colState.hide,
      };
      return columnInfo;
    }
    return {
      headerName: undefined,
      field: undefined,
      hide: undefined,
    };
  });
  return tableState;
};
