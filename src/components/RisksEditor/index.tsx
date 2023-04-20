import PlusCircleFilled from '@ant-design/icons/PlusCircleFilled';
import { Button, Card, Col, Row } from 'antd';
import Layout, { Content } from 'antd/lib/layout/layout';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getConstantRisksThunk,
  postNewRiskThunk,
  putUpdatedRiskThunk,
} from '../../thunks/riskSettings';
import { PostConstantRiskParams } from '../../api/params/post-constant-risk.params';
import { setConstantRisks, setSelectedRiskId } from '../../slices/riskSettings';
import { ObjectFields, StateType } from '../../types';
import { ItemsTable } from '../ItemsTable';
import { RiskEditModal } from './RiskEditModal';
import { RiskItem } from './types';
import { TableBlockWrapperStyled } from '../../styles/commonStyledComponents';

export const RisksEditor: FC = () => {
  const dispatch = useDispatch();
  const constantRisks = useSelector<StateType, RiskItem[]>(
    (state) => state.riskSettings.constantRisks
  );
  const selectedRiskId = useSelector<StateType, string>(
    (state) => state.riskSettings.selectedRiskId
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (!!constantRisks.length) return;

      dispatch(getConstantRisksThunk());
    })();
    return () => {
      dispatch(setConstantRisks([]));
    };
  }, []);

  const onModalSubmit = async (data: PostConstantRiskParams) => {
    if (selectedRiskId) {
      const index = constantRisks.findIndex((item) => item.id === selectedRiskId);
      await dispatch(putUpdatedRiskThunk({ data, id: selectedRiskId, index }));
      return undefined;
    }
    await dispatch(postNewRiskThunk(data));
    return toggleModal();
  };

  const toggleModal = () => {
    if (selectedRiskId) {
      return dispatch(setSelectedRiskId(''));
    }
    return setIsModalOpen((prevState) => !prevState);
  };

  const returnSelectedRisk = useMemo(
    () => constantRisks.find((risk) => risk.id === selectedRiskId),
    [selectedRiskId]
  );

  const returnIsModalOpen = () => isModalOpen || !!selectedRiskId;

  return (
    <Layout>
      <Content>
        <TableBlockWrapperStyled>
          <Card>
            <Row justify='space-between'>
              <Col>
                <Button type='link' onClick={toggleModal} icon={<PlusCircleFilled />}>
                  Создать новый постоянный риск
                </Button>
              </Col>
            
              <Col>
                {/* <Button type="link">
                  Экспортировать в Excel
                </Button> */}
              </Col>
            </Row>
          </Card>

          <ItemsTable<RiskItem>
            items={constantRisks}
            fields={new ObjectFields(RiskItem).getFields()}
            setApiCallback={() => {}}
            hiddenColumns={['id', 'zeroGuid']}
            actionColumns={[
              {
                headerName: 'Действия',
                pinned: 'right',
                cellRenderer: 'riskEditRenderer',
                minWidth: 100,
              },
            ]}
          />
        </TableBlockWrapperStyled>
      </Content>
      <RiskEditModal
        isOpen={returnIsModalOpen()}
        onCancel={toggleModal}
        submitCallback={onModalSubmit}
        risk={returnSelectedRisk}
      />
    </Layout>
  );
};
