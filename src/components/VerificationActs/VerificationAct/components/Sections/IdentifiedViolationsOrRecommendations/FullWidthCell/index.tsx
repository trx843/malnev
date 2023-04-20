import { FC, useEffect } from "react";
import classNames from "classnames/bind";

import styles from "./style.module.css";
import { useVerificationModals } from "../../../Provider";
import { ViolationActModals } from "../constants";
import { VerticalAlignMiddleOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import {
  IViolationListItemModel,
  IViolationListModel,
} from "slices/verificationActs/verificationAct/types";
import { useSelector } from "react-redux";
import { verificationLevelHandler } from "utils";
import { useActStatusPermission } from "components/VerificationActs/VerificationAct/hooks/useActStatusPermission";
import { StateType } from "types";
import { HomeStateType } from "slices/home";

const cx = classNames.bind(styles);

interface FullWidthCell {
  data: { _fullWidthRowName: string; id: string } & IViolationListModel;
}

export const FullWidthCell: FC<FullWidthCell> = ({ data }) => {
  const modalsState = useVerificationModals();

  const { isUserAllowedOst } = useSelector<StateType, HomeStateType>(
    (state) => state.home
  );

  const isOperationDisabled = verificationLevelHandler(
    isUserAllowedOst,
    data?.verificationLevelId
  );

  const buttonProps = useActStatusPermission();

  useEffect(() => {
    console.log("isUserAllowedOst", isUserAllowedOst);
    console.log("data", data);
    console.log("buttonProps", buttonProps);
  }, []);

  const handleChangeOrder = () => {
    modalsState.setModal({
      visible: true,
      payload: data.areaOfResponsibility,
      type: ViolationActModals.CHANGE_AREA_VIOLATION_ORDER_MODAL,
    });
  };

  return (
    <div className={cx("full-width-cell")}>
      <p className={cx("full-width-cell__title")}>{data._fullWidthRowName}</p>
      <div>
        <Tooltip title="Изменить порядок">
          <Button
            className="ais-table-actions__item"
            icon={<VerticalAlignMiddleOutlined />}
            type="link"
            onClick={handleChangeOrder}
            disabled={buttonProps.disabled || isOperationDisabled}
          />
        </Tooltip>
      </div>
    </div>
  );
};
