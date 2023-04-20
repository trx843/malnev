import moment from "moment";

export const initListFilter = {
  filter: {
    treeFilter: {
      nodePath: "all",
      isOwn: null
    }
  },
  rowCount: 0,
  pageIndex: 0,
  sortedField: "",
  isSortAsc: true
};

export const VERIFICATED_DATE_FROM = moment(new Date("2017-01-01"));

export const VERIFICATED_DATE_TO = moment(new Date());
