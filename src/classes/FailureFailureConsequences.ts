import { IEntity } from "../interfaces";
import { description, IdType, Nullable, String } from "../types";
import { pureDate, zeroGuid } from "../utils";

export class FailureFailureConsequences implements IEntity {
  @description("Уникальный идентификатор записи")
  id: string = zeroGuid;

  @description("Идентификатор отказа")
  failureID: IdType;

  @description("Идентификатор последствия отказа")
  failureConsequenceIdList: number;
}
