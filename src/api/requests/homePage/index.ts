import { EventGroupCountType } from "api/responses/home-page.response";
import axios from "axios";
import { User } from "../../../classes";
import { apiBase } from "../../../utils";
import { ApiRoutes } from "../../api-routes.enum";

export const authRequest = async (): Promise<User> => {
  // запрос на бэк
  const user = await axios.get<User>(`${apiBase}${ApiRoutes.Auth}`);
  return user.data;
};

export const getEventsWidgetAsync = async (): Promise<
  EventGroupCountType[]
> => {
  const eventsCount = await axios.get<EventGroupCountType[]>(
    `${apiBase}${ApiRoutes.EventsWidget}`
  );
  return eventsCount.data;
};
