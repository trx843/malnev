export interface AlgorithmTreeViewData {
  title: JSX.Element;
  key: string;
  enabled?: boolean;
  state?: number;
  children?: AlgorithmTreeViewData[];
}
