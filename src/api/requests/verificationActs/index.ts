import axios from "axios";
import { apiBase } from "../../../utils";
import { ApiRoutes } from "../../api-routes.enum";
import {
  CheckingObject,
  GroupClassiffNumbersOptions,
  VerificationPage
} from "../../../slices/verificationActs/verificationAct/types";
import {
  VerificationScheduleItem,
  VerificationScheduleResponse
} from "../../../pages/PspControl/VerificationSchedulePage/classes";
import { OsusItem } from "../../../components/PspControl/PspObject/classes";
import {
  CommissionsDtoParams,
  OtherPartDtoParams,
  RecommendationDtoParams,
  ReportDtoParams,
  ViolationDtoParams
} from "../../../slices/verificationActs/verificationAct/params";
import { VerificationActSection } from "../../../containers/VerificationActs/VerificationAct/types";
import {
  getVerificationSectionUrl,
  getVerificationSectionUrlSort
} from "./helpers";
import { IPspObject } from "../../../components/PspControl/PspObject/types";
import {
  ICustomAttrFilterConfig,
  IListFilter,
  PagedModel
} from "../../../types";
import {
  IFilter,
  IViolationListModel,
  TypicalViolationForActModalFilter
} from "../../../slices/pspControl/actionPlanTypicalViolations/types";
import { IViolationListModel as IViolationList } from "../../../slices/verificationActs/verificationAct/types";
import { IdentifiedViolationActDto, SourceRemarkDto } from "./dto-types";

export const getSectionRequest = async <T = unknown>(params: {
  actId: string;
  sectionType: VerificationActSection;
}): Promise<T> => {
  const url = getVerificationSectionUrl(params.sectionType, params.actId);
  const { data } = await axios.get(url);

  return data;
};

export const getIdentifiedViolationsRequest = async (
  actId
): Promise<IViolationList[]> => {
  const { data } = await axios.get(
    `${apiBase}${ApiRoutes.VerificationActs}/${actId}/identifiedViolations`
  );
  return data;
};

export const getOSUSItemsBySiknLabRsuIdRequest = async (
  siknLabRsuId: string
): Promise<IPspObject> => {
  const { data } = await axios.get<IPspObject>(
    `${apiBase}${ApiRoutes.GetPsp}/${siknLabRsuId}`
  );

  return data;
};

export const getCheckingObjectItemsByActIdRequest = async (
  actId: string
): Promise<CheckingObject[]> => {
  const { data } = await axios.get<CheckingObject[]>(
    `${apiBase}${ApiRoutes.VerificationActs}/${actId}/checkingObjects`
  );

  return data;
};

export const getCheckingObjectViolationsItemsByActIdRequest = async (
  actId: string
): Promise<CheckingObject[]> => {
  const { data } = await axios.get<CheckingObject[]>(
    `${apiBase}${ApiRoutes.VerificationActs}/${actId}/checkingObjectsViolation`
  );

  return data;
};

export const getVerificationActByIdRequest = async (
  actId: string
): Promise<VerificationPage> => {
  const { data } = await axios.get(
    `${apiBase}${ApiRoutes.VerificationActs}/${actId}/actCard`
  );

  return data;
};

export const setVerificationActOSUItemRequest = async ({
  actId,
  osuId
}: {
  actId: string;
  osuId: string;
}): Promise<OsusItem> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.VerificationActs}/${actId}/checkingObject/${osuId}`,
    {}
  );

  return data;
};

export const getScheduleByIdRequest = async (
  verificationSchedulesId: string
): Promise<VerificationScheduleResponse> => {
  const { data } = await axios.get(
    `${apiBase}${ApiRoutes.VerificationSchedules}/${verificationSchedulesId}`
  );

  return data;
};

export const getVerificationOptionsByCheckTypeIdRequest = async (
  checkTypeId: string
): Promise<{ id: string; label: string }[]> => {
  const { data } = await axios.get(
    `${apiBase}${ApiRoutes.GetPsp}/${checkTypeId}/verifications`
  );

  return data;
};

// ADD
export const addVerificationActViolationsRequest = async (
  payload: { data: ViolationDtoParams } & { actId: string }
): Promise<IViolationList> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.VerificationActs}/${payload.actId}/identifiedViolation`,
    payload.data
  );

  return data;
};

export const addVerificationActCommissionsRequest = async (
  payload: { data: CommissionsDtoParams } & { actId: string }
): Promise<CommissionsDtoParams> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.VerificationActs}/${payload.actId}/commission`,
    payload.data
  );

  return data;
};

export const addVerificationActReportRequest = async (
  payload: { data: ReportDtoParams } & { actId: string }
): Promise<ReportDtoParams> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.VerificationActs}/${payload.actId}/addition`,
    payload.data
  );

  return data;
};

