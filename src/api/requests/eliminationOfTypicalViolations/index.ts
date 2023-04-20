import axios from "axios";
import { message } from "antd";
import { history } from "../../../history/history";
import { ApiRoutes } from "api/api-routes.enum";
import { apiBase, getErrorMessage } from "../../../utils";
import {
  IEliminationTypicalViolationFilter,
  IEliminationTypicalViolationInfoModel,
  IEliminationTypicalViolationSettingsModel,
} from "./types";
import { EliminationViolationSaveModel, IEliminationTypicalViolationsSaveModel } from "slices/pspControl/eliminationOfTypicalViolations/types";
import { IListFilter, PagedModel } from "types";

// Получение настройки для ПСП
export const getSettingsPsp = async (id: string) => {
  try {
    const url = `${apiBase}${ApiRoutes.EliminationTypical}/settingsPsp/${id}`;
    const response = await axios.get<IEliminationTypicalViolationSettingsModel>(
      url
    );

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return null;
  }
};

// Обновление настройки для ПСП
export const editSettingsPsp = async (params: any) => {
  try {
    const url = `${apiBase}${ApiRoutes.EliminationTypical}/settingsPsp`;
    const response = await axios.put<IEliminationTypicalViolationSettingsModel>(
      url,
      params
    );

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return null;
  }
};

// Сохранение настройки для ПСП
export const saveSettingsPsp = async (params: {
  ostRnuPspId: string;
  fullName: string;
  jobTitle: string;
}) => {
  try {
    const url = `${apiBase}${ApiRoutes.EliminationTypical}/settingsPsp`;
    const response =
      await axios.post<IEliminationTypicalViolationSettingsModel>(url, params);

    if (response.status === 200) {
      message.success({
        content: "Ответственный за проверку указан успешно",
        duration: 2,
      });

      history.push(
        `/pspcontrol/elimination-of-typical-violations/${params.ostRnuPspId}`
      );
    }
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};

// отметить нарушение
export const eliminationTypicalFound = async (
  params: IEliminationTypicalViolationsSaveModel
) => {
  try {
    const url = `${apiBase}${ApiRoutes.EliminationTypical}/found`;
    const response = await axios.post(url, params);

    if (response.status === 200) {
      message.success({
        content: "Нарушение отмечено успешно",
        duration: 2,
      });
    }
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};

// Нарушение не выявлено для всех выбранных нарушений
export const eliminationTypicalNotFound = async (
  params: IEliminationTypicalViolationsSaveModel
) => {
  try {
    const url = `${apiBase}${ApiRoutes.EliminationTypical}/notFound`;
    const response = await axios.post(url, params);

    if (response.status === 200) {
      message.success({
        content: "Подтверждение отсутствия нарушения(й) успешно",
        duration: 2,
      });
    }
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};

// Нарушение исправлено
export const eliminationTypicalComplited = async (
  params: EliminationViolationSaveModel
) => {
  try {
    const url = `${apiBase}${ApiRoutes.EliminationTypical}/complited`;
    const response = await axios.put(url, params);
    if (response.status === 200) {
      message.success({
        content: "Подтверждение устранения нарушения успешно",
        duration: 2,
      });
      return response.data;
    }
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};

//Информация о проверке объекта на наличие типового нарушения
export const getEliminationTypicalViolationByPspId = async (
  filter: IListFilter<IEliminationTypicalViolationFilter>
) => {
  try {
    const url = `${apiBase}/pspcontrol/filters/eliminationTypicalViolation/identifiedViolations/filter`;
    const response = await axios.put<
      PagedModel<IEliminationTypicalViolationInfoModel>
    >(url, filter);

    const data = response.data;

    if (data) {
      return data.entities;
    }

    return [];
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return [];
  }
};

export const getEliminationStatusesRequest = async (): Promise<
  { id: string; label: string }[]
> => {
  const { data } = await axios.get(
    `${apiBase}/pspcontrol/elimination/eliminationStatuses`
  );

  return data;
};
