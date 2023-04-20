import React, { FC } from "react";

import { FilterSider } from "../../components/VerificationActs/FilterSider";
import { ActsTable } from "../../components/VerificationActs/ActsTable";
import { TopFilters } from "../../components/VerificationActs/TopFilters";
import "./style.css";

export const VerificationActsContent: FC = () => {
  return (
    <div className="verification-acts__inner">
      <FilterSider />
      <div className="verification-acts__table-container">
        <TopFilters />
        <ActsTable />
      </div>
    </div>
  );
};
