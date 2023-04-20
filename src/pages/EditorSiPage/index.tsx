import React, { FunctionComponent, Key, useState } from "react";
import { PageHeader, Layout, Row, Col, Checkbox } from "antd";
import { history } from "../../history/history";
import {
  IEditorSiMapState,
  ISiEquipmentState,
  SelectedNode,
} from "../../interfaces";
import { useDispatch, useSelector } from "react-redux";
import {
  siEqArchiveFiltered,
  siEqOwnedFilter,
} from "../../actions/editorSiEquipment/creators";
import {
  siBindingNodeChanged,
  treeChanged,
  siBindingOwnedFilter,
  siBindingArchiveFiltered,
} from "../../actions/editorSiMap/creators";
import EditorSiMapContainer from "../../containers/EditorSiMapContainer";
import EditorSiModelContainer from "../../containers/EditorSiModelContainer";
import SiEquipmentContainer from "../../containers/SiEquipmentContainer";
import { siEqNodeChanged } from "../../actions/editorSiEquipment/creators";
import { siEqTreeConstant, techPosTreeConstant, zeroGuid } from "../../utils";
import { SqlTree } from "../../classes/SqlTree";
import { OwnedType, StateType } from "../../types";
import { RouteComponentProps } from "react-router";
import { SiEquipment } from "../../classes";
import {
  FilterItemLabelStyled,
  FilterRowStyled,
  FilterSearchTreeStyled,
  PageLayoutStyled,
  PageStyledTabs,
  SiderFilterStyled,
  WrapperTreeRowStyled,
} from "../../styles/commonStyledComponents";
import Title from "antd/lib/typography/Title";
import RightOutlined from "@ant-design/icons/RightOutlined";
import { LeftOutlined } from "@ant-design/icons";
import { siModelArchiveFiltered } from "../../actions/editorSiModel/creators";
import { ShowType } from "enums";

type InfoType = {
  node: SelectedNode;
};

const { Content } = Layout;

