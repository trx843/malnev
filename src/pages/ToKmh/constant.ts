export const ToKmhRoute = "/tokmh";
export enum ToKmhElements {
  ControlResultsAdd,  //Внести результаты КМХ/поверки  1*
  ControlResultsData,  //Результат: внести данные / данные внесены  2*
  ViewReport,  //Просмотр отчета  3*
  ViewProtocol,  //Просмотр протокола  3*
  ControlResultsLoad,  //Загрузить результаты КМХ и поверок  3*
  ControlSchedLoad,  //Загрузить график ТО и КМХ  3*
  Export,  //Экспортировать  3*
  DownloadFile, //Скачать файл 3
};

export const elementId = (name: string): string => `${ToKmhRoute}${name}`;