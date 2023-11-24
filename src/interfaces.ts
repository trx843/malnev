import {
  ControlMaintEvents,
  EditorSiMapItem,
  Event,
  Failures,
  ImportLogs,
  SiEquipment,
  SiknOffItem,
  SiModel,
} from "./classes";
import { CoefChangeEventSigns } from "./classes/CoefChangeEventSigns";
import { DataSi } from "./classes/DataSi";
import { GroupsEventTypes } from "./classes/GroupsEventTypes";
import { OperativeMonitoringModel } from "./classes/OperativeMonitoringModel";
import { HistoryLimit, SiEquipmentLimits } from "./classes/SiEquipmentLimits";
import { SiknRsuItem } from "./classes/SiknRsuItem";
import { SqlTree } from "./classes/SqlTree";
import { UsersEventTypes } from "./classes/UsersEventTypes";
import { OperativeMonitoringFilter } from "./components/operativeMonitoring/OperativeMonitoringFilterPanel";
import {
  IdType,
  NodeType,
  NotificationStatus,
  Nullable,
  OwnedType,
  PagedModel,
  String,
  WarningType,
} from "./types";
import { RowSpanParams } from "ag-grid-community";
import { EventGroupCountType } from "api/responses/home-page.response";

/**
 * Параметры маршрута на страницу с компонентом Frame
 */
export interface IFrameParams {
  /**
   * Название окна: используется для получения нужной ссылки в iframe
   */
  frameName: string;
}

/**
 * Состояние маршрута на страницу с компонентом Frame
 */
export interface IFrameState {
  /**
   * Название окна: используется для получения нужной ссылки в iframe
   */
  mapping: Map<string, string>;
}

/**
 * Абстрактный экшн.
 * https://redux.js.org/basics/actions
 */
export interface IAction<T extends string, P = {}> {
  /**
   * Тип экшна: читается редюсером, для того чтобы определить как менять стейт
   */
  type: T;
  /**
   * Полезная нагрузка: используется для изменения стейта
   */
  payload?: P;
}

/**
 * Интерфейс для передачи конструктора в качестве параметра функции
 */
export interface IConstructor<T extends object> {
  new(): T;
}

/**
 * Поле объекта
 */
export interface IObjectField<T extends object> {
  /**
   * Название поля
   */
  field: keyof T;
  /**
   * Тип поля
   */
  type: string;
  /**
   * Описание поля
   */
  description?: string;
  /**
   * Api запрос
   */
  apiquery?: string;
  /**
   * Api запрос
   */
  specialType?: string;
  /**
   * Имя свойства
   */
  propName?: string;
  /**
   * Путь к идентификатору связанной сущности
   */
  idProp?: string;
  /**
   * Имя React компоненты для рендеринга cell
   */
  cellRenderer?: string;
  /**
   * Объединение полей
   */
  rowSpan?: (params: RowSpanParams) => number;

  cellClassRules?: { [p: string]: string | Function } | undefined;
}

/**
 * Запись об ошибке
 */
export interface IErrorRecord {
  /**
   * Текст ошибки
   */
  message: string;
  /**
   * Стектрейс ошибки
   */
  stack: string;
}

/**
 * Описание записи объекта
 */
export interface IWrittenItem<T> {
  /**
   * Старый объект
   */
  old: T;
  /**
   * Новый объект
   */
  new: T | null;
}

/**
 * Состояние при работе с API элементов типа T
 */
