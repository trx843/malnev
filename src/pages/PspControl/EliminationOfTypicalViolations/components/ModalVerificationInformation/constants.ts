import { dateValueFormatter as defaultDateValueFormatter } from "../../../../../utils";
import { ActionColumn } from "./components/ActionColumn";

const dateValueFormatter = defaultDateValueFormatter();

export const TableColumns = [
  {
    headerName: "Дата проверки",
    minWidth: 100,
    field: "verificatedOn",
    valueFormatter: dateValueFormatter,
  },
  {
    headerName: "Автор", field: "fullNameAuthor", minWidth: 100,
    cellClass: "ModalVerificationInformation__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    headerName: "Наличие нарушения", field: "status", minWidth: 100,
    cellClass: "ModalVerificationInformation__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    headerName: "Содержание выявленного нарушения", field: "eliminationText", minWidth: 250,
    cellClass: "ModalVerificationInformation__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    headerName: "Срок устранения (план)",
    field: "planDate",
    valueFormatter: dateValueFormatter,
    minWidth: 153
  },
  {
    headerName: "Срок устранения (факт)",
    field: "factDate",
    valueFormatter: dateValueFormatter,
    minWidth: 145,
  },
  {
    headerName: "Действия",
    minWidth: 100,
    pinned: "right",
    cellRendererFramework: ActionColumn,
    sortable: false,
    filter: false,
  },
];

export const InitFilter = {
  filter: {
    treeFilter: {
      nodePath: "",
      isOwn: null,
    },
  },
  rowCount: 0,
  pageIndex: 1,
  sortedField: "",
  isSortAsc: true,
  nodePath: "",
};

const staticCellStyle = { wordBreak: "break-word", lineHeight: "23px" };

export const DefaultColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  wrapText: true,
  cellStyle: staticCellStyle,
}
