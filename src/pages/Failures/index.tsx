import React, { FunctionComponent, Key, useEffect, useState } from "react";
import { PageHeader, Layout, Row, Col, DatePicker, Select } from "antd";
import { history } from "../../history/history";
import FailuresContainer from "../../containers/FailuresContainer";
import { SearchTree } from "../../components/SearchTree";
import {
  dateChanged,
  failureOwnedFilter,
  failuresConseqChanged,
  failuresTypeChanged,
  nodeChanged,
  treeChanged
} from "../../actions/failures/creators";
import { useDispatch, useSelector } from "react-redux";
import { FilterDates, IFailuresState, SelectedNode } from "../../interfaces";
import Title from "antd/lib/typography/Title";
import RightOutlined from "@ant-design/icons/RightOutlined";
import LeftOutlined from "@ant-design/icons/LeftOutlined";
import locale from "antd/es/date-picker/locale/ru_RU";
import moment, { Moment } from "moment";
import { OwnedType, StateType } from "../../types";
import { apiBase, siEqTreeConstant, techPosTreeConstant } from "../../utils";
import { RouteComponentProps } from "react-router";
import { FailureConsequences, Failures, MssFailureTypes } from "../../classes";
import axios from "axios";
import { SelectValue } from "antd/lib/select";
import { FilterItemLabelStyled, FilterRowStyled, FilterSearchTreeStyled, PageLayoutStyled, SiderFilterStyled, WrapperTreeRowStyled } from "../../styles/commonStyledComponents";

const { Content } = Layout;
 
const { RangePicker } = DatePicker;

type InfoType = {
  node: SelectedNode;
};

export const FailuresPage: FunctionComponent<RouteComponentProps> = props => {
  if (props.history.action !== "PUSH" && props.location.state) {
    props.history.push("/failures", undefined);
  }
  const dispatch = useDispatch();
  const pageState = useSelector<StateType, IFailuresState>(
    state => state.failures
  );

  const [viewName, setViewName] = useState<string>(pageState.viewName);
  const [currentNodeKey, setCurrentNodeKey] = useState<Key>(pageState.node.key);

  const [startDate, setStartDate] = useState<Date>(
    pageState.filterDates.startDate
  );
  const [endDate, setEndDate] = useState<Date>(pageState.filterDates.endDate);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mssFailureTypes, setMssFailureTypes] = useState<MssFailureTypes[]>([]);
  const [mssFailureCons, setMssFailureCons] = useState<FailureConsequences[]>(
    []
  );

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    let mInfo = info as InfoType;
    const change = mInfo.node;
    dispatch(nodeChanged(change));
  };

  const ownedFilterChanged = (type: OwnedType) => {
    dispatch(failureOwnedFilter(type));
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

  const onTypeChange = (value: Array<number>) => {
    dispatch(failuresTypeChanged(value));
  };

  const onConsChange = (value: Array<number>) => {
    dispatch(failuresConseqChanged(value));
  };

  useEffect(() => {
    axios
      .get<MssFailureTypes[]>(`${apiBase}/MssFailureTypes`)
      .then(result => setMssFailureTypes(result.data));
    axios
      .get<FailureConsequences[]>(`${apiBase}/FailureConsequences`)
      .then(result => setMssFailureCons(result.data));
  }, []);

  const disabledDateNow = (current: moment.Moment) => {
    // Can not select days before today and today
    return current > moment();
  };

  return (
    <PageLayoutStyled>
      <PageHeader
        style={{ paddingTop: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title="Отказы"
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
                {React.createElement(
                  collapsed ? RightOutlined : LeftOutlined,
                    {
                      onClick: onCollapse
                    }
                )}
              </Col>
            </Row>
            
              <FilterRowStyled $collapsed={collapsed}>
                <Col >
                  <FilterItemLabelStyled>Даты</FilterItemLabelStyled>
                  <RangePicker
                    locale={locale}
                    value={[moment(startDate), moment(endDate)]}
                    disabledDate={disabledDateNow}
                    onChange={(
                        dates: [Moment, Moment],
                        formatString: [string, string]
                    ) => {
                        if (dates != undefined) {
                            let filterDates: FilterDates = {
                                startDate: dates[0].toDate(),
                                endDate: dates[1].toDate(),
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
                  <FilterItemLabelStyled>Тип отказа</FilterItemLabelStyled>
                  <Select
                    allowClear
                    mode="multiple"
                    maxTagCount={1}
                    maxTagTextLength={14}
                    showSearch
                    optionFilterProp={"label"}
                    style={{ marginTop: 4, width: "100%" }}
                    dropdownStyle={{ width: 250 }}
                    placeholder="Все"
                    notFoundContent="Нет данных"
                    onChange={onTypeChange}
                    defaultValue={
                      pageState.failureTypeFilter as SelectValue
                    }
                    options={mssFailureTypes.map(x => ({
                      label: `${x.id}) ${x.shortName}`,
                      value: x.id,
                      key: x.id
                    }))}
                  />
                </Col>
              </FilterRowStyled>

              <FilterRowStyled $collapsed={collapsed}>
                <Col >
                  <FilterItemLabelStyled>Последствия отказа</FilterItemLabelStyled>
                  <Select
                    allowClear
                    mode="multiple"
                    showSearch
                    optionFilterProp={"label"}
                    maxTagCount={1}
                    maxTagTextLength={15}
                    style={{ marginTop: 4, width: "100%" }}
                    placeholder="Все"
                    notFoundContent="Нет данных"
                    onChange={onConsChange}
                    defaultValue={
                      pageState.failureConsequenceFilter as SelectValue
                    }
                    options={mssFailureCons.map(x => ({
                      label: x.shortName,
                      value: x.id,
                      key: x.id
                    }))}
                  />
                </Col>
              </FilterRowStyled>

              <FilterRowStyled $collapsed={collapsed}>
                <Col >
                  <FilterItemLabelStyled>Выберите объект в дереве</FilterItemLabelStyled>
                </Col>
              </FilterRowStyled>
              <WrapperTreeRowStyled $collapsed={collapsed}>
                <Col span={24} style={{ height: "100%" }}>
                  <FilterSearchTreeStyled
                    treeViewName={viewName}
                    isSiEq={true}
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
          
          <Content style={{ minHeight: 280 }}>
            <FailuresContainer
              failures={props.location.state as Failures[] | undefined}
              isSiTypeTree={viewName === siEqTreeConstant}
            />
          </Content>
        </Layout>
    </PageLayoutStyled>
  );
};
