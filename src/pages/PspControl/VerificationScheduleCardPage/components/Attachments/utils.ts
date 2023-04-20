import { ApiRoutes } from "../../../../../api/api-routes.enum";
import { Nullable } from "../../../../../types";
import { apiBase } from "../../../../../utils";

export const getAddAttachmentUrl = (id: Nullable<string> | undefined) => {
  if (!id) return undefined;
  return `${apiBase}${ApiRoutes.VerificationSchedules}/${id}/file`;
};

export const getDownloadAttachmentUrl = (id: string) =>
  `${apiBase}${ApiRoutes.VerificationSchedules}/file/${id}`;
