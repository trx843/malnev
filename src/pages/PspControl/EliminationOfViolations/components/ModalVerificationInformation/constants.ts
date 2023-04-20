import { dateValueFormatter } from "utils";

export const TableColumns = [
  { headerName: "ОСТ", field: "ostName", headerTooltip: "ОСТ" },
  { headerName: "Филиал", field: "filialName", headerTooltip: "Филиал" },
  { headerName: "ПСП ", field: "pspName", headerTooltip: "ПСП" },
  { headerName: "ОСУ", field: "suNames", headerTooltip: "ОСУ" },
  {
    headerName: "Принадлежность ПСП",
    field: "pspAffilation",
    headerTooltip: "Принадлежность ПСП",
  },
  { headerName: "Лаборатория", field: "ilName", headerTooltip: "Лаборатория" },
  {
    headerName: "Владелец Исп. Лаб.",
    field: "ilOwner",
    headerTooltip: "Владелец Исп. Лаб.",
  },
  {
    headerName: "Дата проверки",
    field: "controlDate",
    headerTooltip: "Дата проверки",
    valueFormatter: dateValueFormatter(),
  },
  {
    headerName: "Уровень проверки",
    field: "verificationLevel",
    headerTooltip: "Уровень проверки",
  },
  {
    headerName: "Тип проверки",
    field: "verificationType",
    headerTooltip: "Тип проверки",
  },
  {
    headerName: "В графике/вне графика",
    field: "inSchedule",
    headerTooltip: "В графике/вне графика",
  },
];
