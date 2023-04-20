import EditOutlined from '@ant-design/icons/EditOutlined';
import { ICellRendererParams } from 'ag-grid-community';
import { Button } from 'antd';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MssEventType } from '../../../classes';
import {
  setIsEventRisksModalOpen,
  setSelectedMssEventTypes,
} from '../../../slices/riskSettings';
import { StateType } from '../../../types';

export const EventRiskEditRenderer: FC<ICellRendererParams> = ({
  data,
}: ICellRendererParams) => {
  const dispatch = useDispatch();

  const filteredEventTypes = useSelector<StateType, MssEventType[]>(
    (state) => state.riskSettings.filteredMssEventTypes
  );

  const handleOnClick = () => {
    const item = data as MssEventType;
    const selectedEventType = filteredEventTypes.find((type) => type.id === item.id);
    if (!selectedEventType) return undefined;
    dispatch(setSelectedMssEventTypes([selectedEventType]));
    dispatch(setIsEventRisksModalOpen(true));
    return undefined;
  };

  return (
    <Button
      type='link'
      onClick={handleOnClick}
      style={{ width: '100%' }}
      icon={<EditOutlined />}
    />
  );
};