export interface ItemsState<T extends object> {
  /**
   * Получение
   */
  fetch: {
    /**
     * Загружаются ли?
     */
    isFetching: boolean;
    /**
     * Полученные элементы
     */
    items: Array<T>;
    /**
     * Запись об ошибке получения
     */
    fetchError: IErrorRecord | null;
  };
  /**
   * Вставка
   */
  insert: {
    /**
     * Идёт ли процесс вставки?
     */
    isInserting: boolean;
    /**
     * Элемент для вставки
     */
    item: T | null;
    /**
     * Запись об ошибке вставки
     */
    insertError: IErrorRecord | null;
  };
  /**
   * Обновление
   */
  update: {
    /**
     * Идёт ли обновление?
     */
    isUpdating: boolean;
    /**
     * Запись об изменении элемента
     */
    writtenItem: IWrittenItem<T> | null;
    /**
     * Запись об ошибке обновления
     */
    updateError: IErrorRecord | null;
  };
  /**
   * Удаление
   */
  delete: {
    /**
     * Идёт ли удаление?
     */
    isDeleting: boolean;
    /**
     * Идентификатор удаляемого элемента
     */
    itemId: IdType | null;
    /**
     * Запись об ошибке удаления
     */
    deleteError: IErrorRecord | null;
  };
  /**
   * Конструктор типа T
   */
  itemConstructor: IConstructor<T>;
  /**
   * Поля объекта типа T
   */
  fields: Array<IObjectField<T>>;
  /**
   * Список скрываемых в UI полей объекта типа T
   */
  hiddenProps: Array<keyof T>;
  /**
   * Последний action, который был задиспатчен в reducer
   */
  lastAction: string;
}

/**
 * Некоторая сущность, приходящая из бд
 */
export interface IEntity {
  /**
   * Уникальный идентификатор
   */
  id: IdType;
}

/**
 * Именованная сущность
 */
interface INamedEntity {
  /**
   * Значение к полю по строковому индексу - ['shortName'], ['fullName'], ['Name']
   */
  [name: string]: string;
}

/**
 * Индексаторы по строкам обязывают соответствовать возвращаемому типу все остальные свойства.
 * Поэтому используем type intersection
 */
export type NamedEntity = IEntity & INamedEntity;

/**
 * Некоторая сущность, приходящая из бд для селекта
 */
export interface ITitem {
  /**
   * Уникальный идентификатор
   */
  id: IdType;

  /**
   * Значение
   */
  shortName: string;
}

/**
 * Состояние актов отключений
 */
export interface ISiknOffState {
  /**
   * Акты
   */
  items: PagedModel<SiknOffItem>;
  /**
   * Вводимый акт
   */
  writtenItem: IWrittenItem<SiknOffItem> | null;
  /**
   * Акт без события
   */
  insertedItem: SiknOffItem | null;
  /**
   * Фильтрованные акты
   */
  filteredItems: Array<SiknOffItem>;
  /**
   * Выбранный СИКН или ОСТ
   */
  node: SelectedNode;
  /**
   * Фильтр по датам
   */
  filterDates: FilterDates;
  /**
   * Фильтр по РСУ
   */
  rsuFilter: boolean;
  /**
   * Фильтр по РСУ
   */
  reportFilter: boolean;
  /**
   * Фильтр по собственным.сторонним СИКН
   */
  ownedFilter: OwnedType;
}

/**
 * Выбранный узел
 */
export interface SelectedNode {
  /**
   * Идентификатор ноды
   */
  id: IdType;

  /**
   * Идентификатор для работы с API
   */
  nodeId: number;
  /**
   * Название ОСТ или СИКН
   */
  title: string;
  /**
   * Ключ для работы UI-дерева
   */
  key: string;
  type: NodeType;
  owned: Nullable<boolean>;
  isSiType: boolean;
  path?: string;
  children?: SelectedNode[];
}

/**
 * Выбранный узел
 */
export interface CheckedNode {
  item: {
    /**
     * Идентификатор для работы с API
     */
    id: number;
    /**
     * Название ОСТ или СИКН
     */
    title: string;
    /**
     * Ключ для работы UI-дерева
     */
    key: string;
    children?: CheckedNode[];
  };
}

/**
 * Состояние ТО КМХ
 */
export interface IToKmhState {
  /**
   * ТО КМХ
   */
  items: PagedModel<ControlMaintEvents>;
  /**
   * Фильтрованные ТО КМХ
   */
  filteredItems: Array<ControlMaintEvents>;
  /**
   * Вводимый ТО КМХ
   */
  writtenItem: IWrittenItem<ControlMaintEvents> | null;
  /**
   * Выбранный СИКН или ОСТ
   */
  node: SelectedNode;
  /**
   * Фильтр по датам
   */
  filterDates: FilterDates;
  /**
   * Имя дерева
   */
  viewName: string;
  /**
   * Фильтр по собственным.сторонним СИКН
   */
  ownedFilter: OwnedType;
}

