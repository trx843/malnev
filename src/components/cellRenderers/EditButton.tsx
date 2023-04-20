import { Button, Tooltip } from "antd";
import EditOutlined from "@ant-design/icons/EditOutlined";
import React, { Component } from "react";

interface IEditButtonProps {
  data: any;
  clicked: (obj: any) => void;
  flagSelector?: (item: any) => boolean;
  abilityDisabled?: boolean;
}

export class EditButton extends Component<IEditButtonProps> {
  constructor(props: IEditButtonProps) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    this.props.clicked(this.props.data);
  }

  render() {
    const disabled = this.props.flagSelector
      ? this.props.flagSelector(this.props.data)
      : false;
    return (
      <Tooltip
        arrowPointAtCenter
        title={<span style={{ color: "black" }}>Редактировать</span>}
        color="#ffffff"
        placement="bottomLeft"
      >
        <Button
          type={"link"}
          onClick={this.clickHandler}
          style={{ width: "100%" }}
          icon={<EditOutlined />}
          disabled={this.props.abilityDisabled || disabled}
        />
      </Tooltip>
    );
  }
}
