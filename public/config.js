const config = {
  /*
  / Настройки API 
  */
  api: {
    //url: "https://ndc01-pebkekt01.dc-prod.tn.corp:8443"
    url: "http://localhost:12345",
    // Main DEV 'http://localhost:8080/TkoRestApi',
    // Second DEV API 'http://localhost:8081' Local DEV API 'http://localhost:8081'
  },
  /*
  / Конфигурация для кнопок боковой панели действий
  */
  buttons: {
    // Ссылка на отчет "Результаты КМХ и поверки"
    report:
      "http://localhost:8081/Reports/report/АИС%20МСС2/ТО%20КМХ%20Поверка/Изменение%20коэффициентов%20СИ?EventFrameID=",
    // Изменение коэффициентов СИ
    protocolReport:
      "http://localhost:8081/Reports/report/АИС%20МСС2/ТО%20КМХ%20Поверка/Результаты%20КМХ%20и%20поверки?ControlMaintEventID=",
  },
  /*
    Префикс ссылок для разных систем в iframe
  */
  frame: {
    // Для отчетов
    report: "http://localhost:8081/",
    // Для ГИС
    gis: "https://gis.tn.corp/",
    // Для PiVision
    piVision: "https://ndc01-pebkekt01.dc-prod.tn.corp:8443/PIVision/#/Displays/",
  },
  /*
  / Соответствие внешнийх ссылок с БД (внешние - которые открываются в новой вкладке)
  */
  urlMapping: {
    // Для PiVision
    piVision: "https://ndc01-pebkekt01.dc-prod.tn.corp:8443/PIVision/#/",
    // Для grafana
    grafana: "http://10.10.2.116",
    // Для zabbix
    zabbix: "https://10.10.2.116/zabbix",
    // Для ГИС
    gis: "https://gis.tn.corp",
    // Управление отчетами
    reportedit: "http://localhost:8081/Reports/browse/%D0%90%D0%98%D0%A1%20%D0%9C%D0%A1%D0%A12"
  },
  /*
  / Использовать русский формат дат
  */
  isRussianDateFormat: true,
  /*
  / Дельта расширения диапазона дат для перехода на тренды
  */
  percentDelta: 20,
  /*
  / Максимальное число минут за которое увеличиться диапазон с двух сторон для перехода на тренды
  */
  fixDeltaMinutes: 30,
  /*
  / Параметры обновления в секундах
  */
  longPollingSeconds: {
    /*
    / Виджет с Событиями
    */
    events: 120,
    /*
    / Оперативный мониторинг
    */
    operativeMonitoring: 120,
    /*
    / Сообщение на портале
    */
    notificationMessage: 30,
  },
};

// Вспомогательная функция для конфигурации УДАЛЯТЬ НЕЛЬЗЯ
// функция для запрета на запись свойств объекта
const deepReadOnly = (object) =>
  Object.keys(object).forEach((key) => {
    // запрещаем записывать свойства вложенных объектов в том числе
    if (typeof object[key] === "object") {
      deepReadOnly(object[key]);
    }
    Object.defineProperty(object, key, {
      writable: false,
    });
  });
deepReadOnly(config);
Object.defineProperty(window, "config", {
  value: config,
});
