import { OwnTypes, TransportedProducts } from "../../../../../enums";

export const TransportedProductAllOptionValue = 3;

export enum FormFields {
  OwnThirdParty = "isOwned", // поле Собственный/сторонний
  DateOfIntroduction = "enteryDate", // поле Дата введения
  TransportedProduct = "transportedProduct", // поле Транспортируемый продукт
}

export const InitialFormValues = {
  [FormFields.OwnThirdParty]: OwnTypes.Mix,
  [FormFields.DateOfIntroduction]: null,
  [FormFields.TransportedProduct]: TransportedProductAllOptionValue,
};

export const OwnThirdPartyOptions = [
  { value: OwnTypes.Own, label: "Собственные" },
  { value: OwnTypes.Out, label: "Сторонние" },
  { value: OwnTypes.Mix, label: "Все" },
];

export const TransportedProductOptions = [
  { value: TransportedProducts.Oil, label: "Нефть" },
  { value: TransportedProducts.OilProduct, label: "Нефтепродукты" },
  { value: TransportedProductAllOptionValue, label: "Все" },
];
