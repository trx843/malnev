import React from "react";
import classNames from "classnames/bind";
import styles from "./statusColumn.module.css";
import { EliminateStatusEnum } from "./enums";

const cx = classNames.bind(styles);

interface IProps {
  data: any;
}

export const StatusColumn: React.FC<IProps> = ({ data }) => {
  return (
    <div
      className={
        data.actionPlan_eliminateStatusId === EliminateStatusEnum.Expired || data.actionPlan_isDeclined
          ? cx("red-text")
          : ""
      }
    >
      {data.actionPlan_isDeclined
        ? "Отклонено"
        : data.actionPlan_eliminateStatusText}
    </div>
  );
};
