import { createAsyncThunk } from "@reduxjs/toolkit";
import isEmpty from "lodash/isEmpty";
import { message } from "antd";
import axios from "axios";

import { ThunkApi } from "../../types";
import {
  CheckingObject,
  ClassifType,
  GroupClassiffNumbersOptions,
  IViolationListItemModel,
  ModalConfigTypes,
  ReportItemModel,
  RecommendationItemModel,
  SourceRemark,
  VerificationPage,
} from "slices/verificationActs/verificationAct/types";
import {
  VerificationActOptions,
  VerificationActSection,
} from "containers/VerificationActs/VerificationAct/types";
import * as actAPI from "../../../api/requests/verificationActs";
import {
  deleteVerificationActOSUItemBySiknLabRsuIdRequest,
  getAreaOfResponsibilityByIdRequest,
  getCheckingObjectItemsByActIdRequest,
  getClassiffRequest,
  getOSUSItemsBySiknLabRsuIdRequest,
  getViolationsSourcesRequest,
} from "api/requests/verificationActs";
import {
  ActAction,
  RemoveVerificationOsuItemThunkParams,
  RemoveVerificationOtherPartItemThunkParams,
  RemoveVerificationOtherPartItemThunkResponse,
  SectionAction,
  SetVerificationOsuItemThunk,
} from "./types";
import {
  getSortedViolationsByAreaGroup,
  moveSerialsLeft,
} from "slices/verificationActs/verificationAct/helpers";
import {
  CommissionsDtoParams,
  OtherPartDtoParams,
  RecommendationDtoParams,
  ReportDtoParams,
  ViolationDtoParams,
} from "slices/verificationActs/verificationAct/params";
import { OsusItem } from "components/PspControl/PspObject/classes";
import { apiBase, openNotification } from "../../../utils";
import { ApiRoutes } from "api/api-routes.enum";
import { history } from "../../../history/history";
import { IFiltersDescription, IListFilter, Nullable } from "types";
import {
  IViolationListModel,
  TypicalViolationForActModalFilter,
} from "slices/pspControl/actionPlanTypicalViolations/types";
import { IViolationListModel as IViolationList } from "../../../slices/verificationActs/verificationAct/types";
import { IdentifiedViolationActDto } from "api/requests/verificationActs/dto-types";
import { CommissionItem } from "components/VerificationActs/VerificationAct/classes";
import { IAttachments } from "components/UploadAttachment/types";

const setSerials = async (
  type: VerificationActSection,
  id: string,
  items: any[]
) => {
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) {
    return;
  }
  const updatedSerials = moveSerialsLeft(items, index);
  const ids = updatedSerials.map((item) => ({
    id: item.id,
    newSerial: item.serial,
  }));
  await actAPI.setNewSerialsByTypeRequest(type, ids);
};

export const getVerificationActPageThunk = createAsyncThunk<
  VerificationPage | null,
  string,
  ThunkApi
>("verificationAct/getVerificationActPageThunk", async (actId) => {
  try {
    const data = await actAPI.getVerificationActByIdRequest(actId);
    return data;
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });

    history.push("/pspcontrol/verification-acts");
    return null;
  }
});

export const getVerificationActSectionPageThunk = createAsyncThunk<
  CommissionItem[],
  SectionAction,
  ThunkApi
>(
  "verificationAct/getVerificationActSectionPageThunk",
  async ({ actId, sectionType }) => {
    try {
      const data = await actAPI.getSectionRequest<any[]>({
        sectionType,
        actId,
      });

      return data;
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });

      return [];
    }
  }
);

export const getViolationsThunk = createAsyncThunk<any, ActAction, ThunkApi>(
  "verificationAct/getViolationsThunk",
  async ({ actId }, thunkApi) => {
    try {
      const data = await actAPI.getIdentifiedViolationsRequest(actId);
      const sorted = getSortedViolationsByAreaGroup(data);

      return sorted;
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
    }
  }
);

export const getOSUSVerificationThunk = createAsyncThunk<
  {
    items: OsusItem[];
    optionType: VerificationActOptions;
  } & ActAction,
  { pspId: string } & ActAction,
  ThunkApi
>(
  "verificationAct/getOSUSVerificationThunk",
  async ({ actId, pspId }, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const data = await getOSUSItemsBySiknLabRsuIdRequest(pspId);
      if (!data) {
        return rejectWithValue({ actId });
      }
      const items = data.osus;
      return { actId, items, optionType: VerificationActOptions.OSUS };
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });

      return rejectWithValue(error.response.data);
    }
  }
);

