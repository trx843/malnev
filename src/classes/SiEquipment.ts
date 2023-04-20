import { EditorSiMapItem } from ".";
import { IEntity } from "../interfaces";
import { description, IdType, Nullable, String } from "../types";
import { zeroGuid } from "../utils";

export class SiEquipment implements IEntity {
  @description("Идентификатор записи")
  id: IdType = zeroGuid;
  @description("Имя СИ")
  siName: string = "";
  siTypeId: Nullable<number> = null;
  @description("Тип СИ")
  siTypeName: string = "";
  @description("Заводской номер СИ")
  manufNumber: string = "";
  @description("Интервал между КМХ")
  intervalKmh: Nullable<number> = 30;
  @description("Интервал между поверками")
  intervalPov: Nullable<number> = 365;
  @description("Интервал между ТО-3")
  intervalTo3: Nullable<number> = 365;
  @description("Идентификатор СИ в ПиКТС")
  piKtsRef: string = "";
  siModelId: Nullable<IdType> = null;
  @description("Модель СИ")
  siModelName: string = "";
  @description("Год выпуска")
  manufYear: number = 0;
  manufYearDate: Nullable<Date> = null;

  installYear: number = 0;
  @description("Код по ОР-17.120.00-КТН-159-16")
  reglamentCode: Nullable<IdType> = 0;
  @description("Идентификатор в ТОиР")
  toirId: Nullable<IdType>;
  @description("Идентификатор в БДМИ")
  bdmiId: Nullable<IdType>;

  isBinding: boolean;

  showMH: boolean;

  treeId: string;
  @description("Архив")
  isArchival: Nullable<boolean> = false;
  @description("Признак принадлежности")
  owned: boolean;

  techPositionId: Nullable<number> = 0;
  techPositionName: String = "";
  manufacturer: String;

  siknId: number;
  siknFullName: string = "";

  lastSiEquipmentBinding: EditorSiMapItem;

  siCompName: String = "";

  factDateKmh: Nullable<Date> = null;
  planDateKmh: Nullable<Date> = null;
  factDateValid: Nullable<Date> = null;
  planDateValid: Nullable<Date> = null;
  factDateTo3: Nullable<Date> = null;
  planDateTo3: Nullable<Date> = null;
  installDate: Nullable<Date> = null;
  @description("Дата ввода в эксплуатацию")
  installDateText: Nullable<string> = null;

  ostId: number;

  public static InitTechPos(techPosId: number): SiEquipment {
    let result = new SiEquipment();

    result.techPositionId = techPosId;
    result.techPositionName = null;

    return result;
  }

  public static Default(): SiEquipment {
    let result = new SiEquipment();

    result.intervalKmh = null;
    result.intervalPov = null;
    result.siModelId = null;
    result.reglamentCode = null;
    result.intervalTo3 = null;
    result.isArchival = null;
    result.toirId = null;
    result.bdmiId = null;
    result.siModelName = "";
    result.siTypeName = "";

    return result;
  }
}
