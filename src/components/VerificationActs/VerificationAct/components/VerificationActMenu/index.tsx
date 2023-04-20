import React, { FC, memo } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

import { VerificationActSection } from "../../../../../containers/VerificationActs/VerificationAct/types";

interface VerificationActMenuProps {
  selectedKeys?: string;
  showCompositionSection?: boolean;
}

export const VerificationActMenu: FC<VerificationActMenuProps> = memo(
  ({
    showCompositionSection = true,
    selectedKeys = VerificationActSection.NumberOneSide,
  }) => (
    <Menu
      selectedKeys={[selectedKeys]}
      mode="horizontal"
      className="verification-act-page__menu"
    >
      <Menu.Item key={VerificationActSection.NumberOneSide}>
        <Link to={`?section=${VerificationActSection.NumberOneSide}`}>
          Общая информация
        </Link>
      </Menu.Item>
      <Menu.Item key={VerificationActSection.Commission}>
        <Link to={`?section=${VerificationActSection.Commission}`}>
          Комиссия
        </Link>
      </Menu.Item>
      <Menu.Item
        key={VerificationActSection.IdentifiedViolationsOrRecommendations}
      >
        <Link
          to={`?section=${VerificationActSection.IdentifiedViolationsOrRecommendations}`}
        >
          Выявленные нарушения
        </Link>
      </Menu.Item>
      <Menu.Item key={VerificationActSection.Recommendations}>
        <Link to={`?section=${VerificationActSection.Recommendations}`}>
          Рекомендации
        </Link>
      </Menu.Item>

      <Menu.Item
        hidden={!showCompositionSection}
        key={VerificationActSection.CompositionOfAppendicesToReport}
      >
        {showCompositionSection && (
          <Link
            to={`?section=${VerificationActSection.CompositionOfAppendicesToReport}`}
          >
            Состав приложений к отчету
          </Link>
        )}
      </Menu.Item>
    </Menu>
  )
);
