import * as Yup from "yup";
import moment from "moment";
import {
  IOsu,
  IPspViewModel,
  IVerificationLevelsOst,
} from "../../../../../slices/pspControl/verificationScheduleCard/types";
import { DateFormat, FormFields } from "./constants";
import { OstValues } from "./types";
import { getDefaultDateRangeByInspectionYearSchedule } from "../../../../../thunks/pspControl/verificationScheduleCard/utils";

export const isVerificationScheduleLevelEqualOst = (
  verificationScheduleLevel: number | undefined
) => {
  return verificationScheduleLevel === OstValues.Ost;
};

export const isDividerVisible = (
  verificationScheduleLevel: number | undefined,
  isLastPsp: boolean
) => {
  return (
    isVerificationScheduleLevelEqualOst(verificationScheduleLevel) && !isLastPsp
  );
};

export const getValidationSchema = (
  verificationScheduleLevel: number | undefined
) => {
  if (verificationScheduleLevel === OstValues.Ost) {
    return Yup.object({
      [FormFields.psps]: Yup.array()
        .of(
          Yup.object({
            [FormFields.checkingObject]: Yup.array()
              .of(Yup.string())
              .nullable()
              .required("Поле обязательно к заполнению!"),
            [FormFields.verificationOstLevelsId]: Yup.string()
              .nullable()
              .required("Поле обязательно к заполнению!"),
            [FormFields._dateRange]: Yup.array(Yup.date()).when(
              [FormFields.isMonth],
              {
                is: false,
                then: Yup.array(Yup.date()).required(
                  "Поле обязательно к заполнению!"
                ),
              }
            ),
            [FormFields.month]: Yup.string()
              .nullable()
              .when([FormFields.isMonth], {
                is: true,
                then: Yup.string().required("Поле обязательно к заполнению!"),
              }),
            [FormFields.isTnm]: Yup.boolean().required(
              "Поле обязательно к заполнению!"
            ),
          })
        )
        .required("Поле обязательно к заполнению!"),
    });
  }

  return Yup.object({
    [FormFields.psps]: Yup.array()
      .of(
        Yup.object({
          [FormFields.checkingObject]: Yup.array()
            .of(Yup.string())
            .nullable()
            .required("Поле обязательно к заполнению!"),
          [FormFields._dateRange]: Yup.array(Yup.date()).required(
            "Поле обязательно к заполнению!"
          ),
        })
      )
      .required("Поле обязательно к заполнению!"),
  });
};

export const mapVerificationObjectsPps = (osus: IOsu[]) => {
  return osus.map((osu) => {
    return {
      value: osu.id,
      label: osu.osuShortName,
    };
  });
};

export const mapVerificationLevelsOst = (levels: IVerificationLevelsOst[]) => {
  return levels.map((level) => {
    return {
      value: level.id,
      label: level.name,
    };
  });
};

// получение нового объекта псп
export const getEmptyPsp = (
  ostRnuPspId: string | undefined,
  verificationScheduleId: string,
  inspectionYear: number,
  firstPsp: IPspViewModel | undefined
) => {

  return {
    checkingObject: firstPsp?.checkingObject,
    endDate: undefined,
    isMonth: false,
    isTnm: false,
    month: undefined,
    ostRnuPspId,
    startDate: undefined,
    verificationOstLevelsId: firstPsp?.verificationOstLevelsId,
    verificationScheduleId,
    _dateRange: getDefaultDateRangeByInspectionYearSchedule(inspectionYear),
    _siknLabRsuIds: firstPsp?._siknLabRsuIds,
  };
};

// валидация диапазонов дат
const validateDateRanges = (
  dateRangeString: string, // отформатированная строка даты текущего значения в селекте/дэйтренже
  psps: IPspViewModel[],
  inspectionYear: number // год карточки графика в пределах которого может быть диапазон дат
) => {
  // проверяем есть ли одинаковые диапазоны дат в массиве псп
  const sameDatesOfVerification = psps.filter((p) => {
    // если объект имеет дату в формате месяца, то
    if (p.isMonth) {
      // получаем отформатированную строку startDate с первым числом месяца
      const formattedPspDate1 = moment({ year: inspectionYear })
        .set({ month: p.month })
        .startOf("month")
        .format(DateFormat);

      // получаем отформатированную строку endDate с последним днем месяца
      const formattedPspDate2 = moment({ year: inspectionYear })
        .set({ month: p.month })
        .endOf("month")
        .format(DateFormat);

      const pspDateRangeString = `${formattedPspDate1}_${formattedPspDate2}`;

      return pspDateRangeString === dateRangeString;
    }

    const pspDate1 = p._dateRange?.[0];
    const pspDate2 = p._dateRange?.[1];

    const pspDateRangeString = `${pspDate1?.format(
      DateFormat
    )}_${pspDate2?.format(DateFormat)}`;

    return pspDateRangeString === dateRangeString;
  });

  return sameDatesOfVerification.length > 1
    ? "Невозможно выбрать одну и ту же дату проверки"
    : undefined;
};

// валидатор для проверки на одинаковый интервал значения "Дата проверки"
export const dateOfVerificationValidator = (
  dateRange: [moment.Moment, moment.Moment],
  psps: IPspViewModel[],
  inspectionYear: number // год карточки графика в пределах которого может быть диапазон дат
) => {
  if (!dateRange) return;

  const date1 = dateRange[0];
  const date2 = dateRange[1];

  const dateRangeString = `${date1.format(DateFormat)}_${date2.format(
    DateFormat
  )}`;

  return validateDateRanges(dateRangeString, psps, inspectionYear);
};

export const monthValidator = (
  monthNumber: number,
  psps: IPspViewModel[],
  inspectionYear: number
) => {
  const formattedPspDate1 = moment({ year: inspectionYear })
    .set({ month: monthNumber })
    .startOf("month")
    .format(DateFormat);

  // получаем отформатированную строку endDate с последним днем месяца
  const formattedPspDate2 = moment({ year: inspectionYear })
    .set({ month: monthNumber })
    .endOf("month")
    .format(DateFormat);

  const dateRangeString = `${formattedPspDate1}_${formattedPspDate2}`;

  return validateDateRanges(dateRangeString, psps, inspectionYear);
};