export const getSourceRemarkThunk = createAsyncThunk<
  { items: SourceRemark[]; optionType: VerificationActOptions } & ActAction,
  ActAction,
  ThunkApi
>("verificationAct/getSourceRemarkThunk", async ({ actId }, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const data = await actAPI.getSourceRemark();
    if (!data) {
      return rejectWithValue({ actId });
    }
    const items = data;
    return { actId, items, optionType: VerificationActOptions.SourceRemark };
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });

    return rejectWithValue(error.response.data);
  }
});

export const getCheckingObjectVerificationThunk = createAsyncThunk<
  {
    items: CheckingObject[];
    optionType: VerificationActOptions;
  } & ActAction,
  ActAction,
  ThunkApi
>("verificationAct/getOSUSVerificationThunk", async ({ actId }, thunkApi) => {
  const { rejectWithValue } = thunkApi;
  try {
    const data = await getCheckingObjectItemsByActIdRequest(actId);
    if (!data) {
      return rejectWithValue({ actId });
    }
    const items = data;
    return { actId, items, optionType: VerificationActOptions.OSUS };
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });

    return rejectWithValue(error.response.data);
  }
});

export const getAreaResponsibilitiesThunk = createAsyncThunk<
  {
    items: string[];
    optionType: VerificationActOptions;
  } & ActAction,
  ActAction,
  ThunkApi
>(
  "verificationAct/getAreaResponsibilitiesThunk",
  async ({ actId }, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const items = await getAreaOfResponsibilityByIdRequest(actId);

      return {
        actId,
        items,
        optionType: VerificationActOptions.AreaOfResponsibility,
      };
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });

      return rejectWithValue(error.response.data);
    }
  }
);

export const getClassificationNumbersNumberThunk = createAsyncThunk<
  {
    items: GroupClassiffNumbersOptions[];
    optionType: VerificationActOptions;
  } & ActAction,
  { type: ClassifType } & ActAction,
  ThunkApi
>(
  "verificationAct/getClassificationNumberThunk",
  async ({ actId, type }, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const items = await getClassiffRequest(type);

      return {
        actId,
        items,
        optionType: VerificationActOptions.ClassificationNumber,
      };
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });

      return rejectWithValue(error.response.data);
    }
  }
);

export const getViolationSourceThunk = createAsyncThunk<
  {
    items: string[];
    optionType: VerificationActOptions;
  } & ActAction,
  ActAction,
  ThunkApi
>("verificationAct/getViolationSourceThunk", async ({ actId }, thunkApi) => {
  const { rejectWithValue } = thunkApi;
  try {
    const data = await getViolationsSourcesRequest(actId);
    if (!data) {
      return rejectWithValue({ actId });
    }
    const items = data;
    return { actId, items, optionType: VerificationActOptions.OSUS };
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });

    return rejectWithValue(error.response.data);
  }
});

export const getCtoThunk = createAsyncThunk<
  {
    items: { id: null; label: string }[];
    optionType: VerificationActOptions;
  } & ActAction,
  ActAction,
  ThunkApi
>("verificationAct/getCtoThunk", async ({ actId }, thunkApi) => {
  const { rejectWithValue } = thunkApi;
  try {
    const data = await actAPI.getCtoRequest(actId);
    if (!data) {
      return rejectWithValue({ actId });
    }
    const items = data;
    return { actId, items, optionType: VerificationActOptions.CTO };
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });

    return rejectWithValue(error.response.data);
  }
});

export const setVerificationOsuItemThunk = createAsyncThunk<
  void,
  SetVerificationOsuItemThunk,
  ThunkApi
>("verificationAct/setVerificationOsuItemThunk", async ({ actId, data }) => {
  try {
    await actAPI.setVerificationActOSUItemRequest({
      actId,
      osuId: data.id as string,
    });
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });
  }
});

export const removeVerificationOsuItemThunk = createAsyncThunk<
  void,
  RemoveVerificationOsuItemThunkParams
>("verificationAct/removeVerificationOsuItemThunk", async ({ actId, id }) => {
  try {
    await actAPI.deleteVerificationActOSUItemBySiknLabRsuIdRequest(id);
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });
  }
});

export const addVerificationOtherPartItemThunk = createAsyncThunk<
  { data: OtherPartDtoParams } & SectionAction,
  { data: OtherPartDtoParams } & ActAction
