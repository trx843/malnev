import {
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
  current,
} from "@reduxjs/toolkit";
import update from "immutability-helper";
import {
  // getViolationsBySectionThunk,
  getTypicalPlanPageThunk,
  addActionPlanPageThunk,
  editActionPlanPageThunk,
  removeActionPlanPageThunk,
  setMainFileThunk,
  getPlanTypicalAttachmentsThunk,
  deletePlanTypicalAttachmentThunk,
  sortViolationsThunk,
  changePlanTypicalStatusThunk,
  getViolationsByAreaOfResponsibilityThunk,
} from "../../../thunks/pspControl/actionPlans/actionPlanTypicalViolations";
import {
  ActionPlanTypicalSection,
  ActionPlanTypicalSectionPending,
  ActionPlanTypicalViolationsStore,
  ActionTypicalPlanSectionBody,
  IFilter,
  IFilterBasicInformation,
  IViolationListModel,
  TypicalPlanListFilter,
  TypicalPlanSections,
} from "./types";
import {
  initListFilter,
  VERIFICATED_DATE_FROM,
  VERIFICATED_DATE_TO,
} from "./constants";
import { IFiltersDescription, IListFilter } from "../../../types";
import { AreasOfResponsibility } from "pages/PspControl/ActionPlans/EliminationOfTypicalViolations/constants";
import moment from "moment";
import { IAttachments } from "components/UploadAttachment/types";

export enum LoadingsNames {
  isViolationsLoading = "isViolationsLoading",
  isFilterListLoading = "isFilterListLoading",
  isAddingTypicalViolation = "isAddingTypicalViolation",
}

const initialState: ActionPlanTypicalViolationsStore = {
  pending: false,
  sectionPending: {},
  currentId: null,
  memoizePages: {},
  attachments: [],
  planName: "",
  planStatus: "",
  violations: [],
  filterList: [],
  listFilter: initListFilter,
  isAddViolationsModalVisible: false,
  [LoadingsNames.isViolationsLoading]: false,
  [LoadingsNames.isFilterListLoading]: false,
  [LoadingsNames.isAddingTypicalViolation]: false,


  filterBasicInformation: {
    verificationPeriodFrom: moment({ year: 2017 }).startOf('year').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS), // поле Период проверки с
    verificationPeriodFor: moment().startOf('day').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS), // поле Период проверки по
  },
  typicalPlanCard: null, // объект карточки типового плана

  isTypicalPlanCardLoading: false,
  isViolationsByAreaOfResponsibilityLoading: false,
  acceptancePointsForOilAndPetroleumProducts: [], // данные таблицы "Приемо-сдаточные пункты нефти и нефтепродуктов"
  testingLaboratoriesOfOilAndPetroleumProducts: [], // данные таблицы "Испытательные лаборатории нефти и нефтепродуктов",

  isMatchingsTabLoading: false,
  planStatusId: 0,
  isIL: false,
  isAttachmentsLoading: false,
  reloadTableItems: false,
};

const createPageBody = (
  planId: string | null = null
): ActionTypicalPlanSectionBody => ({
  filter: {
    planId,
    verificatedDateFrom: VERIFICATED_DATE_FROM,
    verificatedDateTo: VERIFICATED_DATE_TO,
    areaOfResponsibility:
      TypicalPlanSections.AcceptancePointsForOilAndPetroleumProducts,
    treeFilter: {
      isOwn: "",
      nodePath: "all",
    },
    rowCount: 0,
    pageIndex: 0,
    sortedField: "",
    isSortAsc: false,
  },
  entities: [],
  pageInfo: {
    pageNumber: 0,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
  },
});

const createPage = (planId: string): ActionPlanTypicalSection => ({
  [TypicalPlanSections.AcceptancePointsForOilAndPetroleumProducts]:
    createPageBody(planId),
  [TypicalPlanSections.TestingLaboratoriesOfOilAndPetroleumProducts]:
    createPageBody(planId),
});

const createPending = (): ActionPlanTypicalSectionPending => ({
  [TypicalPlanSections.AcceptancePointsForOilAndPetroleumProducts]: true,
  [TypicalPlanSections.TestingLaboratoriesOfOilAndPetroleumProducts]: true,
});

