export enum FormFields {
  processedDate = "processedDate", // Обрабатываемая дата
  files = "files", // Файлы
  urls = "urls", // Ссылки на внешние ресурсы хранения
  comment = "comment", // Коментарий
}

export const EliminationOfViolationsRoute = "/pspcontrol/elimination-of-violations";
export enum EliminationOfViolationsElements {
  CheckInfo, //Информация о проверке	3*
  FixingProcessInfo, //Открыть информацию о ходе устранения	3*
  SendToCheck, //Отправить на проверку	3*
  SendToProlongation, //Отправить на продление	3*
  RejectExtension, // Отклонить продление
  RejectMaterials, // Отклонить материалы
  AcceptMaterials, // Принять материалы
  Extend, // Продлить

};
export const elementId = (name: string): string => `${EliminationOfViolationsRoute}${name}`;