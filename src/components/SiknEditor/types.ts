import { description } from '../../types';
import { SiknPermanentRisk } from '../cellRenderers/ConstantRiskBindRenderer/ConstantRiskBindModal/types';

export class SiknEditorTableItem {
  id: number = 0;
  @description('СИКН')
  fullName: string = 'СИКН';
  @description('Критичность')
  criticalness: string = '';
  @description('Риск')
  riskRatio: number = 0;
  @description('Постоянные риски СИКН')
  risksListString: string = '';

  risks: SiknPermanentRisk[];
}
