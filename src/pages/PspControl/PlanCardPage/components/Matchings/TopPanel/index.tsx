import { FC } from "react";
import { PlusCircleFilled, UnorderedListOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useSelector } from "react-redux";

import { useModals } from "components/ModalProvider";

import { MatchingModals } from "../constants";
import { StateType } from "types";
import { IPlanCardStore } from "slices/pspControl/planCard";
import { isOperationButtonDisabled } from "pages/PspControl/PlanCardPage/utils";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

export const MatchingTopPanel: FC = () => {
  const { planCardInfo } = useSelector<StateType, IPlanCardStore>(
    (state) => state.planCard
  );
  const { isUserAllowedOst } = useSelector<
    StateType,
    HomeStateType
  >((state) => state.home);


  const planStatusId = planCardInfo?.planStatusId;

  const { setModal } = useModals();

  const handleAdd = () => {
    setModal({
      type: MatchingModals.ADD_MODAL,
      payload: {},
    });
  };

  const handleSort = () => {
    setModal({
      type: MatchingModals.SORT_MODAL,
      payload: {},
    });
  };

  return (
    <>
      <Button
        type="link"
        icon={<PlusCircleFilled />}
        onClick={handleAdd}
        disabled={isOperationButtonDisabled(planStatusId)}
      >
        Добавить согласующего
      </Button>

      <Button
        className="ais-table-actions__item"
        icon={<UnorderedListOutlined />}
        type="link"
        onClick={handleSort}
        disabled={isOperationButtonDisabled(planStatusId)}
      >
        Изменить порядок
      </Button>
    </>
  );
};
