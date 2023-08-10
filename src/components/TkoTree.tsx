import React, { useEffect, useState } from "react";
import axios from "axios";
import { SqlTree } from "../classes/SqlTree";
import { Tree } from "antd";
import { apiBase } from "utils";

interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

interface ITkoTreeProps {
  className?: string;
}

const initTreeData: DataNode[] = [
  // {
  //   title: 'Tree Node',
  //   key: '0',
  //   isLeaf: true
  // },
];

const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
  list.map((node) => {
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

const TkoTree: React.FC<ITkoTreeProps> = (props) => {
  const { className } = props;

  const [treeData, setTreeData] = useState(initTreeData);

  const onLoadData = async ({ key, children }: any) => {
    if (children) {
      return;
    }

    const result = await axios.get<Array<SqlTree>>(`${apiBase}/get-tkotree?parentId=${key}`);

    setTreeData((origin) => updateTreeData(origin, key, result.data));
  };  

  useEffect(() => {
    // получаем первую ноду при загрузке, обращаясь к процедуре с parentId null
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
              loadData={onLoadData}
              treeData={treeData}
              defaultExpandedKeys={defaultExpandedKeys}
            />
          )
        : (
            'Загрузка дерева...'
          )
      }    
    </div>
  );
}

export default TkoTree;