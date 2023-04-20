import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Layout, DatePicker, Form, Row, Col, Checkbox, PageHeader, Select } from "antd";
import Title from "antd/lib/typography/Title";
import moment, { Moment } from "moment";
import React, { FunctionComponent, useState, Key } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { nodeChanged, offOwnedFilter, dateChanged, reportFiltered, rsuFiltered } from "../../actions/siknoffs/creators";
import { SearchTree } from "../../components/SearchTree";
import { SelectedNode, ISiknOffState, FilterDates } from "../../interfaces";
import { StateType, OwnedType } from "../../types";
import locale from "antd/es/date-picker/locale/ru_RU";
import SiknOffContainer from "../../containers/SiknOffContainer";
import { FilterItemLabelStyled, FilterRowStyled, FilterSearchTreeStyled, PageLayoutStyled, SiderFilterStyled, WrapperTreeRowStyled } from "../../styles/commonStyledComponents";

const { Content, Sider } = Layout;
const { RangePicker } = DatePicker;

type InfoType = {
  node: SelectedNode;
};

export const SiknOffPage: FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const pageState = useSelector<StateType, ISiknOffState>(
    (state) => state.siknOffs
  );

  const [currentNodeKey, setCurrentNodeKey] = useState<Key>(pageState.node.key);
  let date = new Date();
  const [startDate, setStartDate] = useState<Date>(
    pageState.filterDates.startDate
  );
  const [endDate, setEndDate] = useState<Date>(pageState.filterDates.endDate);
  const [useInReportsFilter, setUseInReportsFilter] = useState<boolean>(false);
  const [rsuFilter, setRsuFilter] = useState<boolean>(true);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const onSelect = (selectedKeys: React.Key[], info: InfoType) => {
    const change = info.node;
    setCurrentNodeKey(change.key);
    dispatch(nodeChanged(change));
  };

  const ownedFilterChanged = (type: OwnedType) => {
    dispatch(offOwnedFilter(type));
  };

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };



  return (
    <PageLayoutStyled>
      <PageHeader
        style={{ paddingTop: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title="Отключения СИКН"
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
            <Col>
                <FilterItemLabelStyled>Даты</FilterItemLabelStyled>
                <RangePicker
                    locale={locale}
                    value={[moment(startDate), moment(endDate)]}
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
            <Col>
              <Checkbox
                onClick={() => {
                  setUseInReportsFilter(!useInReportsFilter);
                  dispatch(reportFiltered(!useInReportsFilter));
                }}
                checked={useInReportsFilter}
              >
                Отображать не вошедшие в отчет
              </Checkbox>
            </Col>
          </FilterRowStyled>

          <FilterRowStyled $collapsed={collapsed}>
            <Col>
              <Checkbox
                onClick={() => {
                  setRsuFilter(!rsuFilter);
                  dispatch(rsuFiltered(!rsuFilter));
                }}
                checked={rsuFilter}
              >
                Отображать отключения без перехода на РСУ
              </Checkbox>
            </Col>
          </FilterRowStyled>

          <FilterRowStyled $collapsed={collapsed}>
            <Col>
                <FilterItemLabelStyled>Выберите СИКН</FilterItemLabelStyled>
            </Col>
          </FilterRowStyled>
          <WrapperTreeRowStyled $collapsed={collapsed}>
            <Col span={24} style={{ height: "100%" }}>
                <FilterSearchTreeStyled
                  isSiEq={false}
                  treeViewName={"SiknByOstTree"}
                  onSelectCallback={onSelect}
                  ownedFilterChangedCallback={ownedFilterChanged}
                  currentNodeKey={currentNodeKey}
                  ownFilterValue={pageState.ownedFilter}
                  filterDate={endDate}
                />
            </Col>
          </WrapperTreeRowStyled>
        </SiderFilterStyled>

        <Content>
          <SiknOffContainer />
        </Content>
      </Layout>
    </PageLayoutStyled>
  );
};
