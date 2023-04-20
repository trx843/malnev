import { IEntity } from "../interfaces";
import { description, IdType, Nullable } from '../types';
import { zeroGuid } from "../utils";

export class MeasRangeItem implements IEntity {
   id: IdType = zeroGuid;

    @description('Имя СИ')
    siName: string = '';
    
    @description("Тип границ")
    siLimitTypeID: number = 0;
    
    @description("Верхняя граница")
    upperLimit: number = 0;

    @description("Нижняя граница")
    lowerLimit: number = 0;

    @description("Когда изменено")
    changeDate: Date = new Date();

    @description("Кем изменено")
    changedBy: string = "";
    
    @description("Идентификатор СИ")
    idSi: Nullable<IdType> = 0;    

    public static Default(): MeasRangeItem {
        let result = new MeasRangeItem();
            result.idSi = null;
        return result;
    }
}

// export class MeasRangeTechItem implements IEntity {
//     id: IdType = zeroGuid;

//     @description('Имя СИ')
//     siName: string = '';
    
//     @description("Тип границ")
//     siLimitTypeID: number = 0;
    
//     @description("Верхняя граница")
//     upperLimit: number = 0;

//     @description("Нижняя граница")
//     lowerLimit: number = 0;

//     @description("Когда изменено")
//     changeDate: Date = new Date();

//     @description("Кем изменено")
//     changedBy: string = "";
    
//     @description("Идентификатор СИ")
//     techPositionId: Nullable<IdType> = 0;
// }