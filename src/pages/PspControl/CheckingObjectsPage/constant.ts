export const CheckingObjectsRoute = "/pspcontrol/checkingobjects";
export enum CheckingObjectsElements {
    Export, //Экспортировать 3 *
    AddToSchedule, //Создать график 3 *

    CheckOsuInfo, //Посмотреть информ. по ОСУ 3 *
    CreateCheckAct, //Создать акт поверки 3 *
    CreateActionPlan, //Создать план мероприятий 3 *
    OpenPSP, //Открыть ПСП 3 *
    TypViolationCheck, //Проверить на наличие типовых нарушений 3 *
};
export const elementId = (name: string): string => `${CheckingObjectsRoute}${name}`;