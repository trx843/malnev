import _, { Dictionary } from "lodash";
import {
  IActionPlanCard,
  IRecommendationWithActionPlanModel,
  IViolation,
} from "../../../slices/pspControl/planCard/types";
import { IGroupedObject, RemapObjectKeys } from "./types";

const transformNameOfObjectKeys = <T extends object, Prefix extends string>(
  obj: T,
  prefix: string
) => {
  return _.reduce(
    obj,
    (acc, value, key) => {
      return {
        ...acc,
        [`${prefix}_${key}`]: value,
      };
    },
    {} as RemapObjectKeys<T, Prefix>
  );
};

// маппер мероприятий
const mapActionPlans = (
  violation: IViolation,
  violationIndex: number,
  rowSpanPointColumn: number
) => {
  const adjustedViolation = transformNameOfObjectKeys<IViolation, "violation">(
    violation,
    "violation"
  );

  const violationSerial = `${violation.identifiedViolationsSerial}.${violation.serial}`;
  const actionPlans = violation.actionPlan;

  if (!actionPlans.length) {
    return [
      {
        ...adjustedViolation,
        // формируем значение 2 столбца №пп
        _violationSerial: violationSerial,
        // булев атрибут, чтобы знать какое мероприятие в группе является последним,
        // для отображения кнопки добавления нового мероприятия в таблице
        _isLastActionPlan: true,
        _maxActionPlanSerial: 0,
        // рассчет row span для 1 столбца №пп
        _rowSpanPointColumn: violationIndex === 0 ? rowSpanPointColumn : 1,
      },
    ];
  }

  // находим максимальный Serial среди всех мероприятий нарушения
  // нужен для отправки передачи в параметры при создании
  // нового мероприятия
  const maxActionPlanSerial = getMaxActionPlanSerial(actionPlans);

  const adjustedActionsPlans = actionPlans.map(
    (actionPlan: IActionPlanCard, actionIndex) => {
      const adjustedActionPlan = transformNameOfObjectKeys<
        IActionPlanCard,
        "actionPlan"
      >(actionPlan, "actionPlan");

      return {
        ...adjustedViolation,
        ...adjustedActionPlan,
        // формируем значение столбца(строку) № мероприятия - берем атрибуты
        _actionPlanSerial: `${violationSerial}.${actionPlan.serial}`,
        // формируем значение 2 столбца №пп
        _violationSerial: violationSerial,
        // булев атрибут, чтобы знать какое мероприятие в группе является последним,
        // для отображения кнопки добавления нового мероприятия в таблице
        _isLastActionPlan: actionPlans.length - 1 === actionIndex,
        _maxActionPlanSerial: maxActionPlanSerial,
        // рассчет row span для 1 столбца №пп
        _rowSpanPointColumn:
          violationIndex === 0 && actionIndex === 0 ? rowSpanPointColumn : 1,
        // рассчет row span для 2 столбца № подпункта
        _rowSpanSubPointColumn: actionIndex === 0 ? actionPlans.length : 1,
      };
    }
  );

  return adjustedActionsPlans;
};

// получить максимальный Serial из списка мероприятий
const getMaxActionPlanSerial = (actionPlans: IActionPlanCard[]) => {
  return actionPlans.reduce((acc, actionPlan) => {
    const serial = actionPlan.serial ?? 0;
    return serial > acc ? serial : acc;
  }, 0);
};

const getNumberOfAllActions = (violations: IViolation[]) => {
  return violations.reduce((acc, violation) => {
    const actionsCount = violation.actionPlan.length;
    if (actionsCount) {
      return acc + actionsCount;
    }
    return acc + 1 + actionsCount;
  }, 0);
};

const transformGroupedObject = (groupedObject: Dictionary<IViolation[]>) => {
  // Create items array
  var items = Object.keys(groupedObject).map(function (key) {
    return [key, groupedObject[key]];
  });

  // Sort the array based on the second element
  const list = items.sort(function (first, second) {
    const t1 = second[1][0] as IViolation;
    const t2 = first[1][0] as IViolation;
    const p1 = t1.sortOrder;
    const p2 = t2.sortOrder;
    return p2 - p1;
  });
  return _.reduce(
    list,
    (acc, violations, key) => {
      const v = violations[1] as IViolation[];
      return {
        ...acc,
        [key]: {
          violations: v,
          // количество всех мероприятий в группе у каждого нарушения
          numberOfAllGroupActions: getNumberOfAllActions(v),
        },
      };
    },
    {}
  );
};