export const EditorSiPage: FunctionComponent<RouteComponentProps> = (props) => {
  const dispatch = useDispatch();
  if (props.history.action !== "PUSH" && props.location.state) {
    props.history.push("/editorsi", undefined);
  }

  const editorSiEqState = useSelector<StateType, ISiEquipmentState>(
    (state) => state.editorSiEq
  );
  const [collapsedSiEq, setCollapsedSiEq] = useState<boolean>(false);
  const [treeLabelSiEq, setTreeLabelSiEq] = useState<string>("объект в дереве");
  const [viewNameSiEq, setViewNameSiEq] = useState<string>(
    editorSiEqState.viewName
  );
  const [currentNodeKeySiEq, setCurrentNodeKeySiEq] = useState<Key>(
    editorSiEqState.node?.key ?? ''
  );

  const editorSiMapState = useSelector<StateType, IEditorSiMapState>(
    (state) => state.editorSiMap
  );
  const [collapsedSiBinding, setCollapsedSiBinding] = useState<boolean>(false);
  const [treeLabelSiBinding, setTreeLabelSiBinding] =
    useState<string>("объект в дереве");
  const [viewNameSiBinding, setViewNameSiBinding] = useState<string>(
    editorSiMapState.viewName
  );
  const [currentNodeKeySiBinding, setCurrentNodeKeySiBinding] = useState<Key>(
    editorSiMapState.node?.key ?? ''
  );


  const [collapsedSiModel, setCollapsedSiModel] = useState<boolean>(false);

  const [isEditorSiEqArchiveFilter, setIsEditorSiEqArchiveFilter] =
    useState<boolean>(false);

  const [isEditorSiMapArchiveFilter, setIsEditorSiMapArchiveFilter] =
    useState<boolean>(false);

  const [isEditorSiModelArchiveFilter, setIsEditorSiModelArchiveFilter] =
    useState<boolean>(false);

  const onCollapseSiEq = () => {
    setCollapsedSiEq(!collapsedSiEq);
  };
  const onSelectSiEq = (selectedKeys: React.Key[], info: InfoType) => {
    dispatch(siEqNodeChanged(selectedKeys.length > 0 ? info.node : undefined));
  };
  const onTreeChangeSiEq = (checked: boolean) => {
    let treeName: string = techPosTreeConstant;
    if (checked) {
      treeName = siEqTreeConstant;
      setViewNameSiEq(treeName);
    } else {
      treeName = techPosTreeConstant;
      setViewNameSiEq(treeName);
    }
    dispatch(treeChanged(treeName));
  };
  const ownedFilterChangedSiEq = (type: OwnedType) => {
    dispatch(siEqOwnedFilter(type));
  };

  const onCollapseSiBinding = () => {
    setCollapsedSiBinding(!collapsedSiBinding);
  };

  const onCollapseSiModel = () => {
    setCollapsedSiModel(!collapsedSiModel);
  };

  const onSelectSiBinding = (selectedKeys: React.Key[], info: InfoType) => {
    dispatch(siBindingNodeChanged(selectedKeys.length > 0 ? info.node : undefined));
  };
  const onTreeChangeSiBinding = (checked: boolean) => {
    let treeName: string = techPosTreeConstant;
    if (checked) {
      treeName = siEqTreeConstant;
      setViewNameSiBinding(treeName);
    } else {
      treeName = techPosTreeConstant;
      setViewNameSiBinding(treeName);
    }
    dispatch(treeChanged(treeName));
  };
  const ownedFilterChangedSiBinding = (type: OwnedType) => {
    dispatch(siBindingOwnedFilter(type));
  };

  return (
    <PageLayoutStyled>
      <PageHeader
        style={{ paddingTop: 0, paddingBottom: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title="Редактор"
      />
      <PageStyledTabs
        defaultActiveKey="siEquipment"
        destroyInactiveTabPane={true}
      >
        <PageStyledTabs.TabPane
          key="siEquipment"
          tab="Редактор средств измерений"
        >
          <Layout>
            <SiderFilterStyled
              width={280}
              trigger={null}
              collapsible
              collapsed={collapsedSiEq}
              onCollapse={onCollapseSiEq}
            >
              <Row
                justify={collapsedSiEq ? "center" : "space-between"}
                align="middle"
              >
                <Col style={{ display: collapsedSiEq ? "none" : "block" }}>
                  <Title level={4}>Фильтр</Title>
                </Col>
                <Col>
                  {React.createElement(
                    collapsedSiEq ? RightOutlined : LeftOutlined,
                    {
                      onClick: onCollapseSiEq,
                    }
                  )}
                </Col>
              </Row>

              <FilterRowStyled $collapsed={collapsedSiEq}>
                <Col>
                  <Checkbox
                    onClick={() => {
                      setIsEditorSiEqArchiveFilter(!isEditorSiEqArchiveFilter);
                      dispatch(siEqArchiveFiltered(!isEditorSiEqArchiveFilter));
                    }}
                    checked={isEditorSiEqArchiveFilter}
                  >
                    Показывать архивные записи
                  </Checkbox>
                </Col>
              </FilterRowStyled>

              <FilterRowStyled $collapsed={collapsedSiEq}>
                <Col>
                  <FilterItemLabelStyled>
                    Выберите {treeLabelSiEq}
                  </FilterItemLabelStyled>
                </Col>
              </FilterRowStyled>
              <WrapperTreeRowStyled $collapsed={collapsedSiEq}>
                <Col span={24} style={{ height: "100%" }}>
                  <FilterSearchTreeStyled
                    isSiEq={true}
                    treeViewName={viewNameSiEq}
                    onSelectCallback={onSelectSiEq}
                    onTreeChangeCallback={onTreeChangeSiEq}
                    ownedFilterChangedCallback={ownedFilterChangedSiEq}
                    currentNodeKey={currentNodeKeySiEq}
                    ownFilterValue={editorSiEqState.ownedFilter}
                    showType={ShowType.SiEditor}
                  />
                </Col>
              </WrapperTreeRowStyled>
            </SiderFilterStyled>

            <Content>
              <SiEquipmentContainer
                siEq={props.location.state as SiEquipment[] | undefined}
              />
            </Content>
          </Layout>
        </PageStyledTabs.TabPane>

        <PageStyledTabs.TabPane key="siEquipmentBinding" tab="Редактор связей">
          <Layout>
            <SiderFilterStyled
              width={280}
              trigger={null}
              collapsible
              collapsed={collapsedSiBinding}
              onCollapse={onCollapseSiBinding}
            >
              <Row
                justify={collapsedSiBinding ? "center" : "space-between"}
                align="middle"
              >
                <Col style={{ display: collapsedSiBinding ? "none" : "block" }}>
                  <Title level={4}>Фильтр</Title>
                </Col>
                <Col>
                  {React.createElement(
                    collapsedSiBinding ? RightOutlined : LeftOutlined,
                    {
                      onClick: onCollapseSiBinding,
                    }
                  )}
                </Col>
              </Row>

              <FilterRowStyled $collapsed={collapsedSiBinding}>
                <Col>
                  <Checkbox
                    onClick={() => {
                      setIsEditorSiMapArchiveFilter(
                        !isEditorSiMapArchiveFilter
                      );
                      dispatch(
                        siBindingArchiveFiltered(!isEditorSiMapArchiveFilter)
                      );
                    }}
                    checked={isEditorSiMapArchiveFilter}
                  >
                    Показывать архивные записи
                  </Checkbox>
                </Col>
              </FilterRowStyled>

              <FilterRowStyled $collapsed={collapsedSiBinding}>
                <Col>
                  <FilterItemLabelStyled>
                    Выберите {treeLabelSiBinding}
                  </FilterItemLabelStyled>
                </Col>
              </FilterRowStyled>
              <WrapperTreeRowStyled $collapsed={collapsedSiBinding}>
                <Col span={24} style={{ height: "100%" }}>
                  <FilterSearchTreeStyled
                    isSiEq={true}
                    treeViewName={viewNameSiBinding}
                    onSelectCallback={onSelectSiBinding}
                    onTreeChangeCallback={onTreeChangeSiBinding}
                    ownedFilterChangedCallback={ownedFilterChangedSiBinding}
                    currentNodeKey={currentNodeKeySiBinding}
                    ownFilterValue={editorSiMapState.ownedFilter}
                    showType={ShowType.SiEditor}
                  />
                </Col>
              </WrapperTreeRowStyled>
            </SiderFilterStyled>
            <Content>
              <EditorSiMapContainer />
            </Content>
          </Layout>
        </PageStyledTabs.TabPane>

        <PageStyledTabs.TabPane key="siModel" tab="Редактор моделей СИ">
          <Layout>
            <SiderFilterStyled
              width={280}
              trigger={null}
              collapsible
              collapsed={collapsedSiModel}
              onCollapse={onCollapseSiModel}
            >
              <Row
                justify={collapsedSiModel ? "center" : "space-between"}
                align="middle"
              >
                <Col style={{ display: collapsedSiModel ? "none" : "block" }}>
                  <Title level={4}>Фильтр</Title>
                </Col>
                <Col>
                  {React.createElement(
                    collapsedSiModel ? RightOutlined : LeftOutlined,
                    {
                      onClick: onCollapseSiModel,
                    }
                  )}
                </Col>
              </Row>

              <FilterRowStyled $collapsed={collapsedSiModel}>
                <Col>
                  <Checkbox
                    onClick={() => {
                      setIsEditorSiModelArchiveFilter(
                        !isEditorSiModelArchiveFilter
                      );
                      dispatch(
                        siModelArchiveFiltered(!isEditorSiModelArchiveFilter)
                      );
                    }}
                    checked={isEditorSiModelArchiveFilter}
                  >
                    Показывать архивные записи
                  </Checkbox>
                </Col>
              </FilterRowStyled>
            </SiderFilterStyled>

            <Content>
              <EditorSiModelContainer />
            </Content>
          </Layout>
        </PageStyledTabs.TabPane>
      </PageStyledTabs>
    </PageLayoutStyled>
  );
};
