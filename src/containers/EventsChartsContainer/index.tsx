import React, { FC, useEffect, useMemo, useState } from 'react';

import { Layout, Row, DatePicker, Typography, Col, Select } from 'antd';
import locale from 'antd/es/date-picker/locale/ru_RU';
import moment, { Moment } from 'moment';
import { CheckboxGroup } from '../../components/shared/CheckboxGroup';
import * as Highcharts from 'highcharts';

import './styles.css';
import HighchartsReact from 'highcharts-react-official';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '../../types';
import { ControlMaintEvents } from '../../classes';
import {
  ChartLinesLib,
  DateRange,
  setDateFilter,
  setSelectedEvents,
  setSelectedType,
  TypeFilterParams,
} from '../../slices/eventsCharts';
import { getEventsChartsThunk } from '../../thunks/eventsCharts';
import { GetEventsChartsParams } from '../../api/params/get-events-charts.params';
import { returnEventsChartsConfig, returnEventsOptions } from './utils';
import { useParams } from 'react-router-dom';
import { GridLoading } from '../../components/GridLoading';

const { Content, Sider } = Layout;
const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;

const b = (name: string): string => `events-charts__${name}`;

const isDatesSame = (prevDates: string[], newDates: DateRange): boolean =>
  prevDates[0] === newDates.dateFrom && prevDates[1] === newDates.dateTo;

export const EventsChartsContainer: FC = () => {
  const dispatch = useDispatch();

  const { siId } = useParams<{ siId: string }>();

  const dateFilter = useSelector<StateType, DateRange | null>(
    (state) => state.eventsCharts.dateFilter
  );
  const events = useSelector<StateType, ControlMaintEvents[]>(
    (state) => state.eventsCharts.events
  );
  const selectedEvents = useSelector<StateType, string[]>(
    (state) => state.eventsCharts.selectedEvents
  );
  const selectedType = useSelector<StateType, string>(
    (state) => state.eventsCharts.selectedType
  );
  const chartLinesLib = useSelector<StateType, ChartLinesLib>(
    (state) => state.eventsCharts.chartLinesLib
  );
  const isLoading = useSelector<StateType, boolean>(
    (state) => state.eventsCharts.isLoading
  );

  const [prevDatesFilter, setPrevDatesFilter] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      window.dispatchEvent(new Event('resize'));
      if (!siId || !dateFilter || isDatesSame(prevDatesFilter, dateFilter))
        return undefined;
      const params: GetEventsChartsParams = {
        siId,
        dateFilter,
      };
      await dispatch(getEventsChartsThunk(params));
      setPrevDatesFilter([dateFilter.dateFrom, dateFilter.dateTo]);
      return undefined;
    })();
  }, [siId, dateFilter]);

  const eventsOptions = useMemo(
    () => returnEventsOptions(events, selectedType),
    [events, selectedType]
  );

  const highchartsConfig = useMemo(
    () => returnEventsChartsConfig(events, selectedEvents, chartLinesLib),
    [events, selectedEvents]
  );

  const onDateChange = (dates: [Moment, Moment]) => {
    if (dates === null) {
      dispatch(setDateFilter(null));
      return undefined;
    }
    if (dates != undefined && dates[0] && dates[1]) {
      dispatch(
        setDateFilter({
          dateFrom: dates[0].format('YYYY-MM-DD'),
          dateTo: dates[1].format('YYYY-MM-DD'),
        })
      );
      return undefined;
    }
    return undefined;
  };

  const onEventsChange = (events: string[]) => {
    dispatch(setSelectedEvents(events));
  };

  const onTypeChange = (type: string) => {
    dispatch(setSelectedType(type));
  };

  return (
    <Layout>
      <Sider
        width={280}
        style={{
          background: 'white',
          height: '75.3vh',
          marginRight: '1px',
          overflowY: 'scroll',
        }}
      >
        {isLoading ? (
          <GridLoading />
        ) : (
          <>
            <Row>
              <Title level={4} style={{ padding: 16 }}>
                Фильтр событий
              </Title>
            </Row>
            <Row>
              <Col offset={1}>
                <Typography>Даты</Typography>

                <RangePicker
                  style={{ width: '96%' }}
                  locale={locale}
                  onCalendarChange={onDateChange}
                  defaultValue={[moment().subtract(3, 'years'), moment()]}
                />

                <Select
                  defaultValue={selectedType}
                  style={{ width: '96%', marginTop: '1rem' }}
                  onChange={(type) => onTypeChange(type)}
                >
                  <Option value={TypeFilterParams.All}>Все</Option>
                  <Option value={TypeFilterParams.Kmh}>КМХ</Option>
                  <Option value={TypeFilterParams.Verifications}>Поверки</Option>
                </Select>

                <CheckboxGroup
                  options={eventsOptions}
                  onChange={onEventsChange}
                  value={selectedEvents}
                  className={b('events')}
                />
              </Col>
            </Row>
          </>
        )}
      </Sider>

      <Content style={{ backgroundColor: 'white', height: '75.3vh' }}>
        <HighchartsReact highcharts={Highcharts} options={highchartsConfig} />
      </Content>
    </Layout>
  );
};
