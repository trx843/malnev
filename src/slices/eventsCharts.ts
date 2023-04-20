import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { ControlMaintEvents } from '../classes';

export interface DateRange {
  dateFrom: string;
  dateTo: string;
}

export enum TypeFilterParams {
  All = 'Все',
  Kmh = 'КМХ',
  Verifications = 'Поверка',
}

export interface ChartLineStyle {
  color: string;
  marker: {
    symbol: string;
  };
}

export interface ChartLinesLib {
  [key: string]: ChartLineStyle;
}
export interface EventsCharts {
  dateFilter: DateRange | null;
  events: ControlMaintEvents[];
  selectedEvents: string[];
  selectedType: string;
  chartLinesLib: ChartLinesLib;
  isLoading: boolean;
}

const initialState: EventsCharts = {
  dateFilter: {
    dateFrom: moment().subtract(3, 'years').format('YYYY-MM-DD'),
    dateTo: moment().format('YYYY-MM-DD'),
  },
  events: [],
  chartLinesLib: {},
  selectedEvents: [],
  selectedType: TypeFilterParams.All,
  isLoading: false,
};

const eventsCharts = createSlice({
  name: 'eventsCharts',
  initialState,
  reducers: {
    setDateFilter(state, action: PayloadAction<DateRange | null>) {
      state.dateFilter = action.payload;
    },
    setEvents(state, action: PayloadAction<ControlMaintEvents[]>) {
      state.events = action.payload;
    },
    setSelectedEvents(state, action: PayloadAction<string[]>) {
      state.selectedEvents = action.payload;
    },
    setSelectedType(state, action: PayloadAction<string>) {
      state.selectedType = action.payload;
    },
    setChartLinesLib(state, action: PayloadAction<ChartLinesLib>) {
      state.chartLinesLib = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setDateFilter,
  setEvents,
  setSelectedEvents,
  setSelectedType,
  setChartLinesLib,
  setIsLoading,
} = eventsCharts.actions;

export default eventsCharts.reducer;
