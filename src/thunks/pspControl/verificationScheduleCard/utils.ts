import _ from "lodash";
import moment from "moment";
import { OstIds } from "pages/PspControl/VerificationScheduleCardPage/components/ModalScheduleEditing/constants";
import { OstValues } from "pages/PspControl/VerificationScheduleCardPage/components/ModalScheduleEditing/types";
import {
  ICheckingObject,
  IPsp,
  IPspViewModel,
} from "../../../slices/pspControl/verificationScheduleCard/types";

const formatDate = (date: moment.Moment | undefined) => {
  if (date?.isValid()) {
    return date.startOf("day").format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
  }

  return undefined;
};

// значение диапазона дат по умолчанию - первая неделя года графика
export const getDefaultDateRangeByInspectionYearSchedule = (
  inspectionYear: number
) => {
  return [
    moment().set({ year: inspectionYear, month: 0, date: 1 }),
    moment().set({ year: inspectionYear, month: 0, date: 7 }),
  ];
};

const getVerificationOstLevelsId = (verificationScheduleLevel: OstValues) => {
  if (verificationScheduleLevel === OstValues.Ost) {
    return OstIds.Ost;
  }

  return null;
};

export const mapVerificationPsps = (
  psps: IPsp[],
  inspectionYear: number,
  verificationScheduleLevel: OstValues
): IPspViewModel[] => {
  return psps.map((psp) => {
    const _siknLabRsuIds = psp.checkingObject.map(
      (o: ICheckingObject) => o.siknLabRsuId
    );

    const adjustedPsp = {
      ...psp,
      verificationOstLevelsId:
        psp.verificationOstLevelsId ||
        getVerificationOstLevelsId(verificationScheduleLevel),
      _siknLabRsuIds: _siknLabRsuIds.length ? _siknLabRsuIds : undefined,
    };

    if (psp.startDate && psp.endDate) {
      const startDateMomentObj = moment(psp.startDate);
      const endDateMomentObj = moment(psp.endDate);

      if (startDateMomentObj.isValid() && endDateMomentObj.isValid()) {
        if (psp.isMonth) {
          const monthNumber = startDateMomentObj.month();
          return {
            ...adjustedPsp,
            _dateRange: [startDateMomentObj, endDateMomentObj],
            month: monthNumber,
          };
        }

        return {
          ...adjustedPsp,
          _dateRange: [startDateMomentObj, endDateMomentObj],
          month: undefined,
        };
      }
    }

    return {
      ...adjustedPsp,
      _dateRange: getDefaultDateRangeByInspectionYearSchedule(inspectionYear),
      month: undefined,
    };
  });
};

export const adjustParams = (psps: IPspViewModel[], inspectionYear: number) => {
  const params = psps.map((psp) => {
    // проверяем добавились/удалились ли новые объекты в селекте Объекты проверки
    const adjustedCheckingObject = psp._siknLabRsuIds?.reduce(
      (acc, siknLabRsuId) => {
        // проверяем есть ли объект есть в _siknLabRsuIds
        const checkingObject = psp.checkingObject.find((checkObj) => {
          return checkObj.siknLabRsuId === siknLabRsuId;
        });

        // если есть, то добавляем его в массив
        if (checkingObject) {
          return [...acc, checkingObject];
        }

        // если нет, то кидаем айди
        return [...acc, { siknLabRsuId }];
      },
      []
    );

    const commonParams = {
      ..._.omit(psp, ["_siknLabRsuIds", "_dateRange", "month"]), // исключаем из target объекта свойства
      checkingObject: adjustedCheckingObject ?? [],
    };

    if (psp.isMonth) {
      return {
        ...commonParams,
        startDate: moment({ year: inspectionYear })
          .set({ month: psp.month })
          .startOf("month")
          .format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
        endDate: moment({ year: inspectionYear })
          .set({ month: psp.month })
          .endOf("month")
          .format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS),
      };
    }

    return {
      ...commonParams,
      startDate: formatDate(psp._dateRange?.[0]) ?? null,
      endDate: formatDate(psp?._dateRange?.[1]) ?? null,
    };
  });

  return params;
};
