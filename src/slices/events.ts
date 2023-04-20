import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import moment, { Moment } from "moment";
import { CtrlEventsItem } from "pages/PspControl/CtrlEventsPage/types";
import { returnStringDate } from "utils";
import { GetEventsCardFilterBody } from "../api/params/get-events-card.params";
import { FilterType } from "../api/params/get-events-params";
import {
  EventsCardFilterValues,
  CardEvents,
} from "../api/responses/get-events-card";
import { EventItem } from "../classes";
import {
  getCardEventsFiltersTC,
  getCardEventsTC,
  postEventCommentTC,
} from "../thunks/events";
import { GenericResponse } from "../types";

const localDateFormat = "YYYY-MM-DDTHH:mm:ss";
const startDate = moment().subtract(7,'d').startOf("day").format(localDateFormat);
const endDate = moment().endOf("day").format(localDateFormat);

const initialState = {
  isLoading: false,
  filtersLoading: false,
  allEvents: [] as EventItem[],
  isConfigured: false,
  eventsCardFilterValues: {
    types: [],
    levels: [],
    acknowledges: [],
  } as EventsCardFilterValues,
  filterValues: {
    startTime: startDate,
    endTime: endDate,
    type: undefined,
    level: undefined,
    acknowledge: undefined,
  } as GetEventsCardFilterBody,
  currentPage: 1,
  nextButtonDisable: false,
  nextButtonLoading: false,
  commentModalVisible: false,
  selectedEvent: {} as EventItem,
  widgetEventLoading: false,
};

//slice
const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setAllEvents: (state, action: PayloadAction<EventItem[]>) => {
      state.allEvents = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setLevelFilter: (state, action: PayloadAction<number>) => {
      state.filterValues.level = action.payload;
    },
    setTypeFilter: (state, action: PayloadAction<number>) => {
      state.filterValues.type = action.payload;
    },
    setAcknowledgeFilter: (state, action: PayloadAction<number>) => {
      state.filterValues.acknowledge = action.payload;
    },
    setDateFilter: (state, action: PayloadAction<[Date, Date]>) => {
      state.filterValues.startTime = moment(action.payload[0]).startOf("day").format(localDateFormat);
      state.filterValues.endTime = moment(action.payload[1]).endOf("day").format(localDateFormat);
    },
    setCommentModalVisible: (state, action: PayloadAction<boolean>) => {
      state.commentModalVisible = action.payload;
    },
    setSelectedEvent: (state, action: PayloadAction<EventItem>) => {
      state.commentModalVisible = true;
      state.selectedEvent = action.payload;
    },
    setWidgetEventLoading: (state, action: PayloadAction<boolean>) => {
      state.widgetEventLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCardEventsFiltersTC.pending, (state) => {
        state.filtersLoading = true;
      })
      .addCase(
        getCardEventsFiltersTC.fulfilled,
        (state, action: PayloadAction<EventsCardFilterValues>) => {
          state.eventsCardFilterValues = action.payload;
          state.filtersLoading = false;
        }
      )
      .addCase(getCardEventsFiltersTC.rejected, (state) => {
        state.filtersLoading = false;
      })
      .addCase(getCardEventsTC.pending, (state) => {
        state.isLoading = state.currentPage === 1;
        state.nextButtonLoading = state.currentPage > 1;
      })
      .addCase(
        getCardEventsTC.fulfilled,
        (state, action: PayloadAction<CardEvents>) => {
          const cardEvents = action.payload;
          state.isConfigured = cardEvents.isConfigured;
          state.allEvents = state.allEvents.concat(cardEvents.events.entities);
          state.nextButtonDisable =
            cardEvents.events.pageInfo.totalPages == state.currentPage;
          state.isLoading = false;
          state.nextButtonLoading = false;
        }
      )
      .addCase(getCardEventsTC.rejected, (state) => {
        state.isLoading = false;
        state.nextButtonLoading = false;
      })
      .addCase(
        postEventCommentTC.fulfilled,
        (state, action: PayloadAction<GenericResponse<EventItem>>) => {
          if (action.payload.success) {
            const index = state.allEvents
              .map(function (e) {
                return e.id;
              })
              .indexOf(action.payload.result.id);

            if (index != -1) {
              // все элементы до обновлённого
              const data = state.allEvents.slice(0, index);
              // обновлённый элемент
              data.push(action.payload.result);
              // все элементы после обновлённого элемента
              data.push(
                ...state.allEvents.slice(index + 1, state.allEvents.length)
              );
              state.allEvents = data;
              state.commentModalVisible = false;
            }
          } else {
            message.error("Не удалось квитировать событие");
          }
        }
      );
  },
});

//exports
export default eventsSlice.reducer;
export const {
  setAllEvents,
  setCurrentPage,
  setLevelFilter,
  setTypeFilter,
  setAcknowledgeFilter,
  setDateFilter,
  setCommentModalVisible,
  setSelectedEvent,
  setWidgetEventLoading,
} = eventsSlice.actions;

//type
export type EventsStateType = typeof initialState;
export type ErrorType = { message: string };
