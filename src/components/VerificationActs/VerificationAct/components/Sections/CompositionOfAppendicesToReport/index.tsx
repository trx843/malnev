import React, { FC } from "react";
import { PageTableTemplate } from "../../../../../../templates/PageTable";
import { CompositionTable } from "./CompositionTable";
import { VerificationActSection } from "../../../../../../containers/VerificationActs/VerificationAct/types";
import { useSectionFetch } from "../../../hooks/useSectionFetch";
import { CompositionActionTopPanel } from "./CompositionActionTopPanel";
import { VerificationSectionModalProvider } from "../../Provider";
import { CompositionOfAppendicesModals } from "./CompositionOfAppendicesModals";

export const CompositionOfAppendicesToReport: FC = () => {
  const [isLoading] = useSectionFetch(
    VerificationActSection.CompositionOfAppendicesToReport
  );

  return (
    <VerificationSectionModalProvider>
      <PageTableTemplate
        loading={isLoading}
        childrenTop={<CompositionActionTopPanel />}
        childrenTable={<CompositionTable />}
      />
      <CompositionOfAppendicesModals />
    </VerificationSectionModalProvider>
  );
};
