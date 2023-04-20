import React from "react";
import classNames from "classnames/bind";
import styles from "./fullWidthCell.module.css";
import { Tooltip } from "antd";

const cx = classNames.bind(styles);

interface IProps {
  data: any;
}

export class FullWidthCell extends React.Component<IProps> {
  getReactContainerStyle() {
    return {
      display: "block",
      height: "100%",
    };
  }

  render() {
    const { _fullWidthCellName } = this.props.data;

    return (
      <div className={cx("wrapper")}>
        <Tooltip title={_fullWidthCellName}>
          <p className={cx("title")}>{_fullWidthCellName}</p>
        </Tooltip>
      </div>
    );
  }
}
