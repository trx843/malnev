import EditOutlined from '@ant-design/icons/EditOutlined';
import { ICellRendererParams } from 'ag-grid-community';
import { Button } from 'antd';
import React, { FC, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { AbilityContext, ActionsEnum } from '../../../casl';
import { OperandNode } from '../../../customHooks/useNodeTableData';
import { AlgorithmStatusElements, elementId } from '../../../pages/AlgorithmStatus/constant';
import { setSelectedOperandNode } from '../../../slices/algorithmStatus/settings';

export const SettingsEditRenderer: FC<ICellRendererParams> = (
  props: ICellRendererParams
) => {
  const dispatch = useDispatch();

  const ability = useContext(AbilityContext);

  const item = props.data as OperandNode;

  const onClick = () => {
    dispatch(setSelectedOperandNode(item));
  };

  return (
    <div>
      <Button
        type='link'
        onClick={onClick}
        style={{ width: '100%' }}
        icon={<EditOutlined />}
        disabled={
          ability.cannot(
            ActionsEnum.View,
            elementId(AlgorithmStatusElements[AlgorithmStatusElements.EditSettings])
          )
        }
      />
    </div>
  );
};
