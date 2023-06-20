let config = {
	/*
  / Настройки API 
  */
  api: {
    url: "https://ndc01-pebkekt01.dc-prod.tn.corp/TkoRestApi",
  },
  /*
  / Конфигурация для кнопокв боковой панели действий
  */
  buttons: {
    // Результаты КМХ и поверки
    report:
      //"https://ndc01-pebkekt01.dc-prod.tn.corp:59448/Reports/report/АИС%20МСС2/ТО%20КМХ%20Поверка/Изменение%20коэффициентов%20СИ?EventFrameID=",
      "https://ndc01-pebkekp01.dc-prod.tn.corp:59448/Reports/report/АИС%20МСС2/ТО%20КМХ%20Поверка/Изменение%20коэффициентов%20СИ?EventFrameID=",
    // Изменение коэффициентов СИ
    protocolReport:
      //"https://ndc01-pebkekt01.dc-prod.tn.corp:59448/Reports/report/АИС%20МСС2/ТО%20КМХ%20Поверка/Результаты%20КМХ%20и%20поверки?ControlMaintEventID=",
      "https://ndc01-pebkekp01.dc-prod.tn.corp:59448/Reports/report/АИС%20МСС2/ТО%20КМХ%20Поверка/Результаты%20КМХ%20и%20поверки?ControlMaintEventID=",
  },
  /*
    Префикс ссылок для разных систем в iframe
  */
  frame: {
	  // Для отчетов
    //report: "http://ndc01-pebkekt01.dc-prod.tn.corp:59448/",
  	report: "https://ndc01-pebkekp01.dc-prod.tn.corp:59448/",
	  // Для ГИС
	  gis: "https://gis.tn.corp/",
	  // Для PiVision
	  //piVision: "https://ndc01-pebkekt01.dc-prod.tn.corp:8443/PIVision/#/Displays/",
    piVision: "https://ndc01-pebkekp01.dc-prod.tn.corp:8443/PIVision/#/Displays/",
  },
   /*
  / Соответствие внешнийх ссылок с БД (внешние- котрые открываются в новой вкадке)
  */
  urlMapping: {
	  // Для PiVision
    //piVision: "https://ndc01-pebkekt01.dc-prod.tn.corp:8443/PIVision/#/",
    piVision: "https://ndc01-pebkekp01.dc-prod.tn.corp:8443/PIVision/#/",
    // Для grafana
    grafana: "http://10.10.2.116",
    // Для zabbix
    zabbix: "https://10.10.2.116/zabbix",
    // Для ГИС
    gis: "https://gis.tn.corp",
    // Управление отчетами
    //reportedit: "https://ndc01-pebkekt01.dc-prod.tn.corp:59448/Reports/browse/TKO"
    reportedit: "https://ndc01-pebkekp01.dc-prod.tn.corp:59448/Reports/browse/TKO"
  },
  /*
  / Использовать русский формат дат
  */
  isRussianDateFormat: true,
  /*
  / Коэффициент нижней границы результатов Поверки
  */
  kjCalcCoef: 0.9985,
  /*
  / Коэффициент верхней границы  результатов Поверки
  */
  deltaCoef: 1.0015,
  /*
  / Дельта расширения диапазона дат для перехода на тренды
  */
  percentDelta: 20,
  /*
  / максимальное число минут за которое увеличиться диапазон с двух сторон для перехода на тренды
  */
  fixDeltaMinutes: 30,
   /*
  / Параметры обновления в секундах
  */
  longPollingSeconds: {
    events: 120,
    operativeMonitoring: 120,
    notificationMessage: 30
  }
};

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
