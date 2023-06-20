import { Modal, Tooltip, Menu, Row, Col, Spin } from "antd";
import { PushpinFilled } from "@ant-design/icons";
import { FunctionComponent, useState } from "react";
import { history } from "../../history/history";
import {
  AnotherEvents,
  AnotherEventsCount,
  AnotherEventsName,
  BoxIcon,
  CardColumnsWrapper,
  CriticalEvents,
  CriticalEventsCount,
  CriticalEventsName,
  MainTitleWrapper,
  MenuCard,
  MenuCardColumns,
  MenuCardTitle,
  MenuStyled,
  MenuWrapper,
  ReportsMenuStyled,
  Title,
} from "./styledComp";
import DynamicIcon from "../DynamicIcon";
import { OrgStructureTree } from "../OrgStructureTree";
import { IMenuNav } from "../../interfaces";
import { TitleWrapper } from "../../pages/Home/styledComp";
import { AStyled, LinkStyled } from "../../styles/commonStyledComponents";
import { useDispatch } from "react-redux";
import { setCurrentSelectedMenuKey } from "slices/home";
import { WebFeatureLinkTypes } from "enums";

interface MenuCardsProps {
  navs: IMenuNav[];
  urlMapping: Map<string, string>;
  onWidgetClick: (nav: IMenuNav, critical: boolean) => Promise<void>;
  isEventsCountLoading: boolean;
}

export const MenuCards: FunctionComponent<MenuCardsProps> = ({
  navs,
  urlMapping,
  onWidgetClick,
  isEventsCountLoading,
}) => {
  const dispatch = useDispatch();

  const [orgStructureModalVisible, setOrgStructureModalVisible] =
    useState(false);

  const onChangeCallback = (e: any) => {
    dispatch(setCurrentSelectedMenuKey(e.key));
  };

  const drawNav = (nav: IMenuNav, isTitle: boolean) => {
    const anotherSystemUrl = urlMapping.get(nav.linkType);
    if (isTitle) {
      return (
        <MenuStyled.SubMenu key={`sub${nav.id}`} title={nav.name}>
          {nav.children.map((x) => drawNav(x, x.isTitle))}
        </MenuStyled.SubMenu>
      );
    } else {
      return (
        <MenuStyled.Item
          style={{ borderRadius: "16px", whiteSpace: "normal", height: "auto" }}
          key={nav.id}
        >
          <TitleWrapper>
            {nav.route === null ? (
              nav.linkTypeId !== null && !!anotherSystemUrl ? (
                <AStyled
                  href={anotherSystemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {nav.name}
                </AStyled>
              ) : (
                <></>
              )
            ) : nav.linkTypeId === 0 ? (
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
          </TitleWrapper>
        </MenuStyled.Item>
      );
    }
  };  

  // массив личных отчетов
  const userReportsList = [
    {
      id: 1,
      name: 'Отчет 1',
      link: 'report_1'
    },
    {
      id: 2,
      name: 'Отчет 2',
      link: 'report_2'
    },
  ];

  return (
    <>
      <CardColumnsWrapper>
        <MenuCardColumns>
          {/* вывод личных отчетов */}
          {userReportsList.length !== 0 && 
            <MenuCard key={"nav-userReportsList"}>
              <MenuCardTitle>
                <MainTitleWrapper>
                  <BoxIcon>
                    <PushpinFilled />
                  </BoxIcon>
                  <Title isTitle={true}>Мои отчеты</Title>
                </MainTitleWrapper>
              </MenuCardTitle>
              <MenuCard.Body>
                <ReportsMenuStyled mode="inline">
                  <MenuStyled.SubMenu
                    key="subUserReportsList"
                    title="Построить отчет"
                  >
                    {userReportsList.map((report) =>
                      <MenuStyled.Item key={`user-report-${report.id}`}>
                        <TitleWrapper>
                          <LinkStyled
                            target="_blank"
                            to={report.link}
                            rel="noopener noreferrer"
                          >
                            {report.name}
                          </LinkStyled>
                        </TitleWrapper>
                      </MenuStyled.Item>)}
                  </MenuStyled.SubMenu>
                </ReportsMenuStyled>
              </MenuCard.Body>
            </MenuCard>}

          {/* вывод вебфичей из БД */}
          {navs.map((nav) => (
            <MenuCard key={`nav${nav.id}`}>
              <MenuCardTitle>
                <MainTitleWrapper
                  isTitle={nav.isTitle}
                  onClick={() => {
                    if (nav.route === null) {
                      if (nav.linkTypeId !== null) {
                        window.open(urlMapping.get(nav.linkType), "_blank");
                      }
                    } else {
                      if (nav.route === "/orgstructure") {
                        setOrgStructureModalVisible(true);
                      } else {
                        history.push(nav.route);
                      }
                    }
                  }}
                >
                  <BoxIcon>
                    {nav.icon ? <DynamicIcon type={nav.icon} /> : <></>}
                  </BoxIcon>
                  <Title isTitle={nav.isTitle}>{nav.name}</Title>
                </MainTitleWrapper>
              </MenuCardTitle>
              {nav.children.length > 0 ? (
                <MenuCard.Body>
                  <MenuWrapper>
                    <MenuStyled mode="inline" onSelect={onChangeCallback}>
                      {nav.children
                        .filter((x) => x.linkTypeId !== WebFeatureLinkTypes.folder)
                        .map((child) => drawNav(child, child.isTitle))}
                    </MenuStyled>
                  </MenuWrapper>
                  <ReportsMenuStyled mode="inline">
                    {nav.children
                      .filter((x) => x.linkTypeId === WebFeatureLinkTypes.folder)
                      .map((child) => {
                        return drawNav(child, true);
                      })}
                  </ReportsMenuStyled>
                </MenuCard.Body>
              ) : (
                <></>
              )}
              {nav.eventGroup ? (
                <Row style={{ marginTop: 16 }} gutter={16} wrap={false}>
                  <Col span={12}>
                    <Tooltip title="События за последние 7 дней. Нажмите, чтобы посмотреть события.">
                      <CriticalEvents onClick={() => onWidgetClick(nav, true)}>
                        <CriticalEventsName>
                          Критические события
                        </CriticalEventsName>
                        <CriticalEventsCount
                          hasEvents={nav.eventGroup.isCritialCountHasValues}
                        >
                          <Spin spinning={isEventsCountLoading}>
                            {nav.eventGroup.criticalCount}
                          </Spin>
                        </CriticalEventsCount>
                      </CriticalEvents>
                    </Tooltip>
                  </Col>
                  <Col span={12}>
                    <Tooltip title="События за последние 7 дней. Нажмите, чтобы посмотреть события.">
                      <AnotherEvents onClick={() => onWidgetClick(nav, false)}>
                        <AnotherEventsName>Прочие события</AnotherEventsName>
                        <AnotherEventsCount
                          hasEvents={nav.eventGroup.isCountHasValues}
                        >
                          <Spin spinning={isEventsCountLoading}>
                            {nav.eventGroup.count}
                          </Spin>
                        </AnotherEventsCount>
                      </AnotherEvents>
                    </Tooltip>
                  </Col>
                </Row>
              ) : (
                <></>
              )}
            </MenuCard>
          ))}
        </MenuCardColumns>
      </CardColumnsWrapper>
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
