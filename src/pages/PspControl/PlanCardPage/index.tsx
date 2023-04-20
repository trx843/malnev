import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import { Breadcrumb, Spin, Tabs } from "antd";
import { StateType } from "../../../types";
import { IPlanCardStore } from "../../../slices/pspControl/planCard";
import { PlanTable } from "./components/PlanTable";
import { InformationAboutVerificationObjects } from "./components/InformationAboutVerificationObjects";
import { RecommendationsTable } from "./components/RecommendationsTable";
import { Operations } from "./components/Operations";
import { TabPanes } from "./constants";
import { getPlanCardThunk } from "thunks/pspControl/planCard";
import { Matchings } from "./components/Matchings";
import styles from "./planCardPage.module.css";

const { TabPane } = Tabs;

const cx = classNames.bind(styles);

const routes = [
  {
    path: "/pspcontrol/action-plans",
    name: "Планы мероприятий",
  },
];

const breadcrumbItems = routes.map((route) => {
  if (!route.path) {
    return <Breadcrumb.Item key={route.name}>{route.name}</Breadcrumb.Item>;
  }

  return (
    <Breadcrumb.Item key={route.name}>
      <Link to={route.path}>{route.name}</Link>
    </Breadcrumb.Item>
  );
});

export const PlanCardPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const dispatch = useDispatch();

  const { planCardInfo, isPlanCardLoading, isDeleteEventPending } = useSelector<
    StateType,
    IPlanCardStore
  >((state) => state.planCard);

  React.useEffect(() => {
    function init(planId: string) {
      dispatch(getPlanCardThunk(planId));
    }

    if (planId) init(planId);
  }, [planId]);

  return (
    <Spin
      wrapperClassName={cx("spin")}
      spinning={isDeleteEventPending || isPlanCardLoading}
    >
      <div className={cx("container")}>
        <Breadcrumb separator=">">{breadcrumbItems}</Breadcrumb>
        <div className={cx("title-wrapper")}>
          <h3 className={cx("title")}>{planCardInfo?.planName ?? "Н/д"}</h3>
          <h4 className={cx("title")}>{planCardInfo?.planStatus ?? "Н/д"}</h4>
        </div>

        <Tabs
          className={cx("tab")}
          defaultActiveKey={TabPanes.violations}
          tabBarExtraContent={<Operations />}
          destroyInactiveTabPane
        >
          <InformationAboutVerificationObjects />

          <TabPane tab={TabPanes.violations} key={TabPanes.violations}>
            <PlanTable />
          </TabPane>
          <TabPane
            tab={TabPanes.recommendations}
            key={TabPanes.recommendations}
          >
            <RecommendationsTable />
          </TabPane>
          <TabPane
            tab={TabPanes.matchings}
            key={TabPanes.matchings}
          >
            <Matchings />
          </TabPane>
        </Tabs>
      </div>
    </Spin>
  );
};
