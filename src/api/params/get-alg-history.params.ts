export interface GetAlgHistoryParams {
  filter: GetAlgHistoryFilterParams;
  sortedField: string;
  isSortAsc: boolean;
  pageIndex: number;
}

export interface GetAlgHistoryFilterParams {
  startTime: string | null;
  endTime: string | null;
  status: number | null;
  recalc: number | null | boolean;
}
