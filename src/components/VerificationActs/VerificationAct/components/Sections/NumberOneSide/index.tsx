import React, { FC } from "react";
import { useSelector } from "react-redux";

import { CommonInfoSider } from "../../CommonInfoSider";
import { PageTableTemplate } from "../../../../../../templates/PageTable";
import { NumberOneActionTopPanel } from "./NumberOneActionTopPanel";
import { NumberOneTable } from "./NumberOneTable";
import { StateType } from "../../../../../../types";
import { VerificationActStore } from "../../../../../../slices/verificationActs/verificationAct/types";
import { VerificationSectionModalProvider } from "../../Provider";
import { NumberOneModals } from "./NumberOneModals";

export const NumberOneSide: FC = () => {
  const verificationAct = useSelector<StateType, VerificationActStore>(
    state => state.verificationAct
  );

  const act = verificationAct.act

  return (
    <VerificationSectionModalProvider>
      <div className="ais-container">
        <CommonInfoSider
          loading={verificationAct.pending}
          data={act}
        />
        <PageTableTemplate
          loading={verificationAct.pending}
          childrenTop={<NumberOneActionTopPanel />}
          childrenTable={<NumberOneTable />}
        />
      </div>
      <NumberOneModals />
    </VerificationSectionModalProvider>
  );
};
