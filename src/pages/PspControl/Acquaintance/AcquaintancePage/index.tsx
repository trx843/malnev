import { FC } from "react";
import { PageHeader } from "antd";
import { AcquaintanceContainer } from "../../../../containers/AcquaintanceContainer";

import "./style.css";
import { CtrlBreadcrumb } from "components/CtrlBreadcrumb";

export const AcquaintancePage: FC = () => {
  const pageName = "Ознакомление";

  return (
    <div className="acquaintance__container">
      <CtrlBreadcrumb pageName={pageName} />
      <PageHeader style={{ padding: "0 0 8px" }} title={pageName} />
      <div className="acquaintance__page__inner">
        <AcquaintanceContainer />
      </div>
    </div>
  );
};
