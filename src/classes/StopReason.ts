import { IEntity } from "../interfaces";
import { description } from '../types';

export class StopReason implements IEntity {
    @description('Идентификатор типовой причины отключения')
    id: number = 0;
    @description('Код причины отключения')
    code: string = '';
    @description('Типовая причина отключения')
    reason: string = '';

    inPlan: InPlan;
}

export enum InPlan {
    // Оба варианта
   Both,
    // Только в графике
   InPlan, 
    // Только вне графике
   NotInPlan
}