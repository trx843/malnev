import React, { FunctionComponent } from "react";
import { Button, Tooltip } from "antd";
import ReconciliationOutlined from "@ant-design/icons/ReconciliationOutlined";
import { history } from "../../history/history";
import { SiEquipmentLimits } from "../../classes/SiEquipmentLimits";

interface IHistoryLimitButtonProps {
  data: SiEquipmentLimits;
  isSikn: boolean;
}

export const HistoryLimitButton: FunctionComponent<IHistoryLimitButtonProps> = (
  {data, isSikn}
) => {
  const clickHandler = () => {
    let id = isSikn ? data.techPosId : data.id;
    history.push(
      `/historylimit?id='${id}'&isSikn='${isSikn}'&name='${data.siName}'`
    );
  };

  return (
    <div>
      <Tooltip
        arrowPointAtCenter
        title={
          <span style={{ color: "black" }}>Открыть историю изменений</span>
        }
        color="#ffffff"
        placement="bottomLeft"
      >
        <Button
          type={"link"}
          onClick={clickHandler}
          style={{ width: "100%" }}
          icon={<ReconciliationOutlined />}
        />
      </Tooltip>
    </div>
  );
};
