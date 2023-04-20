import React, { FC, useContext } from "react";
import { Col, Row } from "antd";
import { EditButton } from "../EditButton";
import { AbilityContext, ActionsEnum } from "../../../casl";
import {
  EditorSiElements,
  elementId,
} from "../../../pages/EditorSiPage/constant";
import { EditorSiMapItem } from "../../../classes";

interface IEditorBindingSiEditProps {
  data: EditorSiMapItem;
  clicked: (obj: any) => void;
  flagSelector?: (item: any) => boolean;
}

export const SiBindingEditActionsRenderer: FC<IEditorBindingSiEditProps> = ({
  data,
  clicked,
  flagSelector
}) => {
  const ability = useContext(AbilityContext);

  return (
    <Row>
      <Col>
        <EditButton
          data={data}
          clicked={clicked}
          flagSelector={flagSelector}
          abilityDisabled={ability.cannot(
            ActionsEnum.View,
            elementId(EditorSiElements[EditorSiElements.SiEdit])
          )}
        />
      </Col>
    </Row>
  );
};
