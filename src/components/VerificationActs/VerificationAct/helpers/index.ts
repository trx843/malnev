import { format } from "date-fns";
import { VerificationActOptions } from "../../../../containers/VerificationActs/VerificationAct/types";
import { VerificationActOptionsStore } from "../../../../slices/verificationActs/verificationAct/types";

const FORMAT = "dd.MM.yyyy";

export const getFormatDate = (value: string | undefined) =>
  value && format(new Date(value), FORMAT);

export const selectOptionsByTypeAndId = <T = unknown>({
  id,
  memoizeOptions,
  type
}: {
  memoizeOptions: Record<string, VerificationActOptionsStore>;
  type: VerificationActOptions;
  id: string | null;
}): T => {
  if (!id) {
    return [] as any;
  }

  return (memoizeOptions[id]?.[type] as any) || ([] as any);
};

export const groupedTypicalViolationsRowsByCell = (
  list: ITypicalViolation[]
): any[] => {
  let resultArr = [] as any[];

  list.map((item, index) => {
    if (index === 0) {
      resultArr.push([{
        ...item,
        _isFullWidthRow: true,
        _fullWidthRowName: item.siknLabRsuTypeId === 3
          ? "Испытательные лаборатории нефти и нефтепродуктов"
          : "Приемо-сдаточные пункты нефти и нефтепродуктов",
      },
        item
      ])
    }
    if (index !== 0 && item.isRow) {
      if (item.siknLabRsuTypeId !== list[index - 1]['siknLabRsuTypeId']) {
        resultArr.push([{
          ...item,
          _isFullWidthRow: true,
          _fullWidthRowName: item.siknLabRsuTypeId === 3
            ? "Испытательные лаборатории нефти и нефтепродуктов"
            : "Приемо-сдаточные пункты нефти и нефтепродуктов",
        },
          item
        ])
      } else {
        resultArr.push(item)
      }
    }
    if (index !== 0 && !item.isRow) {
      resultArr.push(item)
    }
  })

  return resultArr.flat();
};

export interface ITypicalViolation {
  id: string;
  typicalViolationSerial: string;
  typicalViolationText: string;
  pointNormativeDocuments: string;
  actionPlan: IActionPlan[];
  identifiedViolationSerial: string;
  createdOn: string;
  typicalViolations: ITypicalViolation[];
  siknLabRsuTypeId: number;
  violationId: string;
  isRow: boolean;
}

export interface IActionPlan {
  id: string;
  serial: number;
  serialFull: null | string;
  eliminationText: string;
  eliminatedOn: null | string;
  actionText: null | string;
  fullNameExecutor: null | string;
  positionExecutor: null | string;
  fullNameController: null | string;
  positionController: null | string;
}