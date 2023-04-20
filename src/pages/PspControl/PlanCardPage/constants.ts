export enum OstRnuPspValues {
  createdOnPlan = "createdOnPlan", // Дата создания
  ostName = "ostName", // Наименование ОСТ
  filialName = "filialName", // Наименование филиала ОСТ
  pspFullName = "pspFullName", // Наименование ПСП
  suName = "suName", // Объект проверки
  pspPurpose = "pspPurpose", // Назначение ПСП
  pspAffiliation = "pspAffiliation", // Принадлежность ПСП
  verificatedOn = "verificatedOn", // Дата проверки
  verificationLevel = "verificationLevel", // Уровень проверки
  verificationType = "verificationType", // Тип проверки
  verificationActName = "verificationActName", // Акт проверки

  verificationActId = "verificationActId", // Айди акта проверки
}

export enum ObjectInformationItemType {
  Date = "Date",
  Link = "Link",
}

export const ObjectInformationList = [
  {
    title: "Дата создания",
    name: OstRnuPspValues.createdOnPlan,
    type: ObjectInformationItemType.Date,
  },
  {
    title: "Наименование ОСТ",
    name: OstRnuPspValues.ostName,
  },
  {
    title: "Наименование филиала ОСТ",
    name: OstRnuPspValues.filialName,
  },
  {
    title: "Наименование ПСП",
    name: OstRnuPspValues.pspFullName,
  },
  {
    title: "Объект проверки",
    name: OstRnuPspValues.suName,
  },
  {
    title: "Назначение ПСП",
    name: OstRnuPspValues.pspPurpose,
  },
  {
    title: "Принадлежность ПСП",
    name: OstRnuPspValues.pspAffiliation,
  },
  {
    title: "Дата проверки",
    name: OstRnuPspValues.verificatedOn,
    type: ObjectInformationItemType.Date,
  },
  {
    title: "Уровень проверки",
    name: OstRnuPspValues.verificationLevel,
  },
  {
    title: "Тип проверки",
    name: OstRnuPspValues.verificationType,
  },
  {
    title: "Акт проверки",
    name: OstRnuPspValues.verificationActName,
    type: ObjectInformationItemType.Link,
  },
];

export enum TabPanes {
  violations = "Нарушения",
  recommendations = "Рекомендации",
  matchings = "Согласующие",
}