export const addVerificationActRecommendationRequest = async (
  payload: { data: RecommendationDtoParams } & { actId: string }
): Promise<RecommendationDtoParams> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.VerificationActs}/${payload.actId}/recommendation`,
    payload.data
  );

  return data;
};

export const addVerificationActOtherPartyRequest = async (
  payload: { data: OtherPartDtoParams } & { actId: string }
): Promise<OtherPartDtoParams> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.VerificationActs}/${payload.actId}/otherParty`,
    payload.data
  );

  return data;
};

// DELETE
export const deleteVerificationActOSUItemBySiknLabRsuIdRequest = async (
  osuId: string
): Promise<string> => {
  const { data } = await axios.delete(
    `${apiBase}${ApiRoutes.VerificationActs}/checkingObject/${osuId}`
  );

  return data;
};

export const deleteVerificationActAdditionRequest = async (payload: {
  id: string;
}): Promise<string> => {
  const { data } = await axios.delete(
    `${apiBase}${ApiRoutes.VerificationActs}/addition/${payload.id}`
  );

  return data;
};

export const deleteVerificationActOtherPartyRequest = async (payload: {
  id: string;
}): Promise<string> => {
  const { data } = await axios.delete(
    `${apiBase}${ApiRoutes.VerificationActs}/otherParty/${payload.id}`
  );

  return data;
};

export const deleteVerificationActCommissionRequest = async (payload: {
  id: string;
}): Promise<RecommendationDtoParams> => {
  const { data } = await axios.delete(
    `${apiBase}${ApiRoutes.VerificationActs}/commission/${payload.id}`
  );

  return data;
};

export const deleteVerificationActRecommendationRequest = async (payload: {
  id: string;
}): Promise<RecommendationDtoParams> => {
  const { data } = await axios.delete(
    `${apiBase}${ApiRoutes.VerificationActs}/recommendation/${payload.id}`
  );

  return data;
};

export const deleteVerificationActViolationByIdRequest = async (params: {
  id: string;
}): Promise<string> => {
  const { data } = await axios.delete(
    `${apiBase}${ApiRoutes.VerificationActs}/identifiedViolation/${params.id}`
  );

  return data;
};

export const deleteVerificationActRequest = async (payload: {
  id: string;
}): Promise<string> => {
  const { data } = await axios.delete(
    `${apiBase}${ApiRoutes.VerificationActs}/${payload.id}`
  );

  return data;
};

// OPTIONS
export const getAreaOfResponsibilityByIdRequest = async (
  actId: string
): Promise<string[]> => {
  const { data } = await axios.get(
    `${apiBase}${ApiRoutes.VerificationActs}/${actId}/areas`
  );

  return data;
};

export const getClassiffRequest = async (
  type: number
): Promise<GroupClassiffNumbersOptions[]> => {
  const { data } = await axios.get(
    `${apiBase}${ApiRoutes.VerificationActs}/classiff/${type}`
  );

  return data;
};

export const getViolationsSourcesRequest = async (
  actId: string
): Promise<string[]> => {
  const { data } = await axios.get(
    `${apiBase}${ApiRoutes.VerificationActs}/${actId}/violationSources`
  );

  return data;
};

export const getCtoRequest = async (
  actId: string
): Promise<{ id: null; label: string }[]> => {
  const { data } = await axios.get(
    `${apiBase}${ApiRoutes.VerificationActs}/${actId}/cto`
  );

  return data;
};

export const getInspectionTypeRequest = async (): Promise<{
  id: string;
  label: string;
}[]> => {
  const { data } = await axios.get(
    `${apiBase}${ApiRoutes.VerificationActs}/inspectionType`
  );

  return data;
};

// EDIT

export const editVerificationActCommissionsRequest = async (
  payload: { data: CommissionsDtoParams } & { actId: string }
): Promise<CommissionsDtoParams> => {
  const { data } = await axios.put(
    `${apiBase}${ApiRoutes.VerificationActs}/commission/${payload.data.id}`,
    payload.data
  );

  return data;
};

export const editVerificationActViolationsRequest = async (
  payload: { data: ViolationDtoParams } & { actId: string }
): Promise<ViolationDtoParams> => {
  const { data } = await axios.put(
    `${apiBase}${ApiRoutes.VerificationActs}/identifiedViolation/${payload.data.id}`,
    payload.data
  );

  return data;
};

export const editVerificationActReportRequest = async (
  payload: { data: ReportDtoParams } & { actId: string }
): Promise<ReportDtoParams> => {
  const { data } = await axios.put(
    `${apiBase}${ApiRoutes.VerificationActs}/addition/${payload.data.id}`,
    payload.data
  );

  return data;
};

export const editVerificationActRecommendationRequest = async (
  payload: { data: RecommendationDtoParams } & { actId: string }
): Promise<RecommendationDtoParams> => {
  const { data } = await axios.put(
    `${apiBase}${ApiRoutes.VerificationActs}/recommendation/${payload.data.id}`,
    payload.data
  );

  return data;
};

