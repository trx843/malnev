import { OperandsTreeItem } from "../../api/responses/get-operands-tree.response";
import { TreeStatusColors, TreeStatuses } from "../../enums";
import { TreeItem } from "../shared/TreeItem";

export const loopOperandsTree = (
  data: OperandsTreeItem[],
  searchValue: string,
  withStatus?: boolean
): OperandsTreeItem[] =>
  data.map((item: OperandsTreeItem): any => {
    const index = item.title.toLowerCase().indexOf(searchValue.toLowerCase());
    const beforeStr = item.title.substring(0, index);
    const afterStr = item.title.substring(index + searchValue.length);
    const searchStr = item.title.substring(index, index + searchValue.length);
    const selectedNodeClass = "site-tree-search-value";
    const title =
      index > -1 ? (
        <TreeItem
          withStatus={withStatus}
          background={
            item.enabled || item.enabled === null
              ? TreeStatusColors[TreeStatuses[item.status]]
              : TreeStatusColors.Disabled
          }
          name={
            <span>
              {beforeStr}
              <span className={selectedNodeClass}>{searchStr}</span>
              {afterStr}
            </span>
          }
        />
      ) : (
        <TreeItem
          name={item.title}
          withStatus={withStatus}
          background={
            item.enabled || item.enabled === null
              ? TreeStatusColors[TreeStatuses[item.status]]
              : TreeStatusColors.Disabled
          }
        />
      );

    if (item.children) {
      return {
        id: item.key,
        nodeId: item.key,
        title,
        key: item.key,
        status: item.status,
        item,
        children: loopOperandsTree(item.children, searchValue, withStatus),
        pos: item.elementId,
      };
    }

    return {
      id: item.key,
      nodeId: item.key,
      title,
      key: item.key,
      status: item.status,
      pos: item.elementId,
      item,
    };
  });

interface DataList {
  key: string;
  title: string;
}

const returnDataList = (treeData: Array<OperandsTreeItem>) => {
  const dataList = [] as DataList[];

  generateList(treeData, dataList);

  return dataList;
};

const generateList = (
  data: Array<OperandsTreeItem>,
  dataList: Array<DataList>
) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    const { title } = node;
    dataList.push({ key, title: title });
    if (node.children.length !== 0) {
      generateList(node.children, dataList);
    }
  }
};

const getParentKey = (key: string, tree: Array<OperandsTreeItem>): string => {
  let parentKey: string = "";
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: { key: string }) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

export const onOperandsTreeChange = async (
  searchValue: string,
  treeData: OperandsTreeItem[],
  setTreeState: (prev: any) => void
) => {
  let tree: Array<OperandsTreeItem> = treeData;
  const dataList: DataList[] = returnDataList(treeData);
  const value = searchValue.toLowerCase();
  const expandedKeys = dataList
    .map((item) => {
      if (item.title.toLowerCase().indexOf(value) > -1) {
        return getParentKey(item.key, tree);
      }
      return "";
    })
    .filter((item, i, self) => item && self.indexOf(item) === i);

  if (value) {
    const hasSearchTerm = (n: string) => n.toLowerCase().indexOf(value) !== -1;
    const filterData = (
      arr: Array<OperandsTreeItem>
    ): Array<OperandsTreeItem> => {
      return arr.filter(
        (n: OperandsTreeItem) =>
          hasSearchTerm(n.title) || filterData(n.children).length > 0
      );
    };
    const filteredData = (
      arr: Array<OperandsTreeItem>
    ): Array<OperandsTreeItem> =>
      filterData(arr).map((n: OperandsTreeItem) => {
        return {
          ...n,
          children:
            filteredData(n.children).length > 0
              ? filteredData(n.children)
              : n.children,
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
