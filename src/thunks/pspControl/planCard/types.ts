import { IViolation } from "../../../slices/pspControl/planCard/types";

export interface IGroupedObject {
  violations: IViolation[];
  numberOfAllGroupActions: number;
}

export type RemapObjectKeys<T, Prefix extends string> = {
  [Property in keyof T as `${Prefix}_${string & Property}`]: T[Property];
};
