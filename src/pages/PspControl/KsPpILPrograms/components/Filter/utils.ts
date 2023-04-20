import { ListFilterBase } from "interfaces";
import moment from "moment";
import { OwnTypes } from "../../../../../enums";
import { Nullable } from "../../../../../types";
import { FormFields, TransportedProductAllOptionValue } from "./constants";
import { IFormValues } from "./types";

const formatDate = (date: Nullable<string | Date>) => {
  if (!date) return null;

  const momentDate = moment(date);

  if (momentDate.isValid())
    return momentDate
      .startOf("day")
      .format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);

  return null;
};

export const getInitialFormValues = (listFilter: ListFilterBase) => {
  return {
    [FormFields.OwnThirdParty]:
      listFilter.filter[FormFields.OwnThirdParty] !== null
        ? listFilter.filter[FormFields.OwnThirdParty] === true
          ? OwnTypes.Own
          : OwnTypes.Out
        : OwnTypes.Mix,
    [FormFields.DateOfIntroduction]:
      listFilter.filter[FormFields.DateOfIntroduction] ?? null,
    [FormFields.TransportedProduct]:
      listFilter.filter[FormFields.TransportedProduct] ??
      TransportedProductAllOptionValue,
  };
};

export const getIsOwnedValue = (value: number) => {
  switch (value) {
    case OwnTypes.Own:
      return true;
    case OwnTypes.Out:
      return false;
    case OwnTypes.Mix:
      return null;
    default:
      return null;
  }
};

export const serializeValues = (values: IFormValues) => {
  return {
    [FormFields.OwnThirdParty]: getIsOwnedValue(
      values[FormFields.OwnThirdParty]
    ),
    [FormFields.DateOfIntroduction]: formatDate(
      values[FormFields.DateOfIntroduction]
    ),
    [FormFields.TransportedProduct]:
      values[FormFields.TransportedProduct] !== TransportedProductAllOptionValue
        ? values[FormFields.TransportedProduct]
        : null,
  };
};
