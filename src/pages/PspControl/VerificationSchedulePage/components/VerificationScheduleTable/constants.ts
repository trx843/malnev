import { ActionsColumn } from "../ActionsColumn";
import { dateValueFormatter } from "./utils";

export const TableColumns = [
  {
    headerName: "Уровень проверки",
    field: "verificationLevel",
    minWidth: 229,
    tooltipField: "verificationLevel",
  },
  {
    headerName: "Тип проверки",
    field: "checkType",
    minWidth: 378,
    tooltipField: "checkType",
  },

  {
    headerName: "Наименование ОСТ",
    field: "ost",
    sortable: false,
    minWidth: 269,
    tooltipField: "ost",
  },
  {
    headerName: "Год проверки",
    field: "yearText",
    minWidth: 161,
  },
  {
    headerName: "Дата создания",
    field: "createdOn",
    valueFormatter: dateValueFormatter,
    filter: false,
    minWidth: 154,
  },
  {
    headerName: "Статус",
    field: "statusText",
    minWidth: 169,
    tooltipField: "statusText",
  },
  {
    headerName: "Действия",
    pinned: "right",
    sortable: false,
    filter: false,
    cellRendererFramework: ActionsColumn,
    minWidth: 150,
  },
];

export enum SortableFields {
  verificationLevel = "VerificationLevels.Name",
  checkType = "CheckTypes.Name",
  yearText = "InspectionYear",
  createdOn = "createdOn",
  statusText = "VerificationStatuses.Name",
}

const staticCellStyle = { wordBreak: "break-word", lineHeight: "23px" };

export const DefaultColDef = {
  sortable: true,
  resizable: true,
  comparator: () => 0,
  filter: "customTextTableFilter",
  wrapText: true,
  autoHeight: true,
  cellStyle: staticCellStyle,
};

export const DefaultSortedFieldValue: string = "createdOn";
export const DefaultIsAsc: boolean = false;
