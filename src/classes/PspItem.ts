import { IEntity } from "../interfaces";
import {
  apiquery,
  boundId,
  description,
  Nullable,
  propName,
  String
} from "../types";
import { apiBase } from "../utils";

export class PspItem implements IEntity {
  @description("Идентификатор ПСП")
  id: number = 0;
  @description("Идентификатор ОСТ")
  ostId: number = 0;
  @description("Наименование ОСТ")
  @apiquery(`${apiBase}/osts`)
  @boundId("ostId")
  @propName("fullName")
  ostName: String = "";
  @description("Идентификатор РНУ")
  rnuId: Nullable<number> = 0;
  @description("Наименование РНУ")
  @apiquery(`${apiBase}/rnus`)
  @boundId("rnuId")
  @propName("fullName")
  rnuName: String = "";
  @description("Полное наименование")
  fullName: string = "";
  @description("Краткое наименование")
  shortName: string = "";
  @description("Принадлежность")
  owned: boolean = false;
}
