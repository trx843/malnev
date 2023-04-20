import { AcquaintanceItem } from '../../../api/requests/pspControl/acquaintance/types';
import {IGenericFilterConfig} from '../../../components/CustomFilter/interfaces';
import {ListFilterBase, SelectedNode} from '../../../interfaces';
import {PageInfo} from '../../../types';

export interface AcquaintanceStore {
  items: AcquaintanceItem[];
  loading: boolean;
  selectedTreeNode: SelectedNode;
  appliedFilter: ListFilterBase;
  pageInfo: PageInfo;
  filterConfig: IGenericFilterConfig;
}
