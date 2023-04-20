import React, { FC, useState } from "react";
import "./styles.css";
import { Menu, Tooltip, Row, Col } from "antd";
import LaptopOutlined from "@ant-design/icons/LaptopOutlined";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import { SchemeType } from "../../api/params/nsi-page.params";
import {
  SiderFilterStyled,
  SiderMenuStyled,
  SiderTitleStyled,
} from "../../styles/commonStyledComponents";
import Title from "antd/lib/typography/Title";
import RightOutlined from "@ant-design/icons/RightOutlined";
import LeftOutlined from "@ant-design/icons/LeftOutlined";

type PropsType = {
  onClickSiderHandler: (selectedScheme: SchemeType) => void;
  dirSchemes: Array<SchemeType>;
  regSchemes: Array<SchemeType>;
};

export const СataloguesSider: FC<PropsType> = React.memo(
  ({ onClickSiderHandler, dirSchemes, regSchemes }) => {
    const { SubMenu } = Menu;

    const [collapsed, setCollapsed] = useState<boolean>(false);

    const onCollapse = () => {
      setCollapsed(!collapsed);
    };

    return (
      <SiderFilterStyled
        width={346}
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        style={{
          borderRight: "1px solid #dde8f0",
          padding: "22px 23px 5px 16px",
        }}
      >
        <Row justify={collapsed ? "center" : "space-between"} align="middle">
          <Col style={{ display: collapsed ? "none" : "block" }}>
            <Title level={4}>Таблицы</Title>
          </Col>

          <Col>
            {collapsed ? (
              <RightOutlined onClick={onCollapse} />
            ) : (
              <LeftOutlined onClick={onCollapse} />
            )}
          </Col>
        </Row>

        <SiderTitleStyled collapsed={collapsed}>
          Выберите таблицу
        </SiderTitleStyled>

        <SiderMenuStyled collapsed={collapsed}>
          <Menu mode="inline">
            {dirSchemes.length ? (
              <SubMenu key="dir" icon={<PlusOutlined />} title="Редактируемые">
                {dirSchemes &&
                  dirSchemes.map((dirObj, index) => (
                    <Menu.Item
                      key={`dir${dirObj.name}_index:${index}`}
                      onClick={() => onClickSiderHandler(dirObj)}
                    >
                      <Tooltip title={dirObj.description} placement="topLeft">
                        {dirObj.description}
                      </Tooltip>
                    </Menu.Item>
                  ))}
              </SubMenu>
            ) : null}

            {regSchemes.length ? (
              <SubMenu
                key="reg"
                icon={<LaptopOutlined />}
                title="Не редактируемые"
              >
                {regSchemes &&
                  regSchemes.map((regObj, index) => (
                    <Menu.Item
                      key={`reg${regObj.name}_index:${index}`}
                      onClick={() => onClickSiderHandler(regObj)}
                    >
                      <Tooltip title={regObj.description} placement="topLeft">
                        {regObj.description}
                      </Tooltip>
                    </Menu.Item>
                  ))}
              </SubMenu>
            ) : null}
          </Menu>
        </SiderMenuStyled>
      </SiderFilterStyled>
    );
  }
);
