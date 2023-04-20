import { Layout, PageHeader, Spin } from "antd";
import React, { FC } from "react";
import { PageLayoutStyled } from "../../styles/commonStyledComponents";
import '../Nsi/styles.css';
import { СataloguesSider } from "../../components/СataloguesSider";
import { CataloguesTable } from "../../components/CataloguesTable";
import { NsiUpdateModal } from "../../components/СataloguesModals/СataloguesUpdateModal";
import { NsiCreateModal } from "../../components/СataloguesModals/СataloguesCreateModal";
import { NsiDeleteModal } from "../../components/СataloguesModals/СataloguesDeleteModal";
import usePresenter from "./presenter";

export const tspdNsiPage: FC = React.memo(() => {
    const {
        history,
        tspdNsiState,
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
            title="Редактирование справочников ИО ТСПД"
            subTitle=""
        />
        {tspdNsiState.isLoading
            ? <Spin size="large" tip="Загрузка контента..." style={{ marginTop: "200px" }} />
            : <Layout>
                <СataloguesSider
                    onClickSiderHandler={onClickSiderHandler}
                    dirSchemes={tspdNsiState.dirSchemes}
                    regSchemes={tspdNsiState.regSchemes}
                />

                <Content>
                    {
                        tspdNsiState.isTableLoading
                            ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%", backgroundColor: "#fff" }}>
                                <Spin />
                            </div>
                            : <CataloguesTable
                                columnDefs={tspdNsiState.columnDefs}
                                rowData={tspdNsiState.rowData}
                                selectedScheme={tspdNsiState.selectedScheme}
                                setIsCreateModalVisible={isCreateModalVisibleHandler}
                                setIsUpdateModalVisible={isUpdateModalVisibleHandler}
                                setIsDeleteModalVisible={isDeleteModalVisibleHandler}
                                onRowClickHandler={onRowClickHandler}
                                selectedRowInScheme={tspdNsiState.selectedRowInScheme}
                                setModalTitle={setModalTitle}
                            />
                    }
                </Content>

                <NsiCreateModal
                    dataSelectors={tspdNsiState.dataSelectors}
                    selectedScheme={tspdNsiState.selectedScheme}
                    isModalVisible={tspdNsiState.isCreateModalVisible}
                    isButtonLoading={tspdNsiState.isButtonLoading}
                    modalOnOkHandler={modalOnCreateHandler}
                    modalOnResetHandler={modalOnResetHandler}
                    modalOnCancelHandler={modalOnCancelHandler}
                    itemsForForm={tspdNsiState.itemsForForm}
                    modalTitle={modalTitle}
                    formik={createModalFormik}
                />

                <NsiUpdateModal
                    dataSelectors={tspdNsiState.dataSelectors}
                    selectedScheme={tspdNsiState.selectedScheme}
                    isModalVisible={tspdNsiState.isUpdateModalVisible}
                    isButtonLoading={tspdNsiState.isButtonLoading}
                    modalOnOkHandler={modalOnUpdateHandler}
                    modalOnResetHandler={modalOnResetHandler}
                    modalOnCancelHandler={modalOnCancelHandler}
                    itemsForForm={tspdNsiState.itemsForFormFull}
                    modalTitle={modalTitle}
                    formik={updateModalFormik}
                />

                <NsiDeleteModal
                    selectedScheme={tspdNsiState.selectedScheme}
                    isModalVisible={tspdNsiState.isDeleteModalVisible}
                    isButtonLoading={tspdNsiState.isButtonLoading}
                    modalOnDeletelHandler={modalOnDeletelHandler}
                    modalOnCancelHandler={modalOnCancelHandler}
                    modalTitle={modalTitle}
                />
            </Layout>
        }
    </PageLayoutStyled>
})