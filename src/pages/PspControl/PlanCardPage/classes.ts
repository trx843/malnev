import { IEntity } from "../../../interfaces";
import { description, IdType, Nullable } from "../../../types";

// артибуты называющиеся с _ - вспомогательные фронтовые
export class PlanCardItem implements IEntity {
  id: IdType;
  @description("№ пп")
  _identifiedViolationsGroupSerial: Nullable<string> = "";
  @description("№ пп")
  _violationSerial: Nullable<string> = "";
  @description("Выявленное нарушение")
  violationText: Nullable<string> = "";
  @description("№ мероприятия")
  _actionPlanSerial: Nullable<string> = "";
  @description("Мероприятия по устранению нарушений")
  actionText: Nullable<string> = "";
  @description("Сроки устранения")
  eliminationText: Nullable<string> = "";
  @description("Ответственные за выполнение")
  fullNameExecutor: Nullable<string> = "";
  @description("Ответственные за контроль ")
  fullNameController: Nullable<string> = "";
}
