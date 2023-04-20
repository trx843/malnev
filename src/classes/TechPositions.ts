import { SiEquipment } from ".";
import { IEntity } from "../interfaces";
import { description } from "../types";

export class TechPositions implements IEntity {
  @description("Идентификатор")
  id: number = 0;
  @description("Технологическая позиция")
  shortName: string = "";
  siTypeId: number;
  @description("Тип СИ")
  siTypeName: string = "";
  techBlockTypeId: number;
  siknId: number;
  ostId: number;
  ostName: string;
  siknFullName: string;
  siEquipment: SiEquipment;
  owned: boolean;
  pspName;
}