>(
  "verificationAct/addVerificationOtherPartItemThunk",
  async ({ actId, data }, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const response = await actAPI.addVerificationActOtherPartyRequest({
        actId,
        data,
      });
      return {
        actId,
        data: response,
        sectionType: VerificationActSection.OtherSides,
      };
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });

      return rejectWithValue(error.response.data);
    }
  }
);

export const addVerificationViolationsItemThunk = createAsyncThunk<
  void,
  { data: ViolationDtoParams } & ActAction
>(
  "verificationAct/addVerificationViolationsItemThunk",
  async ({ actId, data }, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      await actAPI.addVerificationActViolationsRequest({
        data,
        actId,
      });
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
    }
  }
);

export const addVerificationCommissionsItemThunk = createAsyncThunk<
  void,
  { data: CommissionsDtoParams } & ActAction
>(
  "verificationAct/addVerificationCommissionsItemThunk",
  async ({ actId, data }) => {
    try {
      await actAPI.addVerificationActCommissionsRequest({
        data,
        actId,
      });
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
    }
  }
);

export const addVerificationRecommendationItemThunk = createAsyncThunk<
  void,
  { data: RecommendationDtoParams } & ActAction
>(
  "verificationAct/addVerificationRecommendationItemThunk",
  async ({ actId, data }) => {
    try {
      await actAPI.addVerificationActRecommendationRequest({
        data,
        actId,
      });
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
    }
  }
);

export const addVerificationReportItemThunk = createAsyncThunk<
  void,
  { data: ReportDtoParams } & ActAction
>(
  "verificationAct/addVerificationReportItemThunk",
  async ({ actId, data }, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      await actAPI.addVerificationActReportRequest({
        data,
        actId,
      });
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
    }
  }
);

export const removeVerificationReportItemThunk = createAsyncThunk<
  void,
  RemoveVerificationOtherPartItemThunkParams,
  ThunkApi
>(
  "verificationAct/removeVerificationReportItemThunk",
  async ({ actId, id }, thunkApi) => {
    const { getState, rejectWithValue } = thunkApi;
    try {
      await actAPI.deleteVerificationActAdditionRequest({ id });

      const items = getState().verificationAct.compositionOfAppendicesToReport;

      await setSerials(
        VerificationActSection.CompositionOfAppendicesToReport,
        id,
        items
      );
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
    }
  }
);

export const removeVerificationOtherPartItemThunk = createAsyncThunk<
  RemoveVerificationOtherPartItemThunkResponse,
  RemoveVerificationOtherPartItemThunkParams,
  ThunkApi
>(
  "verificationAct/removeVerificationOtherPartItemThunk",
  async ({ actId, id }, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;
    try {
      await actAPI.deleteVerificationActOtherPartyRequest({ id });
      const items =
        getState().verificationAct.memoizePages[actId]?.otherSides.items || [];

      await setSerials(VerificationActSection.OtherSides, id, items);
      return {
        actId,
        id,
        sectionType: VerificationActSection.OtherSides,
      };
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });

      return rejectWithValue(error.response.data);
    }
  }
);

export const removeVerificationCommissionItemThunk = createAsyncThunk<
  void,
  RemoveVerificationOtherPartItemThunkParams,
  ThunkApi
>(
  "verificationAct/removeVerificationCommissionItemThunk",
  async ({ actId, id }, thunkApi) => {
    const { getState } = thunkApi;

    try {
      const items = getState().verificationAct.commission;

      await setSerials(VerificationActSection.Commission, id, items);
      await actAPI.deleteVerificationActCommissionRequest({ id });
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
    }
  }
);

export const removeVerificationIdentifiedItemThunk = createAsyncThunk<
  void,
  RemoveVerificationOtherPartItemThunkParams & {
    siknLabRsuId: string;
    area: string;
  },
  ThunkApi
>(
  "verificationAct/removeVerificationIdentifiedItemThunk",
  async ({ actId, id, siknLabRsuId, area }, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;
    try {
      const items =
        getState().verificationAct.identifiedViolationsOrRecommendations;

      const groupItems =
        items.find((v) => v.areaOfResponsibility === area)?.violations || [];

      await setSerials(
        VerificationActSection.IdentifiedViolationsOrRecommendations,
        id,
        groupItems
      );
      await actAPI.deleteVerificationActViolationByIdRequest({ id });
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
    }
  }
);

export const removeVerificationRecommendationItemThunk = createAsyncThunk<
  void,
  RemoveVerificationOtherPartItemThunkParams,
  ThunkApi
