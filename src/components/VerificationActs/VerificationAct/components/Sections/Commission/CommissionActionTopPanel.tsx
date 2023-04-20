import React, { FC } from "react";
import { Button } from "antd";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import { useVerificationModals } from "../../Provider";
import { useActStatusPermission } from "../../../hooks/useActStatusPermission";
import { ActionsEnum, Can } from "../../../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";
import { useSelector } from "react-redux";
import { StateType } from "types";
import { VerificationActStore } from "slices/verificationActs/verificationAct/types";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

export const CommissionActionTopPanel: FC = () => {
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
  return (
    <>
      <Can
        I={ActionsEnum.View}
        a={elementId(VerificationActsElements[VerificationActsElements.AddCommitteeMember])}
      >
        <Button
          type="link"
          icon={<PlusCircleFilled />}
          onClick={() => modalsState.onToggleCreateModal(true)}
          disabled={buttonProps.disabled || isOperationDisabled}
        >
          Добавить
        </Button>
      </Can>
    </>
  );
};
