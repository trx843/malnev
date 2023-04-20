import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import update from "immutability-helper";
import { moveSerialsLeft } from "slices/verificationActs/verificationAct/helpers";
import {
  deletePlanAttachmentThunk,
  getPlanAttachmentsThunk,
  setPlanMainFileThunk,
  getCommissionsThunk,
  createCommissionThunk,
  updateCommissionThunk,
  removeCommissionThunk,
  sortCommissionThunk,
} from "thunks/pspControl/planCard";

import { signActionPlanThunk } from "../../../thunks/pspControl/actionPlans";
import { Nullable, ValueOf } from "../../../types";
import {
  IPlanAttachments,
  IPlanCard,
  IPlanInfo,
  IPlanCardActionPlanViewModel,
  IViolationsWithActionPlanViewModel,
  ICommissionPlanModel,
} from "./types";

export enum DictionariesNames {
  positionExecutors = "positionExecutors",
  fullNameExecutors = "fullNameExecutors",
  positionControllers = "positionControllers",
  fullNameControllers = "fullNameControllers",
}

export enum LoadingsNames {
  isAddOrEditEventPending = "isAddOrEditEventPending",
  isDeleteEventPending = "isDeleteEventPending",
  isActionPlanThunkLoading = "isActionPlanThunkLoading",
  isPlanCardLoading = "isPlanCardLoading",
  isPlanInfoLoading = "isPlanInfoLoading",
  isPlanAttachmentsLoading = "isPlanAttachmentsLoading",
  isDeletingPlanAttachment = "isDeletingPlanAttachment",
  isDownloadingPlanAttachment = "isDownloadingPlanAttachment",
}

interface IDictionaries {
  positionExecutors: any[]; // пока что не известна структура
  fullNameExecutors: any[];
  positionControllers: any[];
  fullNameControllers: any[];
}

export interface IPlanCardStore {
  planInfo: Nullable<IPlanInfo>;
  planCardInfo: Nullable<IPlanCard>;
  tableData: IPlanCardActionPlanViewModel;
  violationsWithActionPlanInfo: Nullable<IViolationsWithActionPlanViewModel>;
  dictionaries: IDictionaries;
  attachments: IPlanAttachments[];
  recommendations: any[];
  commissions: ICommissionPlanModel[];
  [LoadingsNames.isPlanCardLoading]: boolean;
  [LoadingsNames.isAddOrEditEventPending]: boolean;
  [LoadingsNames.isDeleteEventPending]: boolean;
  [LoadingsNames.isActionPlanThunkLoading]: boolean;
  [LoadingsNames.isPlanInfoLoading]: boolean;
  [LoadingsNames.isPlanAttachmentsLoading]: boolean;
  [LoadingsNames.isDeletingPlanAttachment]: boolean;
  [LoadingsNames.isDownloadingPlanAttachment]: boolean;
}

const initialState: IPlanCardStore = {
  planInfo: null,
  planCardInfo: null,
  tableData: [],
  violationsWithActionPlanInfo: null,
  dictionaries: {
    [DictionariesNames.positionExecutors]: [],
    [DictionariesNames.fullNameExecutors]: [],
    [DictionariesNames.positionControllers]: [],
    [DictionariesNames.fullNameControllers]: [],
  },
  attachments: [],
  recommendations: [],
  commissions: [],
  [LoadingsNames.isPlanCardLoading]: false,
  [LoadingsNames.isAddOrEditEventPending]: false,
  [LoadingsNames.isDeleteEventPending]: false,
  [LoadingsNames.isActionPlanThunkLoading]: false,
  [LoadingsNames.isPlanInfoLoading]: false,
  [LoadingsNames.isPlanAttachmentsLoading]: false,
  [LoadingsNames.isDeletingPlanAttachment]: false,
  [LoadingsNames.isDownloadingPlanAttachment]: false,
};

