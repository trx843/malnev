import { IEntity } from '../interfaces';
import { description, Nullable, String } from "../types";
import { pureDate, zeroGuid } from '../utils';


export class ImportLogs implements IEntity {
    @description('Идентификатор')
    id: string = zeroGuid;
    @description('Имя файла')
    fileName: String = '';
    @description('Номер строки')
    rowNumber: number = 0;
    @description('Временная метка')
    timeStamp: Nullable<Date> = pureDate(new Date());
    @description('Сообщение')
    message: String = '';
    @description('Статус добавления строки')
    status: Boolean = false;
}