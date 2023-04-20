import { MssEventSecurityLevel, MssEventType } from "../../classes";
import { EventItem } from "../../classes/EventItem";
import { PagedModel } from "../../types";

/**
 * Фильтры на карточке событий
 */
export interface EventsCardFilterValues {
  types: MssEventType[];
  levels: MssEventSecurityLevel[];
  acknowledges: AckStates[];
}

/**
 * События на карточке событий
 */
export interface CardEvents {
  /**
   * Набор событий
   */
  events: PagedModel<EventItem>;

  /**
   * Настроено ли уведомления
   */
  isConfigured: boolean;
}

/**
 * Статусы квитирования
 */
export interface AckStates {
  /**
   * Идентификатор
   */
  id: number;

  /**
   * Имя
   */
  shortName: string;
}
