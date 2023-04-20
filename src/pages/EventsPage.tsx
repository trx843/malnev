import {
  Col,
  DatePicker,
  Layout,
  PageHeader,
  Row,
  Select,
  TreeSelect
} from "antd";
import React, { FunctionComponent, useState, useEffect, Key } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FilterDates, IEventsState, SelectedNode } from "../interfaces";
import { history } from "../history/history";
import {
  dateChanged,
  eventLevelFilter,
  eventOwnedFilter,
  eventTypeChanged,
  nodeChanged,
  treeChanged
} from "../actions/events/creators";
import EventsContainer from "../containers/EventsContainer";
import Title from "antd/lib/typography/Title";
import RightOutlined from "@ant-design/icons/RightOutlined";
import LeftOutlined from "@ant-design/icons/LeftOutlined";
import locale from "antd/es/date-picker/locale/ru_RU";
import moment, { Moment } from "moment";
import { MssEventSecurityLevel } from "../classes";
import { SelectValue } from "antd/lib/select";
import axios from "axios";
import { apiBase, siEqTreeConstant, techPosTreeConstant } from "../utils";
import { OwnedType, StateType } from "../types";
import { SqlTree } from "../classes/SqlTree";
import { RouteComponentProps } from "react-router-dom";
import { FilterType } from "../api/params/get-events-params";
import { FilterItemLabelStyled, FilterRowStyled, FilterSearchTreeStyled, PageLayoutStyled, SiderFilterStyled, WrapperTreeRowStyled } from "../styles/commonStyledComponents";

const { Content } = Layout;

const { RangePicker } = DatePicker;

type InfoType = {
  node: SelectedNode;
};

export const EventsPage: FunctionComponent<RouteComponentProps> = props => {
  if (props.history.action !== "PUSH" && props.location.state) {
    props.history.push("/events", undefined);
  }
  const dispatch = useDispatch();

  const pageState = useSelector<StateType, IEventsState>(
    state => state.eventsReducer
  );

  const [viewName, setViewName] = useState<string>(pageState.viewName);
  const [currentNodeKey, setCurrentNodeKey] = useState<Key>(pageState.node.key);

  const [securityLevels, setSecurityLevels] = useState<
    Array<MssEventSecurityLevel>
  >([]);

  const [startDate, setStartDate] = useState<Date>(
    pageState.filterDates.startDate
  );
  const [endDate, setEndDate] = useState<Date>(pageState.filterDates.endDate);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<Array<SqlTree>>([]);

  const onSelect = (selectedKeys: React.Key[], info: InfoType) => {
    const change = info.node;
    setCurrentNodeKey(change.key);
    dispatch(nodeChanged(change));
  };
  const ownedFilterChanged = (type: OwnedType) => {
    dispatch(eventOwnedFilter(type));
  };

  const onTreeChange = (checked: boolean) => {
    let viewName: string = techPosTreeConstant;
    if (checked) {
      viewName = siEqTreeConstant;
      setViewName(viewName);
    } else {
      viewName = techPosTreeConstant;
      setViewName(viewName);
    }
    dispatch(treeChanged(viewName));
  };

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const onLevelChange = (value: number) => {
    dispatch(eventLevelFilter(value));
  };

  useEffect(() => {
    axios
      .get<MssEventSecurityLevel[]>(`${apiBase}/msseventseveritylevels`)
      .then(result => setSecurityLevels(result.data));

    axios
      .get<Array<SqlTree>>(`${apiBase}/sqltree?viewName=MssEventTypeTree`)
      .then(result => setTreeData(result.data));
  }, []);

  const onChange = (value: Array<string>) => {
    dispatch(eventTypeChanged(value));
  };

  const disabledDateNow = (current: moment.Moment) => {
    return current > moment();
  };

  return (
    <PageLayoutStyled>
      <PageHeader
        style={{ paddingTop: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title="События"
        subTitle=""
      />
      <Layout>
        <SiderFilterStyled
          width={280}
          style={{ background: "white" }}
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
            <Col >
                <FilterItemLabelStyled>Даты</FilterItemLabelStyled>
                <RangePicker
                  locale={locale}
                  value={[moment(startDate), moment(endDate)]}
                  disabledDate={disabledDateNow}
                  onCalendarChange={(dates: [Moment, Moment]) => {
                    if (dates != undefined) {
                      let filterDates: FilterDates = {
                        startDate: dates[0].toDate(),
                        endDate: dates[1].toDate()
                      };
                      setStartDate(filterDates.startDate);
                      setEndDate(filterDates.endDate);
                      dispatch(dateChanged(filterDates));
                    }
                  }}
                />
            </Col>
          </FilterRowStyled>

          <FilterRowStyled $collapsed={collapsed}>
            <Col >
              <FilterItemLabelStyled>Тип события</FilterItemLabelStyled>
              <TreeSelect
                allowClear
                showSearch
                filterTreeNode
                treeNodeFilterProp={"title"}
                treeCheckable
                style={{ width: "100%", maxHeight: "25px" }}
                dropdownStyle={{
                  maxHeight: 400,
                  minWidth: 500,
                  overflow: "auto"
                }}
                maxTagCount={0}
                placeholder="Выберите тип события"
                onChange={onChange}
                treeData={treeData}
                defaultValue={pageState.eventTypesFilter}
              />
            </Col>
          </FilterRowStyled>

          <FilterRowStyled $collapsed={collapsed}>
            <Col >
              <FilterItemLabelStyled>Критичность</FilterItemLabelStyled>
              <Select
                allowClear
                style={{ marginTop: 4, width: "100%" }}
                placeholder="Все"
                notFoundContent="Нет данных"
                onChange={onLevelChange}
                defaultValue={pageState.levelFilter as SelectValue}
                options={securityLevels.map(x => ({
                  label: x.shortName,
                  value: x.id,
                  key: x.id
                }))}
              />
            </Col>
          </FilterRowStyled>

          <FilterRowStyled $collapsed={collapsed}>
            <Col>
              <FilterItemLabelStyled>Выберите объект в дереве</FilterItemLabelStyled>
            </Col>
          </FilterRowStyled>
          <WrapperTreeRowStyled $collapsed={collapsed}>
            <Col span={24} style={{ height: "100%" }}>
              <FilterSearchTreeStyled
                isSiEq={true}
                treeViewName={viewName}
                onSelectCallback={onSelect}
                onTreeChangeCallback={onTreeChange}
                ownedFilterChangedCallback={ownedFilterChanged}
                currentNodeKey={currentNodeKey}
                ownFilterValue={pageState.ownedFilter}
                filterDate={endDate}
              />
            </Col>
          </WrapperTreeRowStyled>
        </SiderFilterStyled>

        <Content>
          <EventsContainer
            filter={props.location.state as FilterType}
          />
        </Content>
      </Layout>
    </PageLayoutStyled>
  );
};