import { ThunkAction, ThunkDispatch } from "redux-thunk";
import store from "./store";
import { IConstructor, IEntity, IObjectField, SelectedNode } from "./interfaces";
import "reflect-metadata";
import * as actions from "./actions/items/creators";
import * as genericActions from "./actions/items/genericCreators";
import { ActImportStatuses } from "enums";

export type InternalNamePath = (string | number)[];

/**
 * Все экшены справочников
 */
export type allActions = typeof actions | typeof genericActions;

/**
 * Используется для выведения типа ActionTypes
 * https://habr.com/ru/company/alfa/blog/452620/
 */
type InferValueTypes<T> = T extends { [key: string]: infer U } ? U : never;

/**
 * Тип, который является объединением всех экшонов для одного редюсера
 */
export type ActionTypes<R extends { [key: string]: any }> = ReturnType<
  InferValueTypes<R>
>;

/**
 * Тип, описывающий глобальный стейт.
 * Будет изменяться автоматически с добавлением новых редюсеров
 */
export type StateType = ReturnType<typeof store.getState>;

/**
 * Тип, который будет возвращать функция делающая запрос к rest сервису.
 * Дело в том, что будут возвращаться не сами данные, а коллбек с обращением к стору.
 * Пример: https://github.com/Stepami/reduxtodoapp/blob/master/src/services/todos.ts
 */
export type ThunkResult<R, S, A extends { [key: string]: any; }> = ThunkAction<R, S, undefined, ActionTypes<A>>;

/**
 * Тип функции, отправляющей экшн в стор.
 * Пример: https://github.com/Stepami/reduxtodoapp/blob/master/src/services/todos.ts
 */
export type RestThunkDispatch<S, A extends { [key: string]: any; }> = ThunkDispatch<
  S,
  undefined,
  ActionTypes<A>
>;

/**
 * Уникальный идентификатор сущности
 */
export type IdType = string | number;

/**
 * Ключ для хранения описания в метаданных
 */
const descMetadataKey: symbol = Symbol("description");

/**
 * Декоратор для хранения описаний полей класса
 * @param description Описание поля
 */
export function description(description: string) {
  return Reflect.metadata(descMetadataKey, description);
}

/**
 * Ключ для хранения запроса в API в метаданных
 */
const apiqueryMetadataKey: symbol = Symbol("apiquery");

/**
 * Декоратор для хранения запроса в API
 * @param apiquery запрос в API
 */
export function apiquery(apiquery: string) {
  return Reflect.metadata(apiqueryMetadataKey, apiquery);
}

/**
 * Ключ для хранения дополнительного типа в метаданных
 */
const specialTypeMetadataKey: symbol = Symbol("specialType");
/**
 * Ключ для хранения имени свойства с отображаемым названием объекта
 */
const propNameMetadataKey: symbol = Symbol("propName");

/**
 * Ключ для хранения имени свойства, куда прилетает id связанной сущности
 */
const idPropMetadataKey: symbol = Symbol("idProp");

/**
 * Ключ для хранения имени компоненты для рендеринга cell
 */
const cellRendererMetadataKey: symbol = Symbol("cellRenderer");

/**
 * Декоратор для хранения дополнительного типа
 * @param specialType дополнительный тип
 */
export function specialType(type: any) {
  return Reflect.metadata(specialTypeMetadataKey, type);
}

/**
 * Декоратор для хранения имени свойства с отображаемым названием объекта
 * @param propName имя свойства
 */
export function propName(propName: string) {
  return Reflect.metadata(propNameMetadataKey, propName);
}

/**
 * Ключ для хранения имени свойства, куда прилетает id связанной сущности
 * @param idProp путь к id
 */
export function boundId(idProp: string) {
  return Reflect.metadata(idPropMetadataKey, idProp);
}

/**
 * Декоратор для хранения имени React компоненты
 * @param cellRenderer имя компоненты из объекта frameworkComponent
 */
export function cellRenderer(cellRenderer: string) {
  return Reflect.metadata(cellRendererMetadataKey, cellRenderer);
}

