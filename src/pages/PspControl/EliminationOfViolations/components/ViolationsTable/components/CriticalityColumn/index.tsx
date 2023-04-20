import React from "react";
import classNames from "classnames/bind";
import { Button, Tooltip } from "antd";
import {
  ClockCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { EliminationColors } from "../../../../../../../thunks/pspControl/eliminationOfViolations/constants";
import { getCriticalityTitle } from "./utils";
import styles from "./criticalityColumn.module.css";

const cx = classNames.bind(styles);

interface IProps {
  data: any;
}

const CriticalityIcons = {
  [EliminationColors.ApproachingColor]: <InfoCircleOutlined />,
  [EliminationColors.ExpireColor]: <CloseCircleOutlined />,
  [EliminationColors.None]: <ClockCircleOutlined />,
};

export const CriticalityColumn: React.FC<IProps> = ({ data }) => {
  const eliminationColorType =
    data.actionPlan_eliminationColorType as EliminationColors;

  return (
    <Tooltip title={getCriticalityTitle(eliminationColorType)}>
      <Button
        className={cx({
          [cx("elimination-approaching")]:
            eliminationColorType === EliminationColors.ApproachingColor,
          [cx("elimination-expire")]:
            eliminationColorType === EliminationColors.ExpireColor,
          [cx("elimination-default")]:
            eliminationColorType === EliminationColors.None,
        })}
        icon={CriticalityIcons[eliminationColorType]}
        type="link"
      />
    </Tooltip>
  );
};
