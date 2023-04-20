export interface IEliminationViolationEvent {
  processedDate: string; // Обрабатываемая дата
  files: any[];
  urls: string[]; // Ссылки на внешние ресурсы хранения
  comment: string; // Коментарий
}
