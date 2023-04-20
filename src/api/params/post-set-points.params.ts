export interface PostSetPointsParams {
  elementId: string;
  setPoints: SetPoint[];
}

export interface SetPoint {
  id: string;
  value: any;
}
