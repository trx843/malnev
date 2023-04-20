import { findIndex } from 'lodash';
import { useEffect, useState } from 'react';
import { SelectedNodes } from '../slices/algorithmStatus/operands';
import { description } from '../types';
import { AlgorithmTreeViewData } from '../components/AlgorithmTree/types';
import { AlgSetPointConfigItem } from '../api/responses/get-algorithm-tree.response';

export class OperandNode {
  id: string;
  @description('Путь')
  node: string = '';
  @description('Шаблон')
  templateName: string = '';
  @description('Алгоритм')
  algorithmName: string = '';
  algorithm: string = '';
  @description('Время')
  lastRunTime: Date | '' = new Date();
  @description('Статус')
  stateName: string = '';
  status?: number;
  algSetPointConfig?: AlgSetPointConfigItem[];
}

const StatusNames: { [key: number]: string } = {
  20: 'Успешно завершён',
  25: 'Завершён с предупреждением',
  30: 'Расчёт закончился с ошибкой алгоритма',
  40: 'Расчёт завершился с ошибкой инфраструктуры',
};

export const useNodeTableData = (
  selectedOperandId: string,
  selectedNodes: SelectedNodes | null
): OperandNode[] => {
  const [tableData, setTableData] = useState<OperandNode[]>([]);

  useEffect(() => {
    if (!selectedOperandId || !selectedNodes) return undefined;

    let newTableData: OperandNode[] = [];

    const existsAlgorithms: string[] = [];

    const selectedAlgorithms = selectedNodes[selectedOperandId].algorithms;
    const operand = selectedNodes[selectedOperandId].operand;

    tableData.forEach((node) => {
      if (node.node === selectedOperandId) {
        const index = findIndex(
          selectedAlgorithms,
          (algorithm) => algorithm.key === node.algorithm
        );

        if (index !== -1) {
          existsAlgorithms.push(node.algorithm);
          return newTableData.push({
            ...node,
            algSetPointConfig: selectedAlgorithms[index].algSetPointConfig,
          });
        }
        return;
      }
      return newTableData.push(node);
    });

    const algorithmsToAdd: AlgorithmTreeViewData[] = selectedAlgorithms.filter(
      (alg) => !existsAlgorithms.includes(alg.key)
    );

    algorithmsToAdd.forEach((algorithm) => {
      newTableData.push({
        node: operand.key,
        templateName: operand.templateName || '',
        algorithm: algorithm.key,
        algorithmName: algorithm.name,
        lastRunTime: algorithm.lastRunTime || '',
        stateName: algorithm.state ? StatusNames[algorithm.state] : '',
        id: `${operand.elementId}@${algorithm.key}`,
        status: algorithm.state,
        algSetPointConfig: algorithm.algSetPointConfig,
      });
    });
    setTableData(newTableData);

    return;
  }, [selectedNodes]);

  return [...tableData];
};
