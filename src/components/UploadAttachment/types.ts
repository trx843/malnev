import { UploadFile } from "antd/lib/upload/interface";
import { Nullable } from "types";

export enum UploadFileStatuses {
  error = "error",
  success = "success",
  done = "done",
  uploading = "uploading",
  removed = "removed",
}

export interface AttachFile<T = any> extends UploadFile<T> {
  isFavorite?: boolean;
  fileUrl: string;
}

export type UploadAttachmentBeforeUploadValueType =
  | void
  | boolean
  | string
  | Blob
  | File;

export interface IAttachments {
  id: string; // Идентификатор записи
  serial: number; // Порядковый номер записи
  createdOn: string; // Дата создания записи
  fileName: string; // Имя файла
  docType: Nullable<any>; // Тип документа
  verificationPlanId: string; // План Id
  isMain: boolean; // пометка
  url: Nullable<string>;
}
