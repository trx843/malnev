import React, { Component, Key } from "react";
import { SqlTree } from "../classes/SqlTree";
import {
  Button,
  Input,
  Select,
  Space,
  Spin,
  Switch,
  Tooltip,
  Tree,
  Checkbox,
} from "antd";
import InfoCircleOutlined from "@ant-design/icons/lib/icons/InfoCircleOutlined";
import axios from "axios";
import { apiBase, dateToString, techPosTreeConstant } from "../utils";
import DownOutlined from "@ant-design/icons/DownOutlined";
import { Nullable, OwnedType } from "../types";
import { ShowType } from "../enums";
import "../styles/app.css";
import { LabelStyled } from "../styles/commonStyledComponents";

const { Search } = Input;
const { Option } = Select;

interface ITitleRenderConfig {
  render?: (nodeData: SqlTree) => React.ReactNode;
  icon?: React.ReactNode;
  onClickIcon?: (nodeData: SqlTree) => void;
}

interface IDefaultTitleRenderProps {
  node: SqlTree;
  icon?: React.ReactNode;
  onClickIcon?: (nodeData: SqlTree) => void;
}

const DefaultTitleRender: React.FC<IDefaultTitleRenderProps> = ({
  node,
  icon,
  onClickIcon,
}) => {
  const hasNodeChildren = node?.children?.length || false;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {node.title}
      {hasNodeChildren && (
        <Button
          style={{ flexShrink: 0 }}
          type="text"
          icon={icon}
          onClick={(e) => {
            e.stopPropagation();
            if (onClickIcon) onClickIcon(node);
          }}
          size="small"
        />
      )}
    </div>
  );
};

DefaultTitleRender.defaultProps = {
  icon: <InfoCircleOutlined />,
  onClickIcon: () => {},
};

const customTitleRender = (
  node: SqlTree,
  titleRenderConfig: ITitleRenderConfig
) => {
  if (titleRenderConfig.render) return titleRenderConfig.render(node);

  return (
    <DefaultTitleRender
      node={node}
      icon={titleRenderConfig.icon}
      onClickIcon={titleRenderConfig.onClickIcon}
    />
  );
};

interface ISearchTreeProps {
  treeViewName?: string;
  isSiEq: boolean;
  customFieldsChildren?: React.ReactNode;
  onSelectCallback: (selectedKeys: Key[], info: any) => void;
  ownedFilterChangedCallback?: (value: OwnedType) => void;
  onTreeChangeCallback?: (checked: boolean) => void;
  additionalTreeData?: Array<SqlTree>;
  currentNodeKey: Key;
  ownFilterValue: OwnedType;
  showType?: ShowType;
  filterDate?: Date;
  withoutFilters?: boolean;
  // объект с набором свойств для кастомного рендера опции фильтра
  // если лэйаут дефолтный, то можно передать icon(если отличия только в иконке) или onClickIcon
  // при кастомном отличающемся лэйауте прокидывается render
  titleRenderConfig?: ITitleRenderConfig;
  className?: string;
  customRequest?: string;
  customTreeData?: SqlTree[];
  checkable?: boolean;
  checkedKeys?: string[];
  defaultExpandedKeys?: Key[];
  // если true "Собственный/сторонний ПСП", если false "Собственный/сторонний"
  isPspCtrl?: boolean;
}

interface ISearchTreeState {
  expandedKeys: Array<string>;
  searchValue: string;
  autoExpandParent: boolean;
  treeData: Array<SqlTree>;
  filteredTreeData: Array<SqlTree>;
  ownedType: OwnedType;
  loading: boolean;
  isTechPosTree: boolean;
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

let ownedTypeDefault = 0;

export class SearchTree extends Component<ISearchTreeProps, ISearchTreeState> {
  static defaultProps = {
    className: "",
  };

  constructor(props: ISearchTreeProps) {
    super(props);
    this.state = {
      expandedKeys: [
        "0",
        this.props.currentNodeKey ? this.props.currentNodeKey.toString() : "0",
      ],
      searchValue: "",
      autoExpandParent: true,
      treeData: [],
      filteredTreeData: [],
      ownedType: null,
      loading: true,
      isTechPosTree: props.treeViewName === techPosTreeConstant,
    };

    ownedTypeDefault =
      props.ownFilterValue === null ? 0 : props.ownFilterValue === true ? 1 : 2;
  }

  fetchTreeData = async () => {
    this.setState({
      loading: true,
    });
    let treeData;
    if (this.props.customTreeData === undefined) {
      const result = await axios.get<Array<SqlTree>>(
        `${apiBase}/sqltree?viewName=${this.props.treeViewName}&showType=${
          this.props.showType == null ? null : this.props.showType
        }&filterDate=${
          this.props.filterDate == null
            ? null
            : dateToString(this.props.filterDate)
        }`
      );
      treeData = this.props.additionalTreeData
        ? this.props.additionalTreeData.concat(result.data)
        : result.data;
    } else {
      treeData = this.props.customTreeData;
    }

    generateList(treeData);
    tree = treeData;

    let filteredTree = this.returnFilteredTree(tree, this.props.ownFilterValue);
    this.setState({
      treeData: filteredTree,
      filteredTreeData: filteredTree,
      loading: false,
    });
  };

