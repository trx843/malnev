import React, { FunctionComponent, Key, useEffect, useState } from "react";
import { PageHeader, Layout, Row, Col } from "antd";
import { history } from "../history/history";
import { IDataSiState, SelectedNode } from "../interfaces";
import { useDispatch, useSelector } from "react-redux";
import DataSiContainer from "../containers/DataSiContainer";
import { SqlTree } from "../classes/SqlTree";
import {
  dataSiNodeChanged,
  dataSiOwnedFilter,
  dataSiTreeChanged,
} from "../actions/dataSi/creators";
import axios from "axios";
import { apiBase, siEqTreeConstant, techPosTreeConstant } from "../utils";
import { OwnedType, StateType } from "../types";
import {
  FilterItemLabelStyled,
  FilterRowStyled,
  FilterSearchTreeStyled,
  PageLayoutStyled,
  SiderFilterStyled,
  WrapperTreeRowStyled,
} from "../styles/commonStyledComponents";
import Title from "antd/lib/typography/Title";
import RightOutlined from "@ant-design/icons/RightOutlined";
import LeftOutlined from "@ant-design/icons/LeftOutlined";
import { ShowType } from "enums";

type InfoType = {
  node: SelectedNode;
};

export const DataSiPage: FunctionComponent = () => {
  const { Content } = Layout;
  const dispatch = useDispatch();

  const pageState = useSelector<StateType, IDataSiState>(
    (state) => state.dataSi
  );

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [treeLabel, setTreeLabel] = useState<string>("объект в дереве");
  const [viewName, setViewName] = useState<string>(pageState.viewName);
  const [currentNodeKey, setCurrentNodeKey] = useState<Key>(pageState.node?.key ?? '');


  const onCollapse = () => {
    setCollapsed(!collapsed);
  };
  const onSelect = (selectedKeys: React.Key[], info: InfoType) => {
    dispatch(dataSiNodeChanged(selectedKeys.length > 0 ? info.node : undefined));
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
    dispatch(dataSiTreeChanged(treeName));
  };
  const ownedFilterChanged = (type: OwnedType) => {
    dispatch(dataSiOwnedFilter(type));
  };

  return (
    <PageLayoutStyled>
      <PageHeader
        style={{ paddingTop: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title="Сведение по СИ и оборудованию"
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
          <Row justify={collapsed ? "center" : "space-between"} align="middle">
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
                Выберите {treeLabel}
              </FilterItemLabelStyled>
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
                showType={ShowType.SiEditor}
              />
            </Col>
          </WrapperTreeRowStyled>
        </SiderFilterStyled>
        <Content>
          <DataSiContainer />
        </Content>
      </Layout>
    </PageLayoutStyled>
  );
};
