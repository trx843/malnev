import React, { FC, useMemo } from "react";

import { PageTableTemplate } from "../../../../../templates/PageTable";
import { GeneralInfoSider } from "../../GeneralInfoSider";
import { TopPanel } from "../../TopPanel";
import { TableViolations } from "../../Table";
import { useTypicalPlanSectionFetch } from "../../../hooks/useTypicalPlanSectionFetch";
import { TypicalPlanSections } from "../../../../../slices/pspControl/actionPlanTypicalViolations/types";
import { serializedTypicalPlanItems } from "../../Table/helpers";

export const AcceptancePointsForOilAndPetroleumProducts: FC = () => {
  const {
    sectionPending,
    sectionPage,
    removeActionPlan,
    getViolationsByFilterData,
    changePageViolations
  } = useTypicalPlanSectionFetch(
    TypicalPlanSections.AcceptancePointsForOilAndPetroleumProducts
  );

  const items = useMemo(() => {
    return serializedTypicalPlanItems(sectionPage?.entities || []);
  }, [sectionPage?.entities]);

  const fetchViolationsByFilterData = () => {
    getViolationsByFilterData({
      to: sectionPage?.filter.verificatedDateTo as any,
      from: sectionPage?.filter.verificatedDateFrom as any,
    });
  };

  return (
    <div className="ais-container">
      <GeneralInfoSider
        onSubmit={getViolationsByFilterData}
        loading={sectionPending}
        to={sectionPage?.filter.verificatedDateTo}
        from={sectionPage?.filter.verificatedDateFrom}
      />
      <PageTableTemplate
        loading={sectionPending}
        childrenTop={<TopPanel />}
        childrenTable={
          <TableViolations
            data={items}
            pageInfo={sectionPage?.pageInfo}
            onPageChange={changePageViolations}
            onDelete={removeActionPlan}
            getViolationsByFilterData={fetchViolationsByFilterData}
          />
        }
      />
    </div>
  );
};
