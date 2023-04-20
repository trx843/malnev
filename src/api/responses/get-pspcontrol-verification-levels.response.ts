export interface ICheckTypes {
  id: string;
  name: string;
  owned: number;
  isVisibilityInspection: boolean;
}

export interface IPspcontrolVerificationLevelsResponse {
  id: number;
  name: string;
  checkTypes: ICheckTypes[];
}
