import { Nullable } from "../../../types";

export interface IProgramKsPpIlListModel {
  id: string; // Идентификатор записи
  name: Nullable<string>; // Имя программы
  previoseName: Nullable<string>; // Предыдущее имя
  entryDate: Nullable<string>; // Дата введения
  endDate: Nullable<string>; // Срок действия
  status: Nullable<string>; // Статус
  statusId: number; // Статус
  hasFile: boolean; // Файл присутсвует в программе
}
export interface IProgramKsPpIlFilter {
  isOwned: Nullable<boolean>;
  enteryDate: Nullable<string>;
  transportedProduct: Nullable<number>;
  treeFilter: ITreeFilter;
}

export interface ITreeFilter {
  nodePath: Nullable<string>;
  isOwn: Nullable<boolean>;
}

export interface IProgramKsPpIlModelDto {
  id?: string; // Идентификатор записи
  createdOn?: string; // Дата создания записи
  entryDate: string; // Дата воода программы
  endDate?: string; // Срок действия
  approvalDate: string; // Дата утверждения
  previoseName?: string; // Предыдущее наименование
  name?: string; // Наименование программы
  programKsppStatusesId?: number; // Статус программы
  programKsppTypesId: number; // Тип программы
  transportedProductId?: number; // Транспортируемый продукт
  owned?: boolean; // Собственный/сторонний
}

export interface IProgramKsPpIlModel {
  id: string; // Идентификатор записи
  createdOn: Nullable<string>; // Дата создания записи
  entryDate: Nullable<string>; // Дата воода программы
  endDate: Nullable<string>; // Срок действия
  approvalDate: Nullable<string>; // Дата утверждения
  previoseName: Nullable<string>; // Предыдущее наименование
  name: Nullable<string>; // Наименование программы
  programKsppStatusesId: number; // Статус программы
  programKsppTypesId: number; // Тип программы
  transportedProductId: number; // Транспортируемый продукт
  owned: boolean; // Собственный/сторонний
}