>(
  "verificationAct/removeVerificationRecommendationItemThunk",
  async ({ actId, id }, thunkApi) => {
    const { getState } = thunkApi;
    try {
      const recommendations = getState().verificationAct.recommendations;

      await setSerials(
        VerificationActSection.Recommendations,
        id,
        recommendations
      );
      await actAPI.deleteVerificationActRecommendationRequest({ id });
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
    }
  }
);

export const removeVerificationCompositionItemThunk = createAsyncThunk<
  RemoveVerificationOtherPartItemThunkResponse,
  RemoveVerificationOtherPartItemThunkParams,
  ThunkApi
>(
  "verificationAct/removeVerificationCompositionItemThunk",
  async ({ actId, id }, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;
    try {
      await deleteVerificationActOSUItemBySiknLabRsuIdRequest(id);
      const items =
        getState().verificationAct.memoizePages[actId]
          ?.compositionOfAppendicesToReport.items || [];

      await setSerials(
        VerificationActSection.CompositionOfAppendicesToReport,
        id,
        items
      );
      return {
        actId,
        id,
        sectionType: VerificationActSection.CompositionOfAppendicesToReport,
      };
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });

      return rejectWithValue(error.response.data);
    }
  }
);

// EDIT

export const editVerificationOtherPartItemThunk = createAsyncThunk<
  { data: OtherPartDtoParams } & SectionAction,
  { data: OtherPartDtoParams } & ActAction
>(
  "verificationAct/editVerificationOtherPartItemThunk",
  async ({ actId, data }, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const response = await actAPI.editVerificationActOtherPartyRequest({
        actId,
        data,
      });
      return {
        actId,
        data,
        sectionType: VerificationActSection.OtherSides,
      };
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });

      return rejectWithValue(error.response.data);
    }
  }
);

export const editVerificationViolationsItemThunk = createAsyncThunk<
  void,
  { data: ViolationDtoParams } & ActAction,
  ThunkApi
>(
  "verificationAct/editVerificationViolationsItemThunk",
  async ({ actId, data }, thunkApi) => {
    const { rejectWithValue, dispatch } = thunkApi;
    try {
      await actAPI.editVerificationActViolationsRequest({
        data,
        actId,
      });
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
    }
  }
);

export const editVerificationCommissionsItemThunk = createAsyncThunk<
  void,
  { data: CommissionsDtoParams } & ActAction
>(
  "verificationAct/editVerificationCommissionsItemThunk",
  async ({ actId, data }, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const response = await actAPI.editVerificationActCommissionsRequest({
        data,
        actId,
      });
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
    }
  }
);

export const editVerificationRecommendationItemThunk = createAsyncThunk<
  void,
  { data: RecommendationDtoParams } & ActAction
>(
  "verificationAct/editVerificationRecommendationItemThunk",
  async ({ actId, data }) => {
    try {
      await actAPI.editVerificationActRecommendationRequest({
        data,
        actId,
      });
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
    }
  }
);

export const editVerificationReportItemThunk = createAsyncThunk<
  void,
  { data: ReportDtoParams } & ActAction
>(
  "verificationAct/editVerificationReportItemThunk",
  async ({ actId, data }, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      await actAPI.editVerificationActReportRequest({
        data,
        actId,
      });
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
    }
  }
);
export const completeCreatingThunk = createAsyncThunk<void, ActAction>(
  "verificationAct/completeCreatingThunk",
  async ({ actId }, thunkApi) => {
    try {
      const response = await actAPI.completeCreatingRequest({ actId });
      if (response.message){
        openNotification("Уведомление", response.message);
      } 
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
    }
  }
);

// Получение вложений
export const getActAttachmentsThunk = createAsyncThunk<
  IAttachments[],
  Nullable<string>,
  ThunkApi
