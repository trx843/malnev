import React, { FC } from 'react';
import { AlgorithmTreeData } from '../../../api/responses/get-algorithm-tree.response';
import { AlgorithmTreeViewData } from './types';

export { TreeStatusColors } from '../../../enums';

import './styles.css';

const algStatuses = {
  20: 'Good',
  25: 'Warning',
  30: 'Danger',
  40: 'Disabled',
};

interface IProps {
  name: string;
  background: string;
}

const AllTreeItem: FC<IProps> = ({ name, background }) => (
  <div className='alg_tree-item'>
    <div className='alg_tree-status' style={{ background }} />
    <span>{name}</span>
  </div>
);

export const returnPreparedTreeData = (
  treeData: AlgorithmTreeData
): AlgorithmTreeViewData[] => {
  const preparedData: AlgorithmTreeViewData[] = treeData.servicesInfo.map((item) => ({
    title: (
      <AllTreeItem
        name={item.displayName}
        //@ts-ignore
        background={TreeStatusColors[algStatuses[item.state]]}
      />
    ),
    key: item.id,
    children: item.analysisAlgorithms.map((algorithm) => ({
      title: (
        <AllTreeItem
          name={algorithm.name}
          //@ts-ignore
          background={TreeStatusColors[algStatuses[item.state]]}
        />
      ),
      key: `${item.id}#${algorithm.id}`,
    })),
  }));

  return preparedData;
};
