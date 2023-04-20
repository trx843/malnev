import { IEntity } from "../interfaces";
import { ActiveCheckbox, description, Nullable, specialType, String } from "../types";
import { pureDate, zeroGuid } from "../utils";

export class UsersEventTypes implements IEntity {
    @description('Уникальный идентификатор события')
    id: string = zeroGuid;
    @description('Уникальный идентификатор пользователя')
    userId: string = zeroGuid;
    @description('Уникальный идентификатор типа события')
    eventTypeId: number = 1;
    @description('Тип события')
    eventTypeName: string = '';
    @description('СИКН')
    siknList: Array<string> = [];
    @specialType('ActiveCheckbox')
    @description('Уведомление на портале')
    webNotificationFlag: boolean = true;
    @specialType('ActiveCheckbox')
    @description('Уведомление по почте')
    mailNotificationFlag: boolean = true;
    treeKey: React.Key;
};


export class ResponseUsersEventTypes {
    usersEventTypes: Array<UsersEventTypes>;
    isAdmin: boolean;
};