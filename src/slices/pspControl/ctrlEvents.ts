import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { formatDateRange, zeroGuid } from "./../../utils";
import { GenericResponse, PagedModel, PageInfo } from "../../types";
import {
  getCtrlCardEventsFiltersTC,
  getCtrlCardEventsTC,
  getEventsTC,
  getEventTypesTC,
  сtrlCardsEventHandleTC,
  сtrlEventHandleTC,
} from "thunks/pspControl/ctrlEvents";
import { ListFilterBase, SelectedNode } from "interfaces";
import moment, { Moment } from "moment";
import { SqlTree } from "classes/SqlTree";
import {
  CtrlCardEvents,
  CtrlEventsCardFilterValues,
} from "api/responses/get-ctrlevents-card";
import { GetCtrlEventsCardFilterBody } from "api/params/get-ctrlevents-card.params";
import { CtrlEventsItem } from "pages/PspControl/CtrlEventsPage/types";
import { Key } from "react";

const localDateFormat = "YYYY-MM-DDTHH:mm:ss";
const startDate = moment().subtract(7, 'd').startOf("day").format(localDateFormat);
const endDate = moment().endOf("day").format(localDateFormat);

const initialState = {
  pageInfo: {
    pageNumber: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
  },
  selectedTreeNode: {
    id: zeroGuid,
    nodeId: 0,
    title: "",
    key: "",
    type: "all",
    owned: null,
    isSiType: false,
  },
  appliedFilter: {
    filter: {
      dateRange: formatDateRange([moment().startOf("month"), moment()]),
      eventTypes: [] as number[],
      forExecution: false,
      onlyUnread: false,
      treeFilter: {
        nodePath: undefined as string | undefined,
        isOwn: null,
      },
    },
    sortedField: "",
    isSortAsc: true,
    pageIndex: 1,
  } as ListFilterBase,
  ctrlIsLoading: false,
  ctrlFiltersLoading: false,
  ctrlAllEvents: [] as CtrlEventsItem[],
  ctrlIsConfigured: false,
  ctrlEventsCardFilterValues: {
    types: [],
  } as CtrlEventsCardFilterValues,
  ctrlFilterValues: {
    startTime: startDate,
    endTime: endDate,
    type: undefined,
    forExecution: false,
    onlyRead: false,
  } as GetCtrlEventsCardFilterBody,
  ctrlCurrentPage: 1,
  ctrlNextButtonDisable: false,
  ctrlNextButtonLoading: false,
  eventsList: [] as CtrlEventsItem[],
  eventTypesTree: [] as SqlTree[],
  ctrlSelectedEvent: {} as CtrlEventsItem,
  currentEventTypesKeys: [] as Key[],
  dateRange: [moment().startOf("month"), moment()] as [Moment, Moment]
};

