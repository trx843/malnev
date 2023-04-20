import { CtrlEventsItem } from "pages/PspControl/CtrlEventsPage/types";
import { IdType, PagedModel } from "../../types";

/**
 * Фильтры на карточке событий
 */
export interface CtrlEventsCardFilterValues {
  types: CtrlEventTypes[];
}

/**
 * События на карточке событий
 */
export interface CtrlCardEvents {
  /**
   * Набор событий
   */
  ctrlEvents: PagedModel<CtrlEventsItem>;

  /**
   * Настроено ли уведомления
   */
  isConfigured: boolean;
}



/**
 * Типы событий 
 */
 export interface CtrlEventTypes {
  id: IdType;
  /**
   * Наименования
   */
   name: string;
}