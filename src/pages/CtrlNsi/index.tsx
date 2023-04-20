import { Layout, PageHeader, Spin } from "antd";
import React, { FC } from "react";
import { PageLayoutStyled } from "../../styles/commonStyledComponents";
import usePresenter from "./presenter";
import '../Nsi/styles.css';
import { СataloguesSider } from "../../components/СataloguesSider";
import { CataloguesTable } from "../../components/CataloguesTable";
import { NsiUpdateModal } from "../../components/СataloguesModals/СataloguesUpdateModal";
import { NsiCreateModal } from "../../components/СataloguesModals/СataloguesCreateModal";
import { NsiDeleteModal } from "../../components/СataloguesModals/СataloguesDeleteModal";

export const CtrlNsiPage: FC = React.memo(() => {
    const {
        history,
        ctrlNsiState,
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
            title="Редактирование справочников надзора"
        />
        {ctrlNsiState.isLoading
            ? <Spin size="large" tip="Загрузка контента..." style={{ marginTop: "200px" }} />
            : <Layout>
                <СataloguesSider
                    onClickSiderHandler={onClickSiderHandler}
                    dirSchemes={ctrlNsiState.dirSchemes}
                    regSchemes={ctrlNsiState.regSchemes}
                />

                <Content>
                    {
                        ctrlNsiState.isTableLoading
                            ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%", backgroundColor: "#fff" }}>
                                <Spin />
                            </div>
                            : <CataloguesTable
                                columnDefs={ctrlNsiState.columnDefs}
                                rowData={ctrlNsiState.rowData}
                                selectedScheme={ctrlNsiState.selectedScheme}
                                setIsCreateModalVisible={isCreateModalVisibleHandler}
                                setIsUpdateModalVisible={isUpdateModalVisibleHandler}
                                setIsDeleteModalVisible={isDeleteModalVisibleHandler}
                                onRowClickHandler={onRowClickHandler}
                                selectedRowInScheme={ctrlNsiState.selectedRowInScheme}
                                setModalTitle={setModalTitle}
                            />
                    }
                </Content>

                <NsiCreateModal
                    dataSelectors={ctrlNsiState.dataSelectors}
                    selectedScheme={ctrlNsiState.selectedScheme}
                    isModalVisible={ctrlNsiState.isCreateModalVisible}
                    isButtonLoading={ctrlNsiState.isButtonLoading}
                    modalOnOkHandler={modalOnCreateHandler}
                    modalOnResetHandler={modalOnResetHandler}
                    modalOnCancelHandler={modalOnCancelHandler}
                    itemsForForm={ctrlNsiState.itemsForForm}
                    modalTitle={modalTitle}
                    formik={createModalFormik}
                />

                <NsiUpdateModal
                    dataSelectors={ctrlNsiState.dataSelectors}
                    selectedScheme={ctrlNsiState.selectedScheme}
                    isModalVisible={ctrlNsiState.isUpdateModalVisible}
                    isButtonLoading={ctrlNsiState.isButtonLoading}
                    modalOnOkHandler={modalOnUpdateHandler}
                    modalOnResetHandler={modalOnResetHandler}
                    modalOnCancelHandler={modalOnCancelHandler}
                    itemsForForm={ctrlNsiState.itemsForFormFull}
                    modalTitle={modalTitle}
                    formik={updateModalFormik}
                />

                <NsiDeleteModal
                    selectedScheme={ctrlNsiState.selectedScheme}
                    isModalVisible={ctrlNsiState.isDeleteModalVisible}
                    isButtonLoading={ctrlNsiState.isButtonLoading}
                    modalOnDeletelHandler={modalOnDeletelHandler}
                    modalOnCancelHandler={modalOnCancelHandler}
                    modalTitle={modalTitle}
                />
            </Layout>
        }
    </PageLayoutStyled>
})