let config = {
	/*
  / Настройки API 
  */
  api: {
    url: "http://localhost/TkoRestApi",
  },
  /*
  / Конфигурация для кнопокв боковой панели действий
  */
   buttons: {
    // Результаты КМХ и поверки
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
	piVision: "http://localhost:8443/PIVision/#/Displays/",
  },
   /*
  / Соответствие внешнийх ссылок с БД (внешние- котрые открываются в новой вкадке)
  */
  urlMapping: {
	// Для PiVision
    piVision: "http://localhost:8443/PIVision/#/",
	// Надзор
    supervision: "http://vdc01-pebpmkp01:7777/",
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