//slice
const ctrlEventsSlice = createSlice({
  name: "ctrlEvents",
  initialState,
  reducers: {
    setPageInfo: (state, action: PayloadAction<PageInfo>) => {
      state.pageInfo = action.payload;
      state.appliedFilter.pageIndex = action.payload.pageNumber;
    },
    setSelectedNode: (
      state,
      action: PayloadAction<SelectedNode | undefined>
    ) => {
      state.appliedFilter.filter.treeFilter.nodePath = action.payload?.key;
    },
    setFilter: (state, action: PayloadAction<ListFilterBase>) => {
      state.appliedFilter = action.payload;
    },
    setCtrlAllEvents: (state, action: PayloadAction<CtrlEventsItem[]>) => {
      state.ctrlAllEvents = action.payload;
    },
    setCtrlCurrentPage: (state, action: PayloadAction<number>) => {
      state.ctrlCurrentPage = action.payload;
    },
    setForExecutionFilter: (state, action: PayloadAction<boolean>) => {
      state.ctrlFilterValues.forExecution = action.payload;
    },
    setCtrlTypeFilter: (state, action: PayloadAction<number>) => {
      state.ctrlFilterValues.type = action.payload;
    },
    setOnlyReadFilter: (state, action: PayloadAction<boolean>) => {
      state.ctrlFilterValues.onlyRead = action.payload;
    },
    setCtrlDateFilter: (state, action: PayloadAction<[Date, Date]>) => {
      state.ctrlFilterValues.startTime = moment(action.payload[0]).startOf("day").format(localDateFormat);
      state.ctrlFilterValues.endTime = moment(action.payload[1]).endOf("day").format(localDateFormat);
    },
    setCtrlSelectedEvent: (state, action: PayloadAction<CtrlEventsItem>) => {
      state.ctrlSelectedEvent = action.payload;
    },
    setCurrentEventTypesKeys: (state, action: PayloadAction<Key[]>) => {
      state.currentEventTypesKeys = action.payload;
    },
    setDateRange: (state, action: PayloadAction<[Moment, Moment]>) => {
      state.dateRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEventsTC.pending, (state) => {
        state.ctrlIsLoading = true;
      })
      .addCase(
        getEventsTC.fulfilled,
        (state, action: PayloadAction<PagedModel<CtrlEventsItem>>) => {
          state.eventsList = action.payload.entities;
          state.pageInfo = action.payload.pageInfo;
          state.ctrlIsLoading = false;
        }
      )
      .addCase(getEventsTC.rejected, (state) => {
        state.ctrlIsLoading = false;
      })
      .addCase(getCtrlCardEventsFiltersTC.pending, (state) => {
        state.ctrlFiltersLoading = true;
      })
      .addCase(
        getCtrlCardEventsFiltersTC.fulfilled,
        (state, action: PayloadAction<CtrlEventsCardFilterValues>) => {
          state.ctrlEventsCardFilterValues = action.payload;
          state.ctrlFiltersLoading = false;
        }
      )
      .addCase(getCtrlCardEventsFiltersTC.rejected, (state) => {
        state.ctrlFiltersLoading = false;
      })
      .addCase(getCtrlCardEventsTC.pending, (state) => {
        state.ctrlIsLoading = state.ctrlCurrentPage === 1;
        state.ctrlNextButtonLoading = state.ctrlCurrentPage > 1;
      })
      .addCase(
        getCtrlCardEventsTC.fulfilled,
        (state, action: PayloadAction<CtrlCardEvents>) => {
          const cardEvents = action.payload;
          state.ctrlIsConfigured = cardEvents.isConfigured;
          state.ctrlAllEvents = state.ctrlAllEvents.concat(
            cardEvents.ctrlEvents.entities
          );
          state.ctrlNextButtonDisable =
            cardEvents.ctrlEvents.pageInfo.totalPages == state.ctrlCurrentPage;
          state.ctrlIsLoading = false;
          state.ctrlNextButtonLoading = false;
        }
      )
      .addCase(getCtrlCardEventsTC.rejected, (state) => {
        state.ctrlIsLoading = false;
        state.ctrlNextButtonLoading = false;
      })

      .addCase(
        getEventTypesTC.fulfilled,
        (state, action: PayloadAction<SqlTree[]>) => {
          state.eventTypesTree = action.payload;
        }
      )
      .addCase(getEventTypesTC.rejected, (state) => { })

      .addCase(
        сtrlEventHandleTC.fulfilled,
        (state, action: PayloadAction<GenericResponse<CtrlEventsItem>>) => {
          if (action.payload.success) {
            const index = state.eventsList
              .map(function (e) {
                return e.id;
              })
              .indexOf(action.payload.result.id);

            if (index != -1) {
              // все элементы до обновлённого
              const data = state.eventsList.slice(0, index);
              // обновлённый элемент
              data.push(action.payload.result);
              // все элементы после обновлённого элемента
              data.push(
                ...state.eventsList.slice(index + 1, state.eventsList.length)
              );
              state.eventsList = data;
            }

            const cardIndex = state.ctrlAllEvents
              .map(function (e) {
                return e.id;
              })
              .indexOf(action.payload.result.id);

            if (cardIndex != -1) {
              // все элементы до обновлённого
              const data = state.ctrlAllEvents.slice(0, index);
              // обновлённый элемент
              data.push(action.payload.result);
              // все элементы после обновлённого элемента
              data.push(
                ...state.ctrlAllEvents.slice(
                  index + 1,
                  state.ctrlAllEvents.length
                )
              );
              state.ctrlAllEvents = data;
            }
          } else {
            message.error(action.payload.message);
          }
        }
      )
      .addCase(
        сtrlCardsEventHandleTC.fulfilled,
        (state, action: PayloadAction<GenericResponse<CtrlEventsItem>>) => {
          if (action.payload.success) {
            const cardIndex = state.ctrlAllEvents
              .map(function (e) {
                return e.id;
              })
              .indexOf(action.payload.result.id);

            if (cardIndex != -1) {
              // все элементы до обновлённого
              const data = state.ctrlAllEvents.slice(0, cardIndex);
              // обновлённый элемент
              data.push(action.payload.result);
              // все элементы после обновлённого элемента
              data.push(
                ...state.ctrlAllEvents.slice(
                  cardIndex + 1,
                  state.ctrlAllEvents.length
                )
              );
              state.ctrlAllEvents = data;
            }
          } else {
            message.error(action.payload.message);
          }
        }
      );
  },
});

//exports
export default ctrlEventsSlice.reducer;
export const {
  setPageInfo,
  setSelectedNode,
  setFilter,
  setCtrlAllEvents,
  setCtrlCurrentPage,
  setForExecutionFilter,
  setOnlyReadFilter,
  setCtrlTypeFilter,
  setCtrlDateFilter,
  setCtrlSelectedEvent,
  setCurrentEventTypesKeys,
  setDateRange
} = ctrlEventsSlice.actions;

//type
export type CtrlEventsStateType = typeof initialState;
