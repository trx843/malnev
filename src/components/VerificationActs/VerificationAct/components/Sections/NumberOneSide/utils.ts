import { IdType } from "types";
import { AccreditationColumn } from "./components/AccreditationColumn";
import { TableActions } from "./components/TableActions";

export const getTableColumns = (
  onDelete: (id: IdType) => Promise<void>
) => {
  return [
    {
      headerName: "Система учета",
      field: "osuShortName",
      minWidth: 200,
      tooltipField: "osuShortName",
      cellClass: "verification-act-number-one-table__action-text-wrapper",
      cellRenderer: "WrapText",
    },
    {
      headerName: "Тип системы учета",
      field: "osuType",
      minWidth: 200,
      tooltipField: "osuType",
      cellClass: "verification-act-number-one-table__action-text-wrapper",
      cellRenderer: "WrapText",
    },
    {
      headerName: "Владелец",
      field: "osuOwner",
      minWidth: 200,
      tooltipField: "osuOwner",
      cellClass: "verification-act-number-one-table__action-text-wrapper",
      cellRenderer: "WrapText",
    },
    {
      headerName: "Принадлежность к компании",
      field: "osuAffiliation",
      minWidth: 180,
      tooltipField: "osuAffiliation",
      headerTooltip: "Принадлежность к компании",
      cellClass: "verification-act-number-one-table__action-text-wrapper",
      cellRenderer: "WrapText",
    },
    {
      headerName: "Назначение",
      field: "osuPurpose",
      minWidth: 135,
      tooltipField: "osuPurpose",
      headerTooltip: "Назначение",
      cellClass: "verification-act-number-one-table__action-text-wrapper",
      cellRenderer: "WrapText",
    },
    {
      headerName: "Собственный/сторонний",
      field: "owned",
      minWidth: 150,
      tooltipField: "owned",
      headerTooltip: "Собственный/сторонний",
    },
    {
      headerName: "Транспортируемый продукт",
      field: "transportedProduct",
      minWidth: 190,
      tooltipField: "transportedProduct",
      headerTooltip: "Транспортируемый продукт",
      cellClass: "verification-act-number-one-table__action-text-wrapper",
      cellRenderer: "WrapText",
    },
    {
      headerName: "Территориальное расположение",
      field: "territorialLocation",
      minWidth: 175,
      tooltipField: "territorialLocation",
      cellClass: "verification-act-number-one-table__action-text-wrapper",
      cellRenderer: "WrapText",
    },
    {
      headerName: "Принимающая сторона",
      field: "receive",
      minWidth: 155,
      tooltipField: "receive",
      cellClass: "verification-act-number-one-table__action-text-wrapper",
      cellRenderer: "WrapText",
    },
    {
      headerName: "Сдающая сторона",
      field: "send",
      minWidth: 155,
      tooltipField: "send",
      cellClass: "verification-act-number-one-table__action-text-wrapper",
      cellRenderer: "WrapText",
    },
    {
      headerName: "Аккредитация",
      field: "hasAccreditationIl",
      cellRendererFramework: AccreditationColumn,
      minWidth: 150,
      tooltipField: "hasAccreditationIl",
    },
    {
      headerName: "Действия",
      field: "Действия",
      pinned: "right",
      minWidth: 100,
      cellRendererFramework: TableActions,
      cellRendererParams: { onDelete },
    },
  ];
};
