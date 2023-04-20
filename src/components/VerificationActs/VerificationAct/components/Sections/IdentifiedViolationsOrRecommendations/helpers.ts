import { ITooltipParams, ValueGetterParams } from "ag-grid-community";
import _ from "lodash";
import {
  GroupedViolationByArea,
  IViolationListModel,
} from "slices/verificationActs/verificationAct/types";
import { SidePageContextProps } from "../../Provider";

export const getViolationsByAreaGroup = (
  area: string,
  violation: IViolationListModel[]
) => {
  return violation.filter((item) => item.areaOfResponsibility === area);
};

export const groupdViolationsCell = (item: IViolationListModel): any => {
  const rows = [
    ...item.violations.reduce((acc: any, v: any, index) => {
      const row = [
        ...acc,
        {
          ...v,
          ...item,
          id: item.id,
          isRow:
            (v as any).identifiedViolationsId !== acc[index - 1]?.violationId ||
            index === 0,
          violationId: item.id,
          serial: `${item.serial}.${v.serial}`,
          serialMain: item.serial,
          isDuplicate: item.isDuplicate,
        },
      ];

      return row;
    }, []),
  ];

  return rows;
};

export const groupedViolationsRowsByCell = (
  list: IViolationListModel[]
): any[] => {
  const updated = list
    .map((item, indexViolations) => {
      const rows = groupdViolationsCell(item);

      if (
        item.areaOfResponsibility !==
        list[indexViolations - 1]?.areaOfResponsibility
      ) {
        return [
          {
            _isFullWidthRow: true,
            _fullWidthRowName: item.areaOfResponsibility,
            ...item,
          },
          ...rows,
        ];
      }

      return rows;
    })
    .flat();

  return updated;
};

export const getGroupedTableViolations = (params: {
  violations: GroupedViolationByArea[];
}) => {
  const list: IViolationListModel[] = params.violations
    .map((item) => item.violations)
    .flat();

  const updated = groupedViolationsRowsByCell(list);

  return updated;
};

export const siknLabRsuValueGetter = (params: ValueGetterParams) => {
  const siknLabRsu = params.data.siknLabRsu;

  if (Array.isArray(siknLabRsu) && siknLabRsu.length) {
    const siknLabRsuNames = siknLabRsu.map((s) => s.siknLabRsuName);
    return siknLabRsuNames.join(", ");
  }

  return "";
};

export const siknLabRsuTooltipValueGetter = (params: ITooltipParams) => {
  const siknLabRsu = params.data.siknLabRsu;

  if (Array.isArray(siknLabRsu) && siknLabRsu.length) {
    const siknLabRsuNames = siknLabRsu.map((s) => s.siknLabRsuName);
    return siknLabRsuNames.join(", ");
  }

  return params.value;
};

// хелпер для получения корректного номера нарушения при изменеии зоны ответственности
export const getAdjustedSerial = (
  values,
  modalsState: SidePageContextProps,
  identifiedViolationsOrRecommendations: GroupedViolationByArea[]
) => {
  const isAreaOfResponsibilityChanged =
    values.areaOfResponsibility !==
    modalsState.modal.payload.areaOfResponsibility;

  if (isAreaOfResponsibilityChanged) {
    const violations =
      identifiedViolationsOrRecommendations
        .find((v) => v.areaOfResponsibility === values.areaOfResponsibility)
        ?.violations?.flat() || [];

    const maxSerial = _.maxBy(violations, (item) => item.serial)?.serial || 0;

    return maxSerial + 1;
  }

  return values.serial;
};
