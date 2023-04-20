import { createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';
import axios from 'axios';
import { Dispatch } from 'redux';
import { ApiRoutes } from '../api/api-routes.enum';
import { GetEventsChartsParams } from '../api/params/get-events-charts.params';
import { ControlMaintEvents } from '../classes';
import { prepareEventsData } from '../containers/EventsChartsContainer/utils';
import {
  ChartLinesLib,
  setChartLinesLib,
  setEvents,
  setIsLoading,
  setSelectedEvents,
  TypeFilterParams,
} from '../slices/eventsCharts';
import { StateType } from '../types';
import { apiBase, returnRandomColor } from '../utils';

const returnRandomChartLineSymbol = (): string => {
  const symbols = ['circle', 'square', 'diamond', 'triangle'];
  return symbols[Math.floor(Math.random() * 4)];
};

const createChartLinesLib = (events: ControlMaintEvents[]): ChartLinesLib => {
  const lib: ChartLinesLib = {};

  events.forEach((event) => {
    lib[event.id.toString()] = {
      color: returnRandomColor(),
      marker: {
        symbol: returnRandomChartLineSymbol(),
      },
    };
  });

  return lib;
};

export const getEventsChartsThunk = createAsyncThunk<
  ControlMaintEvents[] | void,
  GetEventsChartsParams,
  {
    dispatch: Dispatch;
    state: StateType;
  }
>('eventsCharts/getEventsChartsThunk', async (params, thunkApi) => {
  const { dispatch } = thunkApi;
  try {
    dispatch(setIsLoading(true));

    const response = await axios.get(
      `${apiBase}${ApiRoutes.EventsCharts}?siId=${params.siId}&from=${params.dateFilter.dateFrom}&to=${params.dateFilter.dateTo}`
    );
    const { data } = response;
    const preparedData = prepareEventsData(data);
    const lastEventId = data[data.length - 1].id.toString();
    const initialEvents = [lastEventId];

    dispatch(setEvents(preparedData));
    dispatch(setChartLinesLib(createChartLinesLib(data)));

    if (data[data.length - 1].eventType === TypeFilterParams.Verifications) {
      initialEvents.push(`border@${lastEventId}`);
    }

    dispatch(setSelectedEvents(initialEvents));
    dispatch(setIsLoading(false));

    return response.data as ControlMaintEvents[];
  } catch (error) {
    message.error({
      content: error,
      duration: 2,
    });
    dispatch(setIsLoading(false));
    return undefined;
  }
});
