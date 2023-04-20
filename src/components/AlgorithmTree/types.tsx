import { AlgSetPointConfigItem } from '../../api/responses/get-algorithm-tree.response';

export interface AlgorithmTreeViewData {
  title: JSX.Element;
  key: string;
  enabled?: boolean;
  state?: number;
  children?: AlgorithmTreeViewData[];
  fullName?: string;
  name: string;
  lastRunTime?: Date;
  algSetPointConfig?: AlgSetPointConfigItem[];
}
