import { IEntity } from "../../../interfaces";
import { description, IdType } from "../../../types";

export class NumberOneSideItem implements IEntity {
  id: IdType;
  @description("Система учета")
  osuShortName: string = "";
  @description("Тип системы учета")
  osuType: string = "";
  @description("Владелец")
  osuOwner: string = "";
  @description("Принадлежность к компании")
  osuAffiliation: string = "";
  @description("Назначение")
  osuPurpose: string = "";
  @description("Собственный/сторонний")
  owned: string = "";
  @description("Транспортируемый продукт")
  transportedProduct: string = "";
  @description("Территориальное расположение")
  territorialLocation: string = "";
  @description("Принимающая сторона")
  receive: string = "";
  @description("Сдающая сторона")
  send: string = "";
  @description("РСУ")
  rsus: string = "";
  @description("Аккредитация")
  hasAccreditationIl: string = "";
  hasViolations: boolean = false;
  siknLabRsuId: string = "";
}

export class OtherSideItem implements IEntity {
  id: IdType;
  @description("Сторона")
  serial: string = "";
  @description("Наименование ОСТ/СТО")
  ctoName: string = "";
  @description("Структурное подразделение")
  partyName: string = "";
}

export class CommissionItem implements IEntity {
  id: IdType;
  @description("№")
  serial: string;
  @description("От (Наименование организации)")
  organizationName: string = "";
  @description("ФИО")
  fullName: string = "";
  @description("Должность")
  jobTitle: string = "";
  @description("В присутствии")
  isInPresenceTxt: string = "";
  isInPresence: boolean
}

export class IdentifiedVItem implements IEntity {
  id: IdType;
  violationId: string;
  @description("№ пп")
  serialMain: number = 1;
  @description("№ подпункта")
  serial: number = 1;
  @description("Выявленное нарушение")
  violationText: string = "";
  @description("Пункт НД и/или ОРД")
  pointNormativeDocuments: string = "";
  @description("Система учета/ИЛ")
  siknLabRsuName: string = "";
  @description("Номер по классификации")
  classifficationTypeName: string = "";
  @description("Повторяющееся")
  isDuplicate: boolean = false;
  @description("Номер типового нарушения")
  typicalViolationNumber: number = 1;
  @description("Источник замечания")
  sourceRemark: string = "";
  @description("Особое мнение")
  specialOpinion: string = "";
  siknLabRsuId: string = "";
  identifiedTypicalViolationId: string = "";
}

export class RecommendationItem implements IEntity {
  id: IdType;
  @description("№")
  serial: string = "";
  @description("Рекомендации")
  recommendationsText: string = "";
}

export class CompositionItem implements IEntity {
  id: IdType;
  @description("№")
  serial: string = "";
  @description("Наименование приложения")
  name: string = "";
  @description("Количество листов")
  pageCount: string = "";
}
