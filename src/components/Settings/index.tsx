import { DeploymentUnitOutlined, UngroupOutlined } from '@ant-design/icons';
import { AgGridColumn } from 'ag-grid-react';
import { Layout } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PostSetPointsParams } from '../../api/params/post-set-points.params';
import { OperandsTreeItem } from '../../api/responses/get-operands-tree.response';
import { OperandNode, useNodeTableData } from '../../customHooks/useNodeTableData';
import { SelectedNodes } from '../../slices/algorithmStatus/operands';
import {
  setSelectedNode,
  setSelectedOperandNode,
  SettingsSlice,
} from '../../slices/algorithmStatus/settings';
import {
  getAfAlgorithmTreeThunk,
  getSettingsOperandsTreeThunk,
  postSetPoints,
} from '../../thunks/algorithmStatus/settings';
import { StateType } from '../../types';
import { AgGridTable } from '../AgGridTable';
import { returnRowClassRules } from '../Algorithms/utils';
import { AlgorithmTree } from '../AlgorithmTree';
import { AlgorithmTreeViewData } from '../AlgorithmTree/types';
import { SettingsEditRenderer } from '../cellRenderers/SettingsEditRenderer';
import { OprerandsTree } from '../OperandsTree';
import { CollapsibleSider } from '../shared/CollapsibleSider';
import { WithLoading } from '../shared/WithLoading';
import { SettingsEditModal } from './SettingsEditingModal';

const { Content } = Layout;

enum Siders {
  FirstSider = 'firstSider',
  SecondSider = 'secondSider',
}

export const Settings: FC = () => {
  const dispatch = useDispatch();

  const [selectedOperandKey, setSelectedOperandKey] = useState('');
  const [selectedOperand, setSelectedOperand] = useState<OperandsTreeItem | null>(null);

  const [collapsed, setCollapsed] = useState({
    [Siders.FirstSider]: false,
    [Siders.SecondSider]: false,
  });

  const settings = useSelector<StateType, SettingsSlice>((state) => state.settings);

  const {
    operandsTreeData,
    algTreeData,
    selectedNodes,
    isOperandsLoading,
    isAlgorithmsLoading,
  } = settings;

  const tableData: OperandNode[] = useNodeTableData(selectedOperandKey, selectedNodes);

  useEffect(() => {
    dispatch(getSettingsOperandsTreeThunk());
  }, []);

  useEffect(() => {
    selectedOperand?.elementId &&
      dispatch(getAfAlgorithmTreeThunk(selectedOperand.elementId));
  }, [selectedOperand]);

  const onCollapse = (name: Siders) => {
    setCollapsed((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const onOperandSelect = (keys: string[], node: any) => {
    // не удалось переопределить type of node при имеющихся дополнительных параметрах
    const item = node.item as OperandsTreeItem;
    if (item.elementId) {
      setSelectedOperandKey(keys[0]);
      setSelectedOperand(item);
    }
  };

  const onAlgTreeCheck = (keys: string[], info: any) => {
    if (!selectedOperandKey || !selectedOperand) return undefined;
    const nodes = info.checkedNodes as AlgorithmTreeViewData[];
    const payload: SelectedNodes = {
      [selectedOperandKey]: {
        algorithms: nodes.filter((node) => node.key.split('#')[1]),
        operand: selectedOperand,
      },
    };

    return dispatch(setSelectedNode(payload));
  };

  const onEditSettingsSubmit = async (params: PostSetPointsParams, id: string) => {
    await dispatch(postSetPoints(params));

    if (selectedNodes) {
      const newAlgorithms: AlgorithmTreeViewData[] = [
        ...selectedNodes[selectedOperandKey].algorithms,
      ];

      const index = newAlgorithms.findIndex((alg) => alg.key === id);

      newAlgorithms[index] = {
        ...newAlgorithms[index],
        algSetPointConfig: newAlgorithms[index].algSetPointConfig?.map((config) => ({
          ...config,
          value: params.setPoints.find((point) => point.id === config.id)?.value,
        })),
      };

      const newNode: SelectedNodes = {
        [selectedOperandKey]: {
          ...selectedNodes[selectedOperandKey],
          algorithms: newAlgorithms,
        },
      };
      dispatch(setSelectedNode(newNode));
    }

    dispatch(setSelectedOperandNode(null));
  };

  return (
    <Layout style={{ height: '100%' }}>
      <CollapsibleSider
        collapsed={collapsed[Siders.FirstSider]}
        onCollapse={() => onCollapse(Siders.FirstSider)}
        title='Список операндов'
        collapsedIcon={<DeploymentUnitOutlined />}
      >
        <WithLoading isLoading={isOperandsLoading}>
          <OprerandsTree
            onSelect={(keys, info) => onOperandSelect(keys, info.node)}
            treeData={operandsTreeData}
          />
        </WithLoading>
      </CollapsibleSider>

      <CollapsibleSider
        collapsed={collapsed[Siders.SecondSider]}
        onCollapse={() => onCollapse(Siders.SecondSider)}
        title='Список алгоритмов'
        collapsedIcon={<UngroupOutlined />}
      >
        <WithLoading isLoading={isAlgorithmsLoading}>
          <AlgorithmTree
            autoExpandParent={true}
            treeData={algTreeData}
            checkable
            checkedKeys={
              selectedNodes?.[selectedOperandKey]?.algorithms.map((node) => node.key) ||
              []
            }
            onCheck={onAlgTreeCheck}
          />
        </WithLoading>
      </CollapsibleSider>

      <Content
        style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}
      >
        <AgGridTable rowData={tableData} rowClassRules={returnRowClassRules()}>
          <AgGridColumn headerName='Путь' field='node' />
          <AgGridColumn headerName='Шаблон' field='templateName' />
          <AgGridColumn headerName='Алгоритм' field='algorithmName' />
          <AgGridColumn
            headerName='Действия'
            pinned='right'
            cellRendererFramework={SettingsEditRenderer}
          />
        </AgGridTable>
      </Content>
      <SettingsEditModal onSubmit={onEditSettingsSubmit} />
    </Layout>
  );
};
