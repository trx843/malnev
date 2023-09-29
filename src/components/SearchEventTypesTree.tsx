import React, { Component, Key } from "react";
import { SqlTree } from "../classes/SqlTree";
import { Tree, Input, Spin } from "antd";
import axios from "axios";
import "../styles/app.scss";
import { apiBase } from "../utils";
import DownOutlined from "@ant-design/icons/DownOutlined";
import { EventrSearchTreeStyled } from "../styles/commonStyledComponents";

const { Search } = Input;

interface ISearchEventTypesTreeProps {
  disabled?: boolean;
  treeViewName: string;
  onCheckCallback: (checkedKeys: Key[], info: { checkedNodes: any }) => void;
  checkedKeys: Key[];
}

interface ISearchEventTypesTreeState {
  expandedKeys: Array<string>;
  searchValue: string;
  autoExpandParent: boolean;
  treeData: Array<SqlTree>;
  loading: boolean;
}

const getParentKey = (key: string, tree: Array<SqlTree>): string => {
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
const generateList = (data: Array<SqlTree>) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    const { title } = node;
    dataList.push({ key, title: title });
    if (node.children.length !== 0) {
      generateList(node.children);
    }
  }
};

let tree: Array<SqlTree> = [];

export class SearchEventTypesTree extends Component<
  ISearchEventTypesTreeProps,
  ISearchEventTypesTreeState
> {
  constructor(props: ISearchEventTypesTreeProps) {
    super(props);
    this.state = {
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      treeData: [],
      loading: true,
    };
  }

  fetchTreeData = async () => {
    const result = await axios.get<Array<SqlTree>>(
      `${apiBase}/sqltree?viewName=${this.props.treeViewName}`
    );
    generateList(result.data);
    tree = result.data;
    this.setState({
      treeData: result.data,
      loading: false,
    });
  };

  componentDidMount() {
    this.fetchTreeData();
  }

  onExpand = (expandedKeys: Array<string>) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = (e: any) => {
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
      const filterData = (arr: Array<SqlTree>): Array<SqlTree> =>
        arr?.filter(
          (n: SqlTree) =>
            hasSearchTerm(n.title) || filterData(n.children)?.length > 0
        );
      const filteredData = filterData(tree).map((n: any) => {
        return {
          ...n,
          children: filterData(n.children),
        };
      });

      this.setState({
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
        treeData: tree,
      });
    } else {
      this.setState({
        expandedKeys: [],
        searchValue: "",
        autoExpandParent: false,
        treeData: tree,
      });
    }
  };

  render() {
    const { searchValue, expandedKeys, autoExpandParent, treeData } =
      this.state;
    const loop = (data: Array<SqlTree>): Array<SqlTree> =>
      data.map((item: SqlTree): any => {
        const index = item.title
          .toLowerCase()
          .indexOf(searchValue.toLowerCase());
        const beforeStr = item.title.substring(0, index);
        const afterStr = item.title.substring(index + searchValue.length);
        const searchStr = item.title.substring(
          index,
          index + searchValue.length
        );
        const title =
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
            id: item.id,
            nodeId: item.nodeId,
            title,
            key: item.key,
            item,
            children: loop(item.children),
          };
        }
        return {
          id: item.id,
          nodeId: item.nodeId,
          title,
          key: item.key,
        };
      });
    return (
      <>
        <div style={{height: "100%"}}>
          {this.state.loading ? (
            <div style={{ marginTop: 300, textAlign: "center" }}>
              <Spin />
            </div>
          ) : (
            <EventrSearchTreeStyled>
              <Search
                style={{ marginBottom: 8, width: "100%" }}
                placeholder="Поиск"
                onChange={this.onChange}
              />
              <Tree
                disabled={this.props.disabled}
                selectable={false}
                switcherIcon={<DownOutlined />}
                checkable
                onCheck={this.props.onCheckCallback}
                checkedKeys={this.props.checkedKeys}
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                treeData={loop(treeData)}
              />
            </EventrSearchTreeStyled>
          )}
        </div>
      </>
    );
  }
}
