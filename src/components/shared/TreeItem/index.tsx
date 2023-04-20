import React, { FC } from 'react';

import './styles.css';

interface IProps {
  name: any;
  background?: string;
  withStatus?: boolean;
}

export const TreeItem: FC<IProps> = ({ name, background, withStatus }) => (
  <div className='alg_tree-item'>
    {withStatus && <div className='alg_tree-status' style={{ background }} />}
    <span className='alg_tree-name'>{name}</span>
  </div>
);
