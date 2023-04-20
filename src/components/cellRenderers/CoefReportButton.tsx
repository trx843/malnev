import React, { Component } from "react";
import { Button, Tooltip } from "antd";
import ContainerOutlined from "@ant-design/icons/ContainerOutlined";
import { config } from "../../utils";

interface ICoefReportButtonProps {
  data: any;
}

export class CoefReportButton extends Component<ICoefReportButtonProps> {
  constructor(props: ICoefReportButtonProps) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    const item = this.props.data;
    const url: string = `${config.buttons.report}${item.eventFrameId}`;
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
            onClick={this.clickHandler}
            style={{ width: "100%" }}
            icon={<ContainerOutlined />}
          />
        </Tooltip>
      </div>
    );
  }
}
