import React, { FC } from "react";
import { PageTableTemplate } from "../../../../../../templates/PageTable";
import { VerificationActSection } from "../../../../../../containers/VerificationActs/VerificationAct/types";
import { useSectionFetch } from "../../../hooks/useSectionFetch";
import { CommissionActionTopPanel } from "./CommissionActionTopPanel";
import { CommissionTable } from "./CommissionTable";
import { VerificationSectionModalProvider } from "../../Provider";
import { CommissionModals } from "./CommissionModals";

export const Commission: FC = () => {
  const [isLoading] = useSectionFetch(VerificationActSection.Commission);

  return (
    <VerificationSectionModalProvider>
      <PageTableTemplate
        loading={isLoading}
        childrenTop={<CommissionActionTopPanel />}
        childrenTable={<CommissionTable />}
      />
      <CommissionModals />
    </VerificationSectionModalProvider>
  );
};
