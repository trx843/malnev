import { dateValueFormatter } from "utils";
import { ActionColumn } from "./components/ActionColumn";

export const ActionPlansRoute = "/pspcontrol/action-plans";
export enum ActionPlansElements {
  OpenActionPlan, //Открыть план мероприятий	3*
  DelActionPlan, //Удалить план мероприятий	3*
  EditAction, //Редактировать мероприятие	1*
  DelAction, //Удалить мероприятие	3*
  AddAction, //Создать мероприятие	3*
  CompleteActCreation, //Завершить создание	3*
  Export, //Экспорт	3*
  Attachments, //Вложения	1*
  ApproveInSED, // Согласовать в СЭД
  Finalize, // Доработать 3 *
  CompleteEditing, //Завершить редактирование 3 *
  TypicalApproveInSED, // Типовой план: Согласовать в СЭД
  TypicalFinalize, // Типовой план: Доработать 3 *
  TypicalCompleteEditing, // Типовой план: Завершить редактирование 3 *
  TypicalEditing, //Типовой план: Редактировать 3 *
  TypicalExport, //Типовой план: Экспорт	3*
}
export const elementId = (name: string): string => `${ActionPlansRoute}${name}`;

export const DefaultSortedFieldValue: string = "CreatedOn";
export const DefaultIsAsc: boolean = false;

export const TableColumns = [
  {
    field: "planName",
    headerName: "Наименование",
    sortable: false,
    filter: false,
    minWidth: 350,
    tooltipField: "planName",
    cellClass: "action-plans__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    field: "ostName",
    headerName: "ОСТ",
    minWidth: 150,
    tooltipField: "ostName",
    cellClass: "action-plans__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    field: "filial",
    headerName: "Филиал ОСТ",
    minWidth: 150,
    tooltipField: "filial",
    cellClass: "action-plans__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    field: "psp",
    headerName: "Наименование ПСП",
    minWidth: 175,
    tooltipField: "psp",
    headerTooltip: "Наименование ПСП",
    cellClass: "action-plans__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    field: "checkingObjects",
    headerName: "Объект проверки",
    sortable: false,
    filter: false,
    minWidth: 300,
    tooltipField: "checkingObjects",
    cellClass: "action-plans__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    field: "verificationLevel",
    headerName: "Уровень проверки",
    minWidth: 150,
    tooltipField: "verificationLevel",
    cellClass: "action-plans__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    field: "verificationType",
    headerName: "Тип проверки",
    minWidth: 200,
    tooltipField: "verificationType",
    cellClass: "action-plans__action-text-wrapper",
    cellRenderer: "WrapText",
  },
  {
    field: "verificatedOn",
    headerName: "Дата проверки",
    filter: false,
    minWidth: 150,
  },
  {
    field: "verificationStatus",
    headerName: "Статус",
    minWidth: 150,
    tooltipField: "verificationStatus",
  },
  {
    field: "createdOn",
    headerName: "Дата создания",
    valueFormatter: dateValueFormatter(),
    filter: false,
    minWidth: 150,
    headerTooltip: "Дата создания",
  },
  {
    headerName: "Действия",
    minWidth: 125,
    pinned: "right",
    cellRendererFramework: ActionColumn,
    sortable: false,
    filter: false,
  },
];

const staticCellStyle = { wordBreak: "break-word", lineHeight: "23px" };

export const DefaultColDef = {
  resizable: true,
  sortable: true,
  comparator: () => 0,
  filter: "customTextTableFilter",
  wrapText: true,
  cellStyle: staticCellStyle,
};

export enum SortableFields {
  ostName = "VerificationAct.OstRnuPsp.OstName",
  filial = "VerificationAct.OstRnuPsp.RnuName",
  psp = "VerificationAct.OstRnuPsp.PspFullName",
  verificationLevel = "VerificationSchedules.VerificationLevels.Name",
  verificationType = "VerificationSchedules.CheckTypes.Name",
  verificatedOn = "VerificationAct.VerificatedOn",
  verificationStatus = "VerificationStatuses.Name",
  createdOn = "CreatedOn",
}
