import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import { Col, Form, Layout } from "antd";
const { Sider } = Layout;
import styled from "styled-components";

export const SiderStyled = styled(Sider)`
  background: white;
  border-right: 1px solid #DDE8F0;
`;

export const ColStyled = styled(Col)<{ collapsed: boolean }>`
  display: ${(props) => (props.collapsed ? "none" : "block")};
`;

export const FormStyled = styled(Form)<{ collapsed: boolean }>`
  overflow-y: auto;
  height: 100%;
  display: ${(props) => (props.collapsed ? "none" : "block")};
`;

export const FormItemLabelStyled = styled.label`
  color: #667985;
`;

export const TableBlockStyled = styled.div`
  height: 100%;
  width: 100%;
`;

export const TableButtonStyled = styled.button`
  background-color: transparent;
  border: none;
  outline: none;
`;

export const EditTableButtonIconStyled = styled(EditOutlined)`
  font-size: 21.43px;
  color: #1890ff;
`;

export const DeleteTableButtonIconStyled = styled(DeleteOutlined)`
  font-size: 21.43px;
  color: #FF4D4F;
`;