export const editVerificationActOtherPartyRequest = async (
  payload: { data: OtherPartDtoParams } & { actId: string }
): Promise<OtherPartDtoParams> => {
  const { data } = await axios.put(
    `${apiBase}${ApiRoutes.VerificationActs}/otherParty/${payload.data.id}`,
    payload.data
  );
  return data;
};

export const completeCreatingRequest = async (payload: {
  actId: string;
}): Promise<{ verificationStatus: string; verificationStatusId: number, message: string }> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.VerificationActs}/${payload.actId}/status`
  );

  return data;
};

export const getDescriptionIdentifiedViolations = async (): Promise<ICustomAttrFilterConfig> => {
  const url = `${apiBase}${ApiRoutes.VerificationActs}${ApiRoutes.GetFilter}/typicalViolations`;

  const { data } = await axios.get<ICustomAttrFilterConfig>(url);

  return data;
};

export const getIdentifiedViolationsTable = async (
  filter: IListFilter<TypicalViolationForActModalFilter>
): Promise<PagedModel<IViolationListModel>> => {
  const url = `${apiBase}/pspcontrol/filters/identifiedViolations/filter`;

  const { data } = await axios.put<PagedModel<IViolationListModel>>(
    url,
    filter
  );

  return data;
};

export const getTypicalViolationsFilter = async (
  filter: IListFilter<TypicalViolationForActModalFilter>
): Promise<PagedModel<IViolationListModel>> => {
  const url = `${apiBase}/pspcontrol/filters/typicalViolations/filter`;

  const { data } = await axios.put<PagedModel<IViolationListModel>>(
    url,
    filter
  );

  return data;
};

export const copyIdentifiedViolationsRequest = async (params: {
  id: string;
  violations: string[];
}): Promise<IdentifiedViolationActDto> => {
  const url = `${apiBase}${ApiRoutes.VerificationActs}/${params.id}/identifiedViolation/copy`;

  const { data } = await axios.post<IdentifiedViolationActDto>(
    url,
    params.violations
  );

  return data;
};

export const copyTypicalViolationsRequest = async (params: {
  id: string;
  violations: string[];
}): Promise<IdentifiedViolationActDto> => {
  const url = `${apiBase}${ApiRoutes.VerificationActs}/${params.id}/typicalViolation/copy`;

  const { data } = await axios.post<IdentifiedViolationActDto>(
    url,
    params.violations
  );

  return data;
};

// Типичное нарушение
export const getDescriptionTypicalViolations = async (): Promise<ICustomAttrFilterConfig> => {
  const url = `${apiBase}/pspcontrol/filters/${ApiRoutes.GetFilter}/typicalViolations`;

  const { data } = await axios.get<ICustomAttrFilterConfig>(url);

  return data;
};

export const getTypicalViolationsTable = async (
  filter: IListFilter<IFilter>
): Promise<PagedModel<IViolationListModel>> => {
  const url = `${apiBase}/pspcontrol/filters/typicalViolations/filter`;

  const { data } = await axios.put<PagedModel<IViolationListModel>>(
    url,
    filter
  );

  return data;
};

export const getSourceRemark = async (): Promise<SourceRemarkDto[]> => {
  const url = `${apiBase}/pspcontrol/act/sourceRemark`;

  const { data } = await axios.get<SourceRemarkDto[]>(url);

  return data;
};

export const setMainAttachmentRequest = async (id: string): Promise<void> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.VerificationActs}/file/${id}/main`
  );

  return data;
};

export const setIdentifiedViolationNewSerialsRequest = async (
  serials: { id: string; newSerial: number }[]
): Promise<void> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.VerificationActs}/identifiedViolations/sort`,
    serials
  );

  return data;
};

export const setViolationNewSerialsRequest = async (
  serials: { id: string; newSerial: number }[]
): Promise<void> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.VerificationActs}/violations/sort`,
    serials
  );

  return data;
};

export const setReportNewSerialsRequest = async (
  serials: { id: string; newSerial: number }[]
): Promise<void> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.VerificationActs}/additions/sort`,
    serials
  );

  return data;
};

export const setRecommendationsNewSerialsRequest = async (
  serials: { id: string; newSerial: number }[]
): Promise<void> => {
  const { data } = await axios.post(
    `${apiBase}${ApiRoutes.VerificationActs}/recommendations/sort`,
    serials
  );

  return data;
};

export const setNewSerialsByTypeRequest = async (
  type: VerificationActSection,
  serials: { id: string; newSerial: number }[]
) => {
  const { data } = await axios.post(
    getVerificationSectionUrlSort(type),
    serials
  );

  return data;
};


export const getNotClassifiedRequest = async (id: string): Promise<string[]> => {
  const { data } = await axios.get(
    `${apiBase}${ApiRoutes.VerificationActs}/${id}/notClassified`
  );

  return data;
};
