import React, { FC } from "react";
import { Button } from "antd";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import { useVerificationModals } from "../../Provider";
import { useActStatusPermission } from "../../../hooks/useActStatusPermission";
import { ActionsEnum, Can } from "../../../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";

export const OtherSidesTopAction: FC = () => {
  const modalsState = useVerificationModals();
  const buttonProps = useActStatusPermission();
  return (
    <>
      <Can
        I={ActionsEnum.View}
        a={elementId(VerificationActsElements[VerificationActsElements.AddCamp])}
      >
        <Button
          type="link"
          icon={<PlusCircleFilled />}
          onClick={() => modalsState.onToggleCreateModal(true)}
          disabled={buttonProps.disabled}
        >
          Добавить сторону
        </Button>
      </Can>
    </>
  );
};
