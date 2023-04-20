import { ICellRendererParams } from "ag-grid-community";
import React, { FunctionComponent, useContext } from "react";
import { Failures } from "../../classes";
import { Col, Row } from "antd";
import { PiVisionButton } from "./PiVisionButton";
import { EditButton } from "./EditButton";
import { AbilityContext, ActionsEnum, Can } from "../../casl";
import { elementId, FailuresElements } from "../../pages/Failures/constant";

interface IFailuresActionsProps {
  data: Failures;
  clicked: (obj: any) => void;
  flagSelector: (item: any) => boolean;
}

export const FailuresActionsRenderer: FunctionComponent<IFailuresActionsProps> =
  (props: IFailuresActionsProps) => {

    const ability = useContext(AbilityContext);

    const item = props.data;
    
    return (
      <Row gutter={10}>
        <Col>
          <EditButton
            data={item}
            clicked={props.clicked} /*flagSelector={props.flagSelector*/
            abilityDisabled={
              ability.cannot(
                ActionsEnum.View,
                elementId(FailuresElements[FailuresElements.FailureEdit])
              )
            }
          />
        </Col>
        <Col>
          <Can
            I={ActionsEnum.View}
            a={elementId(
              FailuresElements[FailuresElements.PiVisionTrend]
            )}
          >
            <PiVisionButton data={item} />
          </Can>
        </Col>
      </Row>
    );
  };
