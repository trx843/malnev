import { message, notification, Upload } from "antd";
import moment, { Moment } from "moment";
import { BindRiskModel } from "./api/params/post-bind-constant-risks.params";
import { FieldData, Nullable, RemapObjectKeys } from "./types";
import { FilterObject } from "./interfaces";
import { RcFile } from "antd/lib/upload/interface";
import {
  AllowedTextFileExtensions,
  AllowedTextFileFormats,
  FileExtensions,
  FileFormats,
} from "./constants";
import { InternalNamePath } from "antd/lib/form/interface";
import { get, isEmpty } from "lodash";
import { ValueFormatterParams } from "ag-grid-community";
import _ from "lodash";
import { VerificationLevel } from "enums";

interface IConfig {
  api: {
    url: string;
  };
  buttons: {
    report: string;
    protocolReport: string;
  };
  frame: {
  };
  urlMapping: {
    piVision: string;
  };
  isRussianDateFormat: boolean;

  /*
                                  / Дельта расширения диапазона дат для перехода на тренды
                                  */
  percentDelta: number;

  /*
                                  / максимальное число минут за которое увеличиться диапазон с двух сторон для перехода на тренды
                                  */
  fixDeltaMinutes: number;

  longPollingSeconds: {
    events: number;
    operativeMonitoring: number;
    notificationMessage: number;
  };
}

export const config = (window as any).config as IConfig;
export const apiBase = `${config.api.url}/api`;
export const apiLocal = `http://localhost:8081/api`;

export const techPosTreeConstant = `sp_SiknTechPositionsTree`;
export const siEqTreeConstant = `sp_SiknSiTree`;

export const shortDateFormatConstant = "YYYY-MM-DD";

const ruGrid = {
  // for filter panel
  page: "Страница",
  more: "ещё",
  to: "к",
  of: "из",
  next: "Следующая",
  last: "Последняя",
  first: "Первая",
  previous: "Предыдущая",
  loadingOoo: "Загрузка...",

  // for set filter
  selectAll: "Выделить всё",
  searchOoo: "Поиск...",
  blanks: "Ничего не найдено",

  // for number filter and text filter
  filterOoo: "Фильтровать...",
  applyFilter: "Применить фильтр...",
  equals: "Равно",
  notEqual: "Не равно",

  // for number filter
  lessThan: "Меньше чем",
  greaterThan: "Больше чем",
  lessThanOrEqual: "Меньше или равно",
  greaterThanOrEqual: "Больше или равно",
  inRange: "В промежутке",

  // for text filter
  contains: "Содержит",
  notContains: "Не содержит",
  startsWith: "Начинается с",
  endsWith: "Заканчивается",

  // filter conditions
  andCondition: '"И"',
  orCondition: '"ИЛИ"',

  // the header of the default group column
  group: "Группа",

  // tool panel
  columns: "Столбцы",
  filters: "Фильтры",
  rowGroupColumns: "Столбцы группировки по строкам",
  rowGroupColumnsEmptyMessage: "Перетащите сюда для группировки по строкам",
  valueColumns: "Столбцы со значениями",
  pivotMode: "Режим сводной таблицы",
  groups: "Группы",
  values: "Значения",
  pivots: "Заголовки столбцов",
  valueColumnsEmptyMessage: "Перетащите сюда для агрегации",
  pivotColumnsEmptyMessage: "Перетащите сюда, чтобы задать заголовки столбам",
  toolPanelButton: "Панель инструментов",

  // other
  noRowsToShow: "Нет данных",

  // enterprise menu
  pinColumn: "Закрепить колонку",
  valueAggregation: "Агрегация по значению",
  autosizeThiscolumn: "Автоматически задавать размер этой колонки",
  autosizeAllColumns: "Автоматически задавать размер всем колонкам",
  groupBy: "Группировать по",
  ungroupBy: "Разгруппировать по",
  resetColumns: "Сбросить столбцы",
  expandAll: "Развернуть всё",
  collapseAll: "Свернуть всё",
  toolPanel: "Панель инструментов",
  export: "Экспорт",
  csvExport: "Экспорт в CSV",
  excelExport: "Экспорт в Excel (.xlsx)",
  excelXmlExport: "Экспорт в XML (.xml)",

  // enterprise menu pinning
  pinLeft: "Закрепить слева <<",
  pinRight: "Закрепить справа >>",
  noPin: "Не закреплять <>",

  // enterprise menu aggregation and status bar
  sum: "Сумма",
  min: "Минимум",
  max: "Максимум",
  none: "Пусто",
  count: "Количество",
  average: "Среднее значение",
  filteredRows: "Отфильтрованные",
  selectedRows: "Выделенные",
  totalRows: "Всего строк",
  totalAndFilteredRows: "Строк",

  // standard menu
  copy: "Копировать",
  copyWithHeaders: "Копировать с заголовком",
  ctrlC: "Ctrl+C",
  paste: "Вставить",
  ctrlV: "Ctrl+V",
};

