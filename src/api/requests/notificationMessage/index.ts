import { EventGroupCountType } from "api/responses/home-page.response";
import axios from "axios";
import { NotificationModel } from "components/NotificationMessageModal/types";
import { GenericResponse } from "types";
import { apiBase } from "../../../utils";
import { ApiRoutes } from "../../api-routes.enum";

export const getNotification = async (): Promise<NotificationModel> => {
  const response = await axios.get<NotificationModel>(
    `${apiBase}${ApiRoutes.Notification}`
  );
  return response.data;
};

export const postNotification = async (
  data: NotificationModel
): Promise<GenericResponse<NotificationModel>> => {
  const response = await axios.post<GenericResponse<NotificationModel>>(
    `${apiBase}${ApiRoutes.Notification}`,
    data
  );
  return response.data;
};
