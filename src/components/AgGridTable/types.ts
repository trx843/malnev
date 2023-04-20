import { ICellRendererParams } from "ag-grid-community";

// ICellRendererParams - не полный интерфейс пропсов для кастомного компонента/рендера ячейки(лучше найти не получилось)

export interface ITableCellRendererParams<T = any> extends ICellRendererParams {
  data: T;
}

export interface IStorageValue {
  colId: string;
  width: number;
}

export type AgGridTableStorages = Record<string, IStorageValue[]>;

export interface ISortingAndFiltering {
  isSorting: boolean;
  isFiltering: boolean;
}
