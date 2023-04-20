import isEmpty from "lodash/isEmpty";

import { TypicalPlanCardItem } from "../Sections/classes";
import { TypicalPlanCardFilterEntities } from "../../../../slices/pspControl/actionPlanTypicalViolations/types";

function sortData(data: TypicalPlanCardFilterEntities[]) {
  let arr: TypicalPlanCardFilterEntities[] = [];

  let ids = {};

  for (let i = 0; i < data.length; i++) {
    let id = data[i].identifiedTypicalViolationId;
    if (!ids[id]) {
      ids[id] = id;

      for (let j = i; j < data.length; j++) {
        if (data[j].identifiedTypicalViolationId === id) {
          arr.push(data[j]);
        }
      }
    }
  }

  return arr;
}

export const serializedTypicalPlanItems = (
  data: TypicalPlanCardFilterEntities[]
): TypicalPlanCardItem[] => {
  const sorted = sortData(data);

  const updated = sorted
    .map((entity) => {
      if (entity.actionPlan === null) {
        return null;
      }
      const actionPlan = entity.actionPlan || [];
      const common = data.filter(
        (violation) =>
          violation.identifiedTypicalViolationId ===
          entity.identifiedTypicalViolationId
      );
      const commonActionPlan = common
        .map((violation) => [...(violation.actionPlan || [])])
        .flat();

      if (isEmpty(entity.actionPlan)) {
        return {
          typicalViolationId: entity.id,
          _identifiedViolationsSerial: entity.identifiedTypicalViolationSerial,
          _violationSerial: "",
          _violationText: entity.typicalViolationText,
          _actionPlanSerial: "",
          actionText: "",
          eliminationText: "",
          identifiedViolationsId: entity.identifiedTypicalViolationId,
          actionPlan: [],
          planIndex: 0,
          plan: {},
        };
      }

      return actionPlan.reduce(
        (acc: any[], item, index) => [
          ...acc,
          {
            violationsId: entity.id,
            typicalViolationId: entity.id,
            identifiedTypicalViolationId: entity.identifiedTypicalViolationId,
            identifiedTypicalViolationSerial:
              entity.identifiedTypicalViolationSerial,
            _identifiedViolationsSerial:
              entity.identifiedTypicalViolationSerial,
            _violationSerial: `${entity.typicalViolationSerial}`,
            _violationText: entity.typicalViolationText,
            isRowSpanPlan:
              acc[index - 1]?.identifiedTypicalViolationId !==
              entity.identifiedTypicalViolationId,
            _actionPlanSerial: `${entity.typicalViolationSerial}.${item.serial}`,
            actionText: item.actionText,
            eliminationText: item.actionText,
            _pointNormativeDocuments: entity.pointNormativeDocuments,
            planIndex: index,
            plan: item,
            id: item.id,
            actionPlan: commonActionPlan,
            subLength: actionPlan.length,
          },
        ],
        []
      );
    }, [])
    .flat()
    .filter(Boolean) as any[];

  return updated.map((item, index) => {
    return {
      ...item,
      isRowSpan:
        updated[index - 1]?._identifiedViolationsSerial !==
        item._identifiedViolationsSerial,
    };
  }) as any[];
};
