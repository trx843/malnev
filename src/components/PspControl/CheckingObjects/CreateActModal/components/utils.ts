import {
  ICheckTypes,
  IPspcontrolVerificationLevelsResponse
} from "api/responses/get-pspcontrol-verification-levels.response";
import { OwnStatuses } from "slices/pspControl/verificationSchedule/constants";
import { ISchedule } from "../CreateVerificationActModal/types";

export const mapVerificationSchedules = (
  verificationSchedules: ISchedule[]
) => {
  return verificationSchedules.map(i => {
    return {
      value: i.id,
      label: i.label
    };
  });
};

const mapCheckTypes = (checkTypes: ICheckTypes[]) => {
  return checkTypes.map(type => {
    return {
      ...type,
      value: type.id,
      label: type.name
    };
  });
};

export const mapVerificationLevels = (
  verificationLevels: IPspcontrolVerificationLevelsResponse[]
) => {
  return verificationLevels.map(i => {
    return {
      value: i.id,
      label: i.name,
      checkTypes: mapCheckTypes(i.checkTypes)
    };
  });
};

export const getCheckTypeOptions = (
  verificationLevels: IPspcontrolVerificationLevelsResponse[],
  verificationLevelId: number | string,
  ownType?: OwnStatuses
) => {
  const verificationLevelById = verificationLevels.find(
    level => level.id === verificationLevelId
  );

  if (verificationLevelById) {
    const filteredCheckTypesByOwned = verificationLevelById.checkTypes.filter(
      checkType =>
        checkType.owned === OwnStatuses.mix || checkType.owned === ownType
    );

    return mapCheckTypes(filteredCheckTypesByOwned);
  }

  return [];
};
