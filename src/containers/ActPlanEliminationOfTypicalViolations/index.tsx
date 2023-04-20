import { FC } from "react";
import { Breadcrumb, PageHeader, Typography } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { ActPlanEliminationOfTypicalViolationsSections } from "./components/Sections";
import { StateType } from "../../types";
import { PlanAttachments } from "./components/Attachments";
import { ModalProvider } from "components/ModalProvider";
import { ActionPlanTypicalViolationsStore } from "slices/pspControl/actionPlanTypicalViolations/types";
import "./styles.css";

const routes = (name: string = "") => [
  {
    path: "/pspcontrol/action-plans",
    breadcrumbName: "Планы мероприятий",
    key: "verification-acts",
  },
];

export const ActPlansEliminationOfTypicalViolationsContainer: FC = () => {
  const section = useSelector<
    StateType,
    { planName: string | undefined; planStatus: string | undefined }
  >((state) => {
    const { planName, planStatus } = state.actionPlanTypicalViolations;
    return { planName, planStatus };
  });

  const { typicalPlanCard } = useSelector<
    StateType,
    ActionPlanTypicalViolationsStore
  >((state) => state.actionPlanTypicalViolations);

  const extraBreadcrumbItems = routes(section.planName).map((route, index) => {
    if (!route.path) {
      return (
        <Breadcrumb.Item key={route.key}>
          {route.breadcrumbName}
        </Breadcrumb.Item>
      );
    }
    return (
      <Breadcrumb.Item key={route.key}>
        <Link to={route.path}>{route.breadcrumbName}</Link>
      </Breadcrumb.Item>
    );
  });

  return (
    <ModalProvider>
    <div className="action-plan-typical-violation-page__container">
      <Breadcrumb
        className="action-plan-typical-violation-page__breadcrumb"
        separator=">"
      >
        {extraBreadcrumbItems}
      </Breadcrumb>
      <div className="action-plan-typical-violation-page__title">
        <PageHeader
          title={typicalPlanCard?.planName || 'Н/д'}
          className="verification-acts__page-header"
        />
        <div className="action-plan-typical-violation-page__title-sign">
          <Typography.Text>{typicalPlanCard?.planStatus || 'Н/д'}</Typography.Text>
          <PlanAttachments />
        </div>
      </div>
      <ActPlanEliminationOfTypicalViolationsSections />
    </div>
    </ModalProvider>
  );
};
