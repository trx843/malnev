import moment from "moment";
import { ValueFormatterParams } from "ag-grid-community";
import { Nullable } from "../../../../../types";
import { ModalTypes } from "../ModalForCreatingAndReplacingProgram/constants";
import { ActionsColumn } from "./components/ActionsColumn";

export const dateValueFormatter =
  (attrName: string) => (params: ValueFormatterParams) => {
    const date = params.data[attrName];

    if (!date) return "";

    const momentDateObj = moment(date);

    if (momentDateObj.isValid()) return momentDateObj.format("DD.MM.YYYY");

    return "";
  };

export const getTableColumns = (
  openProgramReplacementModal: (type: ModalTypes, id: Nullable<string>) => void
) => {
  return [
    {
      headerName: "Наименование",
      field: "name",
      filter: "customTextTableFilter",
      minWidth: 518,
      tooltipField: "name",
    },
    {
      headerName: "Дата введения",
      field: "entryDate",
      valueFormatter: dateValueFormatter("entryDate"),
      minWidth: 180,
    },
    {
      headerName: "Срок действия",
      field: "endDate",
      valueFormatter: dateValueFormatter("endDate"),
      minWidth: 153,
    },
    {
      headerName: "Введен взамен",
      field: "previoseName",
      filter: "customTextTableFilter",
      minWidth: 384,
      tooltipField: "previoseName",
    },
    {
      headerName: "Статус",
      field: "status",
      filter: "customTextTableFilter",
      minWidth: 135
    },
    {
      headerName: "Действия",
      field: "Действия",
      pinned: "right",
      cellRendererFramework: ActionsColumn,
      cellRendererParams: { openProgramReplacementModal },
      sortable: false,
      minWidth: 150,
    },
  ];
};
