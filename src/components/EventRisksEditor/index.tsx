import EditOutlined from '@ant-design/icons/EditOutlined';
import { Layout, Row, Button, Card, Col } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { FC, Key, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMssEventTypesThunk, putMssEventTypesThunk } from '../../thunks/riskSettings';
import { PutMssEventRiskParams } from '../../api/params/put-mss-event-risk.params';
import { MssEventType } from '../../classes';
import {
  setFilteredMssEventTypes,
  setIsEventRisksModalOpen,
  setMssEventTypesTreeKey,
  setSelectedMssEventTypes,
} from '../../slices/riskSettings';
import { ObjectFields, StateType } from '../../types';
import { ItemsTable } from '../ItemsTable';
import { SearchTree } from '../SearchTree';
import { EventRiskEditModal } from './EventRiskEditorModal';
import { returnFilteredMssEventTypes } from './utils';
import { FilterItemLabelStyled, FilterRowStyled, FilterSearchTreeStyled, SiderFilterStyled, TableBlockWrapperStyled, WrapperTreeRowStyled } from '../../styles/commonStyledComponents';
import RightOutlined from '@ant-design/icons/RightOutlined';
import LeftOutlined from '@ant-design/icons/LeftOutlined';

const { Content } = Layout;

export const EventRisksEditor: FC = () => {
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState<boolean>(false);
  
  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const mssEventTypes = useSelector<StateType, MssEventType[]>(
    (state) => state.riskSettings.mssEventTypes
  );
  const mssEventTypesTreeKey = useSelector<StateType, string>(
    (state) => state.riskSettings.mssEventTypesTreeKey
  );
  const filteredEventTypes = useSelector<StateType, MssEventType[]>(
    (state) => state.riskSettings.filteredMssEventTypes
  );
  const selectedEventTypes = useSelector<StateType, MssEventType[]>(
    (state) => state.riskSettings.selectedMssEventTypes
  );
  const isModalOpen = useSelector<StateType, boolean>(
    (state) => state.riskSettings.isEventRisksModalOpen
  );

  useEffect(() => {
    (async () => {
      if (mssEventTypes.length) return;
      await dispatch(getMssEventTypesThunk());
    })();
  }, []);

  useEffect(() => {
    const filteredMssEventTypes = returnFilteredMssEventTypes(
      mssEventTypes,
      mssEventTypesTreeKey
    );
    dispatch(setFilteredMssEventTypes(filteredMssEventTypes));
  }, [mssEventTypesTreeKey, mssEventTypes]);

  const toggleModal = () => {
    dispatch(setIsEventRisksModalOpen(!isModalOpen));
  };

  const handleRowSelect = (items: MssEventType[]) => {
    if (!Array.isArray(items)) return undefined;
    return dispatch(setSelectedMssEventTypes(items));
  };

  const handleTreeSelect = (key: Key[]) => {
    if (!key[0]) return dispatch(setMssEventTypesTreeKey(''));
    const currentKey = key[0].toString();
    return dispatch(setMssEventTypesTreeKey(currentKey));
  };

  const handleSubmit = async (item: MssEventType) => {
    const params: PutMssEventRiskParams = {
      ratio: item.riskRatio,
      ids: selectedEventTypes.map((item) => item.id),
    };
    if (selectedEventTypes.length === 1) params.severityId = item.mssEventSeverityLevelId;
    await dispatch(putMssEventTypesThunk(params));
    toggleModal();
    return;
  };

  return (
    <Layout>
      <SiderFilterStyled
        width={280}
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <Row
          justify={collapsed ? "center" : "space-between"}
          align="middle"
        >
          <Col style={{ display: collapsed ? "none" : "block" }}>
            <Title level={4}>Фильтр</Title>
          </Col>
          <Col>
            {React.createElement(collapsed ? RightOutlined : LeftOutlined, {
              onClick: onCollapse,
            })}
          </Col>
        </Row>
        
        <FilterRowStyled $collapsed={collapsed}>
          <Col>
            <FilterItemLabelStyled>Выберите объект в дереве</FilterItemLabelStyled>
          </Col>
        </FilterRowStyled>
        <WrapperTreeRowStyled $collapsed={collapsed}>
          <Col span={24} style={{ height: "100%" }}>
            <FilterSearchTreeStyled
              isSiEq={false}
              treeViewName={'MssEventTypeTree'}
              onSelectCallback={handleTreeSelect}
              onTreeChangeCallback={() => {}}
              ownFilterValue={null}
              currentNodeKey={''}
              withoutFilters
            />
          </Col>
        </WrapperTreeRowStyled>
      </SiderFilterStyled>

      <Content>
        <TableBlockWrapperStyled>
          <Card>
            <Row justify='space-between'>
              <Col>
                <Button
                  type='link'
                  onClick={toggleModal}
                  icon={<EditOutlined />}
                  disabled={!selectedEventTypes.length}
                >
                  Редактировать выбранные риски
                </Button>
              </Col>

              <Col>{/* <Button type="link">Экспортировать в Excel</Button> */}</Col>
            </Row>
          </Card>

          <ItemsTable<MssEventType>
            items={filteredEventTypes}
            rowIsMultiple={true}
            fields={new ObjectFields(MssEventType).getFields()}
            setApiCallback={() => {}}
            hiddenColumns={['id']}
            actionColumns={[
              {
                headerName: 'Действия',
                pinned: 'right',
                cellRenderer: 'eventRiskEditRenderer',
                minWidth: 100,
              },
            ]}
            selectionCallback={(items: MssEventType[]) => handleRowSelect(items)}
          />
        </TableBlockWrapperStyled>
      </Content>
      <EventRiskEditModal
        isOpen={isModalOpen}
        onCancel={toggleModal}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
};
