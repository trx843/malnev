export interface GetAlgorithmTreeResponse {
  data: AlgorithmTreeData;
}

export interface AlgorithmTreeData {
  allAlgsCount: number;
  enabledAlgsCount: number;
  notEnabledAlgsCount: number;
  errorAlgsCount: number;
  goodAlgsCount: number;
  status: number;
  warnAlgsCount: number;
  servicesInfo: ServicesItem[];
}

export interface ServicesItem {
  id: string;
  displayName: string;
  state: number;
  analysisAlgorithms: AnalysisAlgorithmItem[];
}

export interface AnalysisAlgorithmItem {
  enabled: boolean;
  id: string;
  name: string;
  state: number;
  lastRunTime?: Date;
  fullName?: string;
  algSetPointConfig?: AlgSetPointConfigItem[];
}

export interface AlgSetPointConfigItem {
  id: string;
  name: string;
  uom: string;
  type: ConfigItemType;
  value: any;
}

type ConfigItemType = 'Double' | 'Int32' | 'Single' | 'Boolean';

export enum AlgInputTypes {
  Double = 'number',
  Int32 = 'number',
  Single = 'number',
  Boolean = 'checkbox',
  Input = 'text',
}
