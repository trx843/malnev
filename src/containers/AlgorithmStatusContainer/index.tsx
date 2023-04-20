import { Tabs } from 'antd';
import React, { FC } from 'react';
import { Algorithms } from '../../components/Algorithms';
import { Operands } from '../../components/Operands';
import { Settings } from '../../components/Settings';

import './styles.css';

const { TabPane } = Tabs;

export const AlgorithmStatusContainer: FC = () => {
  return (
    <Tabs
      size={'small'}
      defaultActiveKey='algorithm'
      style={{ height: '100%' }}
      className='algorithm__tabs'
    >
      <TabPane key='algorithm' tab='Алгоритмы' style={{ height: '100%' }}>
        <Algorithms />
      </TabPane>
      <TabPane key='operands' tab='Операнды'>
        <Operands />
      </TabPane>
      <TabPane key='settings' tab='Уставки'>
        <Settings />
      </TabPane>
    </Tabs>
  );
};
