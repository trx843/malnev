import React, { FunctionComponent } from "react";
import { OstCollapse } from "../../styles/commonStyledComponents";
import { PanelHeader } from "../PanelHeader";
import CaretRightOutlined from "@ant-design/icons/CaretRightOutlined";
import { SiknCards } from "./SiknCards";
import { OstInformation } from "../../classes/OperativeMonitoringModel";

interface IOstsProps {
  ostList: Array<OstInformation>;
}

export const Osts: FunctionComponent<IOstsProps> = (props) => {
  return (
    <OstCollapse
      ghost
      defaultActiveKey={props.ostList.length > 0 ? props.ostList[0].id : 0}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
    >
      {props.ostList.map((ost) => {
        return (
          <OstCollapse.Panel
            header={<PanelHeader data={ost} />}
            key={ost.id}
          >
            {<SiknCards siknList={ost.siknList} />}
          </OstCollapse.Panel>
        );
      })}
    </OstCollapse>
  );
};
