import React from "react";
import { useSelector } from "react-redux";
import classNames from "classnames/bind";
import { Typography } from "antd";
import { StateType } from "../../../../../types";
import { IPlanCardStore } from "slices/pspControl/planCard";
import {
  ObjectInformationItemType,
  ObjectInformationList,
  OstRnuPspValues,
} from "./constants";
import { ObjectElementCard } from "./components/ObjectElementCard";
import { formatDate } from "./utils";
import styles from "./informationAboutVerificationObjects.module.css";

const { Title } = Typography;

const cx = classNames.bind(styles);

export const InformationAboutVerificationObjects: React.FC = () => {
  const { planCardInfo } = useSelector<StateType, IPlanCardStore>(
    (state) => state.planCard
  );

  return (
    <div className={cx("container")}>
      <Title level={3} className={cx("title")}>
        Информация об объекте проверки
      </Title>
      <div className={cx("list")}>
        {ObjectInformationList.map((item) => {
          const value = planCardInfo?.[item.name];

          if (item.type === ObjectInformationItemType.Date) {
            return (
              <ObjectElementCard title={item.title} value={formatDate(value as string)} />
            );
          }

          if (item.type === ObjectInformationItemType.Link) {
            return (
              <ObjectElementCard
                title={item.title}
                value={value}
                to={`/pspcontrol/verification-acts/${planCardInfo?.[OstRnuPspValues.verificationActId]
                  }`}
              />
            );
          }

          return <ObjectElementCard title={item.title} value={value} />;
        })}
      </div>
    </div>
  );
};