const defaultColDef = {
  filterParams: {
    newRowsAction: "keep",
  },
  resizable: true,
  wrapText: true,
  autoHeight: true,
  flex: 1,
  // https://blog.ag-grid.com/wrapping-column-header-text/
  headerComponentParams: {
    template:
      '<div class="ag-cell-label-container" role="presentation">' +
      '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
      '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
      '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
      '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
      '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
      '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
      '    <span ref="eText" class="ag-header-cell-text" role="columnheader" style="white-space: normal;"></span>' +
      '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
      "  </div>" +
      "</div>",
  },
  cellStyle: {
    lineHeight: "23px",
  },
};

export const mapTypeToFilter = (type: string, isCustomFilter?: boolean) => {
  switch (type) {
    case "string":
      return isCustomFilter ? "customTextTableFilter" : "agTextColumnFilter";
    case "number":
      return "agNumberColumnFilter";
    case "Date":
      return isCustomFilter ? false : "agDateColumnFilter";
    case "boolean":
      return false;
    default:
      return true;
  }
};

export const pureDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const stringDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1
    }-${date.getDate()}T00:00:00`;
};

export const dateToString = (date: Date) => {
  if ((date as unknown as null) === null) {
    return "";
  }
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  return `${date.getFullYear()}-${month}-${day}`;
};

export const dateToShortString = (date: Nullable<Date>) => {
  if ((date as unknown as null) === null || date === null) {
    return "";
  } else {
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    return `${day}.${month}.${date.getFullYear()}`;
  }
};

export const dateToDayTime = (date: Nullable<Date>) => {
  if ((date as unknown as null) === null || date === null) {
    return "";
  } else {
    const hours = twoDigits(date.getHours());
    const minutes = twoDigits(date.getMinutes());
    const seconds = twoDigits(date.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
  }
};

export const endDateToLongDateString = (date: Date) => {
  if ((date as unknown as null) === null) {
    return "";
  }
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  return `${date.getFullYear()}-${month}-${day} 23:59:59`;
};

export const dateToLongDateString = (date: Date) => {
  if ((date as unknown as null) === null) {
    return "";
  }
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let minute =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let second =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return config.isRussianDateFormat
    ? `${day}.${month}.${date.getFullYear()} ${hour}:${minute}:${second}`
    : `${month}/${day}/${date.getFullYear()} ${hour}:${minute}:${second}`;
};

export const dateComparator = (date1: Date | null, date2: Date | null) => {
  if (date1 === null && date2 === null) {
    return 0;
  }
  if (date1 === null) {
    return -1;
  }
  if (date2 === null) {
    return 1;
  }

  return date2.getTime() - date1.getTime();
};

export const dateFilterParams = {
  comparator: function (filterLocalDateAtMidnight: Date, cellValue: Date) {
    if (cellValue == null) return -1;

    const mDate = pureDate(cellValue);

    if (filterLocalDateAtMidnight.getTime() == mDate.getTime()) {
      return 0;
    }

    if (mDate < filterLocalDateAtMidnight) {
      return -1;
    }

    if (mDate > filterLocalDateAtMidnight) {
      return 1;
    }

    return undefined;
  },
  browserDatePicker: true,
};

export const customTextFilterParams = {
  comparator: function () {
    return 0;
  },
};

export const gridOptions = {
  ruGrid,
  defaultColDef,
  suppressScrollOnNewData: true,
  suppressRowClickSelection: false,
  rowSelection: "multiple",
};

export function twoDigits(n: number): string {
  return n.toLocaleString("ru-RU", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

export function threeDigits(n: number): string {
  return n.toLocaleString("en-US", {
    minimumIntegerDigits: 3,
    useGrouping: false,
  });
}

export function addDeltaToDates(
  prevStartDateTime: Date,
  prevEndDateTime: Date,
  percentDelta: number,
  fixDeltaMinutes: number
): [Date, Date] {
  let timeRange = prevEndDateTime.getTime() - prevStartDateTime.getTime();
  let timeRangeDelta = (timeRange * percentDelta) / 100;
  let timeRangeDeltaMinites = timeRangeDelta / 1000 / 60;
  let fixDelta = fixDeltaMinutes * 60 * 1000;

  let startDate = new Date(
    prevStartDateTime.getTime() -
    (timeRangeDeltaMinites < fixDeltaMinutes ? timeRangeDelta : fixDelta)
  );
  let endDate = new Date(
    prevEndDateTime.getTime() +
    (timeRangeDeltaMinites < fixDeltaMinutes ? timeRangeDelta : fixDelta)
  );
  return [startDate, endDate];
}

export const zeroGuid = "00000000-0000-0000-0000-000000000000";

export const returnStringDate = (
  date?: Nullable<Date>,
  isLocal?: boolean,
  isEnd?: boolean
): string => {
  if (!date) return "";
  const calculatedDate = isEnd ? moment(date).endOf("day") : moment(date);
  if (isLocal) {
    return calculatedDate.format("YYYY-MM-DDTHH:mm:ssZ");
  }
  return calculatedDate.format("YYYY-MM-DDTHH:mm:ss");
};

export const returnPreparedRiskBindData = (
  siknIds: number[],
  risksIds: string[]
): BindRiskModel[] => {
  const newBinds: BindRiskModel[] = [];
  siknIds.forEach((sikn) => {
    if (risksIds.length > 0) {
      risksIds.forEach((risk) => {
        newBinds.push({
          id: zeroGuid,
          siknid: sikn,
          constantRiskID: risk,
        });
      });
    } else {
      newBinds.push({
        id: zeroGuid,
        siknid: sikn,
        constantRiskID: "",
      });
    }
  });
  return newBinds;
};

export const returnRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export function getParamFromUrl<T>(name: string, defaultValue: T): T {
  let toReturn: T;
  let toReturnStr = new URL(window.location.href).searchParams.get(name);
  if (!toReturnStr) {
    message.error(`Ссылка не содержит параметра \"${name}\"`);
    toReturn = defaultValue;
  } else {
    toReturn = toReturnStr as unknown as T;
  }

  return toReturn;
}

