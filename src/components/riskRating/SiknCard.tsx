import { Card, Col, Row } from "antd";
import React, { FC } from "react";
import styled from "styled-components";
import { SiknRsuItem } from "../../classes/SiknRsuItem";
import {
  BoldBlackText,
  SecurityLevelName,
  TextGrayStyled
} from "../../styles/commonStyledComponents";
import { history } from "../../history/history";
import { useDispatch } from "react-redux";
import { siknSelected } from "../../actions/riskratinginfo/creators";
import { SiknInfo } from "./SiknInfo";

interface ISiknCardProps {
  sikn: SiknRsuItem;
  loading: boolean;
}

interface ISecurityLevelNameProps {
  color: string;
}

const SiknCardStyled = styled(Card)`
  margin-bottom: 12px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #dde8f0;

  .ant-card-body {
    padding-top: 15px;
    padding-bottom: 11px;
    padding-left: 12px;
    padding-right: 12px;
  }
`;

export const SiknCard: FC<ISiknCardProps> = props => {
  const dispatch = useDispatch();

  return (
    <SiknCardStyled
      loading={props.loading}
      onClick={() => {
        if (props.loading) return;
        dispatch(siknSelected(props.sikn));
        history.push(`/riskratinginfo/${props.sikn.id}`);
      }}
    >
      <Row gutter={[0, 7]}>
        <Col>
          <BoldBlackText>{props.sikn.fullName}</BoldBlackText>
        </Col>
      </Row>
      <SiknInfo sikn={props.sikn} />
    </SiknCardStyled>
  );
};
