import React, { FC, useEffect, useState } from "react";
import { Layout } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ObjectFields, StateType } from "../../types";
import { WithLoading } from "../shared/WithLoading";
import { ItemsTable } from "../ItemsTable";
import { DeploymentUnitOutlined, UngroupOutlined } from "@ant-design/icons";
import { CollapsibleSider } from "../shared/CollapsibleSider";
import { AlgorithmTree } from "../AlgorithmTree";
import { returnPreparedTreeData } from "../AlgorithmTree/utils";
import { OprerandsTree } from "../OperandsTree";
import {
  getAlgorithmTreeThunk,
  getOperandsTreeThunk,
} from "../../thunks/algorithmStatus/operands";
import {
  OperandsSlice,
  SelectedNodes,
  setAlgTreeData,
  setSelectedNode,
} from "../../slices/algorithmStatus/operands";
import {
  OperandNode,
  useNodeTableData,
} from "../../customHooks/useNodeTableData";
import { AlgorithmTreeViewData } from "../AlgorithmTree/types";
import { OperandsTreeItem } from "../../api/responses/get-operands-tree.response";
import { returnRowClassRules } from "../Algorithms/utils";

const { Content } = Layout;

enum Siders {
  FirstSider = "firstSider",
  SecondSider = "secondSider",
}

export const Operands: FC = () => {
  const dispatch = useDispatch();

  const [selectedOperandKey, setSelectedOperandkey] = useState("");
  const [selectedOperand, setSelectedOperand] =
    useState<OperandsTreeItem | null>(null);

  const [collapsed, setCollapsed] = useState({
    [Siders.FirstSider]: false,
    [Siders.SecondSider]: false,
  });

  const operands = useSelector<StateType, OperandsSlice>(
    (state) => state.operands
  );

  const {
    operandsTreeData,
    algTreeData,
    selectedNodes,
    isOperandsLoading,
    isAlgorithmsLoading,
  } = operands;

  const tableData: OperandNode[] = useNodeTableData(
    selectedOperandKey,
    selectedNodes
  );

  useEffect(() => {
    dispatch(getOperandsTreeThunk());
  }, []);

  useEffect(() => {
    selectedOperand?.elementId &&
      dispatch(getAlgorithmTreeThunk(selectedOperand.elementId));
  }, [selectedOperand]);

  const onCollapse = (name: Siders) => {
    setCollapsed((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const onAlgTreeCheck = (keys: string[], info: any) => {
    if (!selectedOperandKey || !selectedOperand) return undefined;
    const nodes = info.checkedNodes as AlgorithmTreeViewData[];
    const payload: SelectedNodes = {
      [selectedOperandKey]: {
        algorithms: nodes.filter((node) => node.key.split("#")[1]),
        operand: selectedOperand,
      },
    };

    return dispatch(setSelectedNode(payload));
  };

  const onOperandSelect = (keys: string[], node: any) => {
    // не удалось переопределить type of node при имеющихся дополнительных параметрах
    const item = node.item as OperandsTreeItem;
    if (item.elementId) {
      setSelectedOperandkey(keys[0]);
      setSelectedOperand(item);
    } else {
      setSelectedOperand(null);
      dispatch(setAlgTreeData([]));
    }
  };

  return (
    <Layout style={{ height: "100%" }}>
      <CollapsibleSider
        collapsed={collapsed[Siders.FirstSider]}
        onCollapse={() => onCollapse(Siders.FirstSider)}
        title="Список операндов"
        collapsedIcon={<DeploymentUnitOutlined />}
      >
        <WithLoading isLoading={isOperandsLoading}>
          <OprerandsTree
            onSelect={(keys, info) => onOperandSelect(keys, info.node)}
            treeData={operandsTreeData}
            withStatus
          />
        </WithLoading>
      </CollapsibleSider>

      <CollapsibleSider
        collapsed={collapsed[Siders.SecondSider]}
        onCollapse={() => onCollapse(Siders.SecondSider)}
        title="Список алгоритмов"
        collapsedIcon={<UngroupOutlined />}
      >
        <WithLoading isLoading={isAlgorithmsLoading}>
          <AlgorithmTree
            autoExpandParent={true}
            treeData={algTreeData}
            checkable
            checkedKeys={
              selectedNodes?.[selectedOperandKey]?.algorithms.map(
                (node) => node.key
              ) || []
            }
            onCheck={onAlgTreeCheck}
          />
        </WithLoading>
      </CollapsibleSider>

      <Content
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ItemsTable<OperandNode>
          items={tableData}
          fields={new ObjectFields(OperandNode).getFields()}
          hiddenColumns={["algorithm", "status"]}
          height="100%"
          rowClassRules={returnRowClassRules()}
        />
      </Content>
    </Layout>
  );
};
