import React, { FC, useState } from 'react';

import { Collapse, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  setConfiguration,
  setOpenedModalId,
} from '../../../slices/algorithmStatus/algorithms';
import { StateType } from '../../../types';
import {
  AlgConfigurationCategory,
  AlgConfigurationProperty,
} from '../../../api/responses/get-alg-configuration.response';
import { PropertyItem } from './PropertyItem';
import { ConfigurationInnerModal, DataTypes } from './ConfigurationItemModal';
import { WithLoading } from '../../shared/WithLoading';

const { Panel } = Collapse;

interface IProps {
  isOpen: boolean;
}

export const ConfigurationModal: FC<IProps> = ({ isOpen }) => {
  const dispatch = useDispatch();

  const categories = useSelector<StateType, AlgConfigurationCategory[] | undefined>(
    (state) => state.algorithms.configuration
  );

  const [isInnerOpen, setIsInnerOpen] = useState(false);
  const [innerType, setInnerType] = useState<DataTypes>(DataTypes.Empty);
  const [innerModalProperty, setInnerModalProperty] = useState<
    AlgConfigurationProperty | undefined
  >(undefined);

  const onCancel = () => {
    dispatch(setOpenedModalId(''));
    dispatch(setConfiguration([]));
  };

  const handleIconClick = (property: AlgConfigurationProperty, type: DataTypes) => {
    setInnerType(type);
    setInnerModalProperty(property);
    setIsInnerOpen(true);
  };

  return (
    <Modal
      title='Конфигурация'
      footer=''
      destroyOnClose
      visible={isOpen}
      onCancel={onCancel}
      width={'738px'}
    >
      <WithLoading isLoading={!categories?.length}>
        <Collapse
          defaultActiveKey={['1']}
          style={{ maxHeight: '700px', overflowY: 'scroll' }}
        >
          {categories?.map((category) => (
            <Panel header={category.name} key={category.name}>
              {category.properties.map((propertyCortege) => (
                <PropertyItem
                  property={propertyCortege}
                  handleIconClick={handleIconClick}
                />
              ))}
            </Panel>
          ))}
        </Collapse>
      </WithLoading>

      <ConfigurationInnerModal
        isOpen={isInnerOpen}
        onCancel={() => setIsInnerOpen(false)}
        type={innerType}
        property={innerModalProperty}
      />
    </Modal>
  );
};
