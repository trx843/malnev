import { Button, Col, Row, Spin, Tooltip, Tree } from "antd";
import React, { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import CaretDownOutlined from "@ant-design/icons/lib/icons/CaretDownOutlined";
import axios from "axios";
import { apiBase } from "../utils";
import { history } from "../history/history";

import {
  OrgStructInformation,
  OrgStructLinkTypes,
  OrgStructModel,
} from "../classes/OrgStructInformation";
import DynamicIcon from "./DynamicIcon";
import Search from "antd/lib/input/Search";

const TreeStyled = styled(Tree)`
  .ant-tree-treenode {
    width: 100%;
  }
  .ant-tree-node-content-wrapper {
    width: 100%;
  }
`;

export interface OrgTreeNode {
  children: OrgTreeNode[];
  key: string | number;
  title: React.ReactNode;
  searchTitle: string;
}

let dataList: { key: string | number; searchTitle: string }[] = [];

export const OrgStructureTree: FunctionComponent = () => {
  const [treeData, setTreeData] = useState<Array<OrgTreeNode>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedKeys, setExpandedKeys] = useState<Array<string | number>>([
    "1",
  ]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [filteredTreeData, setFilteredTreeData] = useState<Array<OrgTreeNode>>(
    []
  );
  const [showNoData, setShowNoData] = useState<boolean>(false);

  const treeDataCreate = (
    data: Array<OrgStructModel>,
    orgStructInformation: OrgStructInformation
  ): Array<OrgTreeNode> => {
    return data.map((node) => {
      return {
        title: (
          <>
            <Row justify="space-between">
              <Col>{node.title}</Col>
              <Col>
                {orgStructInformation.orgStructLinkTypes.map((linkType) => {
                  return (
                    <>
                      <Tooltip title={`Переход в ${linkType.description}`}>
                        <Button
                          type="link"
                          icon={<DynamicIcon type={linkType.icon} />}
                          disabled={
                            node.links.filter(
                              (x) => x.linkTypeId === linkType.id
                            ).length === 0
                          }
                          onClick={() => {
                            let linkInfo = node.links.find(
                              (x) => x.linkTypeId === linkType.id
                            );
                            if (linkInfo) {
                              history.push(`/`);
                              history.push(`orgstructure/${linkInfo.link}`);
                            }
                          }}
                        />
                      </Tooltip>
                    </>
                  );
                })}
              </Col>
            </Row>
          </>
        ),
        key: node.id,
        children: treeDataCreate(node.children, orgStructInformation),
        searchTitle: node.title,
      };
    });
  };

  const generateList = (data: Array<OrgTreeNode>) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      const { searchTitle } = node;
      dataList.push({ key, searchTitle: searchTitle });
      if (node.children && node.children.length !== 0) {
        generateList(node.children);
      }
    }
  };

  const getParentKey = (
    key: string | number,
    tree: Array<OrgTreeNode>
  ): string | number => {
    let parentKey: string | number = "";
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (
          node.children.some(
            (item: { key: string | number }) => item.key === key
          )
        ) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  useEffect(() => {
    axios.get<OrgStructInformation>(`${apiBase}/orgstruct`).then((result) => {
      if (
        result.data &&
        result.data.orgStructLinkTypes &&
        result.data.orgStructModelList
      ) {
        let treeData = treeDataCreate(
          result.data.orgStructModelList,
          result.data
        );

        Promise.resolve().then(() => {
          setTreeData(treeData);
          generateList(treeData);
          setFilteredTreeData(treeData);
          setLoading(false);
          setShowNoData(false);
        });
      } else {
        Promise.resolve().then(() => {
          setLoading(false);
          setShowNoData(true);
        });
      }
    });
  }, []);

  const onSearchChange = (e: any) => {
    const value = e.target.value?.toLowerCase();
    const expandedKeys = dataList
      .map((item) => {
        if (item.searchTitle.toLowerCase().indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return "";
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    if (value) {
      const hasSearchTerm = (n: string) =>
        n.toLowerCase().indexOf(value) !== -1;
      const filterData = (arr: Array<OrgTreeNode>): Array<OrgTreeNode> => {
        return arr.filter(
          (n: OrgTreeNode) =>
            hasSearchTerm(n.searchTitle) || filterData(n.children).length > 0
        );
      };
      const filteredData = (arr: Array<OrgTreeNode>): Array<OrgTreeNode> =>
        filterData(arr).map((n: OrgTreeNode) => {
          return {
            ...n,
            children:
              filteredData(n.children).length > 0
                ? filteredData(n.children)
                : n.children,
          };
        });

      Promise.resolve().then(() => {
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(true);
      });
      setFilteredTreeData(filteredData(treeData));
    } else {
      Promise.resolve().then(() => {
        setExpandedKeys([]);
        setAutoExpandParent(false);
      });
      setFilteredTreeData(treeData);
    }
  };

  const loop = (data: Array<OrgTreeNode>): Array<OrgTreeNode> =>
    data.map((item: OrgTreeNode): any => {
      if (!item.title) return;
      const title = item.title;
      if (item.children) {
        return {
          title,
          key: item.key,
          item,
          children: loop(item.children),
        };
      }
      return {
        title,
        item,
        key: item.key,
      };
    });

  const onExpand = (expandedKeys: Array<string>) => {
    Promise.resolve().then(() => {
      setExpandedKeys(expandedKeys);
      setAutoExpandParent(false);
    });
  };

  return (
    <>
      <Row align={"middle"} justify={"center"}>
        <Col span={24} style={{ textAlign: "center" }}>
          {loading ? (
            <Spin />
          ) : !showNoData ? (
            <>
              <Search
                style={{ marginBottom: 8, width: "100%" }}
                placeholder="Поиск"
                onChange={onSearchChange}
              />
              <TreeStyled
                style={{ maxHeight: "70vh", overflowY: "auto" }}
                selectable={false}
                switcherIcon={<CaretDownOutlined />}
                treeData={loop(filteredTreeData)}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
              />
            </>
          ) : (
            <div>Нет данных</div>
          )}
        </Col>
      </Row>
    </>
  );
};
