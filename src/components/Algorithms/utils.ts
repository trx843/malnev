import { SqlTree } from "../../classes/SqlTree";
import { RowClassRules } from "../../interfaces";
import { AlgorithmStatuses } from "./enums";

export const returnRowClassRules = (): RowClassRules => {
  return {
    "algorithm-table_good": function (params) {
      return params.data.status === AlgorithmStatuses.Good;
    },

    "algorithm-table_danger": function (params) {
      return params.data.status === AlgorithmStatuses.Danger;
    },

    "algorithm-table_warning": function (params) {
      return params.data.status === AlgorithmStatuses.Warning;
    },

    "algorithm-table_failed": function (params) {
      return params.data.status === AlgorithmStatuses.Failed;
    },
  };
};

export const returnCheckedKeys = (treeData: SqlTree[]): string[] => {
  const res: string[] = [];

  const cb = (treeNode: SqlTree) => {
    if (treeNode.enabled) res.push(treeNode.key);
    treeNode.children && treeNode.children.forEach(cb);
  };
  treeData.forEach(cb);
  return res;
};

