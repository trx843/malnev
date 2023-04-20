import axios from "axios";
import { message } from "antd";
import { ApiRoutes } from "api/api-routes.enum";
import { IActionPlanModel } from "slices/pspControl/planCard/types";
import { apiBase, getErrorMessage } from "../../../../utils";
import { PlanStatuses } from "enums";

// получить мероприятие по айди
export const getActionPlan = async (id: string) => {
  try {
    const url = `${apiBase}${ApiRoutes.Plan}/actionPlan/${id}`;
    const response = await axios.get<IActionPlanModel>(url);

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return null;
  }
};

// создать мероприятие
export const createActionPlan = async (params: IActionPlanModel) => {
  try {
    const url = `${apiBase}${ApiRoutes.Plan}/${params.verificationPlanId}/actionPlan`;
    const response = await axios.post(url, params);

    if (response.status === 200) {
      message.success({
        content: "Мероприятие создано успешно",
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

// отредактировать мероприятие
export const editActionPlan = async (params: IActionPlanModel) => {
  try {
    const url = `${apiBase}${ApiRoutes.Plan}/actionPlan/${params.id}`;
    const response = await axios.put(url, params);

    if (response.status === 200) {
      message.success({
        content: "Мероприятие отредактировано успешно",
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

// Создание плана мероприятия для типовых нарушений
export const createActionPlanForTypicalViolation = async (
  planId: string,
  params: any
) => {
  try {
    const url = `${apiBase}${ApiRoutes.TypicalPlan}/${planId}/actionPlan/${params.violationsId}/typicalViolation`;
    const response = await axios.post(url, params);

    if (response.status === 200) {
      message.success({
        content: "Мероприятие создано успешно",
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

// Генерация и добавление вложения через службу
export const planAttachmentSend = async (id: string, oldStatus: PlanStatuses) => {
  try {
    const url = `${apiBase}${ApiRoutes.Plan}/${id}/attachment/send`;
    const res = await axios.post(url, undefined, {
      params: {
        isOriginalFormat: false,
        oldStatus
      }
    });
    return res
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });
  }
};

// Проверка на отмеченное основное вложение
export const planCardHasMain = async (id: string) => {
  try {
    const url = `${apiBase}${ApiRoutes.Plan}/${id}/hasMain`;
    const response = await axios.get<boolean>(url);

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return false;
  }
};

// Проверка на наличие мероприятий по устранению нарушений в плане
export const planCardActionPlan = async (id: string) => {
  try {
    const url = `${apiBase}${ApiRoutes.Plan}/${id}/hasActionPlan`;
    const response = await axios.get<boolean>(url);

    return response.data;
  } catch (error) {
    message.error({
      content: getErrorMessage(error),
      duration: 2,
    });

    return false;
  }
};
