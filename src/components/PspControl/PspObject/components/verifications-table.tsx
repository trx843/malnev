import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AgGridColumn } from "ag-grid-react/lib/agGridColumn";

import { TableCard } from "../../../../styles/commonStyledComponents";
import { RendererProps } from "../../../ItemsTable";

import { ChecksObjectItem } from "../classes";
import { IdType, StateType } from "types";
import { ICheckingObjectsStore } from "slices/pspControl/checkingObjects";
import { getPspVerificationObjectThunk } from "thunks/pspControl";

import { AgGridTable } from "components/AgGridTable";
import { Tooltip, Typography } from "antd";

interface PspVerificationsTableProps {
  pspId: IdType;
}

export const PspVerificationsTableObject: FC<PspVerificationsTableProps> = ({
  pspId,
}) => {
  const { verificationItems } = useSelector<StateType, ICheckingObjectsStore>(
    (state) => state.checkingObjects
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (pspId) {
      dispatch(getPspVerificationObjectThunk({ id: pspId }));
    }
  }, [pspId]);

  const renderCellLinkSchedules = (field: RendererProps<ChecksObjectItem>) => (
    <div className={"psp-page__render-field"}>
      <Link
        className="psp-page__cell-link"
        to={`/pspcontrol/verification-schedule/${field.data.verificationSchedulesId}`}
      >
        <Tooltip
          arrowPointAtCenter
          title={
            <span style={{ color: "black" }}>
              {field.data.verificationSchedulesName}
            </span>
          }
          color="#ffffff"
          placement="bottomLeft"
        >
          {field.data.verificationSchedulesName}
        </Tooltip>
      </Link>
    </div>
  );

  const renderCellLinkPlan = (field: RendererProps<ChecksObjectItem>) => (
    <div className={"psp-page__render-field"}>
      <Link
        className="psp-page__cell-link"
        to={`/pspcontrol/action-plans/cards/${field.data.planId}`}
      >
        <Tooltip
          arrowPointAtCenter
          title={<span style={{ color: "black" }}>{field.data.planName}</span>}
          color="#ffffff"
          placement="bottomLeft"
        >
          {field.data.planName}
        </Tooltip>
      </Link>
    </div>
  );

  const renderCellLinkAct = (field: RendererProps<ChecksObjectItem>) => (
    <div className={"psp-page__render-field"}>
      <Link
        className="psp-page__cell-link"
        to={`/pspcontrol/verification-acts/${field.data.actId}`}
      >
        <Tooltip
          arrowPointAtCenter
          title={<span style={{ color: "black" }}>{field.data.actName}</span>}
          color="#ffffff"
          placement="bottomLeft"
        >
          {field.data.actName}
        </Tooltip>
      </Link>
    </div>
  );

  const renderField = (field: RendererProps<ChecksObjectItem>) => (
    <div className={"psp-page__render-field"}>
      <Tooltip
        arrowPointAtCenter
        title={<span style={{ color: "black" }}>{field.value}</span>}
        color="#ffffff"
        placement="bottomLeft"
      >
        <Typography.Text className="psp-page__cell-text">
          {field.value}
        </Typography.Text>
      </Tooltip>
    </div>
  );


  return (
    <TableCard className="psp-page__table">
      <AgGridTable
        rowData={verificationItems[String(pspId).toLowerCase()] || []}
        suppressRowTransform={true}
        defaultColDef={{
          resizable: true,
          filter: true,
          sortable: true,
        }}
        isAutoSizeColumns={false}
      >
        <AgGridColumn
          headerName="Тип проверки"
          field="checkType"
          cellRendererFramework={renderField}
          minWidth={270}
        />
        <AgGridColumn
          headerName="Уровень проверки"
          field="verificationLevel"
          minWidth={179}
        />
        <AgGridColumn
          headerName="Дата проверки"
          field="verificationDate"
          cellRendererFramework={(props: RendererProps<any>) => (
            <Typography.Text>{props.value}</Typography.Text>
          )}
          minWidth={197}
        />
        <AgGridColumn
          headerName="График проверки"
          field="verificationSchedulesId"
          cellRendererFramework={renderCellLinkSchedules}
          minWidth={283}
          valueGetter={(params) => params.data.verificationSchedulesName}

        />
        <AgGridColumn
          headerName="Акт/отчет проверки"
          field="actId"
          cellRendererFramework={renderCellLinkAct}
          minWidth={425}
          valueGetter={(params) => params.data.actName}

        />
        <AgGridColumn
          headerName="План мероприятий"
          field="planId"
          minWidth={425}
          cellRendererFramework={renderCellLinkPlan}
          valueGetter={(params) => params.data.planName}
        />
      </AgGridTable>
    </TableCard>
  );
};
