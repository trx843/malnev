import { Layout, PageHeader } from 'antd';
import React, { FC } from 'react';
import { AlgorithmStatusContainer } from '../../containers/AlgorithmStatusContainer';

const b = (name: string): string => `algorithm-status__${name}`;

export const AlgorithmStatus: FC = () => {
  return (
    <Layout className={b('container')}>
      <PageHeader
        style={{ padding: 0}}
        className={b('header')}
        title='Статус алгоритмов'
      />
      <AlgorithmStatusContainer />
    </Layout>
  );
};
