import React, { FunctionComponent, Key, useEffect, useState } from "react";
import { PageHeader, Layout, DatePicker, Row, Col } from "antd";
import { history } from "../../history/history";
import { FilterDates, ICoefsState, SelectedNode } from "../../interfaces";
import { useDispatch, useSelector } from "react-redux";
import {
  coefOwnedFilter,
  dateChanged,
  nodeChanged,
  treeChanged,
} from "../../actions/coefs/creators";
import CoefsContainer from "../../containers/CoefsContainer";
import { OwnedType, StateType } from "../../types";
import { ShowType } from "../../enums";
import { RouteComponentProps } from "react-router";
import { CoefChangeEventSigns } from "../../classes/CoefChangeEventSigns";
import { FilterItemLabelStyled, FilterRowStyled, FilterSearchTreeStyled, PageLayoutStyled, SiderFilterStyled, WrapperTreeRowStyled } from "../../styles/commonStyledComponents";
import moment, { Moment } from "moment";
import { siEqTreeConstant, techPosTreeConstant } from "../../utils";
import Title from "antd/lib/typography/Title";
import RightOutlined from "@ant-design/icons/RightOutlined";
import { LeftOutlined } from "@ant-design/icons";
import locale from "antd/es/date-picker/locale/ru_RU";

type InfoType = {
  node: SelectedNode;
};
 
export const CoefsPage: FunctionComponent<RouteComponentProps> = (props) => {
  const { Content } = Layout;

  if (props.history.action !== "PUSH" && props.location.state) {
    props.history.push("/coefs", undefined);
  }

  const pageState = useSelector<StateType, ICoefsState>((state) => state.coefs);

  const { RangePicker } = DatePicker;
    const dispatch = useDispatch();
    
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Date | undefined>(pageState.filterDates.startDate);
    const [endDate, setEndDate] = useState<Date | undefined>(pageState.filterDates.endDate);
    const [treeLabel, setTreeLabel] = useState<string>("объект в дереве");
    const [viewName, setViewName] = useState<string>(pageState.viewName);
    const [currentNodeKey, setCurrentNodeKey] = useState<Key>(pageState.node.key);

    
    const onCollapse = () => {
        setCollapsed(!collapsed);
    };
    const disabledDateNow = (current: moment.Moment) => {
        // Can not select days before today and today
        return current > moment();
    };
    const onSelect = (selectedKeys: React.Key[], info: InfoType) => {
        dispatch(nodeChanged(info.node));
    };
    const onTreeChange = (checked: boolean) => {
        let treeName: string = techPosTreeConstant;
        if (checked) {
          treeName = siEqTreeConstant;
          setViewName(treeName);
        } else {
          treeName = techPosTreeConstant;
          setViewName(treeName);
        }
        dispatch(treeChanged(treeName));
    };
    const ownedFilterChanged = (type: OwnedType) => {
        dispatch(coefOwnedFilter(type));
    };
  
  return (
    <PageLayoutStyled>
      <PageHeader
        style={{ paddingTop: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title="Изменения коэффициентов преобразования СИ"
        subTitle=""
      />
        <Layout>
          <SiderFilterStyled
            width={280}
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
            {dateChanged && <FilterRowStyled $collapsed={collapsed}>
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
            </FilterRowStyled>}
            <FilterRowStyled $collapsed={collapsed}>
              <Col>
                <FilterItemLabelStyled>Выберите {treeLabel}</FilterItemLabelStyled>
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
                    showType={ShowType.Coefs}
                    filterDate={endDate}
                />
              </Col>
            </WrapperTreeRowStyled>
          </SiderFilterStyled>
          <Content>
            <CoefsContainer
              coef={props.location.state as CoefChangeEventSigns[] | undefined}
            />
          </Content>
        </Layout>
    </PageLayoutStyled>
  );
};
