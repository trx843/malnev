import React, { FC } from "react";
import { PageTableTemplate } from "../../../../../../templates/PageTable";
import { OtherSidesTopAction } from "./OtherSidesTopAction";
import { OtherSidesTable } from "./OtherSidesTable";
import { useSectionFetch } from "../../../hooks/useSectionFetch";
import { VerificationActSection } from "../../../../../../containers/VerificationActs/VerificationAct/types";

import { VerificationSectionModalProvider } from "../../Provider";
import { OtherSideModals } from "./OtherSideModals";

export const OtherSides: FC = () => {
  const [isLoading] = useSectionFetch(VerificationActSection.OtherSides);
  return (
    <VerificationSectionModalProvider>
      <PageTableTemplate
        loading={isLoading}
        childrenTop={<OtherSidesTopAction />}
        childrenTable={<OtherSidesTable />}
      />
      <OtherSideModals />
    </VerificationSectionModalProvider>
  );
};