/**
 * Состояние ТО КМХ
 */
export interface ICoefsState {
  /**
   * ТО КМХ
   */
  items: PagedModel<CoefChangeEventSigns>;
  /**
   * Выбранный СИКН или ОСТ
   */
  node: SelectedNode;
  /**
   * Фильтр по датам
   */
  filterDates: FilterDates;
  /**
   * Имя дерева
   */
  viewName: string;
  /**
   * Фильтр по собственным.сторонним СИКН
   */
  ownedFilter: OwnedType;
}

/**
 * Фильтр по датам
 */
export interface FilterDates {
  /**
   * Дата начала
   */
  startDate: Date;
  /**
   * Дата окончания
   */
  endDate: Date;
}

/**
 * Состояние Импорта из Excel
 */
export interface IImportExcelState {
  /**
   * Логи
   */
  items: PagedModel<ImportLogs>;
  /**
   * Фильтр по датам
   */
  filterDates: FilterDates;
}

/**
 * Состояние Отказов
 */
export interface IFailuresState {
  /**
   * Отказы
   */
  items: PagedModel<Failures>;
  /**
   * Отфильтрованные Отказы
   */
  filteredItems: Array<Failures>;
  /**
   * Выбранная нода в дереве
   */
  node: SelectedNode;

  /**
   * Выбранный СИКН или ОСТ
   */
  filterDates: FilterDates;
  /**
   * Имя дерева
   */
  viewName: string;
  /**
   * Выбранный отказ
   */
  selected: Failures | null;
  /**
   * Фильтр по собственным.сторонним СИКН
   */
  ownedFilter: OwnedType;
  /**
   * Фильтр по недостоверным событиям
   */
  warningFilter: WarningType;
  /**
   * Вводимый отказ
   */
  writtenItem: IWrittenItem<Failures> | null;

  /**
   * Фильтр по типам отказа
   */
  failureTypeFilter: Array<number>;
  /**
   * Фильтр по последствиям отказа
   */
  failureConsequenceFilter: Array<number>;
}

/**
 * Состояние событий
 */
export interface IEventsState {
  /**
   * События
   */
  items: PagedModel<Event>;
  /**
   * Отфильтрованные События
   */
  filteredItems: Array<Event>;
  /**
   * Выбранная нода в дереве
   */
  node: SelectedNode;
  /**
   * Временной промежуток
   */
  filterDates: FilterDates;
  /**
   * Имя дерева
   */
  viewName: string;
  /**
   * Выбранное дерево
   */
  selected: Event | null;
  /**
   * Фильтр по критичности
   */
  levelFilter: Nullable<number> | undefined;
  /**
   * Фильтр по собственным.сторонним СИКН
   */
  ownedFilter: OwnedType;
  /**
   * Фильтр по недостоверным событиям
   */
  warningFilter: WarningType;
  /**
   * Фильтр по типам события
   */
  eventTypesFilter: Array<string>;
}

/**

 * Состояние настроек событий
 */
export interface IEventSettingsState {
  /**
   * Привязки в таблице
   */
  tableItems: Array<UsersEventTypes>;
  /**
   * Состояние кнопки сохранения таблицы
   */
  saveBtnDisabled: boolean;
  /**
   * Дерево СИКН
   */
  siknTree: Array<SqlTree>;
  /**
   * Выбранные СИКН в дереве СИКН
   */
  treeKeys: Array<string>;

  /**
   * Уведомления на портале
   */
  webChecked: NotificationStatus;
  /**
   * Уведомления по почте
   */
  mailChecked: NotificationStatus;
  /**
   * Сброс к админским настройкам
   */
  resetToAdmin: boolean;

  /**
   * Статус кнопки сброса к админским настройкам
   */
  resetToAdminBtnStatus: boolean;
}

export interface IGroupEventSettingsState {
  /**
   * Привязки в таблице
   */
  tableItems: Array<GroupsEventTypes>;
  /**
   * Состояние кнопки сохранения таблицы
   */
  saveBtnDisabled: boolean;
  /**
   * Дерево СИКН
   */
  siknTree: Array<SqlTree>;
  /**
   * Выбранные СИКН в дереве СИКН
   */
  treeKeys: Array<string>;

  /**
   * Уведомления на портале
   */
  webChecked: NotificationStatus;
  /**
   * Уведомления по почте
   */
  mailChecked: NotificationStatus;
  /**
   * Текущая группа
   */
  currentGroup: string;
}

/**

 * Состояние настроек событий
 */
export interface CtrlEventSettingsState {
  /**
   * Привязки в таблице
   */
  tableItems: Array<UsersEventTypes>;
  /**
   * Состояние кнопки сохранения таблицы
   */
  saveBtnDisabled: boolean;
  /**
   * Дерево СИКН
   */
  siknTree: Array<SqlTree>;
  /**
   * Выбранные СИКН в дереве СИКН
   */
  treeKeys: Array<string>;

  /**
   * Уведомления на портале
   */
  webChecked: NotificationStatus;
  /**
   * Уведомления по почте
   */
  mailChecked: NotificationStatus;
  /**
   * Сброс к админским настройкам
   */
  resetToAdmin: boolean;

  /**
   * Статус кнопки сброса к админским настройкам
   */
  resetToAdminBtnStatus: boolean;
}

export interface CtrlGroupEventSettingsState {
  /**
   * Привязки в таблице
   */
  tableItems: Array<GroupsEventTypes>;
  /**
   * Состояние кнопки сохранения таблицы
   */
  saveBtnDisabled: boolean;
  /**
   * Дерево СИКН
   */
  siknTree: Array<SqlTree>;
  /**
   * Выбранные СИКН в дереве СИКН
   */
  treeKeys: Array<string>;

  /**
   * Уведомления на портале
   */
  webChecked: NotificationStatus;
  /**
   * Уведомления по почте
   */
  mailChecked: NotificationStatus;
  /**
   * Текущая группа
   */
  currentGroup: string;
}

export interface IGroup {
  id: string;
  sid: string;
  name: string;
  domain: string;
}

export interface IFeature {
  id: string;
  route: string;
  name: string;
}

export interface IFeatureElements {
  id: string | number;
  name: string;
  route: string;
  readOnly: boolean;
}

export interface WebFeaturesTypes {
  userReportsList: IMenuUserReports[];
  cards: IMenuNav[];
  underUserNameList: IMenuNav[];
  special: IMenuNav[];
}

export interface IMenuUserReports {
  id: string;
  name: string;
}

export interface IMenuNav {
  id: string;
  name: string;
  route: string;
  isTitle: boolean;
  parentId: String;
  link: String;
  children: IMenuNav[];
  icon: String;
  linkTypeId: Nullable<number>;
  linkType: string;
  eventGroup: EventGroupCountType;
  webFeatureType: EventGroupCountType;
}

/**
 * Состояние актов отключений
 */
export interface IEditorSiMapState {
  /**
   * Акты
   */
  items: PagedModel<EditorSiMapItem>;
  /**
   * Акты
   */
  filteredItems: Array<EditorSiMapItem>;
  /**
   * Вводимый акт
   */
  writtenItem: IWrittenItem<EditorSiMapItem> | null;
  /**
   * Акт без события
   */
  insertedItem: EditorSiMapItem | null;
  /**
   * Имя дерева
   */
  viewName: string;
  /**
   * Выбранный СИКН или ОСТ
   */
  node: SelectedNode | null;
  /**
   * Архивные записи
   */
  archiveFilter: boolean;
  /**
   * Фильтр по собственным.сторонним СИКН
   */
  ownedFilter: OwnedType;
}

/**
 * Состояние модели СИ
 */
export interface IEditorSiModelState {
  /**
   * модели СИ
   */
  items: PagedModel<SiModel>;
  /**
   * Отфильтрованные модели СИ
   */
  filtered: Array<SiModel>;
  /**
   * Обновление модели СИ
   */
  writtenItem: IWrittenItem<SiModel> | null;
  /**
   * Создание модели СИ
   */
  insertedItem: SiModel | null;
  /**
   * Архивные записи
   */
  archiveFilter: boolean;
}

