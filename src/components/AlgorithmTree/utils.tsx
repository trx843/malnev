import React from "react";
import { AlgorithmTreeViewData } from "./types";

import { ServicesItem } from "../../api/responses/get-algorithm-tree.response";
import { TreeItem } from "../shared/TreeItem";
import { TreeStatusColors, TreeStatuses } from "../../enums";

export const returnPreparedTreeData = (
  treeData: ServicesItem[],
  searchValue: string,
  withStatus?: boolean
): AlgorithmTreeViewData[] => {
  const preparedData: AlgorithmTreeViewData[] = treeData.map((item) => {
    const index = item.displayName
      .toLowerCase()
      .indexOf(searchValue.toLowerCase());
    const beforeStr = item.displayName.substring(0, index);
    const afterStr = item.displayName.substring(index + searchValue.length);
    const searchStr = item.displayName.substring(
      index,
      index + searchValue.length
    );
    const selectedNodeClass = "site-tree-search-value";

    return {
      title: (
        <TreeItem
          name={
            searchValue && index !== -1 ? (
              <span>
                {beforeStr}
                <span className={selectedNodeClass}>{searchStr}</span>
                {afterStr}
              </span>
            ) : (
              item.displayName
            )
          }
          background={TreeStatusColors[TreeStatuses[item.state]]}
          withStatus={withStatus}
        />
      ),
      name: item.displayName,
      key: item.id,
      state: item.state,

      children: item.analysisAlgorithms.map((algorithm) => {
        const name = algorithm.fullName || algorithm.name;
        const selectedNodeClass = "site-tree-search-value";
        const index = name.toLowerCase().indexOf(searchValue.toLowerCase());
        const beforeStr = name.substring(0, index);
        const afterStr = name.substring(index + searchValue.length);
        const searchStr = name.substring(index, index + searchValue.length);
        return {
          title: (
            <TreeItem
              withStatus={withStatus}
              name={
                searchValue && index !== -1 ? (
                  <span>
                    {beforeStr}
                    <span className={selectedNodeClass}>{searchStr}</span>
                    {afterStr}
                  </span>
                ) : (
                  name
                )
              }
              background={
                !algorithm.enabled
                  ? TreeStatusColors.Disabled
                  : TreeStatusColors[TreeStatuses[algorithm.state]]
              }
            />
          ),
          key: `${item.id}#${algorithm.id}`,
          name: algorithm.name,
          state: item.state,
          lastRunTime: algorithm.lastRunTime,
          algSetPointConfig: algorithm.algSetPointConfig,
        };
      }),
    };
  });

  return preparedData;
};

interface DataList {
  id: string;
  title: string;
}

const returnDataList = (treeData: Array<ServicesItem>) => {
  const dataList = [] as DataList[];

  generateList(treeData, dataList);

  return dataList;
};

const generateList = (data: Array<any>, dataList: Array<DataList>) => {
  for (let i = 0; i < data?.length; i++) {
    const node = data[i];
    const { id } = node;
    const title =  node.fullName || node.name || node.displayName;
    dataList.push({ id, title });
    if (node.analysisAlgorithms?.length !== 0) {
      generateList(node.analysisAlgorithms, dataList);
    }
  }
};

const getParentKey = (key: string, tree: Array<any>): string => {
  let parentKey: string = "";
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.analysisAlgorithms) {
      if (
        node.analysisAlgorithms.some((item: { id: string }) => item.id === key)
      ) {
        parentKey = node.id;
      } else if (getParentKey(key, node.analysisAlgorithms)) {
        parentKey = getParentKey(key, node.analysisAlgorithms);
      }
    }
  }
  return parentKey;
};

export const onAlgorithmTreeChange = async (
  searchValue: string,
  treeData: ServicesItem[],
  setTreeState: (prev: any) => void
) => {
  let tree: Array<ServicesItem> = treeData;
  const dataList: DataList[] = returnDataList(treeData);
  const value = searchValue.toLowerCase();
  const expandedKeys = dataList
    .map((item) => {
      if (item.title.toLowerCase().indexOf(value) > -1) {
        return getParentKey(item.id, tree);
      }
      return "";
    })
    .filter((item, i, self) => item && self.indexOf(item) === i);

  if (value) {
    const hasSearchTerm = (n: string) => n.toLowerCase().indexOf(value) !== -1;
    const filterData = (arr: Array<any>): Array<any> => {
      return arr?.filter(
        (n: any) =>
          hasSearchTerm(n.fullName || n.name || n.displayName) ||
          filterData(n.analysisAlgorithms)?.length > 0
      );
    };
    const filteredData = (arr: Array<any>): Array<any> =>
      filterData(arr)?.map((n: ServicesItem) => {
        return {
          ...n,
          analysisAlgorithms:
            filteredData(n.analysisAlgorithms)?.length > 0
              ? filteredData(n.analysisAlgorithms)
              : n.analysisAlgorithms,
        };
      });
    await setTreeState((prev: any) => ({
      ...prev,
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
      filteredTreeData: filteredData(treeData),
    }));
  } else {
    await setTreeState((prev: any) => ({
      ...prev,
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: false,
      filteredTreeData: treeData,
    }));
  }
};
