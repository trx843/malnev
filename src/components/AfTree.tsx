import React, { FunctionComponent, Key, useEffect, useState } from "react";
import { Tree, Input, Spin, message } from "antd";
import axios from "axios";
import "../styles/app.css";
import { apiBase } from "../utils";
import StockOutlined from "@ant-design/icons/StockOutlined";
import DownOutlined from "@ant-design/icons/DownOutlined";
import { EventDataNode } from "antd/lib/tree";
import { AfObjectTypes, AfTreeNode } from "../classes/AfTreeNode";

const { Search } = Input;

interface IAfTreeProps {
  disableElements?: boolean;
  onSelectCallback?: (selectedKeys: Key[], info: any) => void;
}

const testTreeData = [
  {
    title: "parent 1",
    key: "1576ddd4-fa60-4a55-81fc-13f1d8e2b505",
    children: [
      {
        title: "parent 1-0",
        key:
          "1576ddd4-fa60-4a55-81fc-13f1d8e2b505-248cf058-18da-464a-b632-f1b743a891b7",
        children: [
          {
            title: "leaf",
            key:
              "1576ddd4-fa60-4a55-81fc-13f1d8e2b505-248cf058-18da-464a-b632-f1b743a891b7-a487d7a1-6a8f-4dc4-a215-5c6119a630bb",
            icon: <StockOutlined />,
          },
          {
            title: "test",
            key:
              "1576ddd4-fa60-4a55-81fc-13f1d8e2b505-248cf058-18da-464a-b632-f1b743a891b7-a3220312-e3e6-4364-948b-b96476616af5",
            icon: <StockOutlined />,
          },
          {
            title: "leaf",
            isLeaf: true,
            key:
              "1576ddd4-fa60-4a55-81fc-13f1d8e2b505-248cf058-18da-464a-b632-f1b743a891b7-c14f6a50-41ae-4c77-ab8b-0104a7e7c844",
            icon: <StockOutlined />,
          },
        ],
      },
      {
        title: "parent 1-1",
        key:
          "1576ddd4-fa60-4a55-81fc-13f1d8e2b505-4a4efd0b-579b-4fc3-962c-6a8e22eb3500",
        children: [
          {
            title: "leaf",
            key:
              "1576ddd4-fa60-4a55-81fc-13f1d8e2b505-4a4efd0b-579b-4fc3-962c-6a8e22eb3500-cc639615-9f2a-4a4a-ac4c-bacf240eb6fd",
            icon: <StockOutlined />,
          },
        ],
      },
      {
        title: "parent 1-2",
        key:
          "1576ddd4-fa60-4a55-81fc-13f1d8e2b505-a58767c4-3594-4c1e-8f9b-dbc0e7e8033f",
        children: [
          {
            title: "leaf",
            key:
              "1576ddd4-fa60-4a55-81fc-13f1d8e2b505-a58767c4-3594-4c1e-8f9b-dbc0e7e8033f-73c1fb0f-9613-4940-9e03-7054b263d7c9",
            icon: <StockOutlined />,
          },
          {
            title: "leaf",
            key:
              "1576ddd4-fa60-4a55-81fc-13f1d8e2b505-a58767c4-3594-4c1e-8f9b-dbc0e7e8033f-839f6684-3a7c-4941-b9c7-4c7d39bf8bb2",
            icon: <StockOutlined />,
          },
        ],
      },
    ],
  },
];

const getParentKey = (key: string, tree: Array<AfTreeNode>): string => {
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

const dataList: { key: string; title: string }[] = [];
const generateList = (data: Array<AfTreeNode>) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    const { title } = node;
    dataList.push({ key, title: title as string });
    if (node.children.length !== 0) {
      generateList(node.children);
    }
  }
};

let tree: Array<AfTreeNode> = [];

