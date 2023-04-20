import React, { FC, memo } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

import { TypicalPlanSections } from "../../../../slices/pspControl/actionPlanTypicalViolations/types";

interface VerificationActMenuProps {
  selectedKeys?: string;
}

export const TypicalViolationsMenu: FC<VerificationActMenuProps> = memo(
  ({
    selectedKeys = TypicalPlanSections.AcceptancePointsForOilAndPetroleumProducts
  }) => (
    <Menu
      selectedKeys={[selectedKeys]}
      mode="horizontal"
      className="action-plan-typical-violation-page__menu"
    >
      <Menu.Item
        key={TypicalPlanSections.AcceptancePointsForOilAndPetroleumProducts}
      >
        <Link
          to={`?section=${TypicalPlanSections.AcceptancePointsForOilAndPetroleumProducts}`}
        >
          Приемо-сдаточные пункты нефти и нефтепродуктов
        </Link>
      </Menu.Item>
      <Menu.Item
        key={TypicalPlanSections.TestingLaboratoriesOfOilAndPetroleumProducts}
      >
        <Link
          to={`?section=${TypicalPlanSections.TestingLaboratoriesOfOilAndPetroleumProducts}`}
        >
          Испытательные лаборатории нефти и нефтепродуктов
        </Link>
      </Menu.Item>
      <Menu.Item
        key={TypicalPlanSections.TestingLaboratoriesOfOilAndPetroleumProducts}
      >
        <Link
          to={`?section=${TypicalPlanSections.Matchings}`}
        >
          Согласующие
        </Link>
      </Menu.Item>
    </Menu>
  )
);
