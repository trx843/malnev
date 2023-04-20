import { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";
import { Card } from "antd";
import { AcceptancePointsForOilAndPetroleumProducts } from "./AcceptancePointsForOilAndPetroleumProducts";
import { TestingLaboratoriesOfOilAndPetroleumProducts } from "./TestingLaboratoriesOfOilAndPetroleumProducts";
import { TypicalViolationsMenu } from "../Menu";
import { TypicalPlanSections } from "../../../../slices/pspControl/actionPlanTypicalViolations/types";
import { ActPlanEliminationOfTypicalViolationsModals } from "./modals";

export const ActPlanEliminationOfTypicalViolationsSections: FC = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState<TypicalPlanSections>(
    TypicalPlanSections.AcceptancePointsForOilAndPetroleumProducts
  );

  useEffect(() => {
    const { search } = location;
    const query = qs.parse(search.replace("?", ""), {}) as {
      section: TypicalPlanSections;
    };
    setSelectedKey(
      query.section ||
        TypicalPlanSections.AcceptancePointsForOilAndPetroleumProducts
    );
  }, [location.search]);

  const renderContent = () => {
    switch (selectedKey) {
      case TypicalPlanSections.AcceptancePointsForOilAndPetroleumProducts: {
        return <AcceptancePointsForOilAndPetroleumProducts />;
      }
      case TypicalPlanSections.TestingLaboratoriesOfOilAndPetroleumProducts: {
        return <TestingLaboratoriesOfOilAndPetroleumProducts />;
      }
      default: {
        return <AcceptancePointsForOilAndPetroleumProducts />;
      }
    }
  };

  return (
    <div className="action-plan-typical-violation-page__content">
      <div className="action-plan-typical-violation-page__header">
        <TypicalViolationsMenu selectedKeys={selectedKey} />
      </div>
      <Card className="action-plan-typical-violation-page__inner-content">
        {renderContent()}
      </Card>
      <ActPlanEliminationOfTypicalViolationsModals
        selectedSection={selectedKey}
      />
    </div>
  );
};