>(
  "verificationAct/getActAttachmentsThunk",
  async (verificationActId, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    if (!verificationActId) return rejectWithValue("not found id");

    try {
      const url = `${apiBase}${ApiRoutes.VerificationActs}/${verificationActId}/attachments`;

      const response = await axios.get<IAttachments[]>(url);

      const attachments = response.data.sort((a, b) => a.serial - b.serial);

      return attachments || [];
    } catch (error) {
      message.error({
        content: error?.response?.data?.message ?? "Неизвестная ошибка",
        duration: 2,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

// Удаление вложения
export const deleteActAttachmentThunk = createAsyncThunk<
  string,
  string,
  ThunkApi
>(
  "verificationAct/deleteActAttachmentThunk",
  async (attachmentId, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.VerificationActs}/attachment/${attachmentId}`;

      const response = await axios.delete(url);

      if (response.status === 200) {
        message.success({
          content: "Файл удален успешно",
          duration: 2,
        });
      } else {
        message.error({
          content: "Неизвестная ошибка",
          duration: 2,
        });

        throw Error("Неизвестная ошибка");
      }
      return attachmentId;
    } catch (error) {
      message.error({
        content: error?.response?.data?.message ?? "Неизвестная ошибка",
        duration: 2,
      });

      return rejectWithValue(error.response.data);
    }
  }
);

export const getFilterDescriptionViolationThunk = createAsyncThunk<
  { list: IFiltersDescription[]; modalType: ModalConfigTypes },
  ModalConfigTypes,
  ThunkApi
>(
  "verificationAct/getFilterDescriptionScheduleThunk",
  async (modalType, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
      const filterListFromState =
        getState().verificationAct.modalConfigs[modalType].filterList;

      if (!isEmpty(filterListFromState)) {
        return { list: filterListFromState, modalType };
      }

      const requestDescription =
        modalType === ModalConfigTypes.TypicalViolation
          ? actAPI.getDescriptionTypicalViolations
          : actAPI.getDescriptionIdentifiedViolations;

      const { filterList } = await requestDescription();

      return { list: filterList, modalType };
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFilterViolationScheduleThunk = createAsyncThunk<
  { entities: IViolationListModel[]; modalType: ModalConfigTypes },
  {
    modalType: ModalConfigTypes;
    listFilter?: IListFilter<TypicalViolationForActModalFilter>;
  },
  ThunkApi
>(
  "verificationAct/getFilterViolationScheduleThunk",
  async ({ modalType, listFilter }, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
      const state = getState();
      const baseFilter =
        listFilter || state.verificationAct.modalConfigs[modalType].listFilter;

      const requestDescription =
        modalType === ModalConfigTypes.TypicalViolation
          ? actAPI.getTypicalViolationsFilter
          : actAPI.getIdentifiedViolationsTable;

      const { entities } = await requestDescription(baseFilter);

      return { entities, modalType };
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const copyViolationScheduleThunk = createAsyncThunk<
  IdentifiedViolationActDto,
  {
    id: string;
    violations: string[];
    type: ModalConfigTypes;
  },
  ThunkApi
>(
  "verificationAct/copyViolationScheduleThunk",
  async ({ type, ...violations }, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const requestDescription =
        type === ModalConfigTypes.TypicalViolation
          ? actAPI.copyTypicalViolationsRequest
          : actAPI.copyIdentifiedViolationsRequest;
      return await requestDescription(violations);
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const setMainFileThunk = createAsyncThunk<string, string, ThunkApi>(
  "verificationAct/setMainFileThunk",
  async (fileId, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
      await actAPI.setMainAttachmentRequest(fileId);

      return fileId;
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
      return rejectWithValue(error.response.data);
    }
  }
);

export const changeOrderViolationsThunk = createAsyncThunk<
  void,
  { id: string; violations: IViolationListItemModel[]; area: string },
  ThunkApi
>("verificationAct/changeOrderViolationsThunk", async (params, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const ids = params.violations.map((item) => ({
      id: item.id,
      newSerial: item.serial,
    }));
    await actAPI.setViolationNewSerialsRequest(ids);
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });
  }
});

export const changeOrderAreaViolationsThunk = createAsyncThunk<
  void,
  { area: string; violations: IViolationList[] },
  ThunkApi
>(
  "verificationAct/changeOrderAreaViolationsThunk",
  async (params, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
      const ids = params.violations.map((item) => ({
        id: item.id,
        newSerial: item.serial,
      }));
      await actAPI.setIdentifiedViolationNewSerialsRequest(ids);
    } catch (error) {
      message.error({
        content: error.message,
        duration: 2,
      });
    }
  }
);

export const changeOrderReportThunk = createAsyncThunk<
  void,
  { items: ReportItemModel[] },
  ThunkApi
>("verificationAct/changeOrderReportThunk", async (params, thunkApi) => {
  const { rejectWithValue } = thunkApi;

  try {
    const ids = params.items.map((item) => ({
      id: item.id,
      newSerial: item.serial,
    }));
    await actAPI.setReportNewSerialsRequest(ids);
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });
  }
});

export const changeOrderRecommendationThunk = createAsyncThunk<
  void,
  { items: RecommendationItemModel[] },
  ThunkApi
>("verificationAct/changeOrderRecommendationThunk", async (params) => {
  try {
    const ids = params.items.map((item) => ({
      id: item.id,
      newSerial: item.serial,
    }));
    await actAPI.setRecommendationsNewSerialsRequest(ids);
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });
  }
});
