import { CheckBoxCell } from "components/cellRenderers/CheckBoxCell";
import { ActionsColumn } from "../ActionsColumn";
import { ForExecutionColumn } from "../ForExecutionColumn";

export const TableColumns = [
  {
    headerName: "К исполнению",
    field: "forExecution",
    cellRendererFramework: ForExecutionColumn,
  },
  {
    headerName: "Дата и время получения",
    field: "createdOnText",
  },
  { headerName: "Тип проверки", field: "checkTypeName" },
  { headerName: "Тип события", field: "eventTypeName" },
  { headerName: "ОСТ", field: "ostName" },
  { headerName: "ПСП", field: "pspName" },
  { headerName: "Уровень проверки", field: "verificationLevelName" },
  {
    headerName: "Год проверки",
    field: "checkYear",
  },
  {
    headerName: "Признак ознакомления",
    pinned: "right",
    field: "isAcquaintance",
    cellRendererFramework: CheckBoxCell,
  },
  {
    headerName: "Действия",
    pinned: "right",
    cellRendererFramework: ActionsColumn,
  },
];
