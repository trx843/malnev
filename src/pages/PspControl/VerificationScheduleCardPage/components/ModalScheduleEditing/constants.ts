import _ from "lodash";

export enum FormFields {
  checkingObject = "_siknLabRsuIds", // селект Объекты проверки
  verificationOstLevelsId = "verificationOstLevelsId", // селект Уровень проверки
  isMonth = "isMonth", // радио группа Месяц проверки или Дата проверки
  _dateRange = "_dateRange", // таймренж Дата проверки
  isTnm = "isTnm", // чекбокс Участие ТНМ

  psps = "psps", // FieldArray динамической формы
  verificationScheduleLevel = "verificationScheduleLevel", // значение уровня проверки

  month = "month", // поле Месяц
}

export const MAX_PSPS = 4;

export enum OstIds {
  Ost = 1, // ОСТ
  Filial = 2, // Филиал
}

enum Months {
  January = "Январь",
  February = "Февраль",
  March = "Март",
  April = "Апрель",
  May = "Май ",
  June = "Июнь",
  July = "Июль",
  August = "Август",
  September = "Сентябрь",
  October = "Октябрь",
  November = "Ноябрь",
  December = "Декабрь",
}

export const ListOfMonths = Object.keys(Months).map((key, index) => {
  return {
    value: index,
    label: Months[key],
  };
});

export const DateFormat = "DD-MM-YYYY";
