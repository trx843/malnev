import { ICellRendererParams } from "ag-grid-community";
import React, { FunctionComponent } from "react";
import { Col, Row } from "antd";
import { CoefReportButton } from "./CoefReportButton";
import { CoefChangeEventSigns } from "../../classes/CoefChangeEventSigns";
import { ActionsEnum, Can } from "../../casl";
import { CoefsElements, elementId } from "../../pages/Coefs/constant";

export const CoefActionsRenderer: FunctionComponent<ICellRendererParams> = (
  props: ICellRendererParams
) => {
   
  const item = props.data as CoefChangeEventSigns;

  return (
    <Row gutter={10}>
      <Col>
        <Can
          I={ActionsEnum.View}
          a={elementId(
            CoefsElements[CoefsElements.ViewReport]
          )}  
        >
          <CoefReportButton data={item} />
        </Can>
      </Col>
    </Row>
  );
};