export const planCard = createSlice({
  name: "planCard",
  initialState,
  reducers: {
    setPlanInfo: (state, action: PayloadAction<Nullable<IPlanInfo>>) => {
      state.planInfo = action.payload;
    },
    setPlanCardInfo: (state, action: PayloadAction<Nullable<IPlanCard>>) => {
      state.planCardInfo = action.payload;
    },
    setTableData: (
      state,
      action: PayloadAction<IPlanCardActionPlanViewModel>
    ) => {
      state.tableData = action.payload;
    },
    setViolationsWithActionPlanInfo: (
      state,
      action: PayloadAction<Nullable<IViolationsWithActionPlanViewModel>>
    ) => {
      state.violationsWithActionPlanInfo = action.payload;
    },
    setDictionaries(
      state: IPlanCardStore,
      action: PayloadAction<{
        name: DictionariesNames;
        value: ValueOf<IDictionaries>;
      }>
    ) {
      state.dictionaries = {
        ...state.dictionaries,
        [action.payload.name]: action.payload.value,
      };
    },
    setLoading: (
      state,
      action: PayloadAction<{ name: LoadingsNames; value: boolean }>
    ) => {
      state[action.payload.name] = action.payload.value;
    },
    setRecommendations: (state, action: PayloadAction<any[]>) => {
      state.recommendations = action.payload;
    },
    setAttachments(state, action: PayloadAction<IPlanAttachments[]>) {
      state.attachments = action.payload;
    },
    setAttachment(state, action: PayloadAction<IPlanAttachments>) {
      state.attachments = [...state.attachments, action.payload];
    },
  },
  extraReducers: (build) => {
    build.addCase(getPlanAttachmentsThunk.pending, (state) => {
      state[LoadingsNames.isPlanAttachmentsLoading] = true;
    });
    build.addCase(getPlanAttachmentsThunk.fulfilled, (state, { payload }) => {
      state.attachments = payload;
      state[LoadingsNames.isPlanAttachmentsLoading] = false;
    });
    build.addCase(getPlanAttachmentsThunk.rejected, (state) => {
      state[LoadingsNames.isPlanAttachmentsLoading] = false;
    });
    build.addCase(setPlanMainFileThunk.fulfilled, (state, { payload }) => {
      state.attachments = state.attachments.map((attach) => {
        if (attach.id === payload) {
          return {
            ...attach,
            isMain: true,
          };
        }

        return {
          ...attach,
          isMain: false,
        };
      });
    });
    build.addCase(deletePlanAttachmentThunk.fulfilled, (state, { payload }) => {
      state.attachments = state.attachments.filter((attach) => {
        if (attach.id !== payload) {
          return attach;
        }
      });
    });
    build.addCase(signActionPlanThunk.fulfilled, (state, action) => {
      if (state.planCardInfo?.planStatusId && state.planCardInfo?.planStatus) {
        state.planCardInfo.planStatusId = action.payload.verificationStatusId;
        state.planCardInfo.planStatus = action.payload.verificationStatus;
      }
    });
    build.addCase(getCommissionsThunk.fulfilled, (state, { payload }) => {
      state.commissions = payload;
    });
    build.addCase(createCommissionThunk.fulfilled, (state, { payload }) => {
      state.commissions = [...state.commissions, payload];
    });
    build.addCase(updateCommissionThunk.fulfilled, (state, { payload }) => {
      const index = state.commissions.findIndex(
        (item) => item.id === payload.id
      );
      if (index === -1) {
        return;
      }
      state.commissions = update(state.commissions, {
        [index]: { $set: payload },
      });
    });
    build.addCase(removeCommissionThunk.fulfilled, (state, { payload }) => {
      const index = state.commissions.findIndex((item) => item.id === payload);
      if (index === -1) {
        return;
      }

      state.commissions = update(state.commissions, (items) => {
        const movedSerials = moveSerialsLeft(items, index);

        return update(movedSerials, { $splice: [[index, 1]] });
      });
    });
    build.addCase(sortCommissionThunk.fulfilled, (state, { payload }) => {
      state.commissions = payload;
    });
  },
});

export const {
  setPlanInfo,
  setPlanCardInfo,
  setTableData,
  setViolationsWithActionPlanInfo,
  setDictionaries,
  setLoading,
  setRecommendations,
  setAttachments,
  setAttachment,
} = planCard.actions;

export const planCardReducer = planCard.reducer;
