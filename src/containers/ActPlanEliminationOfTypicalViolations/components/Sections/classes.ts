import { IEntity } from "../../../../interfaces";
import { description, IdType, Nullable } from "../../../../types";

export class TypicalPlanCardItem implements IEntity {
  id: IdType;
  @description("№ пп")
  _identifiedViolationsSerial: Nullable<string> = "";
  @description("№ пп")
  _violationSerial: Nullable<string> = "";
  @description("Содержание нарушения")
  _violationText: Nullable<string> = "";
  @description("Требование НД")
  _actionPlanSerial: Nullable<string> = "";
  @description("№мероприятия")
  actionText: Nullable<string> = "";
  @description("Мероприятия по устранению нарушений")
  eliminationText: Nullable<string> = "";
  typicalViolationId: string = "";
}
