import { Button } from "antd";
import React, { Component } from "react";
import InfoCircleOutlined from "@ant-design/icons/lib/icons/InfoCircleOutlined";

interface IEditButtonProps {
  data: any;
  clicked: (obj: any) => void;
}

export class DataSiInfoButton extends Component<IEditButtonProps> {
  constructor(props: IEditButtonProps) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    this.props.clicked(this.props.data);
  }

  render() {
    return (
      <div>
        <Button
          type={"link"}
          onClick={this.clickHandler}
          style={{ width: "100%" }}
          icon={<InfoCircleOutlined />}
        />
      </div>
    );
  }
}
