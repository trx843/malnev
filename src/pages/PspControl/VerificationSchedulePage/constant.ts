export const VerificationScheduleRoute = "/pspcontrol/verification-schedule";
export enum VerificationScheduleElements {
    OpenCheckSchedule, //Открыть график проверки 3 *
    DelCheckSchedule, //Удалить график проверки 3 *
    AddCheckObject, //Добавить объект проверки 3 *
    ApproveInSED, //Согласовать в СЭД 3 *
    CompleteCreation, //Завершить создание 3 *
    Edit, // Редактировать 3 *
    Finalize, // Доработать 3 *
    CompleteEditing, //Завершить редактирование 3 *
    Export, //Экспорт 3 *
    AddApprover, //Добавить согласующего 3 *
    ChangeOrder, //Изменить порядок (согласующих) 3 *
    EditSchedule, //Редактировать график 1* 
    DelCheckObject, //Удалить объект проверки 3 *
    AddCheckAct, //Добавить акт проверки 3 *
    OpenPSP, //Открыть ПСП 3 *
};
export const elementId = (name: string): string => `${VerificationScheduleRoute}${name}`;