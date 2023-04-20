import { Space } from "antd";
import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { OstInformation } from "../classes/OperativeMonitoringModel";
import {
  TextGrayStyled,
  TextRedStyled,
  TextYellowStyled,
} from "../styles/commonStyledComponents";

interface IPanelHeaderProps {
  data: OstInformation;
}

const OstName = styled.div`
  width: 250px;
`;

const CountDark = styled.div`
  font-weight: bold;
  font-size: 20px;
  line-height: 26px;
  color: #424242;
  margin-left: 12px;
`;


export const PanelHeader: FunctionComponent<IPanelHeaderProps> = (props) => {
  return (
    <>
      <Space size={32}>
        <OstName>{props.data.ostName}</OstName>
        <Space>
          <TextGrayStyled>В работе</TextGrayStyled>
          <CountDark>{props.data.inWorkCount}</CountDark>
        </Space>
        <Space size={12}>
          <TextRedStyled>Остановлено</TextRedStyled>
          <CountDark>{props.data.offCount}</CountDark>
        </Space>
        {props.data.invalidCount > 0 ? (
          <Space size={12}>
            <TextYellowStyled>Недостоверно</TextYellowStyled>
            <CountDark>{props.data.invalidCount}</CountDark>
          </Space>
        ) : (
          <></>
        )}
        <Space size={12}>
          <div>Критические</div>
          <CountDark>{props.data.criticalEventsCount}</CountDark>
        </Space>
        <Space size={12}>
          <div>Прочие</div>
          <CountDark>{props.data.otherEventsCount}</CountDark>
        </Space>
      </Space>
    </>
  );
};
