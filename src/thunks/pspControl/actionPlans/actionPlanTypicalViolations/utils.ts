import _ from "lodash";
import { ITypicalViolationsForPlanCardWithActionPlanModel } from "slices/pspControl/actionPlanTypicalViolations/types";
import { IActionPlanCardModel } from "slices/pspControl/eliminationOfTypicalViolations/types";
import { RemapObjectKeys } from "types";
import { sortObjectByKeys, transformNameOfObjectKeys } from "utils";

// получить кол-во всех мероприятий
const getNumberOfAllActions = (
  violations: ITypicalViolationsForPlanCardWithActionPlanModel[]
) => {
  return violations.reduce((acc, violation) => {
    const actionsCount = violation.actionPlan.length;
    if (actionsCount) {
      return acc + actionsCount;
    }
    return acc + 1 + actionsCount;
  }, 0);
};

// маппер нарушений
export const mapViolations = (
  violations: ITypicalViolationsForPlanCardWithActionPlanModel[]
) => {
  // группируем нарушения по атрибуту identifiedTypicalViolationSerial
  const groupedObjectByIdentifiedTypicalViolationSerial = _.groupBy(
    violations,
    "groupField"
  );

  // собираем данные для таблицы
  const data = _.reduce(
    groupedObjectByIdentifiedTypicalViolationSerial,
    (
      acc,
      typicalViolations: ITypicalViolationsForPlanCardWithActionPlanModel[],
      identifiedTypicalViolationSerial
    ) => {
      // получаем кол-во мероприятий в во всех нарушениях группы для рассчета row span
      const numberOfAllActions = getNumberOfAllActions(typicalViolations);

      const adjustedTypicalViolations = typicalViolations.reduce(
        (typicalViolationsAcc, typicalViolation, typicalViolationIndex) => {
          // ремапим ключи нарушения
          const adjustedTypicalViolation = transformNameOfObjectKeys<
            ITypicalViolationsForPlanCardWithActionPlanModel,
            "typicalViolations"
          >(typicalViolation, "typicalViolation");

          // маппим мероприятия
          const adjustedActionPlans = mapActionPlans(
            typicalViolation.actionPlan,
            adjustedTypicalViolation,
            typicalViolation.typicalViolationSerial,
            typicalViolation,
            numberOfAllActions,
            typicalViolationIndex,
            typicalViolations
          );

          return [...typicalViolationsAcc, ...adjustedActionPlans];
        },
        []
      );

      return [...acc, ...adjustedTypicalViolations];
    },
    []
  );

  return data;
};

// маппер мероприятий
const mapActionPlans = (
  actionPlan: IActionPlanCardModel[],
  typicalViolation: RemapObjectKeys<
    ITypicalViolationsForPlanCardWithActionPlanModel,
    "typicalViolations"
  >,
  typicalViolationSerial: string,
  origEntity: ITypicalViolationsForPlanCardWithActionPlanModel,
  numberOfAllActions: number,
  typicalViolationIndex: number,
  typicalViolations: ITypicalViolationsForPlanCardWithActionPlanModel[]
) => {
  const actionPlanLength = actionPlan.length;

  if (!actionPlanLength) {
    return [
      {
        ...typicalViolation,
        // булев атрибут, для отображения кнопки добавления нового мероприятия в таблице
        _isLastActionPlan: true,
        // максимальный Serial при пустом массиве мероприятий у нарушения
        _maxActionPlanSerial: 0,
        // row span для 1 столбца №пп
        _identifiedTypicalViolationRowSpan:
          typicalViolationIndex === 0 ? numberOfAllActions : 1,
        // row span для 2, 3, 4 столбцов № подпункта, Содержание нарушения, Требование НД
        _typicalViolationSerialRowSpan: 1,
        // булев атрибут, для отображения кнопки изменения порядка
        _isFirstActionPlan: false,
        // массив всех нарушений(для работы модального окна изменения порядка)
        _typicalViolations: typicalViolations,
        // сущность оригинального объекта ITypicalViolationsForPlanCardWithActionPlanModel
        _origEntity: origEntity,
      },
    ];
  }

  // находим максимальный Serial среди всех мероприятий нарушения
  // нужен для отправки передачи в параметры при создании
  // нового мероприятия
  const actionPlanWithMaxSerial = _.maxBy(actionPlan, "serial");

  const adjustedActionsPlans = actionPlan.map(
    (actionPlan: IActionPlanCardModel, actionIndex) => {
      // ремапим ключи мероприятия
      const adjustedActionPlan = transformNameOfObjectKeys<
        IActionPlanCardModel,
        "actionPlan"
      >(actionPlan, "actionPlan");

      return {
        ...typicalViolation,
        ...adjustedActionPlan,
        // формируем значение столбца(строку) № мероприятия - берем атрибуты
        _actionPlanSerial: `${typicalViolationSerial}.${actionPlan.serial}`,
        // формируем значение 2 столбца №пп
        _typicalViolationSerial: typicalViolationSerial,
        // булев атрибут, чтобы знать какое мероприятие в группе является последним,
        // для отображения кнопки добавления нового мероприятия в таблице
        _isLastActionPlan: actionPlanLength - 1 === actionIndex,
        // максимальный Serial в массиве мероприятий
        _maxActionPlanSerial: actionPlanWithMaxSerial?.serial || 0,
        // row span для 1 столбца №пп
        _identifiedTypicalViolationSerialRowSpan:
          typicalViolationIndex === 0 && actionIndex === 0
            ? numberOfAllActions
            : 1,
        // row span для 2, 3, 4 столбцов № подпункта, Содержание нарушения, Требование НД
        _typicalViolationSerialRowSpan:
          actionIndex === 0 ? actionPlanLength : 1,
        // сущность оригинального объекта ITypicalViolationsForPlanCardWithActionPlanModel
        _origEntity: origEntity,
        // булев атрибут, для отображения кнопки изменения порядка
        _isFirstActionPlan: typicalViolationIndex === 0 && actionIndex === 0,
        // массив всех нарушений(для работы модального окна изменения порядка)
        _typicalViolations: typicalViolations,
      };
    }
  );

  return adjustedActionsPlans;
};
