import { dateValueFormatter } from "../../../utils";
import { RowSpanParams } from "ag-grid-community";

const getRowSpan = (attrName: string) => (params: RowSpanParams) => {
  const rowSpan = params.data[attrName];
  return rowSpan;
};

export const identifiedViolationRowSpan = getRowSpan(
  "_rowSpanIdentifiedViolation"
);

export const pspRowSpan = getRowSpan("rowSpanPsp");

const getCellClassRules = (attrName: string) => {
  return {
    ["psp-checking-objects__row-span-cell"]: (params: any) =>
      params.data[attrName] > 1,
  };
};

export const pspCellClassRules = getCellClassRules("rowSpanPsp");

export const DefaultSortedFieldValue =
  "OstRnuPsp.OstName, OstRnuPsp.RnuName, OstRnuPsp.PspFullName";
export const DefaultIsAsc: boolean = true;

export const TableColumns = [
  {
    field: "ostName",
    headerName: "ОСТ",
    minWidth: 250,
    tooltipField: "ostName",
    pinned: "left",
    rowSpan: pspRowSpan,
    cellClassRules: pspCellClassRules,
  },
  {
    field: "filial",
    headerName: "Филиал ",
    minWidth: 180,
    tooltipField: "filial",
    rowSpan: pspRowSpan,
    cellClassRules: pspCellClassRules,
  },
  {
    field: "pspFullName",
    headerName: "ПСП ",
    minWidth: 315,
    tooltipField: "pspFullName",
    rowSpan: pspRowSpan,
    cellClassRules: pspCellClassRules,
  },
  {
    field: "osus",
    headerName: "ОСУ",
    minWidth: 250,
    tooltipField: "osus",
    cellClass: "psp-checking-objects__action-text-wrapper",
    cellRenderer: "RedText",
  },
  {
    field: "osuOwnedText",
    headerName: "Собственная/сторонняя ОСУ",
    filter: "customFilter",
    filterParams: {
      customOptions: ["Cторонняя", "Собственная"],
    },
    minWidth: 250,
    tooltipField: "osuOwnedText",
  },
  {
    field: "osuAddress",
    headerName: "Расположение ОСУ",
    minWidth: 250,
    tooltipField: "osuAddress",
  },
  {
    field: "osuPurpose",
    headerName: "Назначение ОСУ",
    minWidth: 250,
    tooltipField: "osuPurpose",
  },
  {
    field: "osuAffiliation",
    headerName: "Принадлежность ОСУ",
    minWidth: 250,
    tooltipField: "osuAffiliation",
    cellClass: "psp-checking-objects__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    field: "transportedProduct",
    headerName: "Транспортируемый продукт ОСУ",
    minWidth: 210,
    tooltipField: "transportedProduct",
    headerTooltip: "Транспортируемый продукт ОСУ",
    cellClass: "psp-checking-objects__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    field: "pspOwner",
    headerName: "Владелец ПСП",
    minWidth: 200,
    tooltipField: "pspOwner",
    cellClass: "psp-checking-objects__action-text-wrapper",
    cellRenderer: "WrapText",
    rowSpan: pspRowSpan,
    cellClassRules: pspCellClassRules,
  },
  {
    field: "osuOwners",
    headerName: "Владелец ОСУ",
    minWidth: 200,
    tooltipField: "osuOwners",
    cellClass: "psp-checking-objects__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    field: "rsus",
    headerName: "РСУ ",
    minWidth: 250,
    tooltipField: "rsus",
    cellClass: "psp-checking-objects__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    field: "rsuOwners",
    headerName: "Владелец РСУ",
    minWidth: 200,
    tooltipField: "rsuOwners",
    cellClass: "psp-checking-objects__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    field: "receiver",
    headerName: "Принимающая сторона",
    minWidth: 250,
    tooltipField: "receiver",
    cellClass: "psp-checking-objects__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    field: "sender",
    headerName: "Сдающая сторона",
    minWidth: 250,
    tooltipField: "sender",
    cellClass: "psp-checking-objects__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    field: "pspAffiliation",
    headerName: "Принадлежность ПСП к группе",
    minWidth: 200,
    tooltipField: "pspAffiliation",
    headerTooltip: "Принадлежность ПСП к группе",
    cellClass: "psp-checking-objects__action-text-wrapper",
    cellRenderer: "WrapText",
    rowSpan: pspRowSpan,
    cellClassRules: pspCellClassRules,
  },
  {
    field: "pspOwned",
    headerName: "Принадлежность ПСП",
    filter: "customFilter",
    filterParams: {
      customOptions: ["Cторонний", "Собственный"],
    },
    minWidth: 200,
    tooltipField: "pspOwned",
    headerTooltip: "Принадлежность ПСП",
    cellClass: "psp-checking-objects__action-text-wrapper",
    cellRenderer: "WrapText",
    rowSpan: pspRowSpan,
    cellClassRules: pspCellClassRules,
  },
  
  {
    field: "ils",
    headerName: "Наименование исп. лаб.",
    minWidth: 250,
    tooltipField: "ils",
    headerTooltip: "Наименование исп. лаб.",
    cellClass: "psp-checking-objects__action-text-wrapper",
    cellRenderer: "WrapText",
    rowSpan: pspRowSpan,
    cellClassRules: pspCellClassRules,
  },
  {
    field: "ilOwner",
    headerName: "Владелец исп. лаб.",
    minWidth: 250,
    tooltipField: "ilOwner",
    cellClass: "psp-checking-objects__action-text-wrapper",
    cellRenderer: "WrapText",
    rowSpan: pspRowSpan,
    cellClassRules: pspCellClassRules,
  },
  {
    field: "hasAccreditationIl",
    headerName: "Наличие аккредитации",
    filter: "customFilter",
    minWidth: 180,
    tooltipField: "hasAccreditationIl",
    headerTooltip: "Наличие аккредитации",
    cellClass: "psp-checking-objects__action-text-wrapper",
    cellRenderer: "WrapText",
    rowSpan: pspRowSpan,
    cellClassRules: pspCellClassRules,
  },
  {
    field: "paoControlDate",
    headerName: "Дата контроля ПАО",
    valueFormatter: dateValueFormatter(),
    sortable: true,
    filter: false,
    minWidth: 125,
  },
  {
    field: "tnmControlDate",
    headerName: "Дата контроля ТНМ",
    valueFormatter: dateValueFormatter(),
    sortable: true,
    filter: false,
    minWidth: 125,
  },
  {
    field: "ostControlDate",
    headerName: "Дата контроля ОСТ",
    valueFormatter: dateValueFormatter(),
    sortable: true,
    filter: false,
    minWidth: 125,
  },
  {
    field: "tnmMonitoringDate",
    headerName: "Дата мониторинга ТНМ",
    valueFormatter: dateValueFormatter(),
    sortable: true,
    filter: false,
    minWidth: 145,
    headerTooltip: "Дата мониторинга ТНМ",
  },
  {
    headerName: "Действия",
    pinned: "right",
    cellRenderer: "CheckingObjectActions",
    minWidth: 250,
    maxWidth: 260,
    filter: false,
  },
];

export enum SortableFields {
  paoControlDate = "OstRnuPsp.PaoControlDate",
  tnmControlDate = "OstRnuPsp.TnmControlDate",
  ostControlDate = "OstRnuPsp.OstControlDate",
  tnmMonitoringDate = "OstRnuPsp.TnmMonitoringDate",
}

const staticCellStyle = { wordBreak: "break-word", lineHeight: "23px" };

export const DefaultColDef = {
  resizable: true,
  sortable: false,
  comparator: () => 0,
  filter: "customTextTableFilter",
  wrapText: true,
  cellStyle: staticCellStyle,
};
