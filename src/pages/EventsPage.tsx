import React, { FunctionComponent, useState, useEffect, Key } from "react";
import { useDispatch, useSelector } from "react-redux";
import { history } from "../history/history";
import {
  Col,
  DatePicker,
  Layout,
  PageHeader,
  Row,
  Select,
  TreeSelect
} from "antd";
import {
  FilterDates,
  IEventsState,
  SelectedNode,
  InfoType
} from "../interfaces";
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
import {
  FilterItemLabelStyled,
  FilterRowStyled,
  FilterSearchTreeStyled,
  PageLayoutStyled,
  SiderFilterStyled,
  TkoTreeStyled,
  WrapperTreeRowStyled
} from "../styles/commonStyledComponents";
// import TkoTree from "components/TkoTree";

const { Content } = Layout;

const { RangePicker } = DatePicker;

export const EventsPage: FunctionComponent<RouteComponentProps> = (props) => {
  //console.log("props", props);

  if (props.history.action !== "PUSH" && props.location.state) {
    props.history.push("/events", undefined);
  }

  // получение всех параметров из адресной строки
  const searchParams = new URLSearchParams(props.location.search); 

  const dispatch = useDispatch();

  const pageState = useSelector<StateType, IEventsState>(
    state => state.eventsReducer
  );

  const [viewName, setViewName] = useState<string>(pageState.viewName);
  const [currentNodeKey, setCurrentNodeKey] = useState<Key>(pageState.node.key);

  // получение ключа объекта из адресной строки
  const keyParam = searchParams.get("key"); 

  // создание парамерта для передачи в props дерева
  const urlKey = keyParam ? keyParam : "";

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
    console.log("selectedKeys", selectedKeys);    

    const change = info.node;
    console.log("change.key", change.key);

    /*
    ТН-Восток
    d194b42f-5ccb-11ec-8125-005056b4fde6
    */

    console.log("change", change);

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
          width={260}
          style={{ background: "white" }}
          trigger={null}
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
        >
          <Title level={4}>Фильтр</Title>

          <FilterRowStyled $collapsed={collapsed}>
            <Col>
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
          
          <WrapperTreeRowStyled $collapsed={collapsed}>
            <Col span={24} style={{ height: "100%" }}>
              <FilterItemLabelStyled>Выберите объект в дереве</FilterItemLabelStyled>
              {/* новое дерево ТКО */}
              <TkoTreeStyled urlKey={urlKey} onSelectCallback={onSelect}/>
            </Col>
          </WrapperTreeRowStyled>
        </SiderFilterStyled>

        <Content>
          <EventsContainer filter={props.location.state as FilterType}/>
        </Content>
      </Layout>
    </PageLayoutStyled>
  );
};