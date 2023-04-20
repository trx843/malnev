import { FC } from "react";
import { PageHeader } from "antd";

import { VerificationActsContent } from "../../containers/VerificationActs";
import "./style.css";
import { CtrlBreadcrumb } from "components/CtrlBreadcrumb";

export const VerificationActsPage: FC = () => {
  const pageName = "Акты проверки";
  return (
    <div className="verification-acts__container">
      <CtrlBreadcrumb pageName={pageName} />
      <PageHeader title={pageName} className="verification-acts__page-header" />
      <VerificationActsContent />
    </div>
  );
};
