import React, { FC, useCallback, useEffect, useState } from "react";
import { AppstoreOutlined, BarsOutlined, BookOutlined, BranchesOutlined, DashboardOutlined, DownOutlined, FolderOutlined, GlobalOutlined, LineChartOutlined, TableOutlined } from "@ant-design/icons";
import { Alert, Col, Dropdown, Menu, Row, Tooltip, Button } from "antd";
import { Link } from "react-router-dom";
import { User } from "../../classes";
import { HeaderStyled, NodeColorDot, TypographyText } from "./styledComponents";
import logo from "../../images/TkoLogo_sm.png";
import { LinkStyled } from "../../styles/commonStyledComponents";
import { ActionsEnum, Can } from "../../casl";
import { NotificationMessageModal } from "components/NotificationMessageModal";
import { getNotification } from "api/requests/notificationMessage";
import { useLongPolling } from "customHooks/useLongPolling";
import { NotificationModel } from "components/NotificationMessageModal/types";
import { config } from "utils";
import { history } from "../../history/history";
import { IndexContext, IndexContextType } from "../../hooks/useIndex"

interface HeaderProps {
  currentUser: User;
}

export const Header: FC<HeaderProps> = ({ currentUser }) => {
  const [isNotificatonModalOpened, setisNotificatonModalOpened] =
    useState(false);

  const [notification, setNotification] = useState<NotificationModel | null>(
    null
  );

  const [startPolling, stopPolling] = useLongPolling();

  const fetchData = useCallback(async () => {
    const res = await getNotification();
    setNotification(res);
  }, []);

  useEffect(() => {
    fetchData();
    startPolling(
      fetchData,
      config.longPollingSeconds.notificationMessage * 1000
    );
    return () => stopPolling();
  }, [fetchData]);

  const onMenuModalTypeClick = (route: string) => {
    switch (route) {
      case "/notificationMessage":
        setisNotificatonModalOpened(true);
        break;
      default:
        break;
    }
  };

  const menuList = (
    <Menu>
      {currentUser && currentUser.webFeaturesTypes.underUserNameList.map((wf) => {
        switch (wf.linkTypeId) {
          case 2:
            return (
              <Can
                I={ActionsEnum.Go}
                a={wf.route}
                key={`underUserNameListItemCan-${wf.id}`}
              >
                <Menu.Item
                  key={`underUserNameListItem-${wf.id}`}
                  onClick={() => onMenuModalTypeClick(wf.route)}
                >
                  {wf.name}
                </Menu.Item>
              </Can>
            );
          default:
            return (
              <Menu.Item key={`underUserNameListItem-${wf.id}`}>
                <LinkStyled key={`underUserNameLink-${wf.id}`} to={wf.route}>
                  {wf.name}
                </LinkStyled>
              </Menu.Item>
            );
        }
      })}
    </Menu>
  );

  // получение функционала из контекста стартовой страницы
  const {
    isUIB, // флаг куратора
    goToState // метод изменения состояния
  } = React.useContext(IndexContext) as IndexContextType;

  return (
    <>
      <HeaderStyled
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          background: "#1F4664",
        }}
      >
        <Row
          justify={"space-between"}
          style={{ maxHeight: 64 }}
          wrap={false}
          gutter={16}
        >
          <Col>
            <div
              style={{
                display: "flex",
                // flexDirection: "column",
                // justifyContent: "center",
                alignItems: "center",
                padding: "0 15",
                height: 64,
                background: "#1F4664",
              }}
              className="logo"
            >
              <Link
                to="/"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 30
                }}
                onClick={() => goToState("index")}
              >
                <img
                  src={logo}
                  alt=""
                  title="Портал МКО ТКО"
                  id={"squaredLogo"}
                />
              </Link>

              {!isUIB &&
                // меню
                <Menu
                  mode="horizontal"
                  theme="dark"
                  multiple={true}
                >
                  <Menu.SubMenu
                    title="Сервисы"
                    key="services"
                    icon={<AppstoreOutlined />}
                  >
                    <Menu.Item key="reports">
                      <Link to="/reports">
                        <BookOutlined />
                        <span>Журналы/Отчеты</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="trends">
                      <LineChartOutlined />
                      <span>Тренды</span>
                    </Menu.Item>
                    <Menu.Item key="mki">
                      <DashboardOutlined />
                      <span>МКИ</span>
                    </Menu.Item>
                    <Menu.Item key="sikn">
                      <BranchesOutlined />
                      <span>Схема СИКН</span>
                    </Menu.Item>
                  </Menu.SubMenu>
                  <Menu.SubMenu
                    title="Документы"
                    key="documents"
                    icon={<FolderOutlined />}
                  >
                    <Menu.Item key="re">
                      <span>РЭ</span>
                    </Menu.Item>
                    <Menu.Item key="trivi">
                      <span>ТР ИВИ</span>
                    </Menu.Item>
                  </Menu.SubMenu>
                  <Menu.SubMenu
                    title="Мониторинг"
                    key="monitoring"
                    icon={<TableOutlined />}
                  >
                    <Menu.Item key="sikn-monitoring">
                      <span>СИКН</span>
                    </Menu.Item>
                    <Menu.Item key="balance">
                      <span>Баланс ОСТ</span>
                    </Menu.Item>
                    <Menu.Item key="neft">
                      <span>Нефть и нефтепродукты</span>
                    </Menu.Item>
                  </Menu.SubMenu>
                  <Menu.SubMenu
                    title="Справочник"
                    key="dictionary"
                    icon={<BarsOutlined />}
                  >
                    <Menu.Item key="sikn-dictionary">
                      <span>СИКН</span>
                    </Menu.Item>
                    <Menu.Item key="psp">
                      <span>ПСП</span>
                    </Menu.Item>
                  </Menu.SubMenu>
                  <Menu.Item key="knowledge-base">
                    <Link to="/knowledge">
                      <GlobalOutlined />
                      <span>База знаний</span>
                    </Link>
                  </Menu.Item>
                </Menu>
              }
            </div>
          </Col>

          <Col
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!!notification &&
              notification.show &&
              notification.message.length > 0 && (
                <Alert
                  message={
                    <Tooltip
                      arrowPointAtCenter
                      title={
                        <span style={{ color: "black" }}>
                          {notification.message}
                        </span>
                      }
                      color="#ffffff"
                      placement="bottom"
                    >
                      <TypographyText>{notification.message}</TypographyText>
                    </Tooltip>
                  }
                  type="warning"
                />
              )}
          </Col>
          <Col>
            <Row gutter={24} align={"middle"}>
              <Col>
                {menuList.props.children.length === 0
                  ? <div style={{
                    color: "white",
                    float: "right",
                    fontWeight: 500,
                    fontFamily: "Golos"
                  }}>
                    {currentUser.domain}\{currentUser.login}
                  </div>
                  : <Dropdown overlay={menuList}>
                    <div style={{ color: "white", float: "right" }}>
                      {currentUser.domain}\{currentUser.login} <DownOutlined />
                    </div>
                  </Dropdown>
                }
              </Col>
              <Col>
                {currentUser.hostNode != null ? (
                  <Tooltip title={`Имя сервера: ${currentUser.hostName}`}>
                    <NodeColorDot node={currentUser.hostNode} />
                  </Tooltip>
                ) : (
                  <></>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </HeaderStyled>
      <NotificationMessageModal
        initialValues={notification ?? { message: "", show: false }}
        isNotificatonModalOpened={isNotificatonModalOpened}
        onCloseCallback={() => {
          fetchData();
          setisNotificatonModalOpened(false);
        }}
      />
    </>
  );
};
