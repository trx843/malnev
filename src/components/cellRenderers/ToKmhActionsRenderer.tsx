import { ICellRendererParams } from "ag-grid-community";
import React, { FunctionComponent } from "react";
import { ControlMaintEvents, Event } from "../../classes";
import { Col, Row } from "antd";
import { ReportButton } from "./ReportButton";
import { ProtocolReportButton } from "./ProtocolReportButton";
import { FileButton } from "./FileButton";
import { ActionsEnum, Can } from "../../casl";
import { elementId, ToKmhElements } from "../../pages/ToKmh/constant";

export const ToKmhActionsRenderer: FunctionComponent<ICellRendererParams> = (
  props: ICellRendererParams
) => {
  const item = props.data as ControlMaintEvents;
  return (
    <Row gutter={10}>
      <Col>
        <Can
          I={ActionsEnum.View}
          a={elementId(
            ToKmhElements[ToKmhElements.ViewReport]
          )}
        >
          <ReportButton data={item} />
        </Can>
      </Col>
      <Col>
        <Can
          I={ActionsEnum.View}
          a={elementId(
            ToKmhElements[ToKmhElements.ViewProtocol]
          )}
        >
          <ProtocolReportButton data={item} />
        </Can>
      </Col>
      <Col>
      <Can
          I={ActionsEnum.View}
          a={elementId(
            ToKmhElements[ToKmhElements.DownloadFile]
          )}
        >
        <FileButton data={item} />
        </Can>
      </Col> 
    </Row>
  );
};
