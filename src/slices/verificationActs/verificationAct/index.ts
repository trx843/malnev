import {
  createSlice,
  isFulfilled,
  PayloadAction,
  current,
} from "@reduxjs/toolkit";
import update from "immutability-helper";
import {
  addVerificationCommissionsItemThunk,
  addVerificationOtherPartItemThunk,
  addVerificationRecommendationItemThunk,
  addVerificationReportItemThunk,
  addVerificationViolationsItemThunk,
  completeCreatingThunk,
  editVerificationCommissionsItemThunk,
  editVerificationOtherPartItemThunk,
  editVerificationRecommendationItemThunk,
  editVerificationReportItemThunk,
  editVerificationViolationsItemThunk,
  getAreaResponsibilitiesThunk,
  getCheckingObjectVerificationThunk,
  getClassificationNumbersNumberThunk,
  getCtoThunk,
  getVerificationActPageThunk,
  getVerificationActSectionPageThunk,
  getViolationSourceThunk,
  removeVerificationCommissionItemThunk,
  removeVerificationIdentifiedItemThunk,
  removeVerificationOsuItemThunk,
  removeVerificationOtherPartItemThunk,
  removeVerificationRecommendationItemThunk,
  removeVerificationReportItemThunk,
  setVerificationOsuItemThunk,
  getFilterDescriptionViolationThunk,
  getFilterViolationScheduleThunk,
  copyViolationScheduleThunk,
  getSourceRemarkThunk,
  setMainFileThunk,
  deleteActAttachmentThunk,
  getActAttachmentsThunk,
  changeOrderViolationsThunk,
  changeOrderAreaViolationsThunk,
  getViolationsThunk,
  changeOrderRecommendationThunk,
  changeOrderReportThunk,
} from "../../../thunks/verificationActs/verificationAct";
import {
  createActPage,
  createOptions,
  createSectionPending,
  moveSerialsLeft,
} from "./helpers";
import {
  GroupedViolationByArea,
  ModalConfigTypes,
  VerificationActStore,
} from "./types";
import { IFiltersDescription, IListFilter } from "../../../types";
import { IFilter, TypicalViolationForActModalFilter } from "../../pspControl/actionPlanTypicalViolations/types";
import { initListFilter } from "./constants";
import { IAttachments } from "components/UploadAttachment/types";

export enum LoadingsNames {
  isActAttachmentsLoading = "isActAttachmentsLoading",
  isDeletingActAttachment = "isDeletingActAttachment",
  isDownloadingActAttachment = "isDownloadingActAttachment",
}

const initialState: VerificationActStore = {
  pending: false,
  sectionPending: {},
  currentId: null,
  memoizePages: {},
  memoizeOptions: {},
  attachments: [],
  modalConfigs: {
    [ModalConfigTypes.IdentifiedViolations]: {
      filterList: [],
      violations: [],
      listFilter: initListFilter,
    },
    [ModalConfigTypes.TypicalViolation]: {
      filterList: [],
      violations: [],
      listFilter: initListFilter,
    },
  },
  [LoadingsNames.isActAttachmentsLoading]: false,
  [LoadingsNames.isDeletingActAttachment]: false,
  [LoadingsNames.isDownloadingActAttachment]: false,

  act: null,
  commission: [],
  identifiedViolationsOrRecommendations: [],
  recommendations: [],
  compositionOfAppendicesToReport: []
};

const isRemovedAction = isFulfilled(
  removeVerificationOtherPartItemThunk,
  // removeVerificationReportItemThunk
);

const isAddedOptionActions = isFulfilled(
  getCheckingObjectVerificationThunk,
  getAreaResponsibilitiesThunk,
  getClassificationNumbersNumberThunk,
  getViolationSourceThunk,
  getSourceRemarkThunk
);

const isAddedAction = isFulfilled(
  addVerificationOtherPartItemThunk,
  // addVerificationReportItemThunk
);

const isEditedAction = isFulfilled(
  // editVerificationReportItemThunk,
  editVerificationOtherPartItemThunk,
);

