import React, { FC, useEffect, useState } from "react";

import { Tree, Input } from "antd";
import { AlgorithmTreeViewData } from "./types";
import { DataNode, EventDataNode } from "antd/lib/tree";
import { onAlgorithmTreeChange, returnPreparedTreeData } from "./utils";
import { ServicesItem } from "../../api/responses/get-algorithm-tree.response";

const { Search } = Input;

interface IProps {
  onSelect?: (
    keys: string[],
    info: {
      event: "select";
      selected: boolean;
      node: EventDataNode;
      selectedNodes: DataNode[];
      nativeEvent: MouseEvent;
    }
  ) => void;
  autoExpandParent: boolean;
  treeData: ServicesItem[];
  checkable?: boolean;
  checkedKeys?: string[];
  onCheck?: (keys: string[], info: any) => void;
  currentNodeKey?: string;
  withStatus?: boolean;
}

export const AlgorithmTree: FC<IProps> = ({
  onSelect,
  treeData,
  autoExpandParent,
  checkable,
  checkedKeys,
  onCheck,
  currentNodeKey,
  withStatus,
}) => {
  const [treeState, setTreeState] = useState({
    expandedKeys: ["0", currentNodeKey ? currentNodeKey.toString() : "0"],
    searchValue: "",
    autoExpandParent: true,
    filteredTreeData: [] as ServicesItem[],
    ownedType: null,
    loading: true,
  });

  const onExpandHandle = (expandedKeys: Array<string>) => {
    setTreeState((prev) => ({
      ...prev,
      expandedKeys,
      autoExpandParent: false,
    }));
  };

  useEffect(() => {
    setTreeState((prev) => ({
      ...prev,
      filteredTreeData: treeData,
    }));
  }, [treeData]);

  const onSearch = (value: string) => {
    onAlgorithmTreeChange(value, treeData, setTreeState);
  };

  /*   const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTreeState((prev) => ({
      ...prev,
      searchValue: value,
    }));
  }; */

  return (
    <div>
      <Search
        style={{ marginBottom: 8 }}
        placeholder="Поиск"
        onSearch={onSearch}
        enterButton
      />
      <Tree
        onExpand={onExpandHandle}
        expandedKeys={treeState.expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={returnPreparedTreeData(
          treeState.filteredTreeData,
          treeState.searchValue,
          withStatus
        )}
        onSelect={onSelect}
        checkable={checkable}
        checkedKeys={checkedKeys || []}
        onCheck={onCheck}
      />
    </div>
  );
};
