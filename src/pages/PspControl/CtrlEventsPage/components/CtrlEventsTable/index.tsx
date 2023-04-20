import { FC, useEffect } from "react";
import { AgGridTable } from "../../../../../components/AgGridTable";
import { CtrlEventsItem } from "../../types";
import { TableColumns } from "./constants";

interface CtrlEventsTableProps {
  eventsList: CtrlEventsItem[];
}
export const CtrlEventsTable: FC<CtrlEventsTableProps> = ({ eventsList }) => {
  return (
    <AgGridTable
      defaultColDef={{
        sortable: true,
        resizable: true,
      }}
      rowData={eventsList}
      columnDefs={TableColumns}
    />
  );
};
