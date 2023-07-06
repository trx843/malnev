import { HomeFilled, PushpinFilled } from "@ant-design/icons";
import { Menu, Modal } from "antd";
import { useState } from "react";
import { FC } from "react";
import { useHistory } from "react-router";
import { AStyled, LinkStyled } from "../../styles/commonStyledComponents";
import { User } from "../../classes";
import { IMenuNav } from "../../interfaces";
import { config } from "../../utils";
import DynamicIcon from "../DynamicIcon";
import { OrgStructureTree } from "../OrgStructureTree";
import { SiderStyled } from "./styledComponents";
import { useDispatch } from "react-redux";
import { setCurrentSelectedMenuKey } from "slices/home";
import { WebFeatureLinkTypes } from "enums";

const { SubMenu } = Menu;

interface MenuSiderProps {
  currentUser: User;
  currentSelectedMenuKey: string;
}

export const MenuSider: FC<MenuSiderProps> = ({
  currentUser,
  currentSelectedMenuKey,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const map = new Map(Object.entries(config.urlMapping));

  // личные отчеты
  const userReportsList = currentUser.webFeaturesTypes.userReportsList.map((report) => ({
    ...report,
    link: `/frame/myreport_${report.id}?title=${encodeURIComponent(report.name)}`
  }));

  const navs = currentUser.webFeaturesTypes.cards;

  const [collapsed, collapse] = useState(true);
  const [orgStructureModalVisible, setOrgStructureModalVisible] =
    useState(false);

  const onChangeCallback = (e: any) => {
    dispatch(setCurrentSelectedMenuKey(e.key));
  };

  function drawNav(nav: IMenuNav, isTitle: boolean): JSX.Element {
    const anotherSystemUrl = map.get(nav.linkType);
    if (isTitle || (nav.linkTypeId === WebFeatureLinkTypes.folder && nav.children.length > 0)) {
      return (
        <SubMenu
          icon={nav.icon ? <DynamicIcon type={nav.icon} /> : <></>}
          key={nav.id}
          title={nav.name}
        >
          {nav.children.map((x) => drawNav(x, x.isTitle))}
        </SubMenu>
      );
    } else {
      if (nav.route === "/orgstructure") {
        return (
          <Menu.Item
            icon={nav.icon ? <DynamicIcon type={nav.icon} /> : <></>}
            key={nav.id}
            onClick={() => {
              setOrgStructureModalVisible(true);
            }}
          >
            {nav.name}
          </Menu.Item>
        );
      } else {
        return (
          <Menu.Item
            icon={nav.icon ? <DynamicIcon type={nav.icon} /> : <></>}
            key={nav.id}
          >
            {nav.route === null ? (
              nav.linkTypeId !== null && !!anotherSystemUrl ? (
                <AStyled
                  target="_blank"
                  href={anotherSystemUrl}
                  rel="noopener noreferrer"
                >
                  {nav.name}
                </AStyled>
              ) : (
                <></>
              )
            ) : nav.linkTypeId === WebFeatureLinkTypes.report ? (
              <LinkStyled
                to={nav.route}
                target="_blank"
                rel="noopener noreferrer"
              >
                {nav.name}
              </LinkStyled>
            ) : (
              <LinkStyled to={nav.route}>{nav.name}</LinkStyled>
            )}
          </Menu.Item>
        );
      }
    }
  }
  
  return (
    <>
      <SiderStyled
        className="site-layout"
        width={322}
        style={{
          overflow: "auto",
          position: "fixed",
          height: "90%",
          zIndex: 1000,
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed: boolean) => collapse(collapsed)}
      >
        <Menu
          defaultSelectedKeys={["main"]}
          selectedKeys={[currentSelectedMenuKey]}
          mode="inline"
          style={{ border: "none" }}
          onSelect={onChangeCallback}
        >
          <Menu.Item
            key={"main"}
            icon={<HomeFilled />}
            onClick={() => history.push("/")}
          >
            Главная
          </Menu.Item>
          
          {/* вывод личных отчетов */}
          {userReportsList.length !== 0 &&
            <SubMenu
              key="userReportsList"
              icon={<PushpinFilled />}
              title="Мои отчеты"
            >
              <SubMenu
                key="subUserReportsList"
                title="Построить отчет"
              >
                {userReportsList.map((report) =>
                  <Menu.Item key={`user-report-${report.id}`}>
                    <AStyled
                      target="_blank"
                      href={report.link}
                      rel="noopener noreferrer"
                    >
                      {report.name}
                    </AStyled>
                  </Menu.Item>)}
              </SubMenu>
            </SubMenu>}

          {navs.map((nav) => {
            return drawNav(nav, nav.isTitle);
          })}
        </Menu>
      </SiderStyled>

      <Modal
        visible={orgStructureModalVisible}
        title={`Обзор объектов`}
        destroyOnClose
        footer={null}
        maskClosable={false}
        onCancel={() => {
          setOrgStructureModalVisible(false);
        }}
      >
        <OrgStructureTree />
      </Modal>
    </>
  );
};
