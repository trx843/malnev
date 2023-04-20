import React, { FC, useContext } from "react";
import { Col, Row } from "antd";
import { EditButton } from "../EditButton";
import { AbilityContext, ActionsEnum } from "../../../casl";
import {
  EditorSiElements,
  elementId,
} from "../../../pages/EditorSiPage/constant";
import { SiModel } from "../../../classes";

interface IEditorModelSiEditProps {
  data: SiModel;
  clicked: (obj: any) => void;
  flagSelector?: (item: any) => boolean;
}

export const SiModelEditActionsRenderer: FC<IEditorModelSiEditProps> = ({
  data,
  clicked,
  flagSelector,
}) => {
  const ability = useContext(AbilityContext);

  return (
    <Row>
      <Col>
        <EditButton
          flagSelector={flagSelector}
          data={data}
          clicked={clicked}
          abilityDisabled={ability.cannot(
            ActionsEnum.View,
            elementId(EditorSiElements[EditorSiElements.SiEdit])
          )}
        />
      </Col>
    </Row>
  );
};
