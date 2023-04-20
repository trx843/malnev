export const AcquaintanceRoute = "/pspcontrol/acquaintance";
export enum AcquaintanceElements {
    Export, //Экспортировать	3*
    ListOfCheckedOut, //Информация о лицах, ознакомившихся с документом	3*
    AddCheckedOut, //Добавление факта ознакомления	3*
};
export const elementId = (name: string): string => `${AcquaintanceRoute}${name}`;