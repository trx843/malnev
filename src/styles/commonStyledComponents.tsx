import {
  Card,
  Collapse,
  Form,
  Layout,
  Tabs,
  Row,
  Menu,
  // Spin
} from "antd";
// import SubMenu from "antd/lib/menu/SubMenu";
import { SearchTree } from "components/SearchTree";
import TkoTree from "components/TkoTree";
import { Link } from "react-router-dom";
import styled from "styled-components";
const { Sider } = Layout;

export const TextGrayStyled = styled.div`
  color: #667985;
  font-size: 14px;
`;

export const DarkBoldStyled = styled.div`
  color: #424242;
  font-size: 16px;
  font-weight: 500;
`;

export const TextDarkStyled = styled.div`
  color: #424242;
  font-size: 16px;
`;

export const TextRedStyled = styled.div`
  color: #ff4d4f;
`;

export const TextYellowStyled = styled.div`
  color: #f2994a;
`;

export const ThStyled = styled.th`
  color: #667985;
  padding: 12px;
`;

export const TdStyled = styled.td`
  color: #667985;
  padding: 12px;
`;

export const OverflowDiv = styled.div`
  overflow-y: auto;
`;

export const FilterWrapper = styled.div``;
export const FilterCollapse = styled(Collapse)`
  .ant-collapse-header {
    font-weight: 500;
    font-size: 16px;
    line-height: 21px !important;
    color: #1890ff !important;
  }
`;

export const FilterContainer = styled.div`
  padding-right: 14px;
  overflow-y: auto;
  max-height: 35vh;
`;

export const FilterFooter = styled.div``;

export const FilterTextParagraph = styled.p`
  font-size: 16px;
  line-height: 21px;
  color: #667985;
  margin: 0;
`;

export const OstCollapse = styled(Collapse)`
  .ant-collapse-header {
    font-weight: 500;
    font-size: 14px;
    //line-height: 21px !important;
    .ant-collapse-arrow {
      color: #1890ff !important;
    }
  }
`;

export const CustomCard = styled(Card)`
  border-radius: 6px;
  .ant-card-body {
    padding: 12px;
  }
`;

export const TextLink = styled.div`
  cursor: pointer;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

export const BoldBlackText = styled.div`
  font-weight: bold;
  font-size: 20px;
  line-height: 26px;
  color: #424242;
`;

export const SecurityLevelName = styled.div`
  font-weight: bold;
  font-size: 20px;
  line-height: 26px;
  color: ${(props: { color: string }) => `#${props.color}`};
`;

export const TableCard = styled(Card)`
  .ant-card-body {
    padding: 12px;
  }
`;

export const FilterGroupCollapse = styled(Collapse)`
  .ant-collapse-header {
    font-weight: 500;
    font-size: 16px;
    line-height: 21px !important;
    color: #667985 !important;
  }

  background: #ffffff;
  border: 1px solid #dde8f0;
  border-radius: 4px;
  min-width: 274px;
`;

export const FilterGroupPanel = styled(FilterGroupCollapse.Panel)`
  border: 0 !important;

  .ant-collapse-content.ant-collapse-content-active {
    border: 0;
  }
`;

export const PageLayoutStyled = styled(Layout)`
  .ant-layout {
    height: 100%;
  }
`;

export const PageSiderStyled = styled(PageLayoutStyled.Sider)`
  background: white;
  border-right: 1px solid #dde8f0;
`;

export const PageFormStyled = styled(Form)<{ collapsed: boolean }>`
  overflow-y: auto;
  height: 100%;
  display: ${(props) => (props.collapsed ? "none" : "block")};
`;

export const WarningStyled = styled.div`
  background: #fffbe6;
  border: 1px solid #ffe58f;
  padding: 12px;
`;

export const TableBlockWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .agGridTable-module-agGridTable_bIpNQ.ag-theme-material .ag-ltr .ag-cell {
    border-right: none;
  }
`;

export const PageStyledTabs = styled(Tabs)`
  height: 100%;
  .ant-tabs-content.ant-tabs-content-top {
    height: 100%;
  }
`;

// боковая панель слева событий
export const SiderFilterStyled = styled(Sider)<{ collapsed: boolean }>`
  background: white;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  padding: 20px 15px;

  .ant-layout-sider-children {
    // display: flex;
    // flex-direction: column;
    position: relative;
    overflow-y: auto;
    margin-right: -10px;
    padding-right: 10px;
  }
`;

export const FilterRowStyled = styled(Row)`
  display: ${(props: { $collapsed: boolean }) =>
    props.$collapsed ? "none" : "block"};
  margin-top: 15px;
`;

export const FilterItemLabelStyled = styled.label`
  color: #667985;
  margin-bottom: 10px;
`;

export const WrapperTreeRowStyled = styled(Row)`
  // width: 90%;
  overflow: hidden;
  display: ${(props: { $collapsed: boolean }) =>
    props.$collapsed ? "none" : "block"};
`;

export const SiderTitleStyled = styled.h6<{ collapsed: boolean }>`
  color: #667985;
  display: ${(props) => (props.collapsed ? "none" : "block")};
`;

export const SiderMenuStyled = styled(Menu)<{ collapsed: boolean }>`
  height: 100%;
  overflow-y: auto;
  margin-top: 15px;
  display: ${(props) => (props.collapsed ? "none" : "block")};
`;

export const FilterSearchTreeStyled = styled(SearchTree)`
  display: flex;
  flex-direction: column;
  height: 100%;

  .ant-tree.ant-tree-icon-hide {
    overflow-y: auto;
  }  
`;

// дерево объектов ТКО для событий
export const TkoTreeStyled = styled(TkoTree)`
  // display: flex;
  // flex-direction: column;
  // height: 100%;

  .ant-tree-list-holder-inner {
    margin-left: -6px;
  }

  .ant-tree.ant-tree-icon-hide {
    overflow-y: auto;
  }

  .ant-tree-switcher {
    width: 20px;
    line-height: 16px;
    height: 16px;
    align-self: unset;
    margin-top: 4px;
  }

  .ant-tree .ant-tree-node-content-wrapper {
    padding: 0 0 0 2px;
  }

  .ant-tree .ant-tree-treenode {
    padding: 0 0 2px 0;
    align-items: flex-start;
  }  

  .ant-tree-indent-unit {
    width: 8px;
  }
`;

export const EventrSearchTreeStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .ant-tree.ant-tree-icon-hide {
    overflow-y: auto;
  }
`;
export const StyledTabs = styled(Tabs)`
  height: 100%;
  .ant-tabs-content.ant-tabs-content-top {
    height: 100%;
  }
`;

export const LabelStyled = styled.label`
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;

  color: ${(props: { isActive: boolean }) =>
    props.isActive ? "#1890FF" : "#667985"};
`;

export const LinkStyled = styled(Link)`
  color: white;

  &:hover {
    text-decoration: none;
    color: white;
  }
`;

export const AStyled = styled.a`
  color: white;

  &:hover {
    text-decoration: none;
    color: white;
  }
`;
