import { FC } from "react";
import { Button, Tooltip } from "antd";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";

import { useVerificationModals } from "../../Provider";
import { useActStatusPermission } from "../../../hooks/useActStatusPermission";
import { RecommendationsTypeModals } from "./constants";
import { VerticalAlignMiddleOutlined } from "@ant-design/icons";
import { ActionsEnum, Can } from "../../../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";
import { useSelector } from "react-redux";
import { StateType } from "types";
import { VerificationActStore } from "slices/verificationActs/verificationAct/types";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

export const RecommendationsActionTopPanel: FC = () => {
  const { act } = useSelector<StateType, VerificationActStore>(
    state => state.verificationAct
  );
  const { isUserAllowedOst } = useSelector<
    StateType,
    HomeStateType
  >((state) => state.home);

  const isOperationDisabled = verificationLevelHandler(isUserAllowedOst, act?.verificationLevelId);

  const modalsState = useVerificationModals();
  const buttonProps = useActStatusPermission();

  const handleAdd = () => {
    modalsState.setModal({
      type: RecommendationsTypeModals.NEW_RECOMMENDATION_MODAL,
      visible: true,
      payload: {},
    });
  }

  const handleOrderViolations = () => {
    modalsState.setModal({
      type: RecommendationsTypeModals.ORDER_RECOMMENDATION_MODAL,
      visible: true,
      payload: {},
    });
  };

  return (
    <>
      <Can
        I={ActionsEnum.View}
        a={elementId(VerificationActsElements[VerificationActsElements.AddRecomendation])}
      >
        <Button
          type="link"
          icon={<PlusCircleFilled />}
          onClick={handleAdd}
          disabled={buttonProps.disabled || isOperationDisabled}
        >
          Добавить рекомендацию
        </Button>
      </Can>
      <Tooltip title="Изменить порядок">
        <Button
          className="ais-table-actions__item"
          icon={<VerticalAlignMiddleOutlined />}
          type="link"
          onClick={handleOrderViolations}
          disabled={buttonProps.disabled || isOperationDisabled}
        >
          Изменить порядок
        </Button>
      </Tooltip>
    </>
  );
};
