import React, { FunctionComponent, Key, useState } from "react";
import { PageHeader, Layout, Row, Col } from "antd";
import { history } from "../../history/history";
import { IMeasRangeState, SelectedNode } from "../../interfaces";
import { useDispatch, useSelector } from "react-redux";
import SiEquipmentLimitsContainer from "../../containers/SiEquipmentLimitsContainer";
import {
  measRangeOwnedFilter,
  nodeChanged,
  treeChanged,
} from "../../actions/measRange/creators";
import Title from "antd/lib/typography/Title";
import RightOutlined from "@ant-design/icons/RightOutlined";
import LeftOutlined from "@ant-design/icons/LeftOutlined";
import { OwnedType, StateType } from "../../types";
import { siEqTreeConstant, techPosTreeConstant } from "../../utils";
import { ShowType } from "../../enums";
import { RouteComponentProps } from "react-router-dom";
import { SiEquipmentLimits } from "../../classes/SiEquipmentLimits";
import { FilterItemLabelStyled, FilterRowStyled, FilterSearchTreeStyled, PageLayoutStyled, PageStyledTabs, SiderFilterStyled, WrapperTreeRowStyled } from "../../styles/commonStyledComponents";

type InfoType = {
  node: SelectedNode;
};

export const SiEquipmentLimitsPage: FunctionComponent<RouteComponentProps> = (props) => {
  const { Content } = Layout;
  const dispatch = useDispatch();

  if (props.history.action !== "PUSH" && props.location.state) {
    props.history.push("/measrange", undefined);
  }

  const pageState = useSelector<StateType, IMeasRangeState>(
    (state) => state.measRange
  );

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [treeLabel, setTreeLabel] = useState<string>("объект в дереве");
  const [viewName, setViewName] = useState<string>(pageState.viewName);
  const [currentNodeKey, setCurrentNodeKey] = useState<Key>(pageState.node.key);

  const onCollapse = () => {
    setCollapsed(!collapsed);
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
    dispatch(measRangeOwnedFilter(type));
  };

  return (
    <PageLayoutStyled>
      <PageHeader
        style={{ paddingTop: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title="Диапазон измерений"
        subTitle=""
      />
      <PageStyledTabs
        size={"small"}
        defaultActiveKey="siEquipment"
        destroyInactiveTabPane={true}
      >
        <PageStyledTabs.TabPane key="siLimits" tab="Диапазоны СИ">
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
                    showType={ShowType.Limits}
                  />
                  </Col>
                </WrapperTreeRowStyled>
              </SiderFilterStyled>
              <Content>
                <SiEquipmentLimitsContainer
                  measRange={
                    props.location.state as SiEquipmentLimits[] | undefined
                  }
                  isSikn={false}
                />
              </Content>
            </Layout>
        </PageStyledTabs.TabPane>

        <PageStyledTabs.TabPane key="siknLimits" tab="Диапазоны СИКН">
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
                    showType={ShowType.Limits}
                  />
                  </Col>
                </WrapperTreeRowStyled>
              </SiderFilterStyled>
              <Content>
                <SiEquipmentLimitsContainer
                  measRange={
                    props.location.state as SiEquipmentLimits[] | undefined
                  }
                  isSikn={true}
                />
              </Content>
            </Layout>
        </PageStyledTabs.TabPane>
      </PageStyledTabs>
    </PageLayoutStyled>
  );
};
