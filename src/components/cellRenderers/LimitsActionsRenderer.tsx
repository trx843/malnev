import { ICellRendererParams } from "ag-grid-community";
import React, { FunctionComponent, useContext } from "react";
import { Col, Row } from "antd";
import { EditButton } from "./EditButton";
import { HistoryLimitButton } from "./HistoryLimitButton";
import { SiEquipmentLimits } from "../../classes/SiEquipmentLimits";
import { AbilityContext, ActionsEnum, Can } from "../../casl";
import {
  elementId,
  SiEquipmentLimitsElements,
} from "../../pages/SiEquipmentLimits/constant";

interface ILimitsActionsProps {
  data: SiEquipmentLimits;
  clicked: (obj: any) => void;
  flagSelector: (item: any) => boolean;
  isSikn: boolean;
}

export const LimitsActionsRenderer: FunctionComponent<ILimitsActionsProps> = (
  props: ILimitsActionsProps
) => {
  const ability = useContext(AbilityContext);

  const item = props.data;

  return (
    <Row gutter={10}>
      <Col>
        <EditButton
          data={item}
          clicked={props.clicked}
          flagSelector={props.flagSelector}
          abilityDisabled={ability.cannot(
            ActionsEnum.View,
            elementId(
              SiEquipmentLimitsElements[SiEquipmentLimitsElements.MeasEdit]
            )
          )}
        />
      </Col>
      <Col>
        <Can
          I={ActionsEnum.View}
          a={elementId(
            SiEquipmentLimitsElements[SiEquipmentLimitsElements.MeasHistory]
          )}
        >
          <HistoryLimitButton data={item} isSikn={props.isSikn} />
        </Can>
      </Col>
    </Row>
  );
};
