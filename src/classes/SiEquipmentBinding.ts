import { IEntity } from "../interfaces";
import { description, IdType } from "../types";
import { pureDate, zeroGuid } from "../utils";

export class SiEquipmentBinding implements IEntity {
    @description('Идентификатор записи')
    id: IdType = zeroGuid;
    @description('Идентификатор СИ или оборудования')
    siId: IdType = zeroGuid;
    @description('Действует с')
    effectiveFrom: Date = pureDate(new Date());
    @description('Метка времени изменения записи')
    changeDate: Date = pureDate(new Date());
    @description('Идентификатор технологической позиции')
    techPosId: IdType = zeroGuid;
}