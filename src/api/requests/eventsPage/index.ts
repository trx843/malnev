import axios from "axios";
import { MssEventSecurityLevel, MssEventType } from "../../../classes";
import { EventItem } from "../../../classes/EventItem";
import { GenericResponse, PagedModel } from "../../../types";
import { apiBase, dateToString, endDateToLongDateString } from "../../../utils";
import { ApiRoutes } from "../../api-routes.enum";
import {
  GetEventsCardFilterBody,
  GetEventsCardParams,
} from "../../params/get-events-card.params";
import { FilterType } from "../../params/get-events-params";
import {
  AckStates,
  EventsCardFilterValues,
  CardEvents,
} from "../../responses/get-events-card";

export const getCardEventsFilters = async (
  userId: string
): Promise<EventsCardFilterValues> => {
  const mssEventTypesResponse = await axios.get<MssEventType[]>(
    `${apiBase}${ApiRoutes.MssEventTypes}?userId=${userId}`
  );
  const mssEventSeverityLevelsResponse = await axios.get<
    MssEventSecurityLevel[]
  >(`${apiBase}${ApiRoutes.MssEventSeverityLevels}`);

  const ackStatesResponse = await axios.get<AckStates[]>(
    `${apiBase}${ApiRoutes.AckStates}`
  );
  const filterValues: EventsCardFilterValues = {
    types: mssEventTypesResponse.data,
    levels: mssEventSeverityLevelsResponse.data,
    acknowledges: ackStatesResponse.data,
  };
  return filterValues;
};

export const getCardEvents = async (
  params: GetEventsCardParams,
  filter: GetEventsCardFilterBody
): Promise<CardEvents> => {
  const { data } = await axios.post<CardEvents>(
    `${apiBase}${ApiRoutes.EventsForUser}?userId=${params.userId}&page=${params.page}`,
    filter
  );

  return data;
};

export const getTransitionlist = async (
  filter: FilterType,
  page: number
): Promise<PagedModel<EventItem>> => {
  const params = {
    eventGroupId: filter.id,
    critical: filter.critical,
    page: page,
  };

  const { data } = await axios.get<PagedModel<EventItem>>(
    `${apiBase}${ApiRoutes.Events}/transitionlist`,
    { params: params }
  );
  return data;
};

export const getOperativeMonitoringlist = async (
  filter: FilterType,
  page: number
): Promise<PagedModel<EventItem>> => {
  const { data } = await axios.post<PagedModel<EventItem>>(
    `${apiBase}${ApiRoutes.Events}/operativemonitoring?siknId=${filter.id}&critical=${filter.critical}&page=${page}`,
    filter.operativeMonitFilter
  );
  return data;
};

export const postEventComment = async (
  event: EventItem
): Promise<GenericResponse<EventItem>> => {
  const { data } = await axios.put<GenericResponse<EventItem>>(
    `${apiBase}${ApiRoutes.Events}/${event.id}`,
    event
  );
  return data;

  /* axios
    .put<{ success: boolean }>(`${apiBase}/events/${item.id}`, item)
    .then((result) => {
      console.log(result);
      if (result.data.success) {
        setReload(!reload);
      } else {
        message.error("Квитирование невозможно из-за ошибки.");
        reject();
      }
      setCommentModalVisible(false);
      setEvent(null);
      resolve();
    })
    .catch((err) => {
      message.error("Квитирование невозможно из-за ошибки.");
      reject(err);
    }); */
};