const actionPlanTypicalViolations = createSlice({
  name: "actionPlanTypicalViolations",
  initialState,
  reducers: {
    clearVerificationMemoizePage(state) {
      return update(state, {
        memoizePages: { $set: {} },
      });
    },
    setAttachments(state, action: PayloadAction<IAttachments[]>) {
      state.attachments = action.payload;
    },
    setAttachment(state, action: PayloadAction<IAttachments>) {
      state.attachments = [...state.attachments, action.payload];
    },
    initPlanTypicalViolationsPage(
      state,
      action: {
        payload: {
          planId: string;
        };
      }
    ) {
      state.memoizePages[action.payload.planId] =
        state.memoizePages[action.payload.planId] ||
        createPage(action.payload.planId);
      state.sectionPending[action.payload.planId] =
        state.sectionPending[action.payload.planId] || createPending();
    },
    setViolations(state, action: PayloadAction<IViolationListModel[]>) {
      state.violations = action.payload;
    },
    setFilterList: (state, action: PayloadAction<IFiltersDescription[]>) => {
      state.filterList = action.payload;
    },
    setListFilter(state, action: PayloadAction<TypicalPlanListFilter>) {
      state.listFilter = action.payload;
    },
    resetListFilter(state) {
      state.listFilter = initListFilter;
    },
    toggleAddViolationsModalVisibility(state) {
      state.isAddViolationsModalVisible = !state.isAddViolationsModalVisible;
    },
    setLoading(
      state,
      action: PayloadAction<{ name: LoadingsNames; value: boolean }>
    ) {
      state[action.payload.name] = action.payload.value;
    },
    setFilterBasicInformation(
      state,
      action: PayloadAction<IFilterBasicInformation>
    ) {
      state.filterBasicInformation = action.payload
    },
    setIsMatchingsTabLoading: (state, { payload }) => { state.isMatchingsTabLoading = payload },
    setPlanStatusId: (state, { payload }) => { state.planStatusId = payload },
    setIsIL: (state, { payload }) => { state.isIL = payload },
    setReloadTableItems: (state, { payload }) => { state.reloadTableItems = payload },
  },

  // PENDING ACTIONS
  extraReducers: (builder) => {
    // получение карточки типового плана
    builder.addCase(getTypicalPlanPageThunk.fulfilled, (state, action) => {
      state.typicalPlanCard = action.payload;
      state.isTypicalPlanCardLoading = false;
    });
    builder.addCase(getTypicalPlanPageThunk.pending, (state) => {
      state.isTypicalPlanCardLoading = true;
    });
    builder.addCase(getTypicalPlanPageThunk.rejected, (state) => {
      state.isTypicalPlanCardLoading = false;
    });


    // получение нарушений
    builder.addCase(getViolationsByAreaOfResponsibilityThunk.pending, (state, action) => {
      state.isViolationsByAreaOfResponsibilityLoading = true
    });

    builder.addCase(getViolationsByAreaOfResponsibilityThunk.fulfilled, (state, action) => {
      if (action.payload.areaOfResponsibility === AreasOfResponsibility.AcceptancePointsForOilAndPetroleumProducts) {
        state.acceptancePointsForOilAndPetroleumProducts = action.payload.entities
      }

      if (action.payload.areaOfResponsibility === AreasOfResponsibility.TestingLaboratoriesOfOilAndPetroleumProducts) {
        state.testingLaboratoriesOfOilAndPetroleumProducts = action.payload.entities
      }

      state.isViolationsByAreaOfResponsibilityLoading = false
    });

    builder.addCase(getViolationsByAreaOfResponsibilityThunk.rejected, (state) => {
      state.isViolationsByAreaOfResponsibilityLoading = false
    });

    builder.addCase(
      getPlanTypicalAttachmentsThunk.pending,
      (state) => {
        state.isAttachmentsLoading = true;
      }
    );
    builder.addCase(
      getPlanTypicalAttachmentsThunk.fulfilled,
      (state, { payload }) => {
        state.attachments = payload;
        state.isAttachmentsLoading = false;
      }
    );
    builder.addCase(
      getPlanTypicalAttachmentsThunk.rejected,
      (state) => {
        state.isAttachmentsLoading = false;
      }
    );
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

    // изменение статуса карточки
    builder.addCase(changePlanTypicalStatusThunk.fulfilled, (state, action) => {
      if (state.typicalPlanCard) {
        state.typicalPlanCard.planStatusId = action.payload.verificationStatusId;
        state.typicalPlanCard.planStatus = action.payload.verificationStatus;
      }
    });

  },
});

export const {
  setAttachment,
  setAttachments,
  clearVerificationMemoizePage,
  initPlanTypicalViolationsPage,
  setViolations,
  setFilterList,
  resetListFilter,
  setListFilter,
  toggleAddViolationsModalVisibility,
  setLoading,
  setFilterBasicInformation,
  setIsMatchingsTabLoading,
  setPlanStatusId,
  setIsIL,
  setReloadTableItems,
} = actionPlanTypicalViolations.actions;

export default actionPlanTypicalViolations.reducer;
