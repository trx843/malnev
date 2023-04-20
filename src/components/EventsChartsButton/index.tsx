import LineChartOutlined from "@ant-design/icons/LineChartOutlined";
import { Button } from "antd";
import React, { FC } from "react";
import { DataSiInfo } from "../../classes";
import { history } from "../../history/history";

interface IProps {
  dataSiInfo: DataSiInfo;
}

export const EventsChartsButton: FC<IProps> = ({ dataSiInfo }) => {
  const handleOnClick = () => {
    history.push(`/datasi/${dataSiInfo.id}`);
  };

  return (
    <Button
      type="link"
      onClick={handleOnClick}
      style={{ marginTop: "1.8rem" }}
      icon={<LineChartOutlined />}
    >
      Контроль изменений метрологических характеристик
    </Button>
  );
};
