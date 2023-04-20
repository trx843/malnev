import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import { Breadcrumb, Spin, Tabs } from "antd";
import { StateType } from "../../../types";
import { IVerificationScheduleCardStore } from "../../../slices/pspControl/verificationScheduleCard";
import { ScheduleCardTable } from "./components/ScheduleCardTable";
import { Comissions } from "./components/Commissions";
import { Operations } from "./components/Operations";
import { TabPanes } from "./constants";
import styles from "./verificationScheduleCardPage.module.css";

const { TabPane } = Tabs;

const cx = classNames.bind(styles);

const routes = [
  {
    path: "/pspcontrol/verification-schedule",
    name: "Графики проверки",
  },
  {
    name: "График проверки",
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

export const VerificationScheduleCardPage: React.FC = () => {
  const {
    verificationScheduleCardInfo,
    isVerificationScheduleCardInfoLoading,
    isDeletingVerificationSchedulePsp,
  } = useSelector<StateType, IVerificationScheduleCardStore>(
    (state) => state.verificationScheduleCard
  );

  return (
    <Spin
      wrapperClassName={cx("spin")}
      spinning={
        isVerificationScheduleCardInfoLoading ||
        isDeletingVerificationSchedulePsp
      }
    >
      <Breadcrumb separator=">">{breadcrumbItems}</Breadcrumb>
      <div className={cx("titleWrapper")}>
        <h2 className={cx("title")}>
          {verificationScheduleCardInfo?.header ?? "Н/д"}
        </h2>
        <h4 className={cx("title")}>
          {verificationScheduleCardInfo?.verificationStatus ?? "Н/д"}
        </h4>
      </div>
      <Tabs
        className={cx("tab")}
        defaultActiveKey={TabPanes.schedules}
        tabBarExtraContent={<Operations />}
        destroyInactiveTabPane
      >
        <TabPane
          className={cx("schedulesTabPane")}
          tab={TabPanes.schedules}
          key={TabPanes.schedules}
        >
          <ScheduleCardTable />
        </TabPane>
        <TabPane tab={TabPanes.commissions} key={TabPanes.commissions}>
          <Comissions />
        </TabPane>
      </Tabs>
    </Spin>
  );
};
