import React, { FC } from 'react';
import { Layout, PageHeader } from 'antd';

import './styles.css';
import { EventsChartsContainer } from '../../containers/EventsChartsContainer';
import { useSelector } from 'react-redux';
import { StateType } from '../../types';
import { ControlMaintEvents } from '../../classes';

const b = (name: string): string => `events-charts__${name}`;

export const EventsCharts: FC = () => {
  const event = useSelector<StateType, ControlMaintEvents[]>(
    (state) => state.eventsCharts.events
  )[0];

  const returnTitle = () =>
    `Контроль изменения метрологических характеристик ${event?.siName || ''}`;

  return (
    <Layout className={b('container')}>
      <PageHeader
        style={{ padding: 0, marginBottom: '27px' }}
        className={b('header')}
        title={returnTitle()}
        footer={event?.afPath}
      />
      <EventsChartsContainer />
    </Layout>
  );
};
