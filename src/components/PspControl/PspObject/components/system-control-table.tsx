import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgGridColumn } from "ag-grid-react/lib/agGridColumn";

import { TableCard } from "../../../../styles/commonStyledComponents";

import { IdType, StateType } from "types";
import { ICheckingObjectsStore } from "slices/pspControl/checkingObjects";
import { getPspSystemControlObjectThunk } from "thunks/pspControl";
import { AgGridTable } from "components/AgGridTable";
import { AccreditationColumn } from "./AccreditationColumn";
import { RendererProps } from "components/ItemsTable";
import { OsusItem } from "../classes";
import { Tooltip } from "antd";

interface PspSystemControlTableObjectProps {
  pspId: IdType;
}

export const PspSystemControlTableObject: FC<
  PspSystemControlTableObjectProps
> = ({ pspId }) => {
  const { osusItems } = useSelector<StateType, ICheckingObjectsStore>(
    (state) => state.checkingObjects
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (pspId) {
      dispatch(getPspSystemControlObjectThunk({ id: pspId }));
    }
  }, [pspId]);

  const staticCellStyle = { wordBreak: "break-word", lineHeight: "23px" };

  return (
    <TableCard className="psp-page__table psp-page__system-table">
      <AgGridTable
        rowData={osusItems[String(pspId).toLowerCase()] || []}
        suppressRowTransform={true}
        defaultColDef={{
          autoHeight: true,
          wrapText: true,
          cellStyle: staticCellStyle,
          resizable: true,
          filter: true,
          sortable: true,
        }}
        isAutoSizeColumns={false}
        onModelUpdated={() => {}}
      >
        <AgGridColumn
          headerName="Система учета"
          field="osuShortName"
          minWidth={296}
          tooltipField="osuShortName"
          cellRendererFramework={(item: RendererProps<OsusItem>) =>
            item.data.isDeleted ? (
              <Tooltip title="Объект удален из БДМИ">
                <div style={{ color: "red" }}>{item.data.osuShortName}</div>
              </Tooltip>
            ) : (
              <div>{item.data.osuShortName}</div>
            )
          }
        />
        <AgGridColumn
          headerName="Тип системы учета/ИЛ"
          field="osuType"
          minWidth={180}
          tooltipField="osuType"
        />
        <AgGridColumn
          headerName="Владелец"
          field="osuOwner"
          minWidth={176}
          tooltipField="osuOwner"
        />
        <AgGridColumn
          headerName="Принадлежность к компании"
          field="osuAffiliation"
          minWidth={256}
          tooltipField="osuAffiliation"
        />
        <AgGridColumn
          headerName="Назначение"
          field="osuPurpose"
          minWidth={132}
          tooltipField="osuPurpose"
        />
        <AgGridColumn
          headerName="Собственный/сторонний"
          field="owned"
          minWidth={222}
          tooltipField="owned"
        />
        <AgGridColumn
          headerName="Транспортируемый продукт"
          field="transportedProduct"
          minWidth={246}
          tooltipField="transportedProduct"
        />
        <AgGridColumn
          headerName="Территориальное расположение"
          field="territorialLocation"
          minWidth={277}
          tooltipField="territorialLocation"
        />
        <AgGridColumn
          headerName="Принимающая сторона"
          field="receive"
          minWidth={212}
          tooltipField="receive"
        />
        <AgGridColumn
          headerName="Сдающая сторона"
          field="send"
          minWidth={224}
          tooltipField="send"
        />
        <AgGridColumn
          headerName="ОСУ"
          field="osuName"
          minWidth={220}
          tooltipField="osuName"
        />
        <AgGridColumn
          headerName="РСУ"
          field="rsuName"
          minWidth={220}
          tooltipField="rsuName"
        />
        <AgGridColumn
          headerName="Aккредитация"
          field="isAccredited"
          cellRendererFramework={AccreditationColumn}
          minWidth={180}
          tooltipField="isAccredited"
        />
      </AgGridTable>
    </TableCard>
  );
};
