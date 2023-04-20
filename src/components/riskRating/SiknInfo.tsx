import {Col, Row } from "antd";
import React, { FC } from "react";
import { SiknRsuItem } from "../../classes/SiknRsuItem";
import {
  BoldBlackText,
  SecurityLevelName,
  TextDarkStyled,
  TextGrayStyled,
} from "../../styles/commonStyledComponents";

interface ISiknInfoProps {
  sikn: SiknRsuItem;
  fullinfo?: boolean;
}

export const SiknInfo: FC<ISiknInfoProps> = (props) => {
  return (
    <>
      <Row gutter={[0, 4]} justify="space-between">
        <Col>
          <TextGrayStyled>Значение риска</TextGrayStyled>
        </Col>
        <Col>
          <BoldBlackText>{props.sikn.sumRiskRatio}</BoldBlackText>
        </Col>
      </Row>
      <Row gutter={[0, props.fullinfo ? (16) : (0)]} justify="space-between">
        <Col>
          <TextGrayStyled>Критичность</TextGrayStyled>
        </Col>
        <Col>
          <SecurityLevelName color={props.sikn.mssEventSeverityLevel.color}>
            {props.sikn.criticalness}
          </SecurityLevelName>
        </Col>
      </Row>
      {props.fullinfo ? (
        <>
          <Row gutter={[0, 16]}>
            <Col>
              <TextGrayStyled>ОСТ</TextGrayStyled>
              <TextDarkStyled>{props.sikn.ostName}</TextDarkStyled>
            </Col>
          </Row>
          <Row gutter={[0, 16]}>
            <Col>
              <TextGrayStyled>Суммарное значение риска</TextGrayStyled>
              <TextDarkStyled>{props.sikn.eventsRiskRatio}</TextDarkStyled>
            </Col>
          </Row>
          <Row gutter={[0, 16]}>
            <Col>
              <TextGrayStyled>Постоянное значение риска </TextGrayStyled>
              <TextDarkStyled>{props.sikn.riskRatio}</TextDarkStyled>
            </Col>
          </Row>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
