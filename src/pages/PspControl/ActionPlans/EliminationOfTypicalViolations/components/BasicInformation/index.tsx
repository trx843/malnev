import React from "react";
import { useSelector } from "react-redux";
import classNames from "classnames/bind";
import { Button, Tooltip, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Nullable, StateType } from "types";
import { ActionPlanTypicalViolationsStore } from "slices/pspControl/actionPlanTypicalViolations/types";
import { getDataRange } from "./utils";
import { IFormValues } from "../ModalPlanEditing/types";
import { FormFields } from "../ModalPlanEditing/constants";
import { ModalModes } from "enums";
import styles from "./filterBasicInformation.module.css";

const { Title } = Typography;

const cx = classNames.bind(styles);

interface IProps {
  handleChangePlanName: (
    payload: Nullable<IFormValues>,
    mode: ModalModes
  ) => void;
}

export const BasicInformation: React.FC<IProps> = ({
  handleChangePlanName,
}) => {
  const { typicalPlanCard } = useSelector<
    StateType,
    ActionPlanTypicalViolationsStore
  >((state) => state.actionPlanTypicalViolations);

  const [verificationPeriodFrom, verificationPeriodBy] =
    getDataRange(typicalPlanCard);

  return (
    <div className={cx("wrapper")}>
      <Title level={3}>Основные сведения</Title>

      <div className={cx("info")}>
        <div>
          <p className={cx("date-text")}>Период проверки с</p>
          <p>{verificationPeriodFrom || "Н/д"}</p>
          <p className={cx("date-text")}>Период проверки по</p>
          <p>{verificationPeriodBy || "Н/д"}</p>
        </div>

        <Tooltip title="Редактировать">
          <Button
            onClick={() =>
              handleChangePlanName(
                {
                  [FormFields.verificationPeriodFrom]: verificationPeriodFrom,
                  [FormFields.verificationPeriodFor]: verificationPeriodBy,
                },
                ModalModes.create
              )
            }
            icon={<EditOutlined />}
            type="link"
          />
        </Tooltip>
      </div>
    </div>
  );
};
