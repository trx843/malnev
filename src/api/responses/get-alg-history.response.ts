import { AlgHistory } from '../../classes/AlgHistory';
import { PageInfo } from '../../types';

export interface GetAlgHistoryParamsResponse {
  enabled: boolean;
  lastRunTime: Date;
  nextRunTime: Date;
  algHistory: {
    entities: AlgHistory[];
  };

  pageInfo: PageInfo;
}
