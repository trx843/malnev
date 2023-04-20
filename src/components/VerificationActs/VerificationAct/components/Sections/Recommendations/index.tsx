import React, { FC } from "react";

import { PageTableTemplate } from "../../../../../../templates/PageTable";
import { RecommendationsActionTopPanel } from "./RecommendationsActionTopPanel";
import { RecommendationsTable } from "./RecommendationsTable";
import { useSectionFetch } from "../../../hooks/useSectionFetch";
import { VerificationActSection } from "../../../../../../containers/VerificationActs/VerificationAct/types";

import { VerificationSectionModalProvider } from "../../Provider";
import { RecommendationsModals } from "./RecommendationsModals";

export const Recommendations: FC = () => {
  const [isLoading] = useSectionFetch(VerificationActSection.Recommendations);
  return (
    <VerificationSectionModalProvider>
      <PageTableTemplate
        loading={isLoading}
        childrenTop={<RecommendationsActionTopPanel />}
        childrenTable={<RecommendationsTable />}
      />
      <RecommendationsModals />
    </VerificationSectionModalProvider>
  );
};