/**
 * Состояние оборудования СИ
 */
export interface ISiEquipmentState {
  /**
   * Акты
   */
  items: PagedModel<SiEquipment>;
  /**
   * Акты
   */
  filtered: Array<SiEquipment>;
  /**
   * Вводимый акт
   */
  writtenItem: IWrittenItem<SiEquipment> | null;
  /**
   * Имя дерева
   */
  viewName: string;
  /**
   * Акт без события
   */
  insertedItem: SiEquipment | null;
  /**
   * Выбранный СИКН или ОСТ
   */
  node: SelectedNode | null;
  /**
   * Фильтр по собственным.сторонним СИКН
   */
  ownedFilter: OwnedType;
  /**
   * Архивные записи
   */
  archiveFilter: boolean;
}

/**
 * Состояние сведений по оборудованию СИ
 */
export interface IDataSiState {
  /**
   * Акты
   */
  items: PagedModel<DataSi>;
  /**
   * Акты
   */
  filtered: Array<DataSi>;
  /**
   * Вводимый акт
   */
  writtenItem: IWrittenItem<DataSi> | null;
  /**
   * Имя дерева
   */
  viewName: string;
  /**
   * Акт без события
   */
  insertedItem: DataSi | null;
  /**
   * Выбранный СИКН или ОСТ
   */
  node: SelectedNode | null;
  /**
   * Архивные записи
   */
  archiveFilter: boolean;
  /**
   * Фильтр по собственным.сторонним СИКН
   */
  ownedFilter: OwnedType;
}

/**
 * Состояние диапазонов
 */
export interface IMeasRangeState {
  /**
   * Акты
   */
  items: PagedModel<SiEquipmentLimits>;
  /**
   * Акты
   */
  filteredItems: Array<SiEquipmentLimits>;
  /**
   * Вводимый акт
   */
  writtenItem: IWrittenItem<SiEquipmentLimits> | null;
  /**
   * Акт без события
   */
  insertedItem: SiEquipmentLimits | null;
  /**
   * Имя дерева
   */
  viewName: string;
  /**
   * Выбранный СИКН или ОСТ
   */
  node: SelectedNode;
  /**
   * Фильтр по собственным.сторонним СИКН
   */
  ownedFilter: OwnedType;
}

/**
 * Состояние Оперативного мониторинга СИКН
 */
export interface IOperMonitState {
  /**
   * Данные
   */
  model: OperativeMonitoringModel;

  /**
   * Фильтр
   */
  filter: OperativeMonitoringFilter;
}

/**
 * Состояние Страницы Подробной информации по рискам.
 */
export interface IRiskRatingInfoState {
  /**
   * Данные
   */
  items: PagedModel<Event>;
  /**
   * Выбранный СИКН
   */
  selectedSikn: Nullable<SiknRsuItem>;
}

/**
 * Состояние истории диапазонов
 */
export interface IHistoryLimitState {
  /**
   * Данные
   */
  items: HistoryLimit[];
  /**
   * Выбранный СИ
   */
  // selectedSi: Nullable<SiEquipment>;

  /**
   * Выбранное имя объекта
   */
  selectedName: String;

  /**
   * Выбранный id объекта
   */
  selectedId: String;

  /**
   * Выбранный СИКН
   */
  // selectedSikn: Nullable<TechPositions>;
}

export interface FilterBody extends Record<string, any> {
  nodePath: string | "all" | undefined;
  isOwn: boolean | null;
}

export interface FilterObject extends Record<string, any> {
  treeFilter: FilterBody;
}

/**
 * Фильтр списка
 */
export interface ListFilterBase {
  /**
   * Индекс страницы
   */
  pageIndex: number;
  /**
   * Поле для сортировки
   */
  sortedField: string;
  /**
   * Признак сортировки по возрастанию
   */
  isSortAsc: boolean;
  /**
   * Фильтр по данным
   */
  filter: FilterObject;
}

export interface RowClassRules {
  [cssClassName: string]: string | ((params: any) => boolean);
}

export type InfoType = {
  node: SelectedNode;
};