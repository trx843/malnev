import React from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { Button, Popconfirm, Tooltip } from "antd";
import ScheduleOutlined from "@ant-design/icons/ScheduleOutlined";
import { createPlan } from "thunks/verificationActs";
import { ActionsEnum, Can } from "../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";
import { VerificationItem } from "components/VerificationActs/classes";
import { StatusesIds } from "../../../../enums";
import styles from "./createPlanAction.module.css";
import { StateType } from "types";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

const cx = classNames.bind(styles);

interface IProps {
  data: VerificationItem;
  hasNotClassifiyedViolation: boolean;
}

export const CreatePlanAction: React.FC<IProps> = ({ data, hasNotClassifiyedViolation }) => {
  const { isUserAllowedOst } = useSelector<
    StateType,
    HomeStateType
  >((state) => state.home);


  const dispatch = useDispatch();

  const actId = data.id.toString();
  const verificationStatusId = data.verificationStatusId;
  const planId = data.planId;

  const isButtonDisabled =
    !!(verificationStatusId !== StatusesIds.Signed || planId);

  return (
    <Can
      I={ActionsEnum.View}
      a={elementId(VerificationActsElements[VerificationActsElements.CreatePlan])}
    >
      <Popconfirm
        onConfirm={() => dispatch(createPlan(actId))}
        okText="Создать"
        cancelText="Отмена"
        title={
          <React.Fragment>
            <p className={cx("popconfirm-title")}>Подтверждение</p>
            <p className={cx("popconfirm-text")}>
              Вы уверены, что хотите создать план?
            </p>
          </React.Fragment>
        }
        disabled={isButtonDisabled || hasNotClassifiyedViolation}
      >
        <Tooltip title={hasNotClassifiyedViolation ? "Невозможно создать план, пока не классифицированы все нарушения в акте" : "Создать план"}>
          <Button
            icon={<ScheduleOutlined />}
            disabled={isButtonDisabled || hasNotClassifiyedViolation}
            type="link"
          />
        </Tooltip>
      </Popconfirm>
    </Can>
  );
};
