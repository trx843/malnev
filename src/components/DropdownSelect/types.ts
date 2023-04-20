import { OptionData, OptionGroupData } from "rc-select/lib/interface";

interface IDropdownOptionData extends OptionData {
  label: string;
}

interface IDropdownOptionGroupData extends OptionGroupData {
  label: string;
}

export declare type DropdownOptionsType = (
  | IDropdownOptionData
  | IDropdownOptionGroupData
)[];
