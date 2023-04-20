import { description } from "../../../../types";
import { zeroGuid } from "../../../../utils";

export class SiknPermanentRisk {
  zeroGuid: string = zeroGuid;
  id: string;
  @description('Имя риска')
  name: string = 'Имя риска';
  @description('Критичность')
  severityLevelStr: string = '';
  @description('Риск')
  ratio: number = 0;
};