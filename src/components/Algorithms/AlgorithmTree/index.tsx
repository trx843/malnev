import React, { FC } from 'react';

import { Tree, Input } from 'antd';
import { AlgorithmTreeViewData } from './types';

const { Search } = Input;

interface IProps {
  onTreeChange: () => void;
  onExpand: (keys: string[]) => void;
  expandedKeys: string[];
  onSelect: (keys: string[]) => void;
  autoExpandParent: boolean;
  treeData: AlgorithmTreeViewData[];
}

export const AlgorithmTree: FC<IProps> = ({
  onTreeChange,
  onExpand,
  expandedKeys,
  onSelect,
  treeData,
  autoExpandParent,
}) => {
  return (
    <div>
      <Search style={{ marginBottom: 8 }} placeholder='Поиск' onChange={onTreeChange} />
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        onSelect={onSelect}
      />
    </div>
  );
};
