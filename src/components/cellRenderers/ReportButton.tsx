import React, { Component } from "react";
import { Button, Tooltip } from "antd";
import ContainerOutlined from "@ant-design/icons/ContainerOutlined";
import { config } from "../../utils";
import { ControlMaintEvents } from "../../classes";
interface IReportButtomProps {
  data: ControlMaintEvents;
}

interface IReportButtomState {
  disabled: boolean;
}

export class ReportButton extends Component<
  IReportButtomProps,
  IReportButtomState
> {
  constructor(props: IReportButtomProps) {
    super(props);
    this.state = {
      disabled: this.props.data.coefChangeEventFrameId === null,
    };
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    const item = this.props.data;
    const url: string = `${config.buttons.report}${item.coefChangeEventFrameId}`;
    console.log(url);
    window.open(url, "_blank");
  }

  render() {
    return (
      <div>
        <Tooltip
          arrowPointAtCenter
          title={<span style={{ color: "black" }}>Посмотреть отчет</span>}
          color="#ffffff"
          placement="bottomLeft"
        >
          <Button
            type={"link"}
            disabled={this.state.disabled}
            onClick={this.clickHandler}
            style={{ width: "100%" }}
            icon={<ContainerOutlined />}
          />
        </Tooltip>
      </div>
    );
  }
}
