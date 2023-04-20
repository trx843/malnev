import { FC } from "react";
import { Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { StateType } from "../../../types";
import { VerificationActMenuSections } from "components/VerificationActs/VerificationAct/components/VerificationActMenuSections";

import { VerificationActStore } from "slices/verificationActs/verificationAct/types";
import "./style.css";

export const VerificationActContainer: FC = () => {
  const verificationAct = useSelector<StateType, VerificationActStore>(
    state => state.verificationAct
  );

  const act = verificationAct.act

  return (
    <div className="verification-act-page__container">
      <Link to="/pspcontrol/verification-acts">
        <Typography.Title level={4}>Акты проверки</Typography.Title>
      </Link>
      <div className="verification-acts__page-header">
        <Row>
          <Col flex="auto">
            <Typography.Title level={5}>
              {act?.actName || "Н/д"}
            </Typography.Title>
          </Col>
          <Col flex="100px">
            <Typography.Title level={5}>
              {act?.verificationStatus || "Н/д"}
            </Typography.Title>
          </Col>
        </Row>
      </div>
      <VerificationActMenuSections />
    </div>
  );
};
