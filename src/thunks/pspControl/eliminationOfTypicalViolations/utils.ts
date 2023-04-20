import _ from "lodash";
import { RemapObjectKeys } from "types";
import { transformNameOfObjectKeys } from "utils";
import {
  IActionPlanCardModel,
  IIdentifiedTypicalViolationsWithEliminationModel,
  ITypicalViolationsWithActionPlanModel,
} from "../../../slices/pspControl/eliminationOfTypicalViolations/types";

// маппер типовых нарушений
export const mapIdentifiedTypicalViolationsWithElimination = (
  identifiedTypicalViolations: IIdentifiedTypicalViolationsWithEliminationModel[]
) => {
  // группируем выявленные нарушения по атрибуту actName
  const groupedObjectBySiknLabRsuType = _.groupBy(
    identifiedTypicalViolations,
    "siknLabRsuType"
  );

  // собираем данные для таблицы выявленные нарушения
  const data = mapGroupedObjectBySiknLabRsuType(groupedObjectBySiknLabRsuType);

  return data;
};

const mapGroupedObjectBySiknLabRsuType = (
  groupedObjectBySiknLabRsuType: _.Dictionary<
    IIdentifiedTypicalViolationsWithEliminationModel[]
  >
) => {
  const data = _.reduce(
    groupedObjectBySiknLabRsuType,
    (
      acc,
      // массив типовых нарушений группы
      identifiedTypicalViolationsOfGroup,
      // название группы
      groupName
    ) => {
      // группируем выявленные нарушения группы по атрибуту identifiedViolationsSerial
      const groupedObjectBySerial = _.groupBy(
        identifiedTypicalViolationsOfGroup,
        "identifiedViolationsSerial"
      );

      // собираем данные по каждому выявленному нарушению
      const identifiedTypicalViolationsData = mapGroupedObjectBySerial(
        groupedObjectBySerial
      );

      return [
        ...acc,
        // данные групповой строки
        {
          _isFullWidthRow: true,
          _fullWidthCellName: groupName,
        },
        ...identifiedTypicalViolationsData,
      ];
    },
    []
  );

  return data;
};

const mapGroupedObjectBySerial = (
  groupedObjectBySerial: _.Dictionary<
    IIdentifiedTypicalViolationsWithEliminationModel[]
  >
) => {
  const data = _.reduce(
    groupedObjectBySerial,
    (acc, identifiedTypicalViolations) => {
      // считаем кол-во мероприятий в каждом нарушении группы
      const numberActionPlansInGroup = getNumberActionPlansInGroup(
        identifiedTypicalViolations
      );

      // собираем данные по каждому выявленному нарушению
      const identifiedTypicalViolationsData =
        mapGroupIdentifiedTypicalViolations(
          identifiedTypicalViolations,
          numberActionPlansInGroup
        );

      return [...acc, ...identifiedTypicalViolationsData];
    },
    []
  );

  return data;
};

const getNumberActionPlansInGroup = (
  identifiedTypicalViolationsOfGroup: IIdentifiedTypicalViolationsWithEliminationModel[]
) => {
  return identifiedTypicalViolationsOfGroup.reduce(
    (count, identifiedTypicalViolation) => {
      const violations =
        identifiedTypicalViolation.typicalViolationsWithActionPlan;

      const numberOfActionsPlansInAllViolations = violations.reduce(
        (actionPlansInAllViolationsCount, violation) => {
          const actionPlans = violation.actionPlan;
          const actionsPlansCount = actionPlans.length || 1;

          return actionPlansInAllViolationsCount + actionsPlansCount;
        },
        0
      );

      return count + (numberOfActionsPlansInAllViolations || 1);
    },
    0
  );
};

const mapGroupIdentifiedTypicalViolations = (
  identifiedTypicalViolations: IIdentifiedTypicalViolationsWithEliminationModel[],
  numberActionPlansInGroup: number
) => {
  const data = identifiedTypicalViolations.reduce(
    (acc, identifiedTypicalViolation, identifiedTypicalViolationIndex) => {
      const adjustedIdentifiedTypicalViolation = transformNameOfObjectKeys<
        IIdentifiedTypicalViolationsWithEliminationModel,
        "identifiedTypicalViolation"
      >(identifiedTypicalViolation, "identifiedTypicalViolation");

      const adjustedTypicalViolations = mapTypicalViolations(
        adjustedIdentifiedTypicalViolation,
        identifiedTypicalViolation.typicalViolationsWithActionPlan,
        identifiedTypicalViolationIndex,
        numberActionPlansInGroup
      );

      return [...acc, ...adjustedTypicalViolations];
    },
    []
  );

  return data;
};

// маппер нарушений
const mapTypicalViolations = (
  identifiedTypicalViolation: RemapObjectKeys<
    IIdentifiedTypicalViolationsWithEliminationModel,
    "identifiedTypicalViolation"
  >,
  violations: ITypicalViolationsWithActionPlanModel[],
  identifiedViolationIndex: number,
  numberActionPlansInGroup: number
) => {
  if (!violations.length) {
    return [
      {
        ...identifiedTypicalViolation,
        _rowSpanIdentifiedTypicalViolation: 1,
        _rowSpanTypicalViolation: 1,
        _isSelectedRow: true,
      },
    ];
  }

  const data = violations.reduce((acc, violation, violationIndex) => {
    const adjustedTypicalViolation = transformNameOfObjectKeys<
      ITypicalViolationsWithActionPlanModel,
      "typicalViolation"
    >(violation, "typicalViolation");

    const adjustedActionPlans = mapActionPlans(
      identifiedTypicalViolation,
      adjustedTypicalViolation,
      violation.actionPlan,
      identifiedViolationIndex,
      numberActionPlansInGroup,
      violationIndex
    );

    return [...acc, ...adjustedActionPlans];
  }, []);

  return data;
};

// маппер мероприятий
const mapActionPlans = (
  identifiedTypicalViolation: RemapObjectKeys<
    IIdentifiedTypicalViolationsWithEliminationModel,
    "identifiedTypicalViolation"
  >,
  typicalViolation: RemapObjectKeys<
    ITypicalViolationsWithActionPlanModel,
    "typicalViolation"
  >,
  actionPlan: IActionPlanCardModel[],
  identifiedViolationIndex: number,
  numberActionPlansInGroup: number,
  violationIndex: number
) => {
  const actionPlansLength = actionPlan.length;

  if (!actionPlansLength) {
    return [
      {
        ...identifiedTypicalViolation,
        ...typicalViolation,
        _rowSpanIdentifiedTypicalViolation:
          identifiedViolationIndex === 0 && violationIndex === 0
            ? numberActionPlansInGroup
            : 1,
        _rowSpanTypicalViolation: 1,
        _isSelectedRow: identifiedViolationIndex === 0 && violationIndex === 0,
      },
    ];
  }

  const data = actionPlan.map((action, actionIndex) => {
    const adjustedAction = transformNameOfObjectKeys<
      IActionPlanCardModel,
      "actionPlan"
    >(action, "actionPlan");

    return {
      ...identifiedTypicalViolation,
      ...typicalViolation,
      ...adjustedAction,
      _rowSpanIdentifiedTypicalViolation:
        identifiedViolationIndex === 0 &&
        violationIndex === 0 &&
        actionIndex === 0
          ? numberActionPlansInGroup
          : 1,
      _rowSpanTypicalViolation:
        violationIndex === 0 && actionIndex === 0 ? actionPlansLength : 1,
      _isSelectedRow:
        identifiedViolationIndex === 0 &&
        violationIndex === 0 &&
        actionIndex === 0,
    };
  });

  return data;
};