export const AfTree: FunctionComponent<IAfTreeProps> = (
  props: IAfTreeProps
) => {
  const [expandedKeys, setExpandedKeys] = useState<Array<React.Key>>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [treeData, setTreeData] = useState<Array<AfTreeNode>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchTreeData();
  }, []);

  const filterTreeData = (tree: Array<AfTreeNode>): Array<AfTreeNode> => {
    tree.forEach((x) => {
      switch (x.attributeType) {
        case AfObjectTypes.PiPoint:
          x.icon = <StockOutlined style={{ color: "#FF8A00" }} />;
          x.title = <span style={{ color: "#FF8A00" }}>{x.title}</span>;
          break;
        case AfObjectTypes.Element:
          x.disabled = props.disableElements ?? false;
          break;
        default:
          break;
      }
      if (x.children.length > 0) filterTreeData(x.children);
    });
    return tree;
  };

  const fetchTreeData = async () => {
    const result = await axios.get<Array<AfTreeNode>>(`${apiBase}/aftree`);
    filterTreeData(result.data);
    generateList(result.data);
    tree = result.data;
    setTreeData(result.data);
    setLoading(false);
  };

  const onExpand = (expandedKeys: Array<string>) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: any) => {
    const value = e.target.value?.toLowerCase();
    const expandedKeys = dataList
      .map((item) => {
        if (item.title.toLowerCase().indexOf(value) > -1) {
          return getParentKey(item.key, tree);
        }
        return "";
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    if (value) {
      const hasSearchTerm = (n: string) =>
        n.toLowerCase().indexOf(value) !== -1;
      const filterData = (arr: Array<AfTreeNode>): Array<AfTreeNode> => {
        return arr.filter(
          (n: AfTreeNode) =>
            hasSearchTerm(n.title as string) ||
            filterData(n.children).length > 0
        );
      };
      const filteredData = (arr: Array<AfTreeNode>): Array<AfTreeNode> =>
        filterData(arr).map((n: AfTreeNode) => {
          return {
            ...n,
            children: filteredData(n.children),
          };
        });

      setExpandedKeys(expandedKeys);
      setSearchValue(value);
      setAutoExpandParent(true);
      setTreeData(filteredData(tree));
    } else {
      setExpandedKeys([]);
      setSearchValue("");
      setAutoExpandParent(false);
      setTreeData(tree);
    }
  };

  const updateTreeData = (
    list: AfTreeNode[],
    key: React.Key,
    children: AfTreeNode[]
  ): AfTreeNode[] => {
    let t = list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });
    return t;
  };

  const onLoadData = (treeNode: EventDataNode) => {
    return new Promise<void>((resolve) => {
      if (treeNode.children && treeNode.children.length > 0) {
        resolve();
        return;
      }
      let key = treeNode.key as string;
      let keySplit = key.split("_");
      let nodeId = keySplit[keySplit.length - 1];
      if (nodeId !== "") {
        axios
          .get<Array<AfTreeNode>>(`${apiBase}/aftree/${nodeId}?key=${key}`)
          .then((result) => {
            filterTreeData(result.data);
            setTreeData((originTreeData) =>
              updateTreeData(originTreeData, treeNode.key, result.data)
            );
            resolve();
          })
          .catch((err) => {
            message.error("Ошибка загрузки дерева");
            resolve();
            return;
          });
      }
    });
  };

  const loop = (data: Array<AfTreeNode>): Array<AfTreeNode> =>
    data.map(
      (item: AfTreeNode): AfTreeNode => {
        const index = (item.title as string)
          .toLowerCase()
          .indexOf(searchValue.toLowerCase());
        const beforeStr = (item.title as string).substring(0, index);
        const afterStr = (item.title as string).substring(
          index + searchValue.length
        );
        const searchStr = (item.title as string).substring(
          index,
          index + searchValue.length
        );
        const newTitle =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchStr}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );

        if (item.children) {
          return {
            ...item,
            title: newTitle,
            children: loop(item.children),
          };
        }
        return {
          ...item,
          title: newTitle,
        };
      }
    );

  return (
    <>
      {loading ? (
        <div style={{ marginTop: 300, textAlign: "center" }}>
          <Spin />
        </div>
      ) : (
        <>
          {/*  <Search
            style={{ marginBottom: 8,  "100%" }}
            placeholder="Поиск"
            onChange={onChange}
          /> */}
          <Tree
            loadData={onLoadData}
            showIcon={true}
            switcherIcon={<DownOutlined />}
            defaultSelectedKeys={["0-1"]}
            onExpand={onExpand}
            onSelect={props.onSelectCallback}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={treeData}
          />
        </>
      )}
    </>
  );
};
