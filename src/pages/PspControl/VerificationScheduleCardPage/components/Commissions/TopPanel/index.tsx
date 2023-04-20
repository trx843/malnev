import { FC } from "react";
import { PlusCircleFilled, UnorderedListOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useSelector } from "react-redux";

import { useModals } from "components/ModalProvider";

import { VerificationCommissionModals } from "../../../constants";
import { StateType } from "types";
import { StatusesIds } from "../../../../../../enums";
import { IVerificationScheduleCardStore } from "slices/pspControl/verificationScheduleCard";
import { isOperationButtonDisabled } from "pages/PspControl/VerificationScheduleCardPage/utils";
import { Can } from "../../../../../../casl";
import { ActionsEnum } from "../../../../../../casl";
import { elementId, VerificationScheduleElements } from "pages/PspControl/VerificationSchedulePage/constant";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

export const CommissionTopPanel: FC = () => {
  const { verificationScheduleCardInfo } = useSelector<
    StateType,
    IVerificationScheduleCardStore
  >((state) => state.verificationScheduleCard);
  const { isUserAllowedOst } = useSelector<
    StateType,
    HomeStateType
  >((state) => state.home);

  const isOperationDisabled = verificationLevelHandler(isUserAllowedOst, verificationScheduleCardInfo?.verificationLevel);

  const verificationStatusId = verificationScheduleCardInfo?.verificationStatusId;

  const { setModal } = useModals();

  const handleAdd = () => {
    setModal({
      type: VerificationCommissionModals.ADD_MODAL,
      payload: {},
    });
  };

  const handleSort = () => {
    setModal({
      type: VerificationCommissionModals.SORT_MODAL,
      payload: {},
    });
  };

  return (
    <>
      <Can
        I={ActionsEnum.View}
        a={elementId(
          VerificationScheduleElements[VerificationScheduleElements.AddApprover]
        )}
      >
        <Button
          type="link"
          icon={<PlusCircleFilled />}
          onClick={handleAdd}
          disabled={isOperationButtonDisabled(verificationStatusId) || isOperationDisabled}
        >
          Добавить согласующего
        </Button>
      </Can>

      <Can
        I={ActionsEnum.View}
        a={elementId(
          VerificationScheduleElements[VerificationScheduleElements.ChangeOrder]
        )}
      >
        <Button
          className="ais-table-actions__item"
          icon={<UnorderedListOutlined />}
          type="link"
          onClick={handleSort}
          disabled={isOperationButtonDisabled(verificationStatusId) || isOperationDisabled}
        >
          Изменить порядок
        </Button>
      </Can>
    </>
  );
};
