import { Spin } from 'antd';
import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

const LoadingBox = styled.div`
  height: calc(100vh - 335px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
`;

interface IProps {
  styles?: any;
}

export const GridLoading: FunctionComponent<IProps> = ({ styles }) => (
  <LoadingBox style={styles}>
    <Spin size='large' />
  </LoadingBox>
);
