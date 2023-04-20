import { IEntity } from "../interfaces";
import { IdType } from '../types';
import { zeroGuid } from "../utils";


export class Groups implements IEntity {
    id: string = zeroGuid;
    domain: string = '';
    name: string = '';
}  

