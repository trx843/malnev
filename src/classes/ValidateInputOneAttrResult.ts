import { IEntity } from "../interfaces";
import { description, IdType, Nullable, String } from "../types";

export class ValidateInputOneAttrResult implements IEntity {
    id: IdType;

    @description("Время")
    timeStamp: Date = new Date();

    @description("Значение PDA")
    piValue: String = "";

    @description("Качество PDA")
    piQualityStr: String = "";

    @description("Значение Oracle")
    wccValue: String = "";

    @description("Качество Oracle")
    wccQualityStr: String = "";

    @description("Алгоритм достоверизации")
    algorithms: String = "";
}