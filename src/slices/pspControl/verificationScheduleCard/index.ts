import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import update from "immutability-helper";
import { CheckingObjectsItem } from "../../../components/PspControl/CheckingObjects/classes";
import {
  IFiltersDescription,
  IListFilter,
  Nullable,
  ValueOf,
} from "../../../types";
import { initialBaseFilter } from "./constants";
import {
  ICheckingObjectsModalFilter,
  IOsu,
  IScheduleAttachments,
  IVerificationLevelsOst,
  ISiknLabRsuVerificationSchedulesModel,
  ISiknLabRsuVerificationSchedulesGroup,
  ICommissionVerificationModel,
  NotificationVerSched,
} from "./types";
import { signVerificationScheduleThunk } from "../../../thunks/pspControl/verificationSchedule";
import {
  getScheduleAttachmentsThunk,
  deleteScheduleAttachmentThunk,
  setScheduleMainFileThunk,
  getVerificationCommissionsThunk,
  createVerificationCommissionThunk,
  sortVerificationCommissionThunk,
  removeVerificationCommissionThunk,
  updateVerificationCommissionThunk,
} from "thunks/pspControl/verificationScheduleCard";
import { moveSerialsLeft } from "slices/verificationActs/verificationAct/helpers";

export enum LoadingsNames {
  isVerificationScheduleCardInfoLoading = "isVerificationScheduleCardInfoLoading",
  isVerificationLevelsOstLoading = "isVerificationLevelsOstLoading",
  isVerificationObjectsPpsLoading = "isVerificationObjectsPpsLoading",
  isVerificationPspsLoading = "isVerificationPspsLoading",
  isVerificationScheduleEditing = "isVerificationScheduleEditing",
  isCheckingObjectsLoading = "isCheckingObjectsLoading",
  isAddPspsToVerificationSchedulePending = "isAddPspsToVerificationSchedulePending",
  isFilterListLoading = "isFilterListLoading",
  isScheduleAttachmentsLoading = "isScheduleAttachmentsLoading",
  isDeletingScheduleAttachment = "isDeletingScheduleAttachment",
  isDeletingVerificationSchedulePsp = "isDeletingVerificationSchedulePsp",
}

export enum DictionariesNames {
  verificationLevelsOst = "verificationLevelsOst",
  verificationObjectsPps = "VerificationObjectsPps",
}

interface IDictionaries {
  [DictionariesNames.verificationLevelsOst]: IVerificationLevelsOst[];
  [DictionariesNames.verificationObjectsPps]: IOsu[];
}

export interface IVerificationScheduleCardStore {
  verificationScheduleCardInfo: Nullable<ISiknLabRsuVerificationSchedulesModel>;
  tableData: ISiknLabRsuVerificationSchedulesGroup[];
  verificationScheduleGroupInfo: Nullable<ISiknLabRsuVerificationSchedulesGroup>;
  checkingObjects: CheckingObjectsItem[];
  dictionaries: IDictionaries;
  baseFilter: IListFilter<ICheckingObjectsModalFilter>;
  filterList: IFiltersDescription[];
  attachments: IScheduleAttachments[];
  commissions: ICommissionVerificationModel[];
  notificationVerSched: NotificationVerSched[];
  [LoadingsNames.isVerificationScheduleCardInfoLoading]: boolean;
  [LoadingsNames.isVerificationLevelsOstLoading]: boolean;
  [LoadingsNames.isVerificationObjectsPpsLoading]: boolean;
  [LoadingsNames.isVerificationPspsLoading]: boolean;
  [LoadingsNames.isVerificationScheduleEditing]: boolean;
  [LoadingsNames.isCheckingObjectsLoading]: boolean;
  [LoadingsNames.isAddPspsToVerificationSchedulePending]: boolean;
  [LoadingsNames.isFilterListLoading]: boolean;
  [LoadingsNames.isScheduleAttachmentsLoading]: boolean;
  [LoadingsNames.isDeletingScheduleAttachment]: boolean;
  [LoadingsNames.isDeletingVerificationSchedulePsp]: boolean;
}

const initialState: IVerificationScheduleCardStore = {
  verificationScheduleCardInfo: null,
  tableData: [],
  verificationScheduleGroupInfo: null,
  checkingObjects: [],
  dictionaries: {
    [DictionariesNames.verificationLevelsOst]: [],
    [DictionariesNames.verificationObjectsPps]: [],
  },
  baseFilter: initialBaseFilter,
  filterList: [],
  attachments: [],
  commissions: [],
  notificationVerSched: [],
  [LoadingsNames.isVerificationScheduleCardInfoLoading]: false,
  [LoadingsNames.isVerificationLevelsOstLoading]: false,
  [LoadingsNames.isVerificationObjectsPpsLoading]: false,
  [LoadingsNames.isVerificationPspsLoading]: false,
  [LoadingsNames.isVerificationScheduleEditing]: false,
  [LoadingsNames.isCheckingObjectsLoading]: false,
  [LoadingsNames.isAddPspsToVerificationSchedulePending]: false,
  [LoadingsNames.isFilterListLoading]: false,
  [LoadingsNames.isScheduleAttachmentsLoading]: false,
  [LoadingsNames.isDeletingScheduleAttachment]: false,
  [LoadingsNames.isDeletingVerificationSchedulePsp]: false,
  [LoadingsNames.isDeletingVerificationSchedulePsp]: false,
};

export const verificationScheduleCard = createSlice({
  name: "verificationScheduleCard",
  initialState,
  reducers: {
    setTableData: (
      state,
      action: PayloadAction<ISiknLabRsuVerificationSchedulesGroup[]>
    ) => {
      state.tableData = action.payload;
    },
    setVerificationScheduleCardInfo: (
      state,
      action: PayloadAction<Nullable<ISiknLabRsuVerificationSchedulesModel>>
    ) => {
      state.verificationScheduleCardInfo = action.payload;
    },
    setVerificationScheduleGroupInfo: (
      state,
      action: PayloadAction<Nullable<ISiknLabRsuVerificationSchedulesGroup>>
    ) => {
      state.verificationScheduleGroupInfo = action.payload;
    },
    setCheckingObjects: (
      state,
      action: PayloadAction<CheckingObjectsItem[]>
    ) => {
      state.checkingObjects = action.payload;
    },
    setDictionaries: (
      state: IVerificationScheduleCardStore,
      action: PayloadAction<{
        name: DictionariesNames;
        value: ValueOf<IDictionaries>;
      }>
    ) => {
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
    setBaseFilter: (
      state,
      action: PayloadAction<IListFilter<ICheckingObjectsModalFilter>>
    ) => {
      state.baseFilter = action.payload;
    },
    resetBaseFilter: (state) => {
      state.baseFilter = initialBaseFilter;
    },
    setFilterList: (state, action: PayloadAction<IFiltersDescription[]>) => {
      state.filterList = action.payload;
    },
    setAttachments(state, action: PayloadAction<IScheduleAttachments[]>) {
      state.attachments = action.payload;
    },
    setAttachment(state, action: PayloadAction<IScheduleAttachments>) {
      state.attachments = [...state.attachments, action.payload];
    },
    setNotificationVerSched: (
      state,
      action: PayloadAction<NotificationVerSched[]>
    ) => {
      state.notificationVerSched = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getScheduleAttachmentsThunk.pending, (state) => {
      state[LoadingsNames.isScheduleAttachmentsLoading] = true;
    });
    builder.addCase(
      getScheduleAttachmentsThunk.fulfilled,
      (state, { payload }) => {
        state.attachments = payload;
        state[LoadingsNames.isScheduleAttachmentsLoading] = false;
      }
    );
    builder.addCase(getScheduleAttachmentsThunk.rejected, (state) => {
      state[LoadingsNames.isScheduleAttachmentsLoading] = false;
    });
    builder.addCase(
      setScheduleMainFileThunk.fulfilled,
      (state, { payload }) => {
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
      }
    );
    builder.addCase(
      deleteScheduleAttachmentThunk.fulfilled,
      (state, { payload }) => {
        state.attachments = state.attachments.filter((attach) => {
          if (attach.id !== payload) {
            return attach;
          }
        });
      }
    );
    builder.addCase(
      signVerificationScheduleThunk.fulfilled,
      (state, action) => {
        if (state.verificationScheduleCardInfo) {
          state.verificationScheduleCardInfo.verificationStatusId =
            action.payload.verificationStatusId;
          state.verificationScheduleCardInfo.verificationStatus =
            action.payload.verificationStatus;
        }
      }
    );
    builder.addCase(
      getVerificationCommissionsThunk.fulfilled,
      (state, { payload }) => {
        state.commissions = payload;
      }
    );
    builder.addCase(
      createVerificationCommissionThunk.fulfilled,
      (state, { payload }) => {
        state.commissions = [...state.commissions, payload];
      }
    );
    builder.addCase(
      updateVerificationCommissionThunk.fulfilled,
      (state, { payload }) => {
        const index = state.commissions.findIndex(
          (item) => item.id === payload.id
        );
        if (index === -1) {
          return;
        }
        state.commissions = update(state.commissions, {
          [index]: { $set: payload },
        });
      }
    );
    builder.addCase(
      removeVerificationCommissionThunk.fulfilled,
      (state, { payload }) => {
        const index = state.commissions.findIndex(
          (item) => item.id === payload
        );
        if (index === -1) {
          return;
        }

        state.commissions = update(state.commissions, (items) => {
          const movedSerials = moveSerialsLeft(items, index);

          return update(movedSerials, { $splice: [[index, 1]] });
        });
      }
    );
    builder.addCase(
      sortVerificationCommissionThunk.fulfilled,
      (state, { payload }) => {
        state.commissions = payload;
      }
    );
  },
});

export const {
  setTableData,
  setVerificationScheduleCardInfo,
  setVerificationScheduleGroupInfo,
  setCheckingObjects,
  setDictionaries,
  setLoading,
  setBaseFilter,
  resetBaseFilter,
  setFilterList,
  setAttachments,
  setAttachment,
  setNotificationVerSched,
} = verificationScheduleCard.actions;

export const verificationScheduleCardReducer = verificationScheduleCard.reducer;
