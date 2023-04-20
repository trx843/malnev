import { IEntity } from "../interfaces";
import { description, Nullable, String } from "../types";
import { pureDate, zeroGuid } from "../utils";

export class CoefChangeEventSigns {
  id: string = zeroGuid;
  techPositionId: number = 0;
  @description("Имя СИ")
  siName: string = "";
  @description("СИКН")
  siknFullName: string = "";
  @description("Технологическая позиция")
  techPositionName: string = "";
  siId: string = zeroGuid;
  @description("Метка времени")
  startTimestamp: Date = pureDate(new Date());
  endTimestamp: Nullable<Date> = pureDate(new Date());
  changedCoefficients: string = "";
  @description("В графике")
  graphOkText: string = "";
  @description("Данные о факте поверки")
  controlMaintExits: boolean = false;

  controlMaintEventId: string = zeroGuid;

  public static Default(): CoefChangeEventSigns {
    let result = new CoefChangeEventSigns();

    result.endTimestamp = null;

    return result;
  }
}
