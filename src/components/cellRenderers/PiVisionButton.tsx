import React, { FunctionComponent, useState } from "react";
import { Button, Tooltip } from "antd";
import LineChartOutlined from "@ant-design/icons/LineChartOutlined";
import { config, dateToLongDateString, addDeltaToDates } from "../../utils";
import { Event, Failures, SiknOffItem } from "../../classes";
import { ExtendTimeEnum } from "../../enums";

interface IPiVisionButtonProps {
  data: Event | Failures | SiknOffItem;
}

export const PiVisionButton: FunctionComponent<IPiVisionButtonProps> = (
  props: IPiVisionButtonProps
) => {
  const clickHandler = () => {
    const item = props.data;
    let urlDates: string = "";

    let dates =
      item.extendTime != ExtendTimeEnum.Extend
        ? [item.startDateTime, item.endDateTime]
        : addDeltaToDates(
            item.startDateTime ?? new Date(),
            item.endDateTime ?? new Date(),
            config.percentDelta,
            config.fixDeltaMinutes
          );

    //Даты начала и конца диапазона
    let startDate = dates[0] ?? new Date();
    let endDate = dates[1] ?? new Date();

    urlDates += `&starttime=${dateToLongDateString(startDate)}&endtime=${
      item.endDateTime ? dateToLongDateString(endDate) : "*"
    }&symbol=trend;multipleScales%3Dfalse&hidesidebar`;

    if (
      item.attributeNameList !== null &&
      item.attributeNameList !== undefined &&
      item.attributeNameList.length > 0
    ) {
      let url: string = `${config.urlMapping.piVision}Displays/adhoc?dataitems=`;
      item.attributeNameList.forEach((atttibute) => {
        url +=
          `\\\\${item.afServerName}\\${item.afPath}|${atttibute}` +
          (item.attributeNameList[item.attributeNameList.length - 1] ===
          atttibute
            ? ""
            : ",");
      });
      url += urlDates;
      window.open(url, "_blank");
    } else {
      if (item.customTrendFormName !== null) {
        let url: string = `${config.urlMapping.piVision}Displays/${
          item.customTrendFormName
        }?${item.rootPathType ?? "asset"}=\\\\${item.afServerName}\\${
          item.afPath
        }`;
        url += urlDates;
        window.open(url, "_blank");
      }
    }
  };

  return (
    <div>
      <Tooltip
        arrowPointAtCenter
        title={<span style={{ color: "black" }}>Перейти на тренд</span>}
        color="#ffffff"
        placement="bottomLeft"
      >
        <Button
          disabled={
            (props.data.attributeNameList === null ||
              props.data.attributeNameList === undefined ||
              props.data.attributeNameList.length === 0) &&
            props.data.customTrendFormName === null
          }
          type={"link"}
          onClick={clickHandler}
          style={{ width: "100%" }}
          icon={<LineChartOutlined />}
        />
      </Tooltip>
    </div>
  );
};
