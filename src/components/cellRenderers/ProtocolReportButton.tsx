import React, { Component } from "react";
import { Button, Tooltip } from "antd";
import FileDoneOutlined from "@ant-design/icons/FileDoneOutlined";
import { config } from "../../utils";
import { ControlMaintEvents } from "../../classes";
interface IProtocolReportButtonProps {
  data: ControlMaintEvents;
}

interface IProtocolReportButtonState {
  disabled: boolean;
}

export class ProtocolReportButton extends Component<
  IProtocolReportButtonProps,
  IProtocolReportButtonState
> {
  constructor(props: IProtocolReportButtonProps) {
    super(props);
    this.state = {
      disabled: this.props.data.protocolNum === null,
    };
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    const item = this.props.data;
    const url: string = `${config.buttons.protocolReport}${item.id}`;
    console.log(url);
    window.open(url, "_blank");
  }

  render() {
    return (
      <div>
        <Tooltip
          arrowPointAtCenter
          title={<span style={{ color: "black" }}>Посмотреть протокол</span>}
          color="#ffffff"
          placement="bottomLeft"
        >
          <Button
            type={"link"}
            disabled={this.state.disabled}
            onClick={this.clickHandler}
            style={{ width: "100%" }}
            icon={<FileDoneOutlined />}
          />
        </Tooltip>
      </div>
    );
  }
}