/**
 * Класс для получения информации о полях объекта
 */
export class ObjectFields<T extends object> {
  /**
   * Исследуемый объект
   */
  private instance: T;

  /**
   * Конструктор класса
   * @param type конструктор исследуемого объекта
   */
  constructor(type: IConstructor<T>) {
    this.instance = new type();
  }

  /**
   * Функция, возвращающая информацию о полях объекта класса T
   */
  public getFields(): Array<IObjectField<T>> {
    return (Object.keys(this.instance) as Array<keyof T>).map(
      (x) =>
        <IObjectField<T>>{
          field: x,
          type:
            this.instance[x] === null
              ? "null"
              : <string>typeof this.instance[x] === "object"
                ? ((<unknown>this.instance[x]) as object).constructor.name
                : <string>typeof this.instance[x],
          description: <string>(
            Reflect.getMetadata(descMetadataKey, this.instance, x as string)
          ),
          apiquery: <string>(
            Reflect.getMetadata(apiqueryMetadataKey, this.instance, x as string)
          ),
          propName: <string>(
            Reflect.getMetadata(propNameMetadataKey, this.instance, x as string)
          ),
          idProp: <string>(
            Reflect.getMetadata(idPropMetadataKey, this.instance, x as string)
          ),
          cellRenderer: <string>(
            Reflect.getMetadata(
              cellRendererMetadataKey,
              this.instance,
              x as string
            )
          ),
        }
    );
  }
}

/**
 * Тип который может принимать значение null
 */
export type Nullable<T> = T | null;

/**
 * Дотнетовская строка
 */
export type String = Nullable<string>;

/**
 * Активный чекбокс
 */
export type ActiveCheckbox = Nullable<boolean>;

/**
 * Статус уведомлений
 */
export type NotificationStatus = {
  checked: boolean;
  indeterminate: boolean;
};

/**
 * Принадлежность к собственным\сторонним\всем СИКН
 */
export type OwnedType = Nullable<boolean>;

/**
 * Недостоверные события
 */
export type WarningType = Nullable<boolean>;

/**
 * Информация о странице
 */
export type PageInfo = {
  /**
   * Номер текущей страницы
   */
  pageNumber: number;
  /**
   * Кол-во объектов на странице
   */
  pageSize: number;
  /**
   * Всего объектов
   */
  totalItems: number;
  /**
   * Всего страниц
   */
  totalPages: number;
};

/**
 * Пагинированная коллекция
 */
export type PagedModel<T extends IEntity> = {
  /**
   * Срез
   */
  entities: T[];
  /**
   * Страница
   */
  pageInfo: PageInfo;
};

/**
 * Стандартный ответ от серверной части
 */
export type GenericResponse<T> = {
  /**
   * Успешность
   */
  success: boolean;

  /**
   * Сообщение
   */
  message: Nullable<string>;

  /**
   * Тело результата
   */
  result: T;
};

/**
 * Обобщенный класс со свойствами фильтрации на страницах
 */
export type FiltersModel = {
  /**
   * Дата начала диапазона запрашиваемых данных
   */
  startTime?: Nullable<Date> | string;

  /**
   * Дата начала диапазона запрашиваемых данных
   */
  endTime?: Nullable<Date> | string;

  /**
   * Сторонний\собственный СИКН
   */
  owned?: Nullable<boolean>;

  /**
   * Недостоверные события
   */
  isWarning?: Nullable<boolean>;

  /**
   * Фильтр на актах отключения
   */
  siknOffFilter?: SiknOffFilterType;

  /**
   * Фильтр на событиях
   */
  eventsFilter?: EventsFilterType;

  /**
   * Фильтр на редакторе СИ
   */
  editorSiFilter?: EditorSiFilterType;

  /**
   * Фильтр на ТО КМХ
   */
  controlMaintEventsFilter?: ControlMaintEventsFilter;
  /**
   * Фильтр на Отказах
   */
  failuresFilter?: FailuresFilter;
  /**
   * Фильтр на Диапазонах
   */
  measRangeFilter?: MeasRangeFilter;
};