const getAllKeys =
  typeof Object.getOwnPropertySymbols === "function"
    ? (obj: any) =>
      Object.keys(obj).concat(Object.getOwnPropertySymbols(obj) as any)
    : (obj: any) => Object.keys(obj);

const hasOwnProperty = Object.prototype.hasOwnProperty;
const assign =
  Object.assign ||
  (<T, S>(target: T, source: S) => {
    getAllKeys(source).forEach((key) => {
      if (hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    });
    return target as T & S;
  });

export function removeIn(object: any, path: unknown[] | string | number): any {
  let nested = assign(Object.create(Object.getPrototypeOf(object)), object);
  let current = nested;

  if (typeof path === "string" || typeof path === "number") {
    if (Array.isArray(current) && typeof path === "number") {
      current.splice(path, 1);
    } else {
      delete current[path];
    }
    return nested;
  }

  if (Array.isArray(path)) {
    while (path.length > 1) {
      const [head, ...tail] = path as any[];
      path = tail;
      if (current[head] === undefined) {
        current[head] = {};
      }
      current = current[head];
    }
    const key = path[0];
    if (typeof current === "object" && !Array.isArray(current))
      delete current[key as keyof typeof current];

    if (Array.isArray(current)) {
      current.splice(key as number, 1);
    }

    return nested;
  }
}

export function asciiToUint8Array(str: string) {
  let chars: number[] = [];
  for (let i = 0; i < str.length; ++i) {
    chars.push(str.charCodeAt(i)); /*from  w  ww. j  a  v  a  2s.c o  m*/
  }
  return new Uint8Array(chars);
}

const getKey = (name: string | number | (string | number)[]): string => {
  if (Array.isArray(name)) {
    return String(name[0]);
  }

  return String(name);
};

export const inputAntdFields = (fields: FieldData[]) =>
  fields.reduce(
    (acc, field) => ({
      ...acc,
      [getKey(field.name)]: field,
    }),
    {}
  );

export const outputAntdFields = (fields: Record<string, FieldData>) => {
  return Object.values(fields);
};

export const getFieldsData = (config: {
  values: Record<string, any>;
  errors: Record<string, any>;
}): FieldData[] => {
  return Object.keys({ ...config.values, ...config.errors })
    .map((key) => {
      if (Array.isArray(config.values[key])) {
        const list = config.values[key];
        return list
          .map((item, index) => {
            if (!isEmpty(item)) {
              return Object.keys(item).map((itemKey) => ({
                name: [key, index, itemKey],
                value: item[itemKey],
                errors: [config.errors[key]?.[index]?.[itemKey]].filter(
                  Boolean
                ),
              }));
            }
          })
          .filter(Boolean)
          .flat();
      }

      return {
        name: [key],
        value: config.values[key],
        errors: [config.errors[key]].filter(Boolean),
      };
    })
    .flat();
};

export const setErrorsFromAntd = (
  errors: {
    name: InternalNamePath;
    errors: string[];
  }[]
) => {
  return errors.reduce(
    (acc, item) => ({ ...acc, [item.name[0]]: item.errors }),
    {}
  );
};

export const getAntdValues = (fields: FieldData[]) =>
  fields.reduce(
    (acc, field) => ({
      ...acc,
      [getKey(field.name)]: field.value,
    }),
    {}
  );

export const getValuesFromFilters = (
  filter: FilterObject
): Record<string, any> => {
  const values = Object.keys(filter).reduce(
    (acc, key) => (key !== "treeFilter" ? { ...acc, [key]: filter[key] } : acc),
    {}
  );

  return values;
};

export const downloadFile = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
};

