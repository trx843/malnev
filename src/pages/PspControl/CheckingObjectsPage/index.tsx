import { Col, Layout, PageHeader, Row, Skeleton, Spin, Tooltip } from "antd";
import { getBdmiLastDate } from "api/requests/pspControl/CheckingObjects";
import classNames from "classnames/bind";
import { CheckingObjects } from "components/PspControl/CheckingObjects";
import React, { FC, useEffect, useState } from "react";
import styles from "./checkingObjectsPage.module.css";

const cx = classNames.bind(styles);

interface CheckingObjectsProps {}

const b = (name: string): string => `checking-objets__${name}`;

export const CheckingObjectsPage: FC<CheckingObjectsProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [bdmiLastDate, setBdmiLastDate] = useState<string | null>(null);
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    const bdmiLastDate = await getBdmiLastDate();
    setBdmiLastDate(bdmiLastDate);
    setLoading(false);
  };

  return (
    <Layout className={b("container")}>
      <Row justify="space-between" align="middle">
        <Col>
          <PageHeader className={cx("header")} title="Объекты проверки" />
        </Col>
        <Col>
          <Spin spinning={loading}>
            {bdmiLastDate ? (
              <Tooltip title={"Дата последней интеграции с БДМИ"}>
                <div>{bdmiLastDate}</div>
              </Tooltip>
            ) : (
              !loading && <div>Нет данных о последней интеграции с БДМИ</div>
            )}
          </Spin>
        </Col>
      </Row>
      <CheckingObjects />
    </Layout>
  );
};
