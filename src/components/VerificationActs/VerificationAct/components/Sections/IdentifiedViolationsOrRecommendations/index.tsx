import React, { FC } from "react";
import { PageTableTemplate } from "../../../../../../templates/PageTable";
import { IdentifiedVActionTopPanel } from "./IdentifiedVActionTopPanel";
import { IdentifiedVTable } from "./IdentifiedVTable";
import { useSectionFetch } from "../../../hooks/useSectionFetch";
import { VerificationActSection } from "../../../../../../containers/VerificationActs/VerificationAct/types";
import { VerificationSectionModalProvider } from "../../Provider";
import { IdentifiedModals } from "./IdentifiedModals";

export const IdentifiedViolationsOrRecommendations: FC = () => {
  const [isLoading] = useSectionFetch(
    VerificationActSection.IdentifiedViolationsOrRecommendations
  );
  return (
    <VerificationSectionModalProvider>
      <PageTableTemplate
        loading={isLoading}
        childrenTop={<IdentifiedVActionTopPanel />}
        childrenTable={<IdentifiedVTable />}
      />
      <IdentifiedModals />
    </VerificationSectionModalProvider>
  );
};
