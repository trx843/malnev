import { Menu } from "antd";
import { Card, CardColumns } from "react-bootstrap";
import styled from "styled-components";

interface ITitleWrapperProps {
  isTitle?: boolean;
}

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: ${(props: ITitleWrapperProps) =>
    props.isTitle ? "default" : "pointer"};
  margin: 0;
`;
