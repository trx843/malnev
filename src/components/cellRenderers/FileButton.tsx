import React, { Component } from "react";
import { Button, Tooltip } from "antd";
import FileTextOutlined from "@ant-design/icons/FileTextOutlined";
import { apiBase } from "../../utils";
import { ControlMaintEvents } from "../../classes";

interface IFileButtomProps {
  data: ControlMaintEvents;
}

interface IFileButtomState {
  disabled: boolean;
}

export class FileButton extends Component<IFileButtomProps, IFileButtomState> {
  constructor(props: IFileButtomProps) {
    super(props);
    this.state = {
      disabled: this.props.data.protocolFileName === null,
    };

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    const item = this.props.data;
    const url: string = `${apiBase}/ControlMaintEvents/GetFile?path=${item.protocolFileName}`;
    console.log(url);
    const link = document.createElement("a");
    link.href = url;
    document.body.appendChild(link);
    link.click();
  }

  render() {
    return (
      <div>
        <Tooltip
          arrowPointAtCenter
          title={<span style={{ color: "black" }}>Скачать файл</span>}
          color="#ffffff"
          placement="bottomLeft"
        >
          <Button
            type={"link"}
            disabled={this.state.disabled}
            onClick={this.clickHandler}
            style={{ width: "100%" }}
            icon={<FileTextOutlined />}
          />
        </Tooltip>
      </div>
    );
  }
}