export const getErrorMessage = (
  error: any,
  defaultMessage: string = "Неизвестная ошибка",
  path?: string
) => {
  const defaultPath = "response.data.exceptionMessage";
  return get(error, path ?? defaultPath, defaultMessage);
};

export const getFileExtension = (filename: string) => {
  const parts = filename.split(".");
  return parts[parts.length - 1];
};

export const getAcceptFromAllowExts = () => {
  return `.${Object.keys(FileFormats).join(",.")}`;
};

// базовый валидатор текстовых файлов(txt, xls, xlsx, doc, docx)
export const textFilesAndImagesValidator = (file: RcFile) => {

  if (!file.size) {
    notification.warn({
      message: "Отсутствует содержимое, файл не добавлен",
      description: "",
      duration: 0,
    });

    return Upload.LIST_IGNORE;
  }

  if (file.size > 20971520) {
    notification.warn({
      message: 'Файл слишком тяжелый',
      description: 'Максимально допустимый размер файла 20мб!',
      duration: 0,
    });

    return Upload.LIST_IGNORE;
  }

  const extension = getFileExtension(file.name) as FileExtensions;

  if (AllowedTextFileExtensions.includes(extension)) {
    return true;
  }

  notification.warn({
    message: "Файл не добавлен.",
    description: `Разрешенные форматы: ${AllowedTextFileExtensions.join(", ")}`,
    duration: 0,
  }
  );

  return Upload.LIST_IGNORE;
};

export const dateValueFormatter =
  (format: string = "DD.MM.YYYY") =>
    (params: ValueFormatterParams) => {
      const date = params.value;

      if (!date) return "";

      const momentDateObj = moment(date);

      if (momentDateObj.isValid()) return momentDateObj.format(format);

      return "";
    };

export const formatDateRange = (dates: Moment[]) => {
  if (!dates) return null;
  const momentStartDate = dates[0];
  const momentEndDate = dates[1];

  if (momentStartDate.isValid() && momentEndDate.isValid())
    return [
      momentStartDate
        .startOf("day")
        .format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
      momentEndDate
        .endOf("day")
        .format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
    ];
  return null;
};

// ремаппер ключей объекта
export const transformNameOfObjectKeys = <
  T extends object,
  Prefix extends string
>(
  obj: T,
  prefix: string
) => {
  return _.reduce(
    obj,
    (acc, value, key) => {
      return {
        ...acc,
        [`${prefix}_${key}`]: value,
      };
    },
    {} as RemapObjectKeys<T, Prefix>
  );
};

export const sortObjectByKeys = <T extends object>(sourceObj: T) => {
  return Object.keys(sourceObj)
    .sort()
    .reduce((obj: T, key) => {
      obj[key as keyof T] = sourceObj[key as keyof T];
      return obj;
    }, {} as T);
};

export const getMomentObj = (date: any, defaultValue: any = undefined) => {
  if (_.isNil(date)) return date;

  const momentObj = moment(date);

  if (momentObj.isValid()) return momentObj;

  return defaultValue;
};

export const formatDate = (
  date: any,
  format: string = moment.HTML5_FMT.DATETIME_LOCAL_SECONDS,
  defaultValue: any = undefined
) => {
  if (_.isNil(date)) return date;

  const momentObj = moment(date);
  if (momentObj.isValid()) return momentObj.format(format);

  return defaultValue;
};

export const tableBorderRowSpanHandler = (isBorder: boolean) => {
  if (isBorder) {
    return { "border-bottom": "2px solid #e2e2e2 !important" };
  }
};

export const verificationLevelHandler = (isUserAllowedOst: boolean, elementVerificationLevel: number | undefined) => {
  if (isUserAllowedOst && elementVerificationLevel && (elementVerificationLevel === 0 || elementVerificationLevel !== VerificationLevel.ost)) {
    return true; //disable element
  } else {
    return false;
  }
};

export const openNotification = (title: string, message: string, duration : number = 0) => {
  notification.open({
    message: title,
    description: message,
    duration: duration,
  });
};