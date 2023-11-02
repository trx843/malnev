import React, { Key, useEffect, useState } from "react";
import axios from "axios";
import { SqlTree } from "../classes/SqlTree";
import { Spin, Tree } from "antd";
import { apiBase } from "utils";

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
  urlKey?: string;
  className?: string;
  onSelectCallback: (selectedKeys: Key[], info: any) => void;
}

// компонент дерева
const TkoTree: React.FC<ITkoTreeProps> = (props) => {
  const {
    urlKey,
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

  const allKey = "00000000-0000-0000-0000-000000000001";  // ID "Все"

  // const expandedKeys:string[] = [ allKey ];

  // const selectedKeys:string[] = [];

  if (urlKey) {
    // expandedKeys.push(urlKey);
    // selectedKeys.push(urlKey);
  }

  /* const loadedKeys = [
    "00000000-0000-0000-0000-000000000001", // Все
    "d194b42f-5ccb-11ec-8125-005056b4fde6", // ТН-Восток
    "33b608ef-648a-11ec-8129-005056b4db5d" // СИКН 101
  ]; */

  /* !!! todo сделать выбор пункта меню с родителями + раскрытие */
  return (
    <div className={className}>
      {treeData.length
        ? (
            <Tree
              treeData={treeData}
              loadData={onLoadDataCallback}
              onSelect={onSelectCallback}
              defaultExpandedKeys={[ allKey ]} // открыты по умолчанию
              defaultSelectedKeys={[ allKey ]} // выбраны по умолчанию
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