// маппер нарушений
export const mapViolations = (violations: IViolation[]) => {
  // группируем нарушения по атрибуту areaOfResponsibility
  const groupedObjectByAreaOfResponsibility = _.groupBy(
    violations,
    "areaOfResponsibility"
  );

  // собираем данные для таблицы плана мероприятий
  const data = _.reduce(
    groupedObjectByAreaOfResponsibility,
    (acc, value: IViolation[], key) => {
      // группируем нарушения по атрибуту identifiedViolationsSerial
      const groupedObject = _.groupBy(value, "identifiedViolationsSerial");

      const adjustedGroupedObject = transformGroupedObject(groupedObject);

      // маппим сгруппированный объект
      const adjustedOrderedObject = _.reduce(
        adjustedGroupedObject,
        (adjustedOrderedObjectAcc, group: IGroupedObject) => {
          const adjustedViolations = group.violations.reduce(
            (adjustedViolationsAcc, violation: IViolation, violationIndex) => {
              // маппим мероприятия
              const actionsPlans = mapActionPlans(
                violation,
                violationIndex,
                group.numberOfAllGroupActions
              );

              return [...adjustedViolationsAcc, ...actionsPlans];
            },
            []
          );

          return [...adjustedOrderedObjectAcc, ...adjustedViolations];
        },
        []
      );

      return [
        ...acc,
        { _fullWidthRowName: key, _isFullWidthRow: true },
        ...adjustedOrderedObject,
      ];
    },
    []
  );

  return data;
};

// маппер для рекомендаций
export const mapRecommendations = (
  recommendations: IRecommendationWithActionPlanModel[]
) => {
  const data = recommendations.reduce(
    (acc, recommendation, recommendationIndex) => {
      const actionsPlans = mapRecommendationActionPlans(
        recommendation,
        recommendationIndex
      );

      return [...acc, ...actionsPlans];
    },
    []
  );

  return data;
};

// маппер мероприятий рекомендации
export const mapRecommendationActionPlans = (
  recommendation: IRecommendationWithActionPlanModel,
  recommendationIndex: number
) => {
  const adjustedRecommendation = transformNameOfObjectKeys<
    IRecommendationWithActionPlanModel,
    "recommendation"
  >(recommendation, "recommendation");

  const actionPlans = recommendation.actionPlan;

  if (!actionPlans.length) {
    return [
      {
        ...adjustedRecommendation,
        // булев атрибут, чтобы знать какое мероприятие в группе является последним,
        // для отображения кнопки добавления нового мероприятия в таблице
        _isLastActionPlan: true,
        _maxActionPlanSerial: 0,
        // рассчет row span для 1 столбца №пп
        _recommendationRowSpan: 1,
        _isFirstRowWithRowSpan: false,
      },
    ];
  }

  // находим максимальный Serial среди всех мероприятий нарушения
  // нужен для отправки передачи в параметры при создании
  // нового мероприятия
  const maxActionPlanSerial = getMaxActionPlanSerial(actionPlans);
  const actionsPlansLength = actionPlans.length;

  const adjustedActionsPlans = actionPlans.map(
    (actionPlan: IActionPlanCard, actionIndex) => {
      const adjustedActionPlan = transformNameOfObjectKeys<
        IActionPlanCard,
        "actionPlan"
      >(actionPlan, "actionPlan");

      return {
        ...adjustedRecommendation,
        ...adjustedActionPlan,
        // формируем значение столбца(строку) № мероприятия - берем атрибуты
        _actionPlanSerial: `${recommendation.serial}.${actionPlan.serial}`,
        // булев атрибут, чтобы знать какое мероприятие в группе является последним,
        // для отображения кнопки добавления нового мероприятия в таблице
        _isLastActionPlan: actionsPlansLength - 1 === actionIndex,
        _maxActionPlanSerial: maxActionPlanSerial,
        // рассчет row span для 1 столбца №пп
        _recommendationRowSpan: actionIndex === 0 ? actionsPlansLength : 1,
        _isFirstRowWithRowSpan: recommendationIndex === 0 && actionIndex === 0,
      };
    }
  );

  return adjustedActionsPlans;
};
