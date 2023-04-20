import React, { FC, useState } from "react";

import { Tree, Input } from "antd";
import { loopOperandsTree, onOperandsTreeChange } from "./utils";
import { SqlTree } from "../../classes/SqlTree";
import { DataNode, EventDataNode } from "antd/lib/tree";
import { OperandsTreeItem } from "../../api/responses/get-operands-tree.response";

const { Search } = Input;

interface IProps {
  onSelect: (
    keys: string[],
    info: {
      event: "select";
      selected: boolean;
      node: EventDataNode;
      selectedNodes: DataNode[];
      nativeEvent: MouseEvent;
    }
  ) => void;
  treeData: OperandsTreeItem[];
  checkable?: boolean;
  checkedKeys?: string[];
  onCheck?: (keys: string[]) => void;
  currentNodeKey?: string;
  withStatus?: boolean;
}

export const OprerandsTree: FC<IProps> = ({
  onSelect,
  treeData,
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
    filteredTreeData: treeData,
    ownedType: null,
    loading: true,
  });

  const [searchLoading, setSearchLoading] = useState(false);

  const onExpand = (expandedKeys: Array<string>) => {
    setTreeState((prev) => ({
      ...prev,
      expandedKeys,
      autoExpandParent: false,
    }));
  };

  /*   const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTreeState((prev) => ({
      ...prev,
      searchValue: value,
    }));
  }; */

  const onSearch = (value: string) => {
    onOperandsTreeChange(value, treeData, setTreeState);
  };

  return (
    <div>
      <Search
        style={{ marginBottom: 8 }}
        placeholder="Поиск"
        onSearch={onSearch}
        enterButton
        //onChange={handleOnChange}
      />
      <Tree
        onExpand={onExpand}
        expandedKeys={treeState.expandedKeys}
        autoExpandParent={treeState.autoExpandParent}
        treeData={loopOperandsTree(
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
