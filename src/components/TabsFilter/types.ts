type Value = string[] | number[] | string | number | boolean;

interface Options {
  label: string | number;
  value: string | number;
}

export type TabsFilterOptionsType = Options[];

export interface IValue {
  [key: string]: Value;
}

export interface ITabsFilterFormValues {
  [key: string]: IValue;
}
