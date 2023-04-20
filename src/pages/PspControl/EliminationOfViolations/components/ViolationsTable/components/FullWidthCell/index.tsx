import React from "react";
import classNames from "classnames/bind";
import { Button, Tooltip } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import { Nullable } from "../../../../../../../types";
import { IVerificationInformationInfo } from "../../types";
import styles from "./fullWidthCell.module.css";
import { ActionsEnum, Can } from "../../../../../../../casl";
import { elementId, EliminationOfViolationsElements } from "pages/PspControl/EliminationOfViolations/constants";

const cx = classNames.bind(styles);

interface IProps {
  data: any;
  handleToggleModalVerificationInformation: (
    info: Nullable<IVerificationInformationInfo>
  ) => void;
}

export class FullWidthCell extends React.Component<IProps> {
  getReactContainerStyle() {
    return {
      display: "block",
      height: "100%",
    };
  }

  render() {
    const { handleToggleModalVerificationInformation } = this.props;
    const { _fullWidthCellName, _actId, _actName } = this.props.data;

    return (
      <div className={cx("wrapper")}>
        <Tooltip title={_fullWidthCellName}>
          <p className={cx("title")}>{_fullWidthCellName}</p>
        </Tooltip>
        <Can
          I={ActionsEnum.View}
          a={elementId(EliminationOfViolationsElements[EliminationOfViolationsElements.CheckInfo])}
        >
          <Tooltip title="Информация о проверке">
            <Button
              className={cx("blue-button")}
              onClick={() =>
                handleToggleModalVerificationInformation({
                  id: _actId,
                  title: _actName,
                })
              }
              icon={<FileSearchOutlined />}
              type="link"
            />
          </Tooltip>
        </Can>
      </div>
    );
  }
}
