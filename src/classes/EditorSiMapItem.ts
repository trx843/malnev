import { SiEquipment, TechPositions } from ".";
import { IEntity } from "../interfaces";
import { description, IdType, Nullable } from "../types";
import { zeroGuid } from "../utils";

export class EditorSiMapItem implements IEntity {
  id: IdType = zeroGuid;
  @description("СИКН")
  siknFullName: string = "СИКН ";
  siId: Nullable<IdType> = zeroGuid;
  siTypeId: number;
  techPosId: Nullable<number> = 0;
  @description("Технологическая позиция")
  techPosName: string = "";
  @description("Имя СИ")
  siName: string = "";
  @description("Действует с")
  effectiveFrom: Date = new Date();
  effectiveFor: Nullable<Date> = null;
  @description("Действует по")
  effectiveForText: Nullable<Date> = null;
  @description("Метка времени изменения записи")
  changeDate: Date = new Date();
  techPositions: TechPositions;
  siEquipment: SiEquipment;
  isArchival: boolean;
  prevBinding: Nullable<EditorSiMapItem>;
  owned: boolean;
  isInstallSi: boolean;
  siDecriptionList: string[];
  needToSaveSiDescription: boolean;

  public static Default(): EditorSiMapItem {
    let result = new EditorSiMapItem();

    result.techPosId = null;
    result.siId = null;
    result.siDecriptionList = [""];
    result.needToSaveSiDescription = true;
    result.effectiveFor = null;

    return result;
  }
}
