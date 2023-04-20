import {
  Button,
  Col,
  Layout,
  PageHeader,
  Row,
  Space,
  Spin,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { history } from "../history/history";
import { SearchEventTypesTree } from "../components/SearchEventTypesTree";
import axios from "axios";
import { apiBase } from "../utils";
import { User } from "../classes/User";
import {
  ResponseUsersEventTypes,
  UsersEventTypes,
} from "../classes/UsersEventTypes";
import EventSettingsContainer from "../containers/EventsSettingsContainer";
import {
  eventSettingsBtnDisabled,
  eventSettingsFillTable,
  mailChecked,
  resetInitialValues,
  resetToAdminBtnDisabled,
  siknTreeChecked,
  siknTreeFetched,
  webChecked,
} from "../actions/eventsettings/creators";
import { SqlTree } from "../classes/SqlTree";
import ReloadOutlined from "@ant-design/icons/ReloadOutlined";
import { NotificationStatus, StateType } from "../types";
import { IEventSettingsState } from "../interfaces";
import {
  FilterItemLabelStyled,
  FilterRowStyled,
  LabelStyled,
  PageLayoutStyled,
  SiderFilterStyled,
  WrapperTreeRowStyled,
} from "../styles/commonStyledComponents";
import RightOutlined from "@ant-design/icons/RightOutlined";
import LeftOutlined from "@ant-design/icons/LeftOutlined";
import Title from "antd/lib/typography/Title";
import CtrlEventsSettingsContainer from "containers/PspsControl/CtrlEventsSettingsContainer";
import {
  ctrleventSettingsBtnDisabled,
  ctrleventSettingsFillTable,
  ctrlmailChecked,
  ctrlresetInitialValues,
  ctrlresetToAdminBtnDisabled,
  ctrlwebChecked,
} from "actions/ctrleventsettings/creators";
import { AbilityContext, ActionsEnum } from "../casl";
import { HomeStateType, setIsCtrlEvents } from "slices/home";

const { Content } = Layout;
const { Paragraph } = Typography;
export var checkedKeysConst: Array<React.Key> = [];

export const EventsSettingsPage: FunctionComponent = () => {
  const dispatch = useDispatch();

  const { user, isCtrlEvents } = useSelector<StateType, HomeStateType>(
    (state) => state.home
  );

  const currentUser = user;
  const eventSettingsState = useSelector<StateType, IEventSettingsState>(
    (state) => state.eventSettings
  );

  const ctrleventSettingsState = useSelector<StateType, IEventSettingsState>(
    (state) => state.ctrleventSettings
  );
  const ability = useContext(AbilityContext);

  const showSwitch =
    ability.can(ActionsEnum.Go, "/events") &&
    ability.can(ActionsEnum.Go, "/pspcontrol/ctrlevents");

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]);
  const [items, setItems] = useState<Array<UsersEventTypes>>([]);
  const [reload, setReload] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  const [ctrlcollapsed, setCtrlCollapsed] = useState<boolean>(false);
  const [ctrlcheckedKeys, setCtrlCheckedKeys] = useState<any[]>([]);
  const [ctrlitems, setCtrlItems] = useState<Array<UsersEventTypes>>([]);
  const [ctrlreload, setCtrlReload] = useState<boolean>(true);
  const [ctrlPageLoading, setCtrlPageLoading] = useState<boolean>(true);

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const onCtrlCollapse = () => {
    setCtrlCollapsed(!ctrlcollapsed);
  };
  const onCheck = (checkedKeys: React.Key[], e: { checkedNodes: any }) => {
    let usersEventTypes: Array<UsersEventTypes> = [];
    e.checkedNodes = e.checkedNodes.filter((x: any) => x.children.length === 0);
    if (e.checkedNodes.length > items.length) {
      let tempArray: Array<UsersEventTypes> = [];

      e.checkedNodes
        .filter((x: any) =>
          items.find((i) => i.treeKey === x.item.key) ? false : true
        )
        .map((node: any) => {
          if (node.children.length === 0) {
            let usersEventType: UsersEventTypes = {
              id: node.item.id,
              eventTypeId: node.item.nodeId,
              eventTypeName: node.item.title,
              treeKey: node.item.key,
              userId: currentUser.id,
              siknList: eventSettingsState.treeKeys,
              webNotificationFlag: eventSettingsState.webChecked.checked,
              mailNotificationFlag: eventSettingsState.mailChecked.checked,
            };
            tempArray.unshift(usersEventType);
          }
        });
      usersEventTypes = tempArray.concat(items);
    } else {
      usersEventTypes = items.filter((x: UsersEventTypes) =>
        e.checkedNodes.find((n: any) => n.item.key === x.treeKey) ? true : false
      );
    }

    setCheckedKeys(checkedKeys);
    setItems(usersEventTypes);
    dispatch(eventSettingsFillTable(usersEventTypes));

    dispatch(eventSettingsBtnDisabled(false));
  };

  const onCtrlCheck = (checkedKeys: React.Key[], e: { checkedNodes: any }) => {
    let usersEventTypes: Array<UsersEventTypes> = [];
    e.checkedNodes = e.checkedNodes.filter((x: any) => x.children.length === 0);
    if (e.checkedNodes.length > ctrlitems.length) {
      let tempArray: Array<UsersEventTypes> = [];

      e.checkedNodes
        .filter((x: any) =>
          ctrlitems.find((i) => i.treeKey === x.item.key) ? false : true
        )
        .map((node: any) => {
          if (node.children.length === 0) {
            let usersEventType: UsersEventTypes = {
              id: node.item.id,
              eventTypeId: node.item.nodeId,
              eventTypeName: node.item.title,
              treeKey: node.item.key,
              userId: currentUser.id,
              siknList: [],
              webNotificationFlag: ctrleventSettingsState.webChecked.checked,
              mailNotificationFlag: ctrleventSettingsState.mailChecked.checked,
            };
            tempArray.unshift(usersEventType);
          }
        });
      usersEventTypes = tempArray.concat(ctrlitems);
    } else {
      usersEventTypes = ctrlitems.filter((x: UsersEventTypes) =>
        e.checkedNodes.find((n: any) => n.item.key === x.treeKey) ? true : false
      );
    }

    setCtrlCheckedKeys(checkedKeys);
    setCtrlItems(usersEventTypes);
    dispatch(ctrleventSettingsFillTable(usersEventTypes));

    dispatch(ctrleventSettingsBtnDisabled(false));
  };

  const onCancelBtn = () => {
    setCheckedKeys(checkedKeysConst);
    dispatch(eventSettingsBtnDisabled(true));
    dispatch(eventSettingsFillTable([]));
    setReload(!reload);
  };

  const onCtrlCancelBtn = () => {
    setCtrlCheckedKeys(checkedKeysConst);
    dispatch(ctrleventSettingsBtnDisabled(true));
    dispatch(ctrleventSettingsFillTable([]));
    setCtrlReload(!ctrlreload);
  };

  useEffect(() => {
    return () => {
      dispatch(resetInitialValues());
      dispatch(ctrlresetInitialValues());
    };
  }, []);

  useEffect(() => {
    if (!isCtrlEvents) {
      setPageLoading(true);
      dispatch(eventSettingsBtnDisabled(true));
      axios
        .get<ResponseUsersEventTypes>(
          `${apiBase}/UsersEventTypes/${currentUser.id}`
        )
        .then((result) => {
          if (!result.data.isAdmin) dispatch(resetToAdminBtnDisabled(false));

          let treeKeys: React.Key[] = [];
          result.data.usersEventTypes.map((item) =>
            treeKeys.push(item.treeKey)
          );
          checkedKeysConst = treeKeys;
          dispatch(eventSettingsFillTable(result.data.usersEventTypes));
          const tableItems: Array<UsersEventTypes> =
            result.data.usersEventTypes;
          const webTrueItems: Array<UsersEventTypes> = tableItems.filter(
            (item: UsersEventTypes) => item.webNotificationFlag === true
          );
          const webFalseItems: Array<UsersEventTypes> = tableItems.filter(
            (item: UsersEventTypes) => item.webNotificationFlag === false
          );
          let webNotificationStatus: NotificationStatus = {
            checked: webFalseItems.length === 0,
            indeterminate: webTrueItems.length > 0 && webFalseItems.length > 0,
          };
          dispatch(webChecked(webNotificationStatus));
          const mailTrueItems: Array<UsersEventTypes> = tableItems.filter(
            (item: UsersEventTypes) => item.mailNotificationFlag === true
          );
          const mailFalseItems: Array<UsersEventTypes> = tableItems.filter(
            (item: UsersEventTypes) => item.mailNotificationFlag === false
          );
          let mailNotificationStatus: NotificationStatus = {
            checked: mailFalseItems.length === 0,
            indeterminate:
              mailTrueItems.length > 0 && mailFalseItems.length > 0,
          };
          dispatch(mailChecked(mailNotificationStatus));
          setItems(result.data.usersEventTypes);
          setCheckedKeys(treeKeys);
          dispatch(siknTreeChecked([]));
          setPageLoading(false);
        });
      axios
        .get<Array<SqlTree>>(`${apiBase}/sqltree?viewName=SiknByOstTree`)
        .then((result) => {
          dispatch(siknTreeFetched(result.data));
        });
    } else {
      dispatch(ctrleventSettingsBtnDisabled(true));
      setCtrlPageLoading(true);
      axios
        .get<ResponseUsersEventTypes>(
          `${apiBase}/UsersCtrlEventTypes/${currentUser.id}`
        )
        .then((result) => {
          if (!result.data.isAdmin)
            dispatch(ctrlresetToAdminBtnDisabled(false));

          let treeKeys: React.Key[] = [];
          result.data.usersEventTypes.map((item) =>
            treeKeys.push(item.treeKey)
          );
          checkedKeysConst = treeKeys;
          dispatch(ctrleventSettingsFillTable(result.data.usersEventTypes));
          const tableItems: Array<UsersEventTypes> =
            result.data.usersEventTypes;
          const webTrueItems: Array<UsersEventTypes> = tableItems.filter(
            (item: UsersEventTypes) => item.webNotificationFlag === true
          );
          const webFalseItems: Array<UsersEventTypes> = tableItems.filter(
            (item: UsersEventTypes) => item.webNotificationFlag === false
          );
          let webNotificationStatus: NotificationStatus = {
            checked: webFalseItems.length === 0,
            indeterminate: webTrueItems.length > 0 && webFalseItems.length > 0,
          };
          dispatch(ctrlwebChecked(webNotificationStatus));
          const mailTrueItems: Array<UsersEventTypes> = tableItems.filter(
            (item: UsersEventTypes) => item.mailNotificationFlag === true
          );
          const mailFalseItems: Array<UsersEventTypes> = tableItems.filter(
            (item: UsersEventTypes) => item.mailNotificationFlag === false
          );
          let mailNotificationStatus: NotificationStatus = {
            checked: mailFalseItems.length === 0,
            indeterminate:
              mailTrueItems.length > 0 && mailFalseItems.length > 0,
          };
          dispatch(ctrlmailChecked(mailNotificationStatus));
          setCtrlItems(result.data.usersEventTypes);
          setCtrlCheckedKeys(treeKeys);
          setCtrlPageLoading(false);
        });
    }
  }, [reload, eventSettingsState.resetToAdmin,ctrleventSettingsState.resetToAdmin, isCtrlEvents, ctrlreload]);

  const isCtrlChanged = () => {
    dispatch(resetInitialValues());
    dispatch(ctrlresetInitialValues());
    dispatch(setIsCtrlEvents(!isCtrlEvents));
  };

  return (
    <PageLayoutStyled>
      <PageHeader
        style={{ paddingTop: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title="Настройка уведомлений"
        subTitle=""
        extra={[
          <Button
            disabled={
              !isCtrlEvents
                ? eventSettingsState.saveBtnDisabled
                : ctrleventSettingsState.saveBtnDisabled
            }
            icon={<ReloadOutlined />}
            onClick={() => {
              !isCtrlEvents ? onCancelBtn() : onCtrlCancelBtn();
            }}
          >
            Сбросить
          </Button>,
        ]}
      >
        <Row justify="space-between">
          <Col>
            <Paragraph>
              Выберите типы уведомлений в дереве, на которые вы хотите
              подписаться. Для дополнительной настройки используйте таблицу.
            </Paragraph>
          </Col>
          {showSwitch && (
            <Col>
              <Row gutter={8}>
                <Col>
                  <LabelStyled isActive={!isCtrlEvents}>АИСМСС</LabelStyled>
                </Col>
                <Col>
                  <Switch
                    style={{ marginBottom: 8 }}
                    checked={isCtrlEvents}
                    onChange={isCtrlChanged}
                  />
                </Col>
                <Col>
                  <LabelStyled isActive={isCtrlEvents}>Надзор</LabelStyled>
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </PageHeader>
      {!isCtrlEvents && (
        <Layout>
          <SiderFilterStyled
            width={400}
            trigger={null}
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
          >
            <Row
              justify={collapsed ? "center" : "space-between"}
              align="middle"
            >
              <Col style={{ display: collapsed ? "none" : "block" }}>
                <Title level={4}>Фильтр</Title>
              </Col>
              <Col>
                {React.createElement(collapsed ? RightOutlined : LeftOutlined, {
                  onClick: onCollapse,
                })}
              </Col>
            </Row>

            <FilterRowStyled $collapsed={collapsed}>
              <Col>
                <FilterItemLabelStyled>
                  Выберите типы событий
                </FilterItemLabelStyled>
              </Col>
            </FilterRowStyled>
            <WrapperTreeRowStyled $collapsed={collapsed}>
              <Col span={24} style={{ height: "100%" }}>
                <SearchEventTypesTree
                  checkedKeys={checkedKeys}
                  onCheckCallback={onCheck}
                  treeViewName={"MssEventTypeTree"}
                />
              </Col>
            </WrapperTreeRowStyled>
          </SiderFilterStyled>

          <Content style={{ minHeight: 280 }}>
            <EventSettingsContainer />
          </Content>
        </Layout>
      )}

      {isCtrlEvents && (
        <Layout>
          <SiderFilterStyled
            width={400}
            trigger={null}
            collapsible
            collapsed={ctrlcollapsed}
            onCollapse={onCtrlCollapse}
          >
            <Row
              justify={ctrlcollapsed ? "center" : "space-between"}
              align="middle"
            >
              <Col style={{ display: ctrlcollapsed ? "none" : "block" }}>
                <Title level={4}>Фильтр</Title>
              </Col>
              <Col>
                {React.createElement(
                  ctrlcollapsed ? RightOutlined : LeftOutlined,
                  {
                    onClick: onCtrlCollapse,
                  }
                )}
              </Col>
            </Row>

            <FilterRowStyled $collapsed={ctrlcollapsed}>
              <Col>
                <FilterItemLabelStyled>
                  Выберите типы событий
                </FilterItemLabelStyled>
              </Col>
            </FilterRowStyled>
            <WrapperTreeRowStyled $collapsed={ctrlcollapsed}>
              <Col span={24} style={{ height: "100%" }}>
                <SearchEventTypesTree
                  checkedKeys={ctrlcheckedKeys}
                  onCheckCallback={onCtrlCheck}
                  treeViewName={"CtrlEventTypeTree"}
                />
              </Col>
            </WrapperTreeRowStyled>
          </SiderFilterStyled>
          <Content style={{ minHeight: 280 }}>
            <CtrlEventsSettingsContainer />
          </Content>
        </Layout>
      )}
    </PageLayoutStyled>
  );
};
