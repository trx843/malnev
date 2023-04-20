import { ModalTypes } from "./components/ModalForCreatingAndReplacingProgram/constants";

export enum ProgramStatuses {
  Active = 1,
  Canceled = 2,
  Replaced = 3,
}

export const InitModalConfig = {
  id: null,
  visible: false,
  type: ModalTypes.none,
};

export const KsPpILProgramsRoute = "/pspcontrol/ks-pp-il-programs"
export enum KsPpILProgramsElements {
  CreateProgram, //Создать программу	3*
  DownloadProgram, //Сачать программу	3*
  CancelProgram, //Отменить программу	3*
  Changeprogram, //Заменить программу	3*
};
export const elementId = (name: string): string => `${KsPpILProgramsRoute}${name}`;


export enum SortableFields {
  name = "name",
  entryDate = "entryDate",
  endDate = "endDate",
  previoseName = "previoseName",
  status = "ProgramKsppStatuses.Name",
}

const staticCellStyle = { wordBreak: "break-word", lineHeight: "23px" };

export const DefaultColDef = {
  sortable: true,
  comparator: () => 0,
  resizable: true,
  wrapText: true,
  autoHeight: true,
  cellStyle: staticCellStyle,
};


export const DefaultSortedFieldValue: string = "entryDate";
export const DefaultIsAsc: boolean = false;
