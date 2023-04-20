import React from "react";
import { Tooltip } from "antd";
import { ITableCellRendererParams } from "components/AgGridTable/types";
import { CtrlEventsItem } from "../../types";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export const ForExecutionColumn: React.FC<ITableCellRendererParams<CtrlEventsItem>> =
  ({ data }) => {
    return data.forExecution ? (
      <React.Fragment>
        <Tooltip title={"К исполнению"}>
          <ExclamationCircleOutlined 
            style={{
              alignContent: "center",
              fontSize: "20px",
              color: "#1890FF",
            }}
          />
        </Tooltip>
      </React.Fragment>
    ) : (
      <></>
    );
  };
