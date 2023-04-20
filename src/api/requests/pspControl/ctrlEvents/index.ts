import { GetCtrlEventsCardFilterBody, GetCtrlEventsCardParams } from "api/params/get-ctrlevents-card.params";
import { CtrlCardEvents, CtrlEventsCardFilterValues } from "api/responses/get-ctrlevents-card";
import axios from "axios";
import { SqlTree } from "classes/SqlTree";
import { ListFilterBase } from "interfaces";
import { CtrlEventHandleTypeEnum, CtrlEventsItem } from "pages/PspControl/CtrlEventsPage/types";

import { GenericResponse, PagedModel } from "types";
import { apiBase } from "../../../../utils";
import { ApiRoutes } from "../../../api-routes.enum";

export const getEvents = async (
  filter: ListFilterBase
): Promise<PagedModel<CtrlEventsItem>> => {
  const url = `${apiBase}${ApiRoutes.CtrlEvents}/filter`;
  const { data } = await axios.put<PagedModel<CtrlEventsItem>>(url, filter);
  return data;
};

export const getEventTypes = async (): Promise<Array<SqlTree>> => {
  const url = `${apiBase}/sqltree?viewName=CtrlEventTypeTree`;
  const { data } = await axios.get<Array<SqlTree>>(url);
  return data;
};


export const postCtrlEventHandle = async (event : CtrlEventsItem, handleType : CtrlEventHandleTypeEnum): Promise<GenericResponse<CtrlEventsItem>> => {
  const url = `${apiBase}${ApiRoutes.CtrlEvents}/CtrlEventHandle?ctrlEventHandleType=${handleType}`;
  const { data } = await axios.post<GenericResponse<CtrlEventsItem>>(url, event);
  return data;
};

export const getCardEventsFilters = async (
  userId: string
): Promise<CtrlEventsCardFilterValues> => {
  const mssEventTypesResponse = await axios.get<any[]>(
    `${apiBase}${ApiRoutes.CtrlEventTypes}?userId=${userId}`
  );
  const filterValues: CtrlEventsCardFilterValues = {
    types: mssEventTypesResponse.data,
  };
  return filterValues;
};

export const getCardEvents = async (
  params: GetCtrlEventsCardParams,
  filter: GetCtrlEventsCardFilterBody
): Promise<CtrlCardEvents> => {
  const { data } = await axios.post<CtrlCardEvents>(
    `${apiBase}${ApiRoutes.CtrlEventsForUser}?userId=${params.userId}&page=${params.page}`,
    filter
  );

  return data;
};