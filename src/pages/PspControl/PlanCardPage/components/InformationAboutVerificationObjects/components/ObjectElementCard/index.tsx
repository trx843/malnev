import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./objectElementCard.module.css";

const cx = classNames.bind(styles);

interface IProps {
  title: string;
  value: any;
  to?: string;
}

export const ObjectElementCard: React.FC<IProps> = ({ title, value, to }) => {
  const adjustValue = value || "Н/д";

  return (
    <div className={cx("item")}>
      <p className={cx("title")}>{title}</p>
      {to ? (
        <Link className={cx("value", "value_link")} to={to as string}>
          {adjustValue}
        </Link>
      ) : (
        <p className={cx("value")}>{adjustValue}</p>
      )}
    </div>
  );
};