/**
 * Фильтр на актах отключения
 */
export type SiknOffFilterType = {
  /**
   * Отображать не вошедшие в отчет
   */
  reportFilter: boolean;
  /**
   * Отображать отключения без перехода на РСУ
   */
  rsuFilter: boolean;
};

/**
 * Фильтр на событиях
 */
export type EventsFilterType = {
  /**
   * Фильтр по критичности
   */
  levelFilter?: Nullable<number> | undefined;

  /**
   * Фильтр по типам события
   */
  eventTypesFilter?: Array<string>;

  /**
   * Фильтр по компенсационным мероприятиям
   */
  isCompensated?: Nullable<boolean>;
};

/**
 * Фильтр на редакторе СИ
 */
export type EditorSiFilterType = {
  /**
   * Фильтр по архивности
   */
  archiveFilter: boolean;
};

/**
 * Фильтр на ТО КМХ
 */
export type ControlMaintEventsFilter = {
  /**
   * Фильтр по типам события
   */
  eventTypeFilter: Nullable<number>;
  /**
   * Фильтр по тех позициям
   */
  techPosId: Nullable<number>;
};

/**
 * Фильтр на Отказах
 */
export type FailuresFilter = {
  /**
   * Фильтр по типам отказа
   */
  failureTypeFilter: Array<number>;
  /**
   * Фильтр по последствиям отказа
   */
  failureConsequenceFilter: Array<number>;
};

/**
 * Фильтр на Диапазонах
 */
export type MeasRangeFilter = {
  /**
   * Признак СИКН
   */
  isSikn: boolean;
};

export type NodeType =
  | null
  | "all"
  | "osts"
  | "controldirs"
  | "siknrsus"
  | "techpositions"
  | "sitypes"
  | "siequipments"
  | "notbind"
  | "notbindsieq"
  | "rnus";

export type ValueOf<T> = T[keyof T];

export interface FieldData {
  name: string | number | (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

export type ErrorAntd = {
  name: InternalNamePath;
  errors: string[];
}[];

export interface Violation {
  serial: number;
  violationText: string;
  pointNormativeDocuments: string;
  siknLabRsuId: string;
}

export interface AreaOfResponsibility {
  siknLabRsuId: string;
  classificationNumber: number;
  isDuplicate: boolean;
  typicalViolationNumber: number;
  sourceRemark: string;
  specialOpinion: string;
  VerificationActId: string;
  violations: Violation[];
}

export interface IListFilter<T extends object = object> {
  filter: T;
  rowCount: number;
  pageIndex: number;
  sortedField: string;
  isSortAsc: boolean;
}

export interface ICustomAttrFilterConfig {
  filterList: IFiltersDescription[]; // Список фильтров
}

export interface IFiltersDescription {
  name: string; // Имя фильтра
  propName: string; // Имя свойства
  orderPropName: string; // Имя свойства для сортировки с путем (пример OstRnu.PspFullName)
  displayGroupName: Nullable<string>; // Русское наименование группы в которую входит поле при отображение на фронте
  filterValueName: string; //Наименование поля для получения значений
  type: string; // Тип фильтра
  typeField: string; // Тип отображаемого поля на форме
  controller: Nullable<string>; // Метод из которого вытаскиваем значения в фильтр для выбора (в основном select и multipleSelect)
}

export interface ErrorResponse {
  message: string; //  Сообщение об ошибке
}

export interface IDictionary {
  id: string; // ИД записи
  label: string; // Наименование записи
}

export interface IOption {
  value: string | number; // ИД записи
  label: string; // Наименование записи
}

export type TreeInfoType = {
  node: SelectedNode;
};

export type RemapObjectKeys<T, Prefix extends string> = {
  [Property in keyof T as `${Prefix}_${string & Property}`]: T[Property];
};

export type ActImportType = {
  status: ActImportStatuses;
  lastMessage: string;
  verificationActId: string;
}