import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import { ResultStatusType } from "antd/lib/result";
import { EventGroupCountType } from "api/responses/home-page.response";
import { IMenuNav } from "interfaces";
import { authRequestTC, getEventsWidgetTC } from "thunks/home";
import { User } from "../classes";

const initialState = {
  isLoading: false,
  user: {} as User,
  cards: [] as IMenuNav[],
  resultStatusType: {} as ResultStatusType,
  error: undefined as any,
  showWidgets: false,
  isEventsCountLoading: false,
  isCtrlEvents: false,
  currentSelectedMenuKey: "main",
  isUserAllowedOst: false as boolean,
};

//slice
const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setIsCtrlEvents: (state, action: PayloadAction<boolean>) => {
      state.isCtrlEvents = action.payload;
    },
    setCurrentSelectedMenuKey: (state, action: PayloadAction<string>) => {
      state.currentSelectedMenuKey = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // pending - состояние ожидания
      .addCase(authRequestTC.pending, (state) => {
        state.isLoading = true; // пока идет загрузка ставим в true
      })
      .addCase(
      // fulfilled - состояние успешного получения данных
        authRequestTC.fulfilled,
        (state, action: PayloadAction<User>) => {
          const user = action.payload;
          state.user = user;
          state.cards = user.webFeaturesTypes.cards;
          localStorage.setItem("userContext", JSON.stringify(user));
          const eventsGroupIds = user.webFeaturesTypes.cards.filter(
            (wf) => wf.eventGroup
          );
          state.showWidgets = eventsGroupIds.length > 0;
          state.isUserAllowedOst = !!user.allowedOstIdsList.length;
          state.isLoading = false;
        }
      )
      // rejected - состояние ошибки (отклонено)
      .addCase(authRequestTC.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload;
          state.resultStatusType =
            action.payload?.response?.status == 403 ? "403" : "error";
        }
        state.isLoading = false;
      })
      .addCase(getEventsWidgetTC.pending, (state) => {
        state.isEventsCountLoading = true;
      })
      .addCase(
        getEventsWidgetTC.fulfilled,
        (state, action: PayloadAction<EventGroupCountType[]>) => {
          const eventsCount = action.payload;
          eventsCount.forEach((ec) => {
            const webFeature = state.cards.filter(
              (wf) =>
                wf.eventGroup && wf.eventGroup.eventGroupId === ec.eventGroupId
            );
            if (webFeature)
              webFeature[0].eventGroup = {
                ...ec,
                isCountHasValues: ec.count > 0,
                isCritialCountHasValues: ec.criticalCount > 0,
              };
          });
          state.isEventsCountLoading = false;
        }
      )
      .addCase(getEventsWidgetTC.rejected, (state, action) => {
        if (action.payload) message.error(action.payload.message);
        state.isEventsCountLoading = false;
      });
  },
});

//exports
export default homeSlice.reducer;
export const { setIsCtrlEvents, setCurrentSelectedMenuKey } = homeSlice.actions;

//type
export type HomeStateType = typeof initialState;
