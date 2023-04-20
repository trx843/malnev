import { Alert, Typography } from "antd";
import { Header } from "antd/lib/layout/layout";
import styled from "styled-components";

interface INodeColorDotProps {
  node: boolean;
}

export const HeaderStyled = styled(Header)`
  .ant-dropdown-trigger {
    font-family: "Golos";
    font-weight: 500;
    font-size: 16px;
    color: #8fc0e5;
  }
`;

export const NodeColorDot = styled.div`
  width: 5px;
  height: 5px;
  border-radius: 2px;
  background-color: ${(props: INodeColorDotProps) =>
    props.node ? "#8FC0E5" : "#ffffff"};
`;

export const TypographyText = styled(Typography.Text)`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 40vw;
  display: inline-block;
`;
