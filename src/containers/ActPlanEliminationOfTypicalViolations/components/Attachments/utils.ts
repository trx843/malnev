import { ApiRoutes } from "../../../../api/api-routes.enum";
import { Nullable } from "../../../../types";
import { apiBase } from "../../../../utils";

export const getAddAttachmentUrl = (verificationActId: Nullable<string>) => {
  if (!verificationActId) return undefined;
  return `${apiBase}${ApiRoutes.Plan}/${verificationActId}/file`;
};

export const getDownloadAttachmentUrl = (id: string) =>
  `${apiBase}${ApiRoutes.Plan}/file/${id}`;
