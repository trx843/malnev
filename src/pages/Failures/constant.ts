export const FailuresRoute = "/failures";
export enum FailuresElements {
  FailureCommit, //Квитирование 1 *
  FailureAdd, //Добавить отказ 1 *
  Export, //Экспортировать 3 *
  FailureEdit, //Редактировать 2 *
  PiVisionTrend, //Переход на тренд в Pi Vision 3 *
};
 
export const elementId = (name: string): string => `${FailuresRoute}${name}`;