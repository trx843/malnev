import React from "react";
import QuestionOutlined from "@ant-design/icons/QuestionOutlined";
import ArrowRightOutlined from "@ant-design/icons/ArrowRightOutlined";
import ApiFilled from "@ant-design/icons/ApiFilled";
import ToolFilled from "@ant-design/icons/ToolFilled";
import MinusCircleFilled from "@ant-design/icons/MinusCircleFilled";
import ImportOutlined from "@ant-design/icons/ImportOutlined";
import FolderFilled from "@ant-design/icons/FolderFilled";
import AreaChartOutlined from "@ant-design/icons/AreaChartOutlined";
import AuditOutlined from "@ant-design/icons/AuditOutlined";
import BookFilled from "@ant-design/icons/BookFilled";
import UsergroupAddOutlined from "@ant-design/icons/UsergroupAddOutlined";
import CompassFilled from "@ant-design/icons/CompassFilled";
import StockOutlined from "@ant-design/icons/StockOutlined";
import MonitorOutlined from "@ant-design/icons/MonitorOutlined";
import NodeIndexOutlined from "@ant-design/icons/NodeIndexOutlined";
import EnvironmentOutlined from "@ant-design/icons/EnvironmentOutlined";
import ApartmentOutlined from "@ant-design/icons/ApartmentOutlined";
import FundViewOutlined from "@ant-design/icons/FundViewOutlined";
import TableOutlined from "@ant-design/icons/TableOutlined";
import DashboardOutlined from "@ant-design/icons/DashboardOutlined";
import QuestionCircleOutlined from "@ant-design/icons/QuestionCircleOutlined";
import GroupOutlined from "@ant-design/icons/GroupOutlined";
import FileTextOutlined from "@ant-design/icons/FileTextOutlined";

interface IconSelectorProps {
  type: string;
}

const IconSelector: React.FC<IconSelectorProps> = (
  props: IconSelectorProps
) => {
  const Icons = {
    QuestionOutlined: <QuestionOutlined />,
    ArrowRightOutlined: <ArrowRightOutlined />,
    ApiFilled: <ApiFilled />,
    ToolFilled: <ToolFilled />,
    MinusCircleFilled: <MinusCircleFilled />,
    ImportOutlined: <ImportOutlined />,
    FolderFilled: <FolderFilled />,
    AreaChartOutlined: <AreaChartOutlined />,
    AuditOutlined: <AuditOutlined />,
    BookFilled: <BookFilled />,
    StockOutlined: <StockOutlined />,
    UsergroupAddOutlined: <UsergroupAddOutlined />,
    CompassFilled: <CompassFilled />,
    MonitorOutlined: <MonitorOutlined />,
    NodeIndexOutlined: <NodeIndexOutlined />,
    EnvironmentOutlined: <EnvironmentOutlined />,
    ApartmentOutlined: <ApartmentOutlined />,
    FundViewOutlined: <FundViewOutlined />,
    TableOutlined: <TableOutlined />,
    DashboardOutlined: <DashboardOutlined />,
    QuestionCircleOutlined: <QuestionCircleOutlined />,
    GroupOutlined: <GroupOutlined />,
    FileTextOutlined: <FileTextOutlined />,
  };

  const getIcon = (type: string) => {
    let comp = <QuestionOutlined />;

    let typeNew = type;

    if (!typeNew.match(/.+(Outlined|Filled|TwoTone)$/i)) {
      typeNew += "Outlined";
    }

    const found = Object.entries(Icons).find(
      ([k]) => k.toLowerCase() === typeNew.toLowerCase()
    );
    if (found) {
      [, comp] = found;
    }

    return comp;
  };

  return getIcon(props.type);
};

export default IconSelector;
