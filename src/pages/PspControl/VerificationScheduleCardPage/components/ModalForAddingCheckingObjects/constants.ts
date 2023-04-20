import * as Yup from "yup";
import { dateValueFormatter } from "../../../../../utils";

export enum FormFields {
  pspName = "pspName", // селект Наименование ПСП
}

export const ValidationSchema = Yup.object({
  [FormFields.pspName]: Yup.string(),
});

export const TableColumns = [
  {
    field: "ostName",
    headerName: "ОСТ",
    minWidth: 332,
    tooltipField: "ostName",
  },
  {
    field: "filial",
    headerName: "Филиал ",
    minWidth: 141,
    tooltipField: "filial",
  },
  {
    field: "pspFullName",
    headerName: "ПСП ",
    minWidth: 266,
    tooltipField: "pspFullName",
  },
  {
    field: "osus",
    headerName: "ОСУ",
    minWidth: 161,
    tooltipField: "osus",
  },
  {
    field: "transportedProduct",
    headerName: "Транспортируемый продукт",
    minWidth: 205,
    tooltipField: "transportedProduct",
    headerTooltip: "Транспортируемый продукт",
  },
  {
    field: "pspOwner",
    headerName: "Владелец ПСП",
    sortable: true,
    minWidth: 247,
    tooltipField: "pspOwner",
  },
  {
    field: "osuOwners",
    headerName: "Владелец ОСУ",
    minWidth: 254,
    tooltipField: "osuOwners",
  },
  {
    field: "rsus",
    headerName: "РСУ ",
    minWidth: 324,
    tooltipField: "rsus",
  },
  {
    field: "rsuOwners",
    headerName: "Владелец РСУ",
    minWidth: 252,
    tooltipField: "rsuOwners",
  },
  {
    field: "pspAffiliation",
    headerName: "Принадлежность ПСП",
    minWidth: 207,
    tooltipField: "pspAffiliation",
  },
  {
    field: "pspOwned",
    headerName: "Собственный/сторонний",
    headerTooltip: "Собственный/сторонний",
    minWidth: 172,
    tooltipField: "pspOwned",
  },
  {
    field: "receiver",
    headerName: "Принимающая сторона",
    minWidth: 295,
    tooltipField: "receiver",
  },
  {
    field: "sender",
    headerName: "Сдающая сторона",
    minWidth: 265,
    tooltipField: "sender",
  },
  {
    field: "ils",
    headerName: "Наименование исп. лаб.",
    minWidth: 249,
    tooltipField: "ils",
  },
  {
    field: "ilOwner",
    headerName: "Владелец исп. лаб.",
    minWidth: 316,
    tooltipField: "ilOwner",
  },
  {
    field: "hasAccreditationIl",
    headerName: "Наличие аккредитации",
    minWidth: 142,
    tooltipField: "hasAccreditationIl",
    headerTooltip: "Наличие аккредитации",
  },
  {
    field: "paoControlDate",
    headerName: "Дата контроля ПАО",
    valueFormatter: dateValueFormatter(),
    minWidth: 190,
  },
  {
    field: "tnmControlDate",
    headerName: "Дата контроля ТНМ",
    valueFormatter: dateValueFormatter(),
    minWidth: 190,
  },
  {
    field: "ostControlDate",
    headerName: "Дата контроля ОСТ",
    valueFormatter: dateValueFormatter(),
    minWidth: 190,
  },
  {
    field: "tnmMonitoringDate",
    headerName: "Дата мониторинга ТНМ",
    valueFormatter: dateValueFormatter(),
    minWidth: 210,
  },
];
