import { Nullable } from "types";
import { UploadFile } from "antd/lib/upload/interface";
import { IAttachments } from "./types";

export const isValidUrl = (url: Nullable<string> | undefined) => {
  if (url) {
    return url.startsWith("http://") || url.startsWith("https://");
  }

  return false;
};

export const mapAttachments = (
  attachments: IAttachments[],
  getDownloadAttachmentUrl: (id: string) => string
) => {
  const adjustedAttachments = attachments.map((attachment) => {
    return {
      uid: attachment.id,
      name: attachment.fileName,
      url: attachment.url,
      fileUrl: getDownloadAttachmentUrl(attachment.id),
      isFavorite: attachment.isMain,
      createdOn: attachment.createdOn,
    };
  });

  return adjustedAttachments as UploadFile[];
};
