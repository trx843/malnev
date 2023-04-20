import { IEntity } from "../interfaces";

export class MssFailureTypes implements IEntity
 {
    id: number = 0;
    shortName: string = '';
    mssEventTypeId: number = 0;
}