import moment from "moment";
import * as Yup from "yup";
import { IPspcontrolVerificationLevelsResponse } from "api/responses/get-pspcontrol-verification-levels.response";
import { IDictionary } from "types";
import { IFormValues } from "./types";
import { FormFields } from "./constants";

export const getInspectedTypeVisibilityValue = (
  checkTypeId: string,
  verificationLevels: IPspcontrolVerificationLevelsResponse[]
) => {
  let isVisible = false;

  for (let i = 0; i < verificationLevels.length; i++) {
    const level = verificationLevels[i];
    const checkTypeById = level.checkTypes.find(
      (checkType) => checkType.id === checkTypeId
    );

    if (checkTypeById) {
      isVisible = checkTypeById.isVisibilityInspection;
      break;
    }
  }

  return isVisible;
};

export const mapInspectionTypes = (inspectionTypes: IDictionary[]) => {
  return inspectionTypes.map((inspectionType) => {
    return {
      value: inspectionType.id,
      label: inspectionType.label,
    };
  });
};

export const adjustValues = (values: IFormValues) => {
  return {
    ...values,
    preparedOn: moment(values.preparedOn).format(
      moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
    ),
    verificatedOn: moment(values.verificatedOn).format(
      moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
    ),
  };
};

export const getValidationSchema = (isInspectedTypeVisible: boolean) => {
  const generalValidations = {
    [FormFields.verificatedOn]: Yup.string().nullable().required(
      "Поле обязательно к заполнению!"
    ),
    [FormFields.preparedOn]: Yup.string().nullable().required(
      "Поле обязательно к заполнению!"
    ),
    [FormFields.verificationPlace]: Yup.string().required(
      "Поле обязательно к заполнению!"
    ),
  };

  if (isInspectedTypeVisible) {
    return Yup.object({
      ...generalValidations,
      [FormFields.inspectedTypeId]: Yup.string()
        .nullable()
        .required("Поле обязательно к заполнению!"),
    });
  }

  return Yup.object({ ...generalValidations });
};
