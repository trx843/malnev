import { AlgorithmStatuses } from '../../components/Algorithms/enums';
import { Nullable } from '../../types';

export interface GetOperandsTreeResponse {
  data: OperandsTreeItem[];
}

export interface OperandsTreeItem {
  children: OperandsTreeItem[];
  elementId: Nullable<string>;
  enabled: Nullable<boolean>;
  isOperand: boolean;
  key: string;
  status: AlgorithmStatuses;
  title: string;
  templateName: Nullable<string>;
}