const verificationAct = createSlice({
  name: "verificationAct",
  initialState,
  reducers: {
    clearVerificationMemoizePage(state) {
      return update(state, {
        memoizePages: { $set: {} },
        memoizeOptions: { $set: {} },
      });
    },
    setAttachments(state, action: PayloadAction<IAttachments[]>) {
      state.attachments = action.payload;
    },
    setAttachment(state, action: PayloadAction<IAttachments>) {
      state.attachments = [...state.attachments, action.payload];
    },
    setLoading(
      state,
      action: PayloadAction<{ name: LoadingsNames; value: boolean }>
    ) {
      state[action.payload.name] = action.payload.value;
    },
    setFilterList: (
      state,
      action: PayloadAction<{
        modalType: ModalConfigTypes;
        filters: IFiltersDescription[];
      }>
    ) => {
      state.modalConfigs[action.payload.modalType].filterList =
        action.payload.filters;
    },
    setListFilter(
      state,
      action: PayloadAction<{
        modalType: ModalConfigTypes;
        listFilter: IListFilter<TypicalViolationForActModalFilter>;
      }>
    ) {
      state.modalConfigs[action.payload.modalType].listFilter =
        action.payload.listFilter;
    },
    resetListFilter(state, action: PayloadAction<ModalConfigTypes>) {
      state.modalConfigs[action.payload].listFilter = initListFilter;
    },
  },
  extraReducers: (builder) => {
    // вкладка Общая информация
    builder.addCase(getVerificationActPageThunk.fulfilled, (state, action) => {
      state.act = action.payload
    });

    // вкладка Выявленные нарушения
    builder.addCase(getViolationsThunk.fulfilled, (state, { payload }) => {
      state.identifiedViolationsOrRecommendations = payload
    });

    // вкладка Комиссия
    builder.addCase(
      getVerificationActSectionPageThunk.fulfilled,
      (state, action) => {
        state[action.meta.arg.sectionType] = action.payload
      }
    );

    builder.addCase(
      getFilterDescriptionViolationThunk.fulfilled,
      (state, action) => {
        state.modalConfigs = update(state.modalConfigs, {
          [action.payload.modalType]: {
            filterList: { $set: action.payload.list },
          },
        });
      }
    );
    builder.addCase(
      getFilterViolationScheduleThunk.fulfilled,
      (state, action) => {
        state.modalConfigs = update(state.modalConfigs, {
          [action.payload.modalType]: {
            violations: { $set: action.payload.entities },
          },
        });
      }
    );
    builder.addCase(copyViolationScheduleThunk.fulfilled, (state, action) => {
      const id = state.currentId;

      if (id === null) {
        return;
      }

      state.memoizePages = update(state.memoizePages, {
        [id]: {
          identifiedViolationsOrRecommendations: {
            items: { $push: action.payload as any },
          },
        },
      });
    });
    builder.addCase(getActAttachmentsThunk.pending, (state) => {
      state[LoadingsNames.isActAttachmentsLoading] = true;
    });
    builder.addCase(getActAttachmentsThunk.fulfilled, (state, { payload }) => {
      state.attachments = payload;
      state[LoadingsNames.isActAttachmentsLoading] = false;
    });
    builder.addCase(getActAttachmentsThunk.rejected, (state) => {
      state[LoadingsNames.isActAttachmentsLoading] = false;
    });
    builder.addCase(setMainFileThunk.fulfilled, (state, { payload }) => {
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
    builder.addCase(
      deleteActAttachmentThunk.fulfilled,
      (state, { payload }) => {
        state.attachments = state.attachments.filter((attach) => {
          if (attach.id !== payload) {
            return attach;
          }
        });
      }
    );
    builder.addMatcher(isRemovedAction, (state, { payload }) => {
      state.memoizePages = update(state.memoizePages, {
        [payload.actId]: {
          [payload.sectionType]: {
            items: (itemsData: unknown) => {
              if (!Array.isArray(itemsData)) {
                return [];
              }
              const index = itemsData.findIndex(
                (item) => item.id === payload.id
              );
              if (index === -1) {
                return update(itemsData, { $set: itemsData });
              }
              // сдвигаем serials
              const updatedSerials = moveSerialsLeft(current(itemsData), index);

              return update(updatedSerials, { $splice: [[index, 1]] });
            },
          },
        },
      });
    });
    builder.addMatcher(isAddedOptionActions, (state, { payload }) => {
      const items = state.memoizeOptions[payload.actId][payload.optionType];

      if (!Array.isArray(items)) {
        return;
      }
      state.memoizeOptions = update(state.memoizeOptions, {
        [payload.actId]: {
          [payload.optionType]: { $set: payload.items },
        },
      });
    });
    builder.addMatcher(isAddedAction, (state, { payload }) => {
      state.memoizePages = update(state.memoizePages, {
        [payload.actId]: {
          [payload.sectionType]: { items: { $push: [payload.data] } },
        },
      });
    });
    builder.addMatcher(isEditedAction, (state, { payload }) => {
      state.memoizePages = update(state.memoizePages, {
        [payload.actId]: {
          [payload.sectionType]: {
            items: (itemsData: unknown) => {
              if (!Array.isArray(itemsData)) {
                return;
              }
              const index = itemsData.findIndex(
                (item) => item.id === payload.data.id
              );
              if (index === -1) {
                return update(itemsData, { $set: itemsData });
              }
              return update(itemsData, { [index]: { $set: payload.data } });
            },
          },
        },
      });
    });
  },
});

export const {
  clearVerificationMemoizePage,
  setAttachments,
  setLoading,
  setFilterList,
  resetListFilter,
  setListFilter,
  setAttachment,
} = verificationAct.actions;

export default verificationAct.reducer;
