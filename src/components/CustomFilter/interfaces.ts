import { OptionData } from "../../global";
import { FilterTypes } from "./types";

/**
 * Конфигурация кастомного фильтра
 */
export interface IGenericFilterConfig {
  /**
   * Список групп фильтров
   */
  filterList: Array<IFilterGroup>;
}

/**
 * Группа фильтров
 */
export interface IFilterGroup {
  /**
   * Имя группы
   */
  name: string;
  /**
   * Имя свойства
   */
  propName: string;
  /**
   * Список фильтров
   */
  displayGroupName: string;
  controller: string;
  orderPropName: string;
  filterValueName: string;
  type: string;
  typeField: string;
  options?: OptionData[];
}

/**
 * Фильтр
 */
export interface IFilter {
  /**
   * Имя фильтра
   */
  name: string;
  /**
   * Имя свойства
   */
  propName: string;
  /**
   * Тип фильтра
   */
  type: FilterTypes;
  /**
   * Является ли массивом
   */
  isArray: boolean;
  /**
   * Значение фильтра
   */
  value: any;
  /**
   * Reset по дереву или нет
   */
  IsDependsOnTree?: boolean;
  /**
   * options для select
   */
  options?: OptionData[];
  /**
   * имя контроллера
   */
  controller?: string;
}

export interface IGenericFilterResponseModel {
  /**
   * Значение фильтра
   */
  key: string;
  /**
   * Значение фильтра
   */
  value: any;
}
