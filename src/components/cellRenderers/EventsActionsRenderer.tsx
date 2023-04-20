import { ICellRendererParams } from "ag-grid-community";
import React, { FunctionComponent } from "react";
import { Event } from "../../classes";
import { Col, Row } from "antd";
import { PiVisionButton } from "./PiVisionButton";
import { OrgStructureButton } from "./OrgStructureButton";

export const EventsActionsRenderer: FunctionComponent<ICellRendererParams> = (
  props: ICellRendererParams
) => {
  const item = props.data as Event;
  return (
    <Row gutter={10}>
      <Col>
        <PiVisionButton data={item} />
      </Col>
      <Col>
        <OrgStructureButton data={item} />
      </Col>
    </Row>
  );
};
