/**
 * Справочник групп пользователей для акта расследования (таблица SiknOffGroups)
 */
export enum SiknOffGroupsEnum {
  CommissionMembers = 1,
  CommissionChairman,
  Performers,
  Reconciling,
  Approver,
  SendPeople,
  ReceivePeople,
  ToPeople,
  ExtendTimeEnum,
}

/**
 * Справочник статусов квитирования
 */
export enum AcknowledgedStatus {
  /**
   * Не квитировано
   */
  NotAcknowledged,

  /**
   * Квитировано
   */
  Acknowledged,

  /**
   * Переоткрыто
   */
  Reopened,
}

/**
 * Справочник типов дерева
 */
export enum ShowType {
  /**
   * ТО КМХ
   */
  ToKmh,

  /**
   * Коэффициенты
   */
  Coefs,

  /**
   * Диапазоны
   */
  Limits,

  /**
   * Редактор СИ
   */
  SiEditor,
}

/**
 *  Типы ТО КМХ
 */
export enum ControlMaintEventTypesEnum {
  /**
   *  ТО3
   */
  To3,

  /**
   *  Поверка
   */
  Valid,

  /**
   *  КМХ
   */
  Kmh,
}

export enum ExtendTimeEnum {
  /**
   * Без расширения границ
   */
  DoNotExtend = 0,
  /**
   * С расширением границ
   */
  Extend = 1,
}

export const TreeStatuses: {
  [key: string]: "Good" | "Warning" | "Danger" | "Disabled" | "Failed";
} = {
  "20": "Good",
  "25": "Warning",
  "30": "Danger",
  "40": "Failed",
  null: "Good",
};

export enum TreeStatusColors {
  Good = "#219653",
  Danger = "#FF4D4F",
  Warning = "#F2994A",
  Failed = "#AE1C1D",
  Disabled = "#667985",
}

/**
 *  Статусы графиков проверки
 */
export enum StatusesIds {
  Creation = 1, // Создание
  ApprovalInSED = 2, // Согласование в СЭД
  Signed = 3, // Подписан
  Editing = 4, // Редактирование
  Modification = 5, // Дорабока
  Deleted = 6, // Удален
  ErrorCreatingDocumentInSED = 7, // Ошибка создания документа в СЭД
}

export enum TransportedProducts {
  Oil = 1, // Нефть
  OilProduct = 2, // Нефтепродукт
}

export enum OwnTypes {
  Out = 0, // Сторонний
  Own = 1, // Собственный
  Mix = 2, // Собственный/сторонний
}

export enum WebFeatureTypeEnum {
  /// <summary>
  /// Обычные WebFeature, добавляются на главный экран и в боковое меню
  /// </summary>
  Cards = 1,
  /// <summary>
  /// WebFeature в выпадающем списке под именем пользователя
  /// </summary>
  UnderUserNameList,
  /// <summary>
  /// WebFeature для элементов, не требующих добавления на главный экран и боковое меню в обычном порядке
  /// </summary>
  Special,
}

/**
 *  Статусы нарушений
 */
export enum ViolationStatuses {
  None = 0,
  Revealed = 1, // Выявлено
  NotRevealed = 2, // Не выявлено
  Eliminated = 3, // Устранено
}

/**
 *  Статусы мероприятий нарушения
 */
export enum ViolationEliminationStatuses {
  AtWork = 1, // В работе
  Postponement = 2, // Перенос срока
  OnInspection = 3, // На проверке
  Expired = 4, // Просрочено
  Eliminated = 5, // Устранено
}

/**
 *  Статусы операций мероприятия
 */
export enum OperationsStatuses {
  SendToWork = 0, // Отправить в работу
  SendForVerification = 1, // Отправить на проверку
  AcceptMaterials = 2, // Принять материалы
  RejectMaterials = 3, // Отклонить материалы
  RequestAnExtension = 4, // Запросить продление
  Extend = 5, // Продлить
  DeclineRenewal = 6, // Отклонить продление
}

export enum VerificationTypeCodes {
  MonitoringStatusOfOwnAndThirdPartyPSP = 1, // Контроль состояния собственных и сторонних ПСП
  MonitoringOfStateOfOwnPSP = 2, // Контроль состояния собственных ПСП
  PeriodicMonitoringOfStateOfOurOwnPSP = 3, // Периодический мониторинг состояния собственных ПСП
  MonitoringStatusOfThirdPartyPSP = 4, // Контроль состояния сторонних ПСП
  PeriodicMonitoringOfStatusOfThirdPartyPSP = 5, // Периодический мониторинг состояния сторонних ПСП
}

/**
 *  Статусы планов
 */
export enum PlanStatuses {
  Create = 1, // Создание
  SEDApproval = 2, // Согласование в СЭД
  Signed = 3, // Подписан
  Editing = 4, // Редактирование
  Revision = 5, // Доработка
  Deleted = 6, // Удален
  ErrorCreatingDocumentInSED = 7, // Ошибка создания документа в СЭД
}

export enum OstValues {
  PaoTransneft = 1, // ПАО "Транснефть"
  AoTransneftMetrology = 2, // АО "Транснефть-метрология"
  Ost = 3, // ОСТ
}

export enum AccountTypeIds {
  Operational = 1, // оперативный
  Commercial = 2, // коммерческий
}

export enum CommissionTypesStages {
  Schedule = 1, // График
  Act = 2, // Акт
  Plan = 3, // План
}

export enum OsuTypes {
  osu = 1, // ОСУ
  rsu = 2, // РСУ
  il = 3, // ИЛ
}

/**
 *  Тип сортировки
 */
export enum SortTypes {
  asc = "asc",
  desc = "desc",
}

/**
 *  Режимы работы модального окна
 */
export enum ModalModes {
  create = "create",
  edit = "edit",
  none = "none",
}

/**
 *  Статус импорта акта в объектах проверки
 */
export enum ActImportStatuses {
  success = 3,
  warn = 2,
  error = 1,
}


export enum WebFeatureLinkTypes {
  report = 0, // Отчеты
  supervision = 1, // Надзор
  modal = 2, // Модальное окно
  gis = 3, // ГИС
  piVision = 4, // piVision
  grafana = 5, // grafana
  zabbix = 6, // zabbix
  folder = 7, // Папка
}

export enum VerificationLevel {
  pao_transneft = 1,
  transneft_metrology = 2,
  ost = 3,
}