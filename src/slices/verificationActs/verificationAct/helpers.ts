import _ from 'lodash'
import {
  ActPage,
  GroupedViolationByArea,
  IViolationListModel,
  VerificationPage,
} from "./types";
import {
  VerificationActOptions,
  VerificationActSection,
} from "../../../containers/VerificationActs/VerificationAct/types";

export const createActPage = (page: VerificationPage | null): ActPage => ({
  [VerificationActSection.NumberOneSide]: {
    items: [],
    data: null,
    cached: false,
  },
  [VerificationActSection.Commission]: {
    items: [],
    data: null,
    cached: false,
  },
  [VerificationActSection.CompositionOfAppendicesToReport]: {
    items: [],
    data: null,
    cached: false,
  },
  [VerificationActSection.IdentifiedViolationsOrRecommendations]: {
    items: [],
    data: null,
    cached: false,
  },
  [VerificationActSection.OtherSides]: {
    items: [],
    data: null,
    cached: false,
  },
  [VerificationActSection.Recommendations]: {
    items: [],
    data: null,
    cached: false,
  },
  page,
});

export const createSectionPending = () => ({
  [VerificationActSection.NumberOneSide]: true,
  [VerificationActSection.Commission]: true,
  [VerificationActSection.CompositionOfAppendicesToReport]: true,
  [VerificationActSection.IdentifiedViolationsOrRecommendations]: true,
  [VerificationActSection.OtherSides]: true,
  [VerificationActSection.Recommendations]: true,
});

export const createOptions = () => ({
  [VerificationActOptions.OSUS]: [],
  [VerificationActOptions.AreaOfResponsibility]: [],
  [VerificationActOptions.ClassificationNumber]: [],
  [VerificationActOptions.SourceViolations]: ["Источник 1", "Источник 2"],
  [VerificationActOptions.CTO]: [],
  [VerificationActOptions.InspectionType]: [],
  [VerificationActOptions.SourceRemark]: [],
});

export const initListFilter = {
  filter: {
    treeFilter: {
      nodePath: "all",
      isOwn: null,
    },
  },
  rowCount: 0,
  pageIndex: 0,
  sortedField: "",
  isSortAsc: true,
};

export const getSortedViolationsByAreaGroup = (
  violation: IViolationListModel[]
): GroupedViolationByArea[] => {
  let groupedViolations: any[] = [];
  let areas = {};

  for (let i = 0; i < violation.length; i++) {
    const area = violation[i].areaOfResponsibility;

    if (!areas[area]) {
      areas[area] = area;
      let group: any = {
        areaOfResponsibility: area,
        violations: [],
      };
      for (let j = i; j < violation.length; j++) {
        if (violation[j].areaOfResponsibility === area) {
          group.violations.push(violation[j]);
        }
      }

      groupedViolations.push(group);
    }
  }
  return groupedViolations;
};

export const moveSerialsLeft = <T = Array<unknown & { serial: number }>>(
  items: Array<T & { serial: number }>,
  index: number
): Array<T> => {
  if (index < 0 || index > items.length - 1) {
    return items;
  }
  if (!Array.isArray(items)) {
    return [];
  }
  if (index === items.length - 1) {
    return items;
  }

  let updated = _.cloneDeep(items);
  

  for (let i = index; i < items.length; i++) {
    updated[i].serial = i;
  }

  return updated;
};
