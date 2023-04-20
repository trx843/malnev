import { Button, Col, Layout, Row, Spin } from "antd";
import styles from "./styles.module.css";
import React, { FC } from "react";
import usePresenter, {
  UpdatedFAQItemType,
  UpdatedFAQItemsType,
} from "./presenter";
import { FAQAddOrUpdateModal } from "../../components/FAQ/FAQAddOrUpdateModal";
import { ActionsEnum, Can } from "../../casl";
import { elementId, FAQElements } from "./constant";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import { FAQDeleteFileModel } from "components/FAQ/FAQDeleteFileModel";
import { PageLayoutStyled } from "../../styles/commonStyledComponents";

export const FAQPage: FC = React.memo(() => {
  const {
    updatedFAQFiles,
    getOneFAQFileHelper,
    modalOpenButtonHandler,
    isModalVisible,
    onCancelModalHandler,
    addFileHandler,
    selectedFile,
    selectedModel,
    selectorGroupChangeHandler,
    selectFileHandler,
    isUpdate,
    switchChangeHandler,
    selectorFileChangeHandler,
    selectedForChangingFile,
    replaceFileHandler,
    isLoading,
    docTypes,
    selectedDocType,
    isButtonLoading,
    deleteModelClikHandler,
    cancelDeleteModalHendler,
    deleteFileHandler,
    isDeleteModalVisible,
    confirmLoading,
    isFile,
    onRemoveHandler,
    beforeUploadHandler,
  } = usePresenter();

  return (
    <PageLayoutStyled>
      <Row justify="end">
        <Col>
          <Can
            I={ActionsEnum.View}
            a={elementId(FAQElements[FAQElements.AddFile])}
          >
            <Button
              type={"primary"}
              onClick={modalOpenButtonHandler}
              className={styles.button}
            >
              Добавить файл
            </Button>
          </Can>
        </Col>
      </Row>

      <Layout>
        <Row style={{height:"100%", overflowY: "auto"}}>
          <Col span={24}>
            <Spin spinning={isLoading}>
              {updatedFAQFiles.length ? (
                updatedFAQFiles.map((model: UpdatedFAQItemsType) => {
                  return (
                    <div className={styles.group}>
                      <div className={styles.groupHeaderBlock}>
                        <h3 className={styles.groupHeader}>{model.typeName}</h3>
                      </div>
                      <ul>
                        {model.items.map((item: UpdatedFAQItemType) => {
                          return (
                            <div className={styles.link}>
                              <Button
                                type={"link"}
                                onClick={() => {
                                  getOneFAQFileHelper(item.id);
                                }}
                                loading={item.disabled}
                                disabled={item.disabled}
                                icon={item.icon}
                                className={styles.linkText}
                              >
                                {item.fileName}
                              </Button>
                              <Button
                                type={"link"}
                                onClick={() => deleteModelClikHandler(item.id)}
                                className={styles.groupHeaderButton}
                              >
                                <DeleteOutlined
                                  className={styles.deleteButton}
                                />
                              </Button>
                            </div>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })
              ) : !isLoading ? (
                <div>
                  <h3 className={styles.groupHeader}>
                    В данный раздел пока не было загружено ни одного файла
                  </h3>
                </div>
              ) : (
                <></>
              )}
            </Spin>
          </Col>
        </Row>
      </Layout>

      <FAQAddOrUpdateModal
        updatedFAQFiles={updatedFAQFiles}
        isModalVisible={isModalVisible}
        onCancelModalHandler={onCancelModalHandler}
        selectorGroupChangeHandler={selectorGroupChangeHandler}
        switchChangeHandler={switchChangeHandler}
        selectorFileChangeHandler={selectorFileChangeHandler}
        selectFileHandler={selectFileHandler}
        selectedForChangingFile={selectedForChangingFile}
        addFileHandler={addFileHandler}
        replaceFileHandler={replaceFileHandler}
        selectedDocType={selectedDocType}
        selectedModel={selectedModel}
        selectedFile={selectedFile}
        docTypes={docTypes}
        isUpdate={isUpdate}
        isButtonLoading={isButtonLoading}
        isFile={isFile}
        onRemoveHandler={onRemoveHandler}
        beforeUploadHandler={beforeUploadHandler}
      />
      <FAQDeleteFileModel
        isModalVisible={isDeleteModalVisible}
        deleteHandler={deleteFileHandler}
        cancelHandler={cancelDeleteModalHendler}
        confirmLoading={confirmLoading}
      />
    </PageLayoutStyled>
  );
});
