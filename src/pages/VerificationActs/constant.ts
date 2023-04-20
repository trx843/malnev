export const VerificationActsRoute = "/pspcontrol/verification-acts";
export enum VerificationActsElements {
    ViewCard, // Посмотреть карточку 3 *
    CreatePlan, // Создать план 3 *
    DelAct, // Удалить акт 3 *
    AddAccountingSystem, // Добавить систему учета 3 *
    DelAccountingSystem, // Удалить (систему учета) 3 *
    AddCamp, // Добавить сторону 3 *
    EditCamp, // Редактировать (сторону) 1 *
    DelCamp, // Удалить (сторону) 3 *
    AddCommitteeMember, // Добавить (члена комиссии) 3 *
    EditCommitteeMember, // Редактировать (члена комиссии) 1 *
    DelCommitteeMember, // Удалить (члена комиссии) 3 *
    AddDefect, // Добавить нарушение 3 *
    CreateNewDefect, // Создать новое нарушение 3 *
    SelectDefect, // Выбрать нарушение из справочника 3 *
    SelectTypicalDefect, // Выбрать типовое нарушение 3 *
    ChangeOrder, // Изменить порядок 3 *
    EditDefect, // Редактировать (нарушение) 1 *
    CopyDefect, // Копировать (нарушение) 3 *
    DelDefect, // Удалить (нарушение) 3 *
    AddRecomendation, // Добавить рекомендацию 3 *
    EditRecomendation, // Редактировать рекомендацию 1 *
    DelRecomendation, // Удалить рекомендацию 3 *
    AddApp, // Добавить приложение 3 * 
    EditApp, // Редактировать приложение 1 *
    DelApp, // Удалить приложение 3 *
    CompleteActCreation, // Завершить создание 3 *
    Export, // Экспорт 3 *
    Attachments, // Вложения 1 * 
    OpenActionPlan, // Открыть план мероприятий 3 *
    ViewAct, // Посмотреть акт 3 *
    EditAct, // Редактировать акт 1 *
};
export const elementId = (name: string): string => `${VerificationActsRoute}${name}`;