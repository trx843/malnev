import moment from "moment";
import { KsPspOptions } from "api/requests/pspControl/ksppsp/type";
import { OwnTypes } from "../../../../../enums";
import { IProgramKsPpIlModel } from "../../../../../slices/pspControl/ksPpILPrograms/types";
import { Nullable } from "../../../../../types";
import { textFilesAndImagesValidator } from "../../../../../utils";
import { FormFields, ProgramTypeValues } from "./constants";
import { IFormValues } from "./types";

const getMomentObjDate = (date: Nullable<Date | string>) => {
  if (!date) return null;

  const momentObj = moment(date);

  if (momentObj.isValid()) return momentObj;

  return null;
};

export const normFile = (e: any) => {
  const isFileValid = textFilesAndImagesValidator(e.file);

  if (isFileValid) {
    if (Array.isArray(e)) {
      return e;
    }

    if (e.fileList.length > 1) {
      return [e.fileList[1]];
    }

    return e && e.fileList;
  }

  return [];
};

export const serializeValues = (values: IFormValues) => {
  return {
    ...values,
    [FormFields.DateOfIntroduction]: values[
      FormFields.DateOfIntroduction
    ].format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
    [FormFields.DateOfApproval]: values[FormFields.DateOfApproval].format(
      moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
    ),
    [FormFields.OwnThirdParty]:
      values[FormFields.ProgramType] === ProgramTypeValues.Control
        ? !!values[FormFields.OwnThirdParty]
        : undefined,
  };
};

const getOwnThirdParty = (owned: Nullable<boolean>) => {
  if (owned === null) return undefined;

  return owned ? OwnTypes.Own : OwnTypes.Out;
};

export const getFormValues = (program: IProgramKsPpIlModel) => {
  return {
    [FormFields.ProgramType]: program.programKsppTypesId,
    [FormFields.TransportedProduct]: program.transportedProductId,
    [FormFields.OwnThirdParty]: getOwnThirdParty(program.owned),
    [FormFields.DateOfIntroduction]: getMomentObjDate(
      program.entryDate
    ) as moment.Moment,
    [FormFields.DateOfApproval]: getMomentObjDate(
      program.approvalDate
    ) as moment.Moment,
    [FormFields.File]: [],
  };
};

export const normalizeDate = (date: Nullable<moment.Moment>) => {
  if (!date) return null;

  return date.startOf("day");
};

export const shouldUpdateTransportedProduct = (
  prevValues: IFormValues,
  currentValues: IFormValues
) => {
  return (
    prevValues[FormFields.TransportedProduct] !==
      currentValues[FormFields.TransportedProduct] ||
    prevValues[FormFields.ProgramType] !== currentValues[FormFields.ProgramType]
  );
};

export const shouldUpdateOwnThirdParty = (
  prevValues: IFormValues,
  currentValues: IFormValues
) => {
  return (
    prevValues[FormFields.OwnThirdParty] !==
      currentValues[FormFields.OwnThirdParty] ||
    prevValues[FormFields.ProgramType] !== currentValues[FormFields.ProgramType]
  );
};

export const disabledDateOfIntroduction = (
  dateOfIntroduction: moment.Moment,
  dateOfApproval: Nullable<moment.Moment | undefined>
) => {
  if (!dateOfApproval) return false;

  return dateOfIntroduction.startOf("day") >= dateOfApproval.startOf("day");
};

export const disabledDateOfApproval = (
  dateOfApproval: moment.Moment,
  dateOfIntroduction: Nullable<moment.Moment | undefined>
) => {
  if (!dateOfIntroduction) return false;

  return dateOfApproval.startOf("day") <= dateOfIntroduction.startOf("day");
};

export const mapKspPspOptions = (options: KsPspOptions) => {
  return options.map((item) => ({
    value: item.id,
    label: item.label,
  }));
};
