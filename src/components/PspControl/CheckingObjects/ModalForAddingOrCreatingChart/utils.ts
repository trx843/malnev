import moment from "moment";
import { PspcontrolVerificationScheduleSiknLabRsuInfo } from "../../../../api/params/put-pspcontrol-verification-schedules.params";
import {
  ICheckTypes,
  IPspcontrolVerificationLevelsResponse,
} from "../../../../api/responses/get-pspcontrol-verification-levels.response";
import { VerificationScheduleItem } from "../../../../pages/PspControl/VerificationSchedulePage/classes";
import { OwnStatuses } from "../../../../slices/pspControl/verificationSchedule/constants";
import { Nullable } from "../../../../types";
import { CheckingObjectsItem } from "../classes";
import { RadioGroupValues, FormFields, InitialFormValues } from "./constants";
import { IDictionaries, IFormValues } from "./types";
import { AccountTypeIds, OstValues } from "../../../../enums";

const formatDate = (date: Nullable<string>) => {
  const momentDate = moment(date);

  return momentDate
    .startOf("year")
    .startOf("month")
    .startOf("day")
    .format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
};

export const serializeValues = (
  values: IFormValues,
  checkingObjectsItem: CheckingObjectsItem[]
) => {
  const siknLabRsuInfoArray: PspcontrolVerificationScheduleSiknLabRsuInfo[] =
    checkingObjectsItem.reduce((acc, chObj) => {
      return [
        ...acc,
        ...chObj.siknLabRsuIds.reduce((acc, siknLabRsu) => {
          if (siknLabRsu.accountTypeId === AccountTypeIds.Commercial) {
            return [
              ...acc,
              {
                ostRnuPspId: chObj.pspId,
                siknLabRsuId: siknLabRsu.id,
              }
            ];
          }

          return acc;
        }, []),
      ];
    }, []);

  if (values[FormFields.radioGroup] === RadioGroupValues.add) {
    return {
      [FormFields.verificationScheduleId]:
        values[FormFields.verificationScheduleId],
      siknLabRsuInfoArray,
    };
  }

  if (values[FormFields.radioGroup] === RadioGroupValues.create) {
    return {
      [FormFields.verificationLevelId]: values[FormFields.verificationLevelId],
      [FormFields.checkTypeId]: values[FormFields.checkTypeId],
      [FormFields.inspectionYear]: formatDate(
        values[FormFields.inspectionYear]
      ),
      siknLabRsuInfoArray,
    };
  }

  return {
    [FormFields.verificationScheduleId]:
      values[FormFields.verificationScheduleId],
    siknLabRsuInfoArray,
  };
};

export const getCheckTypeOptions = (
  verificationLevels: IPspcontrolVerificationLevelsResponse[],
  verificationLevelId: number | string,
  ownType?: OwnStatuses
) => {
  const verificationLevelById = verificationLevels.find(
    (level) => level.id === verificationLevelId
  );

  if (verificationLevelById) {
    const filteredCheckTypesByOwned = verificationLevelById.checkTypes.filter(
      (checkType) =>
        checkType.owned === OwnStatuses.mix || checkType.owned === ownType
    );

    return mapCheckTypes(filteredCheckTypesByOwned);
  }

  return [];
};

export const isVerificationLevelId = (values: IFormValues) =>
  !!values[FormFields.verificationLevelId];

export const disabledDate = (date: moment.Moment) => {
  const prevYear = moment().subtract(1, "years").year();
  const dateYear = date.year();

  return prevYear >= dateYear;
};

export const mapVerificationSchedules = (
  verificationSchedules: VerificationScheduleItem[]
) => {
  return verificationSchedules.map((i) => {
    return {
      value: i.id,
      label: i.name,
    };
  });
};

const mapCheckTypes = (checkTypes: ICheckTypes[]) => {
  return checkTypes.map((type) => {
    return {
      value: type.id,
      label: type.name,
    };
  });
};