  componentDidUpdate(prevProps: Readonly<ISearchTreeProps>) {
    if (
      prevProps.treeViewName !== this.props.treeViewName ||
      prevProps.filterDate !== this.props.filterDate ||
      prevProps.customTreeData !== this.props.customTreeData
    ) {
      this.fetchTreeData();
    }
  }

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
      const filterData = (arr: Array<SqlTree>): Array<SqlTree> => {
        return arr.filter(
          (n: SqlTree) =>
            hasSearchTerm(n.title) || filterData(n.children).length > 0
        );
      };
      const filteredData = (arr: Array<SqlTree>): Array<SqlTree> =>
        filterData(arr).map((n: SqlTree) => {
          return {
            ...n,
            children:
              filteredData(n.children).length > 0
                ? filteredData(n.children)
                : n.children,
          };
        });

      this.setState({
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
        filteredTreeData: filteredData(this.state.treeData),
      });
    } else {
      this.setState({
        expandedKeys: [],
        searchValue: "",
        autoExpandParent: false,
        filteredTreeData: this.state.treeData,
      });
    }
  };

  handleOwnedFilter = (value: number) => {
    let type: Nullable<boolean> = null;
    if (value === 1) type = true;
    if (value === 2) type = false;
    if (this.props.ownedFilterChangedCallback)
      this.props.ownedFilterChangedCallback(type);

    let filteredTree = this.returnFilteredTree(tree, type);
    this.setState({
      treeData: filteredTree,
      filteredTreeData: filteredTree,
      searchValue: "",
    });
  };

  returnFilteredTree = (
    treeData: SqlTree[],
    owned: Nullable<boolean>
  ): SqlTree[] => {
    if (owned === null) return treeData;
    const filterOwnedData = (node: SqlTree): boolean => {
      return node.owned === owned;
    };

    function copy(o: SqlTree) {
      return Object.assign({}, o);
    }

    var res = treeData.map(copy).filter(function f(o): any {
      if (filterOwnedData(o)) return true;

      if (o.children) {
        return (o.children = o.children.map(copy).filter(f)).length;
      }
    });
    return res;
  };

  render() {
    const { withoutFilters, titleRenderConfig, className } = this.props;
    const { searchValue, expandedKeys, autoExpandParent, filteredTreeData } =
      this.state;

    const loop = (
      data: Array<SqlTree>,
      parentNodeKey?: string
    ): Array<SqlTree> => {
      return data.map((item: SqlTree): any => {
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
            type: item.type,
            item,
            isSiType: item.isSiType,
            children: loop(item.children, item.key),
            ...(parentNodeKey && { parentNodeKey: parentNodeKey }),
          };
        }

        return {
          id: item.id,
          nodeId: item.nodeId,
          title,
          type: item.type,
          key: item.key,
          isSiType: item.isSiType,
          ...(parentNodeKey && { parentNodeKey: parentNodeKey }),
        };
      });
    };

    return (
      <div className={className}>
        {!withoutFilters && (
          <React.Fragment>
            <p
              style={{
                margin: 0,
                fontWeight: 400,
                fontSize: "15px",
                color: "#667985",
              }}
            >
              {this.props.isPspCtrl
                ? "Собственный/сторонний ПСП"
                : "Собственный/сторонний"}
            </p>
            <Select
              defaultValue={ownedTypeDefault}
              style={{ marginBottom: 8, width: "100%" }}
              onChange={this.handleOwnedFilter}
            >
              <Option value={0}>Все</Option>
              <Option value={1}>Собственные</Option>
              <Option value={2}>Сторонние</Option>
            </Select>
          </React.Fragment>
        )}

        {/* переключатель ТП/СИ (скрыт, не используется) */}
        {/* {this.props.isSiEq ? (
          <Space>
            <Tooltip title="Технологическая позиция">
              <LabelStyled isActive={this.state.isTechPosTree}>ТП</LabelStyled>
            </Tooltip>
            <Switch
              style={{ marginBottom: 8 }}
              checked={!this.state.isTechPosTree}
              onChange={(checked: boolean) => {
                this.setState({ isTechPosTree: !checked });
                if (this.props.onTreeChangeCallback)
                  this.props.onTreeChangeCallback(checked);
              }}
            />
            <Tooltip title="Средство измерения">
              <LabelStyled isActive={!this.state.isTechPosTree}>СИ</LabelStyled>
            </Tooltip>
          </Space>
        ) : (
          <div></div>
        )} */}

        {this.props.customFieldsChildren}
        {this.state.loading ? (
          <div style={{ marginTop: 300, textAlign: "center" }}>
            <Spin />
          </div>
        ) : (
          <>
            <Search
              style={{ marginBottom: 8, width: "100%" }}
              placeholder="Поиск"
              value={this.state.searchValue}
              onChange={this.onChange}
            />
            <Tree
              checkedKeys={this.props.checkedKeys}
              checkable={this.props.checkable}
              switcherIcon={<DownOutlined />}
              defaultExpandedKeys={
                this.props.defaultExpandedKeys
                  ? this.props.defaultExpandedKeys
                  : ["0"]
              }
              defaultExpandParent={true}
              defaultSelectedKeys={[
                this.props.currentNodeKey ? this.props.currentNodeKey : "0",
              ]}
              onExpand={this.onExpand}
              onSelect={this.props.onSelectCallback}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              treeData={loop(filteredTreeData)}
              {...(titleRenderConfig && {
                titleRender: (node: SqlTree) =>
                  customTitleRender(node, titleRenderConfig),
                blockNode: true,
              })}
            />
          </>
        )}
      </div>
    );
  }
}
