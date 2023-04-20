import { Layout } from "antd";
import styled from "styled-components";
const { Sider } = Layout;

export const SiderStyled = styled(Sider)`
  background: #345a76;

  .ant-menu {
    margin-top: 10px;
    background: #345a76;
    color: #e8f4ff;
    font-size: 16px;
    border: none;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  .ant-layout-sider-trigger {
    background: #345a76;
    color: #e8f4ff;
  }

  .ant-menu-item {
    background: #345a76;
    color: #e8f4ff;

    :hover {
      color: #1890ff;
    }
  }

  .ant-menu-item a {
    background: #345a76;
    color: #e8f4ff;

    :hover {
      color: #1890ff;
    }
  }

  .ant-menu-submenu-selected,
  .ant-menu-item.ant-menu-item-selected {
    background: #1890ff;
    color: #ffffff;
  }

  .ant-menu-item-selected a,
  .ant-menu-item-selected a:active {
    background: #1890ff;
    color: #ffffff;
  }

  .ant-menu-submenu-arrow {
    color: #e8f4ff;
  }
`;
