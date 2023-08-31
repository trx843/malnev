import React, { Key, useEffect, useState } from "react";
import axios from "axios";
import { SqlTree } from "../classes/SqlTree";
import { Spin, Tree } from "antd";
import { apiBase } from "utils";

/*
interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
  path
}
*/

/*
const initTreeData: DataNode[] = [
  // {
  //   title: 'Tree Node',
  //   key: '0',
  //   isLeaf: true
  // },
];
*/

// функция обновления дерева
const updateTreeData = (list: SqlTree[], key: React.Key, children: SqlTree[]): SqlTree[] => {
  const treetData = list.map((node) => {
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

  return treetData;
};

// интерфейс пропсов TkoTree
interface ITkoTreeProps {
  className?: string;
  onSelectCallback: (selectedKeys: Key[], info: any) => void;
}

// компонент дерева
const TkoTree: React.FC<ITkoTreeProps> = (props) => {
  const {
    className,
    onSelectCallback
  } = props;

  const [treeData, setTreeData] = useState<SqlTree[]>([]);

  // фукнция загрузки внутренних элементов пункт дерева
  const onLoadDataCallback = async ({ key, children }: any) => {
    if (children) return;

    const result = await axios.get<Array<SqlTree>>(`${apiBase}/get-tkotree?parentId=${key}`);

    setTreeData((origin) => updateTreeData(origin, key, result.data));
  };  

  useEffect(() => {
    // первичная загрузка дерева
    axios
      .get<Array<SqlTree>>(`${apiBase}/get-tkotree?parentId=null`)
      .then((result) => {
        setTreeData(result.data);
      });
  }, []);

  // ключи открытых нод по умолчанию
  const defaultExpandedKeys = [
    "00000000-0000-0000-0000-000000000001" // ID "Все"
  ];

  return (
    <div className={className}>
      {treeData.length
        ? (
            <Tree
              treeData={treeData}
              loadData={onLoadDataCallback}
              onSelect={onSelectCallback}
              defaultExpandedKeys={defaultExpandedKeys} // открыты по умолчанию
              defaultSelectedKeys={defaultExpandedKeys} // выбраны по умолчанию
            />
          )
        : (
          <div style={{
            padding: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Spin />
          </div>
          )
      }    
    </div>
  );
}

export default TkoTree;