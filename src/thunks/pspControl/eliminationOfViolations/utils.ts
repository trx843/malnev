import _ from "lodash";
import {
  IActionPlanWithEliminationModel,
  IdentifiedViolationsWithActionPlanAndEliminationModel,
  ViolationWithActionPlanAndEliminationModel,
} from "../../../slices/pspControl/eliminationOfViolations/types";
import { Nullable } from "../../../types";

const transformNameOfObjectKeys = <T extends object>(
  obj: T,
  prefix: string
): any => {
  return _.reduce(
    obj,
    (acc, value, key) => {
      return {
        ...acc,
        [`${prefix}_${key}`]: value,
      };
    },
    {}
  );
};

const getArrLength = (arr: any[]) => {
  if (!arr.length) return 1;
  return arr.reduce((sum, elt) => sum + (elt.length ? elt.getLength() : 1), 0);
};

const getNumberActionPlansInGroup = (
  identifiedViolationsOfGroup: IdentifiedViolationsWithActionPlanAndEliminationModel[]
) => {
  return identifiedViolationsOfGroup.reduce((count, identifiedViolation) => {
    const violations = identifiedViolation.violations;

    const numberOfActionsPlansInAllViolations = violations.reduce(
      (actionPlansInAllViolationsCount, violation) => {
        const actionPlans = violation.actionPlans;
        const actionsPlansCount = getArrLength(actionPlans);

        return actionPlansInAllViolationsCount + actionsPlansCount;
      },
      0
    );

    return count + numberOfActionsPlansInAllViolations;
  }, 0);
};

// маппер выявленных нарушений
export const mapIdentifiedViolations = (
  identifiedViolations: IdentifiedViolationsWithActionPlanAndEliminationModel[]
) => {
  // группируем выявленные нарушения по атрибуту actName
  const groupedObjectByActName = _.groupBy(identifiedViolations, "actName");

  // собираем данные для таблицы выявленные нарушения
  const data = mapGroupedObjectByActName(groupedObjectByActName);

  return data;
};


// маппер коллекции нарушений по группам
const mapGroupedObjectByActName = (
  groupedObjectByActName: _.Dictionary<
    IdentifiedViolationsWithActionPlanAndEliminationModel[]
  >
) => {
  const data = _.reduce(
    groupedObjectByActName,
    (
      acc,
      // массив выявленных нарушений группы
      identifiedViolationsOfGroup,
      // название группы
      groupName
    ) => {
      // группируем выявленные нарушения группы по атрибуту groupField
      const groupedObjectBySerial = _.groupBy(
        identifiedViolationsOfGroup,
        "groupField"
      );

      // собираем данные по каждому выявленному нарушению
      const identifiedViolationsData = mapGroupedObjectBySerial(
        groupedObjectBySerial
      );

      // сортируем выявленные нарушения по typeMismatch
      const identifiedViolationsDataSortedBy = _.orderBy(
        identifiedViolationsData,
        "identifiedViolation_typeMismatch",
        "asc"
      );
      const firstIdentifiedViolations = _.head(identifiedViolationsOfGroup);

      return [
        ...acc,
        // данные групповой строки
        {
          _isFullWidthRow: true,
          _fullWidthCellName: groupName,
          _actId: firstIdentifiedViolations?.actId,
          _actName: firstIdentifiedViolations?.actName,
        },
        ...identifiedViolationsDataSortedBy,
      ];
    },
    []
  );
  return data;
};

const mapGroupedObjectBySerial = (
  groupedObjectBySerial: _.Dictionary<
    IdentifiedViolationsWithActionPlanAndEliminationModel[]
  >
) => {
  const data = _.reduce(
    groupedObjectBySerial,
    (acc, identifiedViolations) => {
      // считаем кол-во мероприятий в каждом нарушении группы
      const numberActionPlansInGroup =
        getNumberActionPlansInGroup(identifiedViolations);

      // собираем данные по каждому выявленному нарушению
      const identifiedViolationsData = mapGroupIdentifiedViolations(
        identifiedViolations,
        numberActionPlansInGroup
      );

      return [...acc, ...identifiedViolationsData];
    },
    []
  );

  return data;
};

const mapGroupIdentifiedViolations = (
  identifiedViolations: IdentifiedViolationsWithActionPlanAndEliminationModel[],
  numberActionPlansInGroup: number
) => {
  const data = identifiedViolations.reduce(
    (acc, identifiedViolation, identifiedViolationIndex) => {
      const { violations, ...restAttrs } = identifiedViolation;

      const adjustedRestAttrs = transformNameOfObjectKeys<
        Omit<
          IdentifiedViolationsWithActionPlanAndEliminationModel,
          "violations"
        >
      >(restAttrs, "identifiedViolation");

      const adjustedViolations = mapViolations(
        violations,
        adjustedRestAttrs,
        identifiedViolationIndex,
        numberActionPlansInGroup
      );

      return [...acc, ...adjustedViolations];
    },
    []
  );

  return data;
};

// маппер нарушений
const mapViolations = (
  violations: ViolationWithActionPlanAndEliminationModel[],
  identifiedViolation: any,
  identifiedViolationIndex: number,
  numberActionPlansInGroup: number
) => {
  if (!violations.length) {
    return [
      {
        ...identifiedViolation,
        _rowSpanViolation: 1,
        _rowSpanIdentifiedViolation:
          identifiedViolationIndex === 0 ? numberActionPlansInGroup : 1,
      },
    ];
  }

  const data = violations.reduce((acc, violation, violationIndex) => {
    const { actionPlans, ...restAttrs } = violation;

    const adjustedRestAttrs = transformNameOfObjectKeys<
      Omit<ViolationWithActionPlanAndEliminationModel, "actionPlans">
    >(restAttrs, "violation");

    const adjustedActionPlans = mapActionPlans(
      actionPlans,
      identifiedViolation,
      adjustedRestAttrs,
      identifiedViolationIndex,
      violationIndex,
      violation.serial,
      numberActionPlansInGroup
    );

    return [...acc, ...adjustedActionPlans];
  }, []);

  return data;
};

// маппер мероприятий
const mapActionPlans = (
  actionPlans: IActionPlanWithEliminationModel[],
  identifiedViolation: any,
  violation: any,
  identifiedViolationIndex: number,
  violationIndex: number,
  violationSerial: Nullable<string>,
  numberActionPlansInGroup: number
) => {
  const actionPlansLength = actionPlans.length;

  if (!actionPlansLength) {
    return [
      {
        ...identifiedViolation,
        ...violation,
        _rowSpanViolation: 1,
        _rowSpanIdentifiedViolation:
          identifiedViolationIndex === 0 && violationIndex === 0
            ? numberActionPlansInGroup
            : 1,
      },
    ];
  }

  const data = actionPlans.map((actionPlan, actionPlanIndex) => {
    const adjustedActionPlan =
      transformNameOfObjectKeys<IActionPlanWithEliminationModel>(
        actionPlan,
        "actionPlan"
      );
    return {
      ...identifiedViolation,
      ...violation,
      ...adjustedActionPlan,
      _actionPlan_serial: `${
        violationSerial ??
        identifiedViolation.identifiedViolation_identifiedViolationsSerial
      }.${actionPlan.serial}`,
      _rowSpanViolation: actionPlanIndex === 0 ? actionPlansLength : 1,
      _rowSpanIdentifiedViolation:
        identifiedViolationIndex === 0 &&
        violationIndex === 0 &&
        actionPlanIndex === 0
          ? numberActionPlansInGroup
          : 1,
    };
  });

  return data;
};
