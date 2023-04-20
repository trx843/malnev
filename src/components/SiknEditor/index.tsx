import EditOutlined from '@ant-design/icons/EditOutlined';
import { Layout, Row, Button, Card, Col } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindConstantRiskThunk, getSiknRsusThunk } from '../../thunks/riskSettings';
import { SelectedNode } from '../../interfaces';
import {
  RiskSettingsModals,
  setOpenedModal,
  setSelectedSiknArr,
} from '../../slices/riskSettings';
import { ObjectFields, StateType } from '../../types';
import { returnPreparedRiskBindData, zeroGuid } from '../../utils';
import { ConstantRiskBindModal } from '../cellRenderers/ConstantRiskBindRenderer/ConstantRiskBindModal';
import { GridLoading } from '../GridLoading';
import { ItemsTable } from '../ItemsTable';
import { SiknEditorTableItem } from './types';
import { FilterItemLabelStyled, FilterRowStyled, FilterSearchTreeStyled, SiderFilterStyled, TableBlockWrapperStyled, WrapperTreeRowStyled } from '../../styles/commonStyledComponents';
import RightOutlined from '@ant-design/icons/RightOutlined';
import LeftOutlined from '@ant-design/icons/LeftOutlined';

const { Content, Sider } = Layout;
type InfoType = {
  node: SelectedNode;
};

export const SiknEditor: FC = () => {
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const siknArr = useSelector<StateType, SiknEditorTableItem[]>(
    (state) => state.riskSettings.siknRsusArr
  );

  const selectedSiknArr = useSelector<StateType, number[]>(
    (state) => state.riskSettings.selectedSiknArr
  );
  const openedModal = useSelector<StateType, string>(
    (state) => state.riskSettings.openedModal
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const defaultTreeNode: SelectedNode = {
    id: zeroGuid,
    nodeId: 0,
    title: '',
    key: '0',
    type: 'all',
    owned: true,
    isSiType: false,
  };

  const [selectedTreeElement, setSelectedTreeElement] =
    useState<SelectedNode>(defaultTreeNode);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await dispatch(getSiknRsusThunk(selectedTreeElement));
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [selectedTreeElement]);

  const handleRowSelect = (items: SiknEditorTableItem[]) => {
    dispatch(setSelectedSiknArr(items.map((item) => item.id)));
  };

  const toggleModal = () => {
    dispatch(setOpenedModal(!!openedModal ? '' : RiskSettingsModals.riskBindModal));
  };

  const onModalSubmit = async (selectedRisks: string[]) => {
    setIsModalLoading(true);
    if (!selectedSiknArr.length) return;
    const newBinds = returnPreparedRiskBindData(selectedSiknArr, selectedRisks);
    await dispatch(bindConstantRiskThunk(newBinds));
    setIsLoading(true);
    await dispatch(getSiknRsusThunk(selectedTreeElement));
    setIsLoading(false);
    setIsModalLoading(false);
    dispatch(setSelectedSiknArr([]));
    toggleModal();
  };

  const onSelectTreeNode = (selectedKeys: React.Key[], info: InfoType) => {
    const change = info.node;
    setSelectedTreeElement(change);
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
              treeViewName={'SiknByOstTree'}
              onSelectCallback={onSelectTreeNode}
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
                  disabled={!selectedSiknArr.length}
                  onClick={toggleModal}
                  icon={<EditOutlined />}
                >
                  Редактировать выбранные риски
                </Button>
              </Col>
            </Row>
          </Card>

          {isLoading ? (
            <GridLoading />
          ) : (
            <ItemsTable<SiknEditorTableItem>
              items={siknArr}
              rowIsMultiple={true}
              fields={new ObjectFields(SiknEditorTableItem).getFields()}
              setApiCallback={() => {}}
              hiddenColumns={['id']}
              actionColumns={[
                {
                  headerName: 'Действия',
                  pinned: 'right',
                  cellRenderer: 'constantRiskBindRenderer',
                  minWidth: 100,
                },
              ]}
              selectionCallback={(items: SiknEditorTableItem[]) => handleRowSelect(items)}
            />
          )}
      
          <ConstantRiskBindModal
            isOpen={openedModal === RiskSettingsModals.riskBindModal}
            onSave={onModalSubmit}
            onCancel={toggleModal}
            selectedSiknArr={selectedSiknArr}
            isLoading={isModalLoading}
          />
        </TableBlockWrapperStyled>
      </Content>
    </Layout>
  );
};
