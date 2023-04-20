import { createAsyncThunk } from "@reduxjs/toolkit";
import moment, { isMoment } from "moment";
import axios from "axios";
import { message } from "antd";
import update from "immutability-helper";

import * as API from "../../../../api/requests/pspControl/plan-typical-violations";
import { ThunkApi } from "../../../types";
import {
  AddActionPlanDtoType,
  TypicalPlanCardDtoType,
  TypicalPlanCardFilterDto,
  TypicalPlanCardFilterEntitiesDto,
  TypicalPlanFilterDto,
} from "../../../../api/requests/pspControl/plan-typical-violations/dto-types";
import {
  IViolationListModel,
  TypicalPlanFilter,
  TypicalPlanSections,
} from "../../../../slices/pspControl/actionPlanTypicalViolations/types";
import { TypicalActionPlanParams } from "../../../../api/requests/pspControl/plan-typical-violations/contracts";
import { apiBase, getErrorMessage } from "../../../../utils";
import {
  LoadingsNames,
  setFilterList,
  setLoading,
  setViolations,
} from "../../../../slices/pspControl/actionPlanTypicalViolations";
import {
  ICustomAttrFilterConfig,
  Nullable,
  PagedModel,
} from "../../../../types";
import { ApiRoutes } from "../../../../api/api-routes.enum";
import minBy from "lodash/minBy";
import { PlanStatuses } from "enums";
import { mapViolations } from "./utils";
import { IAttachments } from "components/UploadAttachment/types";

const getPreparedFilter = (
  filter: TypicalPlanFilter,
  planId: string,
  areaOfResponsibility: TypicalPlanSections
): TypicalPlanFilterDto => {
  const preparedFilter: TypicalPlanFilterDto = {
    ...filter,
    planId,
    areaOfResponsibility,
    verificatedDateFrom: filter.verificatedDateFrom.format(
      moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
    ),
    verificatedDateTo: filter.verificatedDateTo.format(
      moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
    ),
  };

  return preparedFilter;
};

const getPreparedActionPlan = ({
  ...values
}: TypicalActionPlanParams): AddActionPlanDtoType => {
  const preparedFilter: AddActionPlanDtoType = {
    ...values,
    eliminatedOn: isMoment(values.eliminatedOn)
      ? values.eliminatedOn.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)
      : moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
  };

  const updated = update(preparedFilter, { $unset: ["violationsId"] });

  return updated as AddActionPlanDtoType;
};

export const getViolationsByAreaOfResponsibilityThunk = createAsyncThunk<
  any,
  string,
  ThunkApi
>(
  "actionPlanTypicalViolations/getViolationsByAreaOfResponsibilityThunk",
  async (areaOfResponsibility, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const planId = getState().actionPlanTypicalViolations.typicalPlanCard?.id;

    try {
      const filter = {
        filter: {
          areaOfResponsibility,
          treeFilter: {
            nodePath: "all",
            isOwn: null
          }
        },
        rowCount: 0,
        pageIndex: 0,
        sortedField: "",
        isSortAsc: true
      }

      const data = await API.getViolationsRequest(planId, filter);
      const adjustedEntities = mapViolations(data.entities)

      return {
        areaOfResponsibility,
        entities: adjustedEntities
      }
    } catch (err) {
      message.error({
        content: getErrorMessage(err),
        duration: 2,
      });
      return rejectWithValue(err.response.data);
    }
  }
);

export const getTypicalPlanPageThunk = createAsyncThunk<
  TypicalPlanCardDtoType,
  void,
  ThunkApi
>(
  "actionPlanTypicalViolations/getTypicalPlanPageThunk",
  async (_, thunkApi) => {
    const { rejectWithValue } = thunkApi;
    try {
      const result = await API.getTypicalPlanPageRequest();

      return result;
    } catch (err) {
      message.error({
        content: getErrorMessage(err),
        duration: 2,
      });
      return rejectWithValue(err.response.data);
    }
  }
);

export const addActionPlanPageThunk = createAsyncThunk<
  {
    values: TypicalActionPlanParams;
    section: TypicalPlanSections;
    id: string;
  } & { planId: string },
  { values: TypicalActionPlanParams; section: TypicalPlanSections; id: string },
  ThunkApi
>(
  "actionPlanTypicalViolations/addActionPlanPageThunk",
  async ({ values, id, section }, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;
    try {
      const planId = getState().actionPlanTypicalViolations.currentId;
      if (!planId) {
        return rejectWithValue({ planId });
      }
      const preparedValues = getPreparedActionPlan(values);
      const result = await API.addActionPlanRequest(
        {
          ...preparedValues,
          planId,
        },
        id
      );

      return {
        planId,
        id,
        values: result,
        section,
      };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const editActionPlanPageThunk = createAsyncThunk<
  {
    values: TypicalActionPlanParams;
    section: TypicalPlanSections;
    violationsId: string;
  } & { planId: string },
  {
    values: TypicalActionPlanParams;
    violationsId: string;
    section: TypicalPlanSections;
  },
  ThunkApi
>(
  "actionPlanTypicalViolations/editActionPlanPageThunk",
  async ({ values, violationsId, section }, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;
    try {
      const planId = getState().actionPlanTypicalViolations.currentId;
      if (!planId) {
        return rejectWithValue({ planId });
      }
      const preparedValues = getPreparedActionPlan(values);
      await API.updateActionPlanRequest(preparedValues);

      return {
        planId,
        values,
        violationsId,
        section,
      };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// получить журнал нарушений в модалке с фильтрацией
export const getViolationsThunk = createAsyncThunk<void, undefined, ThunkApi>(
  "actionPlanTypicalViolations/getViolationsThunk",
  async (_, thunkApi) => {
    const { dispatch, getState } = thunkApi;

    const state = getState();
    const baseFilter = state.actionPlanTypicalViolations.listFilter;

    try {
      const url = `${apiBase}/pspcontrol/filters/identifiedViolations/filter`;

      dispatch(
        setLoading({
          name: LoadingsNames.isViolationsLoading,
          value: true,
        })
      );
      const response = await axios.put<PagedModel<IViolationListModel>>(
        url,
        baseFilter
      );
      dispatch(
        setLoading({
          name: LoadingsNames.isViolationsLoading,
          value: false,
        })
      );

      const entities = response.data.entities;

      if (entities) {
        dispatch(setViolations(entities));
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isViolationsLoading,
          value: false,
        })
      );

      message.error({
        content: error?.response?.data?.message ?? "Неизвестная ошибка",
        duration: 2,
      });
    }
  }
);

// получить модель фильтра модалки нарушений
export const getFilterDescriptionSchedule = createAsyncThunk<
  void,
  undefined,
  ThunkApi
>(
  "actionPlanTypicalViolations/getFilterDescriptionSchedule",
  async (_, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.VerificationActs}${ApiRoutes.GetFilter}/typicalViolations`;

      dispatch(
        setLoading({
          name: LoadingsNames.isFilterListLoading,
          value: true,
        })
      );
      const response = await axios.get<ICustomAttrFilterConfig>(url);
      dispatch(
        setLoading({
          name: LoadingsNames.isFilterListLoading,
          value: false,
        })
      );

      const filterList = response.data.filterList;

      if (filterList) {
        dispatch(setFilterList(filterList));
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isFilterListLoading,
          value: false,
        })
      );

      message.error({
        content: error?.response?.data?.message ?? "Неизвестная ошибка",
        duration: 2,
      });
    }
  }
);

// Добавление нарушения как типового
export const addTypicalViolationThunk = createAsyncThunk<
  void,
  {
    id: string;
    violations: string[];
  },
  ThunkApi
>(
  "actionPlanTypicalViolations/addTypicalViolationThunk",
  async (params, thunkApi) => {
    const { dispatch } = thunkApi;

    try {
      const url = `${apiBase}${ApiRoutes.Plan}/${params.id}/typicalViolation`;

      dispatch(
        setLoading({
          name: LoadingsNames.isAddingTypicalViolation,
          value: true,
        })
      );
      const response = await axios.post(url, params.violations);
      dispatch(
        setLoading({
          name: LoadingsNames.isAddingTypicalViolation,
          value: false,
        })
      );

      if (response.status === 200) {
        message.success({
          content: "Типовое нарушение добавлено успешно",
          duration: 2,
        });
      }
    } catch (error) {
      dispatch(
        setLoading({
          name: LoadingsNames.isAddingTypicalViolation,
          value: false,
        })
      );

      message.error({
        content: error?.response?.data?.message ?? "Неизвестная ошибка",
        duration: 2,
      });
    }
  }
);

export const removeActionPlanPageThunk = createAsyncThunk<
  void,
  string,
  ThunkApi
>(
  "actionPlanTypicalViolations/removeActionPlanPageThunk",
  async (id) => {
    try {
      const response = await API.removeActionPlanRequest(id);

      if (response.status === 200) {
        message.success({
          content: 'Мероприятие было удалено успешно',
          duration: 2,
        });
      }
    } catch (err) {
      // return rejectWithValue(err.response.data);
    }
  }
);
export const setMainFileThunk = createAsyncThunk<string, string, ThunkApi>(
  "actionPlanTypicalViolations/setMainFileThunk",
  async (fileId, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
      await API.setMainAttachmentRequest(fileId);

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

// Удаление вложения
export const deletePlanTypicalAttachmentThunk = createAsyncThunk<
  string,
  string,
  ThunkApi
>(
  "actionPlanTypicalViolations/deletePlanTypicalAttachmentThunk",
  async (attachmentId, thunkApi) => {
    const { rejectWithValue, getState, dispatch } = thunkApi;

    try {
      const attachments =
        getState().actionPlanTypicalViolations.attachments.filter(
          (item) => item.id !== attachmentId
        );
      const newMainAttach = minBy(attachments, (items) => items.serial);

      const url = `${apiBase}${ApiRoutes.Plan}/file/${attachmentId}`;

      if (newMainAttach) {
        await dispatch<any>(setMainFileThunk(newMainAttach?.id));
      }

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

// Генерация и добавление вложения через службу
export const typicalPlanAttachmentSendThunk = createAsyncThunk<
  any,
  { yearFrom: number, yearTo: number, oldStatus: number },
  ThunkApi
>(
  "actionPlanTypicalViolations/typicalPlanAttachmentSendThunk",
  async ({ yearFrom, yearTo, oldStatus }) => {
    try {
      const url = `${apiBase}${ApiRoutes.TypicalPlan}/typicalPlanCard/attachment/send`;
      await axios.post(url, undefined, {
        params: {
          yearFrom: yearFrom,
          yearTo: yearTo,
          oldStatus: oldStatus,
          isOriginalFormat: false
        }
      });
    } catch (error) {
      message.error({
        content: getErrorMessage(error, undefined, "response.data.message"),
        duration: 2,
      });
    }
  }
);

// Получение вложений
export const getPlanTypicalAttachmentsThunk = createAsyncThunk<
  IAttachments[],
  Nullable<string>,
  ThunkApi
>(
  "actionPlanTypicalViolations/getPlanTypicalAttachmentsThunk",
  async (verificationActId, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    if (!verificationActId) return rejectWithValue("not found id");

    try {
      const url = `${apiBase}${ApiRoutes.TypicalPlan}/attachments?id=${verificationActId}`;

      const response = await axios.get<IAttachments[]>(url);

      const attachments = response.data;

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

export const sortViolationsThunk = createAsyncThunk<
  { items: TypicalPlanCardFilterEntitiesDto[]; idIdentifiedViolation: string },
  { items: TypicalPlanCardFilterEntitiesDto[]; idIdentifiedViolation: string },
  ThunkApi
>("verificationAct/sortViolationsThunk", async (params, thunkApi) => {
  const { rejectWithValue, getState } = thunkApi;

  try {
    const planId = getState().actionPlanTypicalViolations.currentId;
    if (!planId) {
      return rejectWithValue({ planId });
    }
    const items = params.items.map((item) => ({
      id: item.id,
      newSerial: item.typicalViolationSerial,
      violationText: item.typicalViolationText,
      pointNormativeDocuments: item.pointNormativeDocuments,
    }));
    await API.sortTypicalViolationsRequest(items, planId);

    return params;
  } catch (error) {
    message.error({
      content: error.message,
      duration: 2,
    });
    return rejectWithValue(error.response.data);
  }
});

// Изменение статуса карточки плана по устранению типовых нарушений
export const changePlanTypicalStatusThunk = createAsyncThunk<
  { verificationStatus: string; verificationStatusId: number },
  { id: string, newStatus?: PlanStatuses },
  ThunkApi
>("actionPlanTypicalViolations/changePlanTypicalStatusThunk", async ({ id, newStatus }, thunkApi) => {
  const { rejectWithValue } = thunkApi;
  const url = `${apiBase}${ApiRoutes.TypicalPlan}/${id}/status`;

  try {
    const response = await axios.post<{
      verificationStatus: string;
      verificationStatusId: number;
    }>(url, undefined, { params: { newStatus } });

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return rejectWithValue({ planId: id });
  }
});

