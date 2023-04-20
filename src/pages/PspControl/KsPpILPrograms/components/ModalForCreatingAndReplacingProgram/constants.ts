import { OwnTypes, TransportedProducts } from "../../../../../enums";

export enum ModalTypes {
  none = "none",
  creation = "creation",
  replacement = "replacement",
}

export enum FormFields {
  ProgramType = "programKsppTypesId", // поле Тип программы
  TransportedProduct = "transportedProductId", // поле Транспортируемый продукт
  OwnThirdParty = "owned", // поле Собственный/сторонний
  DateOfIntroduction = "entryDate", // поле Дата введения
  DateOfApproval = "approvalDate", // поле Дата утверждения
  File = "File", // поле Обзор
}

export const InitialFormValues = {
  [FormFields.ProgramType]: null,
  [FormFields.TransportedProduct]: null,
  [FormFields.OwnThirdParty]: null,
  [FormFields.DateOfIntroduction]: null,
  [FormFields.DateOfApproval]: null,
  [FormFields.File]: null,
};

export const OwnThirdPartyOptions = [
  { value: OwnTypes.Own, label: "Собственные" },
  { value: OwnTypes.Out, label: "Сторонние" },
];

export const TransportedProductOptions = [
  { value: TransportedProducts.Oil, label: "Нефть" },
  { value: TransportedProducts.OilProduct, label: "Нефтепродукты" },
];

export enum ProgramTypeValues {
  Control = 1,
  Instructions = 2,
}

export const ProgramTypeOptions = [
  { value: ProgramTypeValues.Control, label: "Контроль состояния КС ПСП и ИЛ" },
  {
    value: ProgramTypeValues.Instructions,
    label:
      "Инструкция по проведению периодического мониторинга состояния ПСП нефти/нефтепродуктов",
  },
];
