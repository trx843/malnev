import React, {FC, useEffect, useState} from "react";
import {Layout, Menu, Typography} from "antd";
import qs from "qs";
import {PspVerificationsTableObject} from "./components/verifications-table";

import {IPspObject} from "./types";

import {Link, useLocation} from "react-router-dom";
import {PspInfoCommon} from "./components/PspInfoCommon";
import "./psp-object.css";

interface PspObjectProps {
  data?: IPspObject;
  id: string;
  loading?: boolean;
}

enum PspObjectSection {
  System = "system",
  Verifications = "verifications"
}

export const PspObject: FC<PspObjectProps> = ({ data, id }) => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState<PspObjectSection>(
    PspObjectSection.System
  );

  useEffect(() => {
    const { search } = location;
    const query = qs.parse(search.replace("?", ""), {}) as {
      section: PspObjectSection;
    };
    setSelectedKey(query?.section || PspObjectSection.System);
  }, [location.search]);

  const renderContent = () => {
    switch (selectedKey) {
      case PspObjectSection.System: {
        return (
          <div className="psp-page__inner">
            <PspInfoCommon data={data} id={id} />
          </div>
        );
      }
      case PspObjectSection.Verifications: {
        return (
          <div className="psp-page__inner">
            <PspVerificationsTableObject pspId={id} />
          </div>
        );
      }
      default: {
        return (
          <div className="psp-page__inner">
            <PspInfoCommon data={data} id={id} />
          </div>
        );
      }
    }
  };

  return (
    <Layout className="psp-page__content">
      <div className="psp-page__title">
        <Typography.Title level={2}>{data?.pspFullName}</Typography.Title>
      </div>
      <Menu
        selectedKeys={[selectedKey]}
        mode="horizontal"
        className="psp-page__menu"
      >
        <Menu.Item key={PspObjectSection.System}>
          <Link to={`?section=${PspObjectSection.System}`}>Система учета</Link>
        </Menu.Item>
        <Menu.Item key={PspObjectSection.Verifications}>
          <Link to={`?section=${PspObjectSection.Verifications}`}>
            Проверки
          </Link>
        </Menu.Item>
      </Menu>
      {renderContent()}
    </Layout>
  );
};
