import React, { FunctionComponent, useState } from "react";
import { Button, Tooltip } from "antd";
import NodeIndexOutlined from "@ant-design/icons/NodeIndexOutlined";
import { addDeltaToDates, config, dateToLongDateString } from "../../utils";
import { Event } from "../../classes";

interface IOrgStructureButtonProps {
  data: Event;
}

export const OrgStructureButton: FunctionComponent<IOrgStructureButtonProps> = (
  props: IOrgStructureButtonProps
) => {
  const clickHandler = () => {
    const item = props.data;

    let urlDates: string = "";

    let dates = addDeltaToDates(
      item.startDateTime ?? new Date(),
      item.endDateTime ?? new Date(),
      config.percentDelta,
      config.fixDeltaMinutes
    );

    urlDates += `?starttime=${dateToLongDateString(dates[0])}&endtime=${
      item.endDateTime ? dateToLongDateString(dates[1]) : "*"
    }&symbol=trend;multipleScales%3Dfalse`;

    if (item.orgStructTrendName !== null) {
      let url: string = `${config.urlMapping.piVision}Displays/${item.orgStructTrendName}`;
      // ?Rootpath=\\\\${item.afServerName}\\${item.afPath};
      url += urlDates;
      url += "&hidesidebar";

      console.log(url);

      window.open(url, "_blank");
    }
  };

  return (
    <div>
      <Tooltip
        arrowPointAtCenter
        title={
          <span style={{ color: "black" }}>Перейти на мнемосхему PiVision</span>
        }
        color="#ffffff"
        placement="bottomLeft"
      >
        <Button
          disabled={props.data.orgStructTrendName === null}
          type={"link"}
          onClick={clickHandler}
          style={{ width: "100%" }}
          icon={<NodeIndexOutlined />}
        />
      </Tooltip>
    </div>
  );
};
