import _ from "lodash";
import moment from "moment";
import { User } from "../../../../../classes";
import {
  acceptDelayEliminationMaterials,
  acceptEliminationMaterials,
  createEliminationMaterials,
  declineDelayEliminationMaterials,
  declineEliminationMaterials,
  delayEliminationMaterials,
} from "../../../../../thunks/pspControl/eliminationOfViolations";
import { FormFields } from "../../constants";
import { TypesOfOperations } from "./constants";
import { IEliminationViolationEvent } from "./types";

const formatDate = (date: string) => {
  const momentObj = moment(date);
  if (momentObj.isValid()) {
    return momentObj.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
  }

  return undefined;
};

export const getFormData = (values: IEliminationViolationEvent) => {
  const user = JSON.parse(
    localStorage.getItem("userContext") as string
  ) as User;

  const adjustedValues = {
    ...values,
    ...(values.processedDate && {
      processedDate: formatDate(values.processedDate),
    }),
    fullName: user?.fullName,
    jobTitle: user?.position,
  };

  const formData = new FormData();

  _.forEach(adjustedValues, (value, key) => {
    if (Array.isArray(value)) {
      if (!value.length) return;

      if (key === FormFields.urls) {
        formData.append(key, JSON.stringify(value));
        return;
      }

      if (key === FormFields.files) {
        value.forEach((file: any) => {
          formData.append(`${key}[]`, file.originFileObj);
        });
        return;
      }

      return;
    }

    formData.append(key, value as string);
  });

  return formData;
};

export const getTitle = (typeOfOperation: TypesOfOperations | undefined) => {
  switch (typeOfOperation) {
    case TypesOfOperations.sendForVerification:
      return "Отправить на проверку";
    case TypesOfOperations.requestAnExtension:
      return "Запрос на продление";
    case TypesOfOperations.acceptMaterials:
      return "Добавление материалов по нарушению";
    case TypesOfOperations.rejectMaterials:
    case TypesOfOperations.rejectExtension:
      return "Отклонение";
    case TypesOfOperations.extend:
      return "Продлить";

    default:
      return null;
  }
};

export const getOperation = (
  typeOfOperation: TypesOfOperations | undefined
) => {
  switch (typeOfOperation) {
    case TypesOfOperations.sendForVerification:
      return createEliminationMaterials;
    case TypesOfOperations.requestAnExtension:
      return delayEliminationMaterials;
    case TypesOfOperations.acceptMaterials:
      return acceptEliminationMaterials;
    case TypesOfOperations.rejectMaterials:
      return declineEliminationMaterials;
    case TypesOfOperations.rejectExtension:
      return declineDelayEliminationMaterials;
    case TypesOfOperations.extend:
      return acceptDelayEliminationMaterials;

    default:
      return null;
  }
};
