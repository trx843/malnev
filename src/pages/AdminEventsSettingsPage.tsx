import {
  Button,
  Col,
  Layout,
  PageHeader,
  Row,
  Select,
  Switch,
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
import { GroupsEventTypes } from "../classes/GroupsEventTypes";
import { SqlTree } from "../classes/SqlTree";
import ReloadOutlined from "@ant-design/icons/ReloadOutlined";
import { NotificationStatus, StateType } from "../types";
import { Groups } from "../classes/Groups";
import {
  groupEventSettingsBtnDisabled,
  groupEventSettingsFillTable,
  groupMailChecked,
  groupSiknTreeChecked,
  groupSiknTreeFetched,
  groupWebChecked,
  changeCurrentGroup,
  resetGroupInitialValues,
} from "../actions/groupeventsettings/creators";
import GroupEventsSettingsContainer from "../containers/GroupEventsSettingsContainer";
import { IGroupEventSettingsState } from "../interfaces";
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
import CtrlGroupEventsSettingsContainer from "containers/PspsControl/CtrlGroupEventsSettingsContainer";
import {
  ctrlchangeCurrentGroup,
  ctrlgroupEventSettingsBtnDisabled,
  ctrlgroupEventSettingsFillTable,
  ctrlgroupMailChecked,
  ctrlgroupWebChecked,
  ctrlresetGroupInitialValues,
} from "actions/ctrlgroupeventsettings/creators";
import { AbilityContext, ActionsEnum } from "../casl";
import { HomeStateType, setIsCtrlEvents } from "slices/home";

const { Content } = Layout;
const { Paragraph } = Typography;
export var checkedKeysConst: Array<React.Key> = [];

export const AdminEventsSettingsPage: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { isCtrlEvents } = useSelector<StateType, HomeStateType>(
    (state) => state.home
  );

  const eventSettingsState = useSelector<StateType, IGroupEventSettingsState>(
    (state) => state.groupEventSettings
  );

  const ctrleventSettingsState = useSelector<StateType, IGroupEventSettingsState>(
    (state) => state.ctrlgroupEventSettings
  );
  const ability = useContext(AbilityContext);

  const showSwitch =
    ability.can(ActionsEnum.Go, "/events") &&
    ability.can(ActionsEnum.Go, "/pspcontrol/ctrlevents");

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [items, setItems] = useState<Array<GroupsEventTypes>>([]);
  const [reload, setReload] = useState<boolean>(true);

  const [ctrlcollapsed, setCtrlCollapsed] = useState<boolean>(false);
  const [ctrlcheckedKeys, setCtrlCheckedKeys] = useState<React.Key[]>([]);
  const [ctrlitems, setCtrlItems] = useState<Array<GroupsEventTypes>>([]);
  const [ctrlreload, setCtrlReload] = useState<boolean>(true);

  const [groups, setGroups] = useState<Array<Groups>>([]);
  const [currentGroup, setCurrentGroup] = useState<string>();

  const [ctrlcurrentGroup, setCtrlCurrentGroup] = useState<string>();

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const onCtrlCollapse = () => {
    setCtrlCollapsed(!ctrlcollapsed);
  };

  const onCheck = (checkedKeys: React.Key[], e: { checkedNodes: any }) => {
    let groupsEventTypes: Array<GroupsEventTypes> = [];
    e.checkedNodes = e.checkedNodes.filter((x: any) => x.children.length === 0);
    if (e.checkedNodes.length > items.length) {
      let tempArray: Array<GroupsEventTypes> = [];

      e.checkedNodes
        .filter((x: any) =>
          items.find((i) => i.treeKey === x.item.key) ? false : true
        )
        .map((node: any) => {
          if (node.children.length === 0) {
            if (currentGroup) {
              let usersEventType: GroupsEventTypes = {
                id: node.item.id,
                eventTypeId: node.item.nodeId,
                eventTypeName: node.item.title,
                treeKey: node.item.key,
                groupId: currentGroup,
                siknList: eventSettingsState.treeKeys,
                webNotificationFlag: eventSettingsState.webChecked.checked,
                mailNotificationFlag: eventSettingsState.mailChecked.checked,
              };
              tempArray.unshift(usersEventType);
            }
          }
        });
      groupsEventTypes = tempArray.concat(items);
    } else {
      groupsEventTypes = items.filter((x: GroupsEventTypes) =>
        e.checkedNodes.find((n: any) => n.item.key === x.treeKey) ? true : false
      );
    }

    setCheckedKeys(checkedKeys);
    setItems(groupsEventTypes);
    dispatch(groupEventSettingsFillTable(groupsEventTypes));
    dispatch(groupEventSettingsBtnDisabled(false));
  };

  const onCtrlCheck = (checkedKeys: React.Key[], e: { checkedNodes: any }) => {
    let groupsEventTypes: Array<GroupsEventTypes> = [];
    e.checkedNodes = e.checkedNodes.filter((x: any) => x.children.length === 0);
    if (e.checkedNodes.length > ctrlitems.length) {
      let tempArray: Array<GroupsEventTypes> = [];

      e.checkedNodes
        .filter((x: any) =>
          ctrlitems.find((i) => i.treeKey === x.item.key) ? false : true
        )
        .map((node: any) => {
          if (node.children.length === 0) {
            if (ctrlcurrentGroup) {
              let usersEventType: GroupsEventTypes = {
                id: node.item.id,
                eventTypeId: node.item.nodeId,
                eventTypeName: node.item.title,
                treeKey: node.item.key,
                groupId: ctrlcurrentGroup,
                siknList: [],
                webNotificationFlag: ctrleventSettingsState.webChecked.checked,
                mailNotificationFlag:
                  ctrleventSettingsState.mailChecked.checked,
              };
              tempArray.unshift(usersEventType);
            }
          }
        });
      groupsEventTypes = tempArray.concat(ctrlitems);
    } else {
      groupsEventTypes = ctrlitems.filter((x: GroupsEventTypes) =>
        e.checkedNodes.find((n: any) => n.item.key === x.treeKey) ? true : false
      );
    }

    setCtrlCheckedKeys(checkedKeys);
    setCtrlItems(groupsEventTypes);
    dispatch(ctrlgroupEventSettingsFillTable(groupsEventTypes));
    dispatch(ctrlgroupEventSettingsBtnDisabled(false));
  };

  const onCancelBtn = () => {
    setCheckedKeys(checkedKeysConst);
    dispatch(groupEventSettingsBtnDisabled(true));
    dispatch(groupEventSettingsFillTable([]));
    setReload(!reload);
  };

  const onCtrlCancelBtn = () => {
    setCtrlCheckedKeys(checkedKeysConst);
    dispatch(ctrlgroupEventSettingsBtnDisabled(true));
    dispatch(ctrlgroupEventSettingsFillTable([]));
    setCtrlReload(!ctrlreload);
  };

  useEffect(() => {
    if (!isCtrlEvents) {
      if (currentGroup) {
        axios
          .get<Array<GroupsEventTypes>>(
            `${apiBase}/GroupsEventTypes/${currentGroup}`
          )
          .then((result) => {
            let treeKeys: React.Key[] = [];
            result.data.map((item) => treeKeys.push(item.treeKey));
            checkedKeysConst = treeKeys;
            dispatch(groupEventSettingsFillTable(result.data));
            const tableItems: Array<GroupsEventTypes> = result.data;
            const webTrueItems: Array<GroupsEventTypes> = tableItems.filter(
              (item: GroupsEventTypes) => item.webNotificationFlag === true
            );
            const webFalseItems: Array<GroupsEventTypes> = tableItems.filter(
              (item: GroupsEventTypes) => item.webNotificationFlag === false
            );
            let webNotificationStatus: NotificationStatus = {
              checked: webFalseItems.length === 0,
              indeterminate:
                webTrueItems.length > 0 && webFalseItems.length > 0,
            };
            dispatch(groupWebChecked(webNotificationStatus));
            const mailTrueItems: Array<GroupsEventTypes> = tableItems.filter(
              (item: GroupsEventTypes) => item.mailNotificationFlag === true
            );
            const mailFalseItems: Array<GroupsEventTypes> = tableItems.filter(
              (item: GroupsEventTypes) => item.mailNotificationFlag === false
            );
            let mailNotificationStatus: NotificationStatus = {
              checked: mailFalseItems.length === 0,
              indeterminate:
                mailTrueItems.length > 0 && mailFalseItems.length > 0,
            };
            dispatch(groupMailChecked(mailNotificationStatus));
            setItems(result.data);
            setCheckedKeys(treeKeys);
            dispatch(groupSiknTreeChecked([]));
          });
      }
      axios
        .get<Array<SqlTree>>(`${apiBase}/sqltree?viewName=SiknByOstTree`)
        .then((result) => {
          dispatch(groupSiknTreeFetched(result.data));
        });
    } else {
      if (ctrlcurrentGroup) {
        axios
          .get<Array<GroupsEventTypes>>(
            `${apiBase}/GroupsCtrlEventTypes/${ctrlcurrentGroup}`
          )
          .then((result) => {
            let treeKeys: React.Key[] = [];
            result.data.map((item) => treeKeys.push(item.treeKey));
            checkedKeysConst = treeKeys;
            dispatch(ctrlgroupEventSettingsFillTable(result.data));
            const tableItems: Array<GroupsEventTypes> = result.data;
            const webTrueItems: Array<GroupsEventTypes> = tableItems.filter(
              (item: GroupsEventTypes) => item.webNotificationFlag === true
            );
            const webFalseItems: Array<GroupsEventTypes> = tableItems.filter(
              (item: GroupsEventTypes) => item.webNotificationFlag === false
            );
            let webNotificationStatus: NotificationStatus = {
              checked: webFalseItems.length === 0,
              indeterminate:
                webTrueItems.length > 0 && webFalseItems.length > 0,
            };
            dispatch(ctrlgroupWebChecked(webNotificationStatus));
            const mailTrueItems: Array<GroupsEventTypes> = tableItems.filter(
              (item: GroupsEventTypes) => item.mailNotificationFlag === true
            );
            const mailFalseItems: Array<GroupsEventTypes> = tableItems.filter(
              (item: GroupsEventTypes) => item.mailNotificationFlag === false
            );
            let mailNotificationStatus: NotificationStatus = {
              checked: mailFalseItems.length === 0,
              indeterminate:
                mailTrueItems.length > 0 && mailFalseItems.length > 0,
            };
            dispatch(ctrlgroupMailChecked(mailNotificationStatus));
            setCtrlItems(result.data);
            setCtrlCheckedKeys(treeKeys);
          });
      }
    }
  }, [reload, currentGroup, isCtrlEvents, ctrlreload, ctrlcurrentGroup]);

  useEffect(() => {
    axios.get<Array<Groups>>(`${apiBase}/groups`).then((result) => {
      setGroups(result.data);
    });
    return () => {
      dispatch(resetGroupInitialValues());
      dispatch(ctrlresetGroupInitialValues());
    };
  }, []);

  const isCtrlChanged = () => {
    dispatch(resetGroupInitialValues());
    dispatch(ctrlresetGroupInitialValues());
    dispatch(setIsCtrlEvents(!isCtrlEvents));
    setCtrlCurrentGroup("");
    setCurrentGroup("");
    setCtrlCheckedKeys([]);
    setCheckedKeys([]);
  };

  return (
    <PageLayoutStyled>
      <PageHeader
        style={{ paddingTop: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title={"Настройка уведомлений"}
        subTitle=""
        extra={[
          <Button
            disabled={eventSettingsState.saveBtnDisabled}
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
                <FilterItemLabelStyled>Выберите группу</FilterItemLabelStyled>
              </Col>
            </FilterRowStyled>
            <FilterRowStyled $collapsed={collapsed}>
              <Col span={24} style={{ height: "100%" }}>
                <Select
                  showSearch
                  placeholder={"Выберите группу"}
                  notFoundContent={"Нет данных"}
                  style={{ width: "90%" }}
                  optionFilterProp={"label"}
                  options={groups.map((x) => ({
                    label: `${x.domain}\\${x.name}`,
                    value: x.id,
                    key: x.id,
                  }))}
                  onChange={(value: string) => {
                    setCurrentGroup(value);
                    dispatch(changeCurrentGroup(value));
                  }}
                />
              </Col>
            </FilterRowStyled>

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
                  disabled={currentGroup ? false : true}
                  checkedKeys={checkedKeys}
                  onCheckCallback={onCheck}
                  treeViewName={"MssEventTypeTree"}
                />
              </Col>
            </WrapperTreeRowStyled>
          </SiderFilterStyled>

          <Content style={{ minHeight: 280 }}>
            <GroupEventsSettingsContainer />
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
              <Col style={{ display: collapsed ? "none" : "block" }}>
                <Title level={4}>Фильтр</Title>
              </Col>
              <Col>
                {React.createElement(collapsed ? RightOutlined : LeftOutlined, {
                  onClick: onCtrlCollapse,
                })}
              </Col>
            </Row>

            <FilterRowStyled $collapsed={ctrlcollapsed}>
              <Col>
                <FilterItemLabelStyled>Выберите группу</FilterItemLabelStyled>
              </Col>
            </FilterRowStyled>
            <FilterRowStyled $collapsed={ctrlcollapsed}>
              <Col span={24} style={{ height: "100%" }}>
                <Select
                  showSearch
                  placeholder={"Выберите группу"}
                  style={{ width: "90%" }}
                  notFoundContent={"Нет данных"}
                  optionFilterProp={"label"}
                  options={groups.map((x) => ({
                    label: `${x.domain}\\${x.name}`,
                    value: x.id,
                    key: x.id,
                  }))}
                  onChange={(value: string) => {
                    setCtrlCurrentGroup(value);
                    dispatch(ctrlchangeCurrentGroup(value));
                  }}
                />
              </Col>
            </FilterRowStyled>

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
                  disabled={ctrlcurrentGroup ? false : true}
                  checkedKeys={ctrlcheckedKeys}
                  onCheckCallback={onCtrlCheck}
                  treeViewName={"CtrlEventTypeTree"}
                />
              </Col>
            </WrapperTreeRowStyled>
          </SiderFilterStyled>

          <Content style={{ minHeight: 280 }}>
            <CtrlGroupEventsSettingsContainer />
          </Content>
        </Layout>
      )}
    </PageLayoutStyled>
  );
};
