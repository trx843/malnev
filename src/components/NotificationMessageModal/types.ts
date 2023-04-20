import { IdType } from "types";

export type NotificationMessageModalProps = {
  isNotificatonModalOpened: boolean;
  onCloseCallback: () => void;
  initialValues: NotificationModel;
};

export interface NotificationModel {
  message: string;
  show: boolean;
}