export const mapVerificationLevels = (
  verificationLevels: IPspcontrolVerificationLevelsResponse[]
) => {
  return verificationLevels.map((i) => {
    return {
      value: i.id,
      label: i.name,
      checkTypes: mapCheckTypes(i.checkTypes),
    };
  });
};

export const getOwnType = (checkingObjectsItem: CheckingObjectsItem[]) => {
  const objTypes = checkingObjectsItem.reduce(
    (acc, cobj) => {
      return {
        ...acc,
        ...(cobj.pspIsOwned ? { own: acc.own + 1 } : { out: acc.out + 1 }),
      };
    },
    {
      own: 0,
      out: 0,
    }
  );

  if (objTypes.own && objTypes.out) return OwnStatuses.mix;

  if (objTypes.own) return OwnStatuses.own;

  if (objTypes.out) return OwnStatuses.out;

  return OwnStatuses.mix;
};

export const getOstIds = (checkingObjectsItem: CheckingObjectsItem[]) => {
  const uniqueOstIds = Array.from(
    new Set(checkingObjectsItem.map((item) => item.ostId))
  );
  return uniqueOstIds;
};

export const getFirstCheckType = (checkTypes: ICheckTypes[]) => {
  if (checkTypes.length === 1)
    return { [FormFields.checkTypeId]: checkTypes[0].id };

  return undefined;
};

export const getFormValues = (dictionaries: IDictionaries) => {
  const { verificationSchedules, verificationLevels } = dictionaries;

  return {
    ...InitialFormValues,
    ...(verificationSchedules.length === 1 && {
      [FormFields.verificationScheduleId]:
        verificationSchedules[0].id.toString(),
    }),
    ...(verificationLevels.length === 1 && {
      [FormFields.verificationLevelId]: verificationLevels[0].id,
      ...getFirstCheckType(verificationLevels[0].checkTypes),
    }),
  };
};

export const validateCheckType = (
  ownType: OwnStatuses,
  verificationLevels: IPspcontrolVerificationLevelsResponse[],
  verificationLevelId: number
) => {
  const verificationLevelById = verificationLevels.find(
    (level) => level.id === verificationLevelId
  );

  if (verificationLevelById) {
    if (!verificationLevelById.checkTypes.length) return;

    const filteredCheckTypesByOwned = verificationLevelById.checkTypes.filter(
      (checkType) =>
        checkType.owned === OwnStatuses.mix || checkType.owned === ownType
    );

    if (filteredCheckTypesByOwned.length) return;

    return "Выберите другой набор объектов или уровень проверки!";
  }

  return;
};

export const verificationLevelValidator = (
  verificationLevelId: number,
  checkingObjectsItem: CheckingObjectsItem[]
) => {
  if (verificationLevelId === OstValues.Ost) {
    const firstCheckingObjectItemOstName = checkingObjectsItem[0].ostName;
    const isOstsOfAllObjectsEqual = checkingObjectsItem.every(
      (item) => item.ostName === firstCheckingObjectItemOstName
    );

    if (isOstsOfAllObjectsEqual) return;

    return "Невозможно создать график, выбранные объекты имеют разные ОСТ";
  }
};

export const verificationScheduleValidator = (
  verificationLevelId: number,
  checkingObjectsItem: CheckingObjectsItem[],
  verificationSchedules: VerificationScheduleItem[]
) => {
  const verificationScheduleById = verificationSchedules.find(
    (schedule) => schedule.id === verificationLevelId
  );

  if (
    verificationScheduleById &&
    verificationScheduleById.verificationLevelId === OstValues.Ost
  ) {
    const isOstsOfAllObjectsEqual = checkingObjectsItem.every(
      (item) => item.ostName === verificationScheduleById.ost
    );

    if (isOstsOfAllObjectsEqual) return;

    return "Невозможно добавить в график, ОСТ выбранных объектов и графика не совпадает";
  }
};
