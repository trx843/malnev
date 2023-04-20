import { Button, Card, Col, Layout, Modal, PageHeader, Row, Spin, Tooltip } from "antd";
import React, { FC } from "react";
import {
  PageLayoutStyled,
  SiderFilterStyled,
  TableBlockWrapperStyled,
} from "../../styles/commonStyledComponents";
import { history } from "../../history/history";
import usePresenter from "./presenter";
import Title from "antd/lib/typography/Title";
import RightOutlined from "@ant-design/icons/RightOutlined";
import LeftOutlined from "@ant-design/icons/LeftOutlined";
import {
  CardsBlockSpinStyled,
  InputSearchStyled,
  ObjectElementCardStyled,
  ObjectElementPStyled,
  ObjectElementsRowStyled,
  SiderTreeStyled,
  SpinWrapStyled,
  TextContainerStyled,
} from "./styled";
import { AgGridTable } from "components/AgGridTable";
import { AgGridColumn } from "ag-grid-react";
import DownOutlined from "@ant-design/icons/DownOutlined";
import {
  EditOutlined,
  ExportOutlined,
  FileAddOutlined,
  PlusCircleFilled,
  UpOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import { IOTSPDRenderer } from "components/cellRenderers/IOTSPDRenderer";
import { ObjectModal } from "components/IOTSPDModals/objectModal";
import { ParametrModal } from "components/IOTSPDModals/parametrModal";
import { UniButton } from "components/UniButton";

const { Content } = Layout;

export const IOTSPDPage: FC = React.memo(() => {
  const {
    iotspdState,
    siderCollapsed,
    onSiderCollapseHandler,
    cardCollapsed,
    onCardCollapseHandler,
    setSearchValueHandler,
    setSelectedTreeObjectsHandler,
    addNewObjectModalOnOpenHandler,
    addNewChildObjectModalOnOpenHandler,
    addObjectCopyModalOnOpenHandler,
    editObjectModalOnOpenHandler,
    objectModalOnSubmitHandler,
    objectModalOnCloseHandler,
    parametrValidationSchema,
    newParamsListInitialValues,
    addParametrModalOnOpenHandler,
    parametrModalOnCloseHandler,
    parametrModalOnSubmitHandler,
    toTypeSelectHandler,
    objectValidationSchema,
    newObjectInitialValues,
    objectExportHandler,
    onExpandTreeHandler,
    loopHandler,
    customTitleRender,
    setWarnFieldsMessageHandler,
    onCloseWarnMessageHandler,
    onOpenWarnMessageHandler,
    maxCountNumberHandler,
  } = usePresenter();

  return (
    <PageLayoutStyled>
      <PageHeader
        style={{ paddingTop: 0 }}
        className="site-page-header"
        onBack={() => history.push("/")}
        title="Формирование ИО ТСПД"
        subTitle=""
      />

      <Layout>
        <SiderFilterStyled
          width={346} //280
          trigger={null}
          collapsible
          collapsed={siderCollapsed}
          onCollapse={onSiderCollapseHandler}
          style={{
            borderRight: "1px solid #E5E5E5",
            padding: "22px 23px 5px 16px",
          }}
        >
          <Row
            justify={siderCollapsed ? "center" : "space-between"}
            align="middle"
          >
            <Col style={{ display: siderCollapsed ? "none" : "block" }}>
              <Title level={4}>Дерево объектов</Title>
            </Col>
            <Col>
              {siderCollapsed ? (
                <RightOutlined onClick={onSiderCollapseHandler} />
              ) : (
                <LeftOutlined onClick={onSiderCollapseHandler} />
              )}
            </Col>
          </Row>

          <InputSearchStyled
            collapsed={siderCollapsed.toString()}
            placeholder="Поиск"
            onChange={(e) => setSearchValueHandler(e.target.value)}
            style={{ width: "100%" }}
            disabled={iotspdState.isLoading}
          />

          {
            iotspdState.isLoading
              ? <SpinWrapStyled>
                <Spin />
              </SpinWrapStyled>
              : <SiderTreeStyled
                onSelect={(e) => setSelectedTreeObjectsHandler(e)}
                collapsed={siderCollapsed.toString()}
                treeData={loopHandler(iotspdState.treeData)}
                selectedKeys={[iotspdState.selectedTreeObject]}
                onExpand={(expandedKeys) => onExpandTreeHandler(expandedKeys)}
                expandedKeys={iotspdState.expandedKeys}
                autoExpandParent={iotspdState.autoExpandParent}
                titleRender={customTitleRender}
              />
          }
        </SiderFilterStyled>

        <Content>
          <TableBlockWrapperStyled className="ag-theme-alpine">
            <Card>
              <Row justify={"space-between"}>
                <Col>
                  <Button
                    type={"link"}
                    icon={<PlusCircleFilled />}
                    onClick={addNewObjectModalOnOpenHandler}
                    disabled={iotspdState.isLoading}
                  >
                    Новый объект
                  </Button>
                </Col>

                <Col>
                  <Button
                    type={"link"}
                    icon={<PlusCircleFilled />}
                    onClick={addNewChildObjectModalOnOpenHandler}
                    disabled={!iotspdState.selectedTreeObject.length}
                  >
                    Новый дочерний объект
                  </Button>
                </Col>

                <Col>
                  <Button
                    type={"link"}
                    icon={<FileAddOutlined />}
                    onClick={addObjectCopyModalOnOpenHandler}
                    disabled={!iotspdState.selectedTreeObject.length}
                  >
                    Дублировать объект
                  </Button>
                </Col>

                <Col>
                  <Button
                    type={"link"}
                    icon={<EditOutlined />}
                    onClick={editObjectModalOnOpenHandler}
                    disabled={!iotspdState.selectedTreeObject.length}
                  >
                    Редактировать объект
                  </Button>
                </Col>

                <Col>
                  <Button
                    type={"link"}
                    icon={<ExportOutlined />}
                    onClick={objectExportHandler}
                    disabled={!iotspdState.selectedTreeObject.length}
                  >
                    Экспортировать в Excel
                  </Button>
                </Col>
              </Row>
            </Card>

            <Card>
              <Row wrap={false} justify={"space-between"} align={"middle"}>
                <Col>
                  <Title level={4} style={{ marginBottom: 0 }}>
                    Элементы кода объекта
                  </Title>
                </Col>

                <Col>
                  {
                    cardCollapsed
                      ? iotspdState.shortObjectCode
                      : ""
                  }
                </Col>

                <Col style={{ marginLeft: "15px" }}>
                  {cardCollapsed ? (
                    <DownOutlined onClick={onCardCollapseHandler} />
                  ) : (
                    <UpOutlined onClick={onCardCollapseHandler} />
                  )}
                </Col>
              </Row>

              <ObjectElementsRowStyled collapsed={cardCollapsed.toString()}>
                <Row justify={"start"}>
                  {iotspdState.objectElementCards.length ? (
                    iotspdState.isObjectElementsCardsLoading ? (
                      <CardsBlockSpinStyled>
                        <Spin size={"large"} />
                      </CardsBlockSpinStyled>
                    ) : (
                      iotspdState.objectElementCards.map((card) => (
                        <Tooltip title={card.toolTip} key={card.key}>
                          <Col key={card.key}>

                            <ObjectElementCardStyled size={"small"} hoverable>
                              <ObjectElementPStyled color={"#667985"}>
                                {card.elName}
                              </ObjectElementPStyled>
                              <ObjectElementPStyled color={"#424242"}>
                                {card.value}
                              </ObjectElementPStyled>
                            </ObjectElementCardStyled>

                          </Col>
                        </Tooltip>
                      ))
                    )
                  ) : (
                    <TextContainerStyled>
                      <p>Выберите объект</p>
                    </TextContainerStyled>
                  )}
                </Row>
              </ObjectElementsRowStyled>
            </Card>

            <Card>
              <Row wrap={false} justify={"space-between"} align={"middle"}>
                <Col>
                  <Title level={4} style={{ marginBottom: 0 }}>
                    Параметры
                  </Title>
                </Col>
                <Col>
                  <Button
                    type={"link"}
                    icon={<PlusCircleFilled />}
                    onClick={addParametrModalOnOpenHandler}
                    disabled={
                      iotspdState.isLoading || !iotspdState.selectedTreeObject
                    }
                  >
                    Добавить параметр
                  </Button>
                </Col>
              </Row>
            </Card>

            <AgGridTable
              rowData={iotspdState.rowData}
              rowSelection="single"
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
              }}
            >
              <AgGridColumn
                headerName="Тип данных"
                field="dataType"
              // minWidth={300}
              />
              <AgGridColumn
                headerName="Группа параметров"
                field="paramGroup"
              // minWidth={300}
              />
              <AgGridColumn
                headerName="Вид параметра"
                field="param"
              // minWidth={300}
              />
              <AgGridColumn
                headerName="Номер параметра"
                field="paramNum"
              // minWidth={300}
              />
              <AgGridColumn
                headerName="Комментарий"
                field="comment"
              // minWidth={300}
              />
              <AgGridColumn
                headerName="Действия"
                pinned="right"
                cellRendererFramework={IOTSPDRenderer}
              />
            </AgGridTable>
          </TableBlockWrapperStyled>
        </Content>
        <ObjectModal
          isModalVisible={iotspdState.isObjectModalVisible}
          modalVariant={iotspdState.objectModalVariant}
          onSubmit={objectModalOnSubmitHandler}
          onCancel={objectModalOnCloseHandler}
          objectItems={iotspdState.objectItems}
          toTypeSelectHandler={toTypeSelectHandler}
          isButtonLoading={iotspdState.isButtonLoading}
          toNumList={iotspdState.toNumList}
          paramItems={iotspdState.paramItems}
          objectValidationSchema={objectValidationSchema}
          newObjectInitialValues={newObjectInitialValues}
          modifingObjectFormInitialValues={
            iotspdState.modifingObjectFormInitialValues
          }
          setWarnFieldsMessageHandler={setWarnFieldsMessageHandler}
          onCloseWarnMessageHandler={onCloseWarnMessageHandler}
          onOpenWarnMessageHandler={onOpenWarnMessageHandler}
          maxCountNumberHandler={maxCountNumberHandler}
        />
        <ParametrModal
          isModalVisible={iotspdState.isParametrModalVisible}
          isButtonLoading={iotspdState.isButtonLoading}
          modalVariant={iotspdState.parametrModalVariant}
          validationSchema={parametrValidationSchema}
          newParamsListInitialValues={newParamsListInitialValues}
          updateParamsListInitialValues={
            iotspdState.updateParamFormInitialValues
          }
          onOk={parametrModalOnSubmitHandler}
          onCancel={parametrModalOnCloseHandler}
          paramItems={iotspdState.paramItems}
          maxCountNumberHandler={maxCountNumberHandler}
        />
        <Modal
          title="Предупреждение!"
          maskClosable={false}
          visible={iotspdState.isWarnMessageVisible && iotspdState.warnFieldsMessage.length > 0}
          destroyOnClose
          onCancel={onCloseWarnMessageHandler}
          footer={<UniButton
            key={"close"}
            title={"Закрыть"}
            type={"link"}
            buttonHandler={onCloseWarnMessageHandler}
          />}
        >
          <div>
            <p>Необходимо заполнить следующие поля:</p>
            {iotspdState.warnFieldsMessage && iotspdState.warnFieldsMessage.map((item: string) => <p>- {item}</p>)}
          </div>
        </Modal>
      </Layout>
    </PageLayoutStyled>
  );
});
