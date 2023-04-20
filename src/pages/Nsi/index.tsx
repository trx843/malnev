import React, { FC } from "react";
import './styles.css';
import { PageHeader, Layout, Spin } from "antd";
import usePresenter from "./presenter";
import { СataloguesSider } from "../../components/СataloguesSider";
import { CataloguesTable } from "../../components/CataloguesTable";
import { NsiUpdateModal } from "../../components/СataloguesModals/СataloguesUpdateModal";
import { NsiCreateModal } from "../../components/СataloguesModals/СataloguesCreateModal";
import { NsiDeleteModal } from "../../components/СataloguesModals/СataloguesDeleteModal";
import { PageLayoutStyled } from "../../styles/commonStyledComponents";

export const NsiPage: FC = React.memo(() => {
    const {
        history,
        nsiState,
        onClickSiderHandler,
        modalOnCreateHandler,
        modalOnCancelHandler,
        isCreateModalVisibleHandler,
        isUpdateModalVisibleHandler,
        isDeleteModalVisibleHandler,
        onRowClickHandler,
        modalTitle,
        setModalTitle,
        modalOnResetHandler,
        modalOnUpdateHandler,
        modalOnDeletelHandler,
        createModalFormik,
        updateModalFormik,
    } = usePresenter();

    const { Content } = Layout;

    return <PageLayoutStyled>
        <PageHeader
            style={{ paddingTop: 0 }}
            className="nsiPage-pageHeader"
            onBack={() => history.push("/")}
            title="Справочники"
        />
        {nsiState.isLoading
            ? <Spin size="large" tip="Загрузка контента..." style={{ marginTop: "200px" }} />
            : <Layout>
                <СataloguesSider
                    onClickSiderHandler={onClickSiderHandler}
                    dirSchemes={nsiState.dirSchemes}
                    regSchemes={nsiState.regSchemes}
                />

                <Content>
                    {
                        nsiState.isTableLoading
                            ? <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                width: "100%",
                                backgroundColor: "#fff"
                            }}>
                                <Spin />
                            </div>
                            : <CataloguesTable
                                columnDefs={nsiState.columnDefs}
                                rowData={nsiState.rowData}
                                selectedScheme={nsiState.selectedScheme}
                                setIsCreateModalVisible={isCreateModalVisibleHandler}
                                setIsUpdateModalVisible={isUpdateModalVisibleHandler}
                                setIsDeleteModalVisible={isDeleteModalVisibleHandler}
                                onRowClickHandler={onRowClickHandler}
                                selectedRowInScheme={nsiState.selectedRowInScheme}
                                setModalTitle={setModalTitle}
                            />
                    }
                </Content>

                <NsiCreateModal
                    dataSelectors={nsiState.dataSelectors}
                    selectedScheme={nsiState.selectedScheme}
                    isModalVisible={nsiState.isCreateModalVisible}
                    isButtonLoading={nsiState.isButtonLoading}
                    modalOnOkHandler={modalOnCreateHandler}
                    modalOnResetHandler={modalOnResetHandler}
                    modalOnCancelHandler={modalOnCancelHandler}
                    itemsForForm={nsiState.itemsForForm}
                    modalTitle={modalTitle}
                    formik={createModalFormik}
                />

                <NsiUpdateModal
                    dataSelectors={nsiState.dataSelectors}
                    selectedScheme={nsiState.selectedScheme}
                    isModalVisible={nsiState.isUpdateModalVisible}
                    isButtonLoading={nsiState.isButtonLoading}
                    modalOnOkHandler={modalOnUpdateHandler}
                    modalOnResetHandler={modalOnResetHandler}
                    modalOnCancelHandler={modalOnCancelHandler}
                    itemsForForm={nsiState.itemsForFormFull}
                    modalTitle={modalTitle}
                    formik={updateModalFormik}
                />

                <NsiDeleteModal
                    selectedScheme={nsiState.selectedScheme}
                    isModalVisible={nsiState.isDeleteModalVisible}
                    isButtonLoading={nsiState.isButtonLoading}
                    modalOnDeletelHandler={modalOnDeletelHandler}
                    modalOnCancelHandler={modalOnCancelHandler}
                    modalTitle={modalTitle}
                />
            </Layout>
        }
    </PageLayoutStyled>
});