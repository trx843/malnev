import UploadOutlined from "@ant-design/icons/UploadOutlined";
import { Button, Modal, Select, Switch, Upload, Typography, Form } from "antd";
import React, { useState } from "react";
import { FC } from "react";
import styled from "styled-components";
import {
  DocTypesResponseType,
  FAQFileItemsType,
} from "../../../api/responses/faq-page.response";
import {
  UpdatedFAQItemType,
  UpdatedFAQItemsType,
} from "../../../pages/FAQ/presenter";
import { UniButton } from "../../UniButton";
import styles from "./styles.module.css";

const { Text } = Typography;

const StyledSwitchDiv = styled.div`
  display: inline;
  ${(props: { isUpdate: boolean }) => (props.isUpdate ? `color: #1890ff` : "")}
`;

const StyledSelect = styled(Select)`
  width: ${(props: { widthPercent: number }) => props.widthPercent}%;
`;

type PropsType = {
  updatedFAQFiles: Array<UpdatedFAQItemsType>;
  isModalVisible: boolean;
  onCancelModalHandler: () => void;
  selectorGroupChangeHandler: (value: number) => void;
  switchChangeHandler: () => void;
  selectorFileChangeHandler: (value: any) => void;
  selectedForChangingFile: UpdatedFAQItemType | null;
  selectFileHandler: (e: any) => void;
  addFileHandler: () => void;
  replaceFileHandler: () => void;
  selectedDocType: DocTypesResponseType | null;
  selectedModel: FAQFileItemsType | null;
  selectedFile: File | null;
  docTypes: Array<DocTypesResponseType>;
  isUpdate: boolean;
  isButtonLoading: boolean;
  isFile: boolean;
  onRemoveHandler: () => void;
  beforeUploadHandler: () => void;
};

export const FAQAddOrUpdateModal: FC<PropsType> = ({
  isModalVisible,
  onCancelModalHandler,
  addFileHandler,
  selectedFile,
  selectedModel,
  selectorGroupChangeHandler,
  selectFileHandler,
  switchChangeHandler,
  isUpdate,
  selectorFileChangeHandler,
  selectedForChangingFile,
  replaceFileHandler,
  docTypes,
  selectedDocType,
  isButtonLoading,
  isFile,
  onRemoveHandler,
  beforeUploadHandler
}) => {
  const uploadProps = {
    onRemove: (file: any) => {
      onRemoveHandler();
    },
    beforeUpload: (file: any) => {
      beforeUploadHandler();
      return false;
    },
  };

  const filterOptionsHandler = (input: string, option: any): boolean => {
    let label = option?.label?.props?.children[1]?.props?.children as string;
    return label.toLowerCase().includes(input.toLowerCase());
  };

  return (
    <>
      {isModalVisible && (
        <Modal
          maskClosable={false}
          title={isUpdate ? "Заменить файл" : "Добавить файл"}
          visible={isModalVisible}
          onCancel={onCancelModalHandler}
          destroyOnClose
          footer={[
            <UniButton
              key={"back"}
              buttonHandler={onCancelModalHandler}
              danger={true}
              title={"Назад"}
              type={"default"}
            />,
            <UniButton
              key={"clear"}
              buttonHandler={() =>
                isUpdate ? replaceFileHandler() : addFileHandler()
              }
              title={isUpdate ? "Заменить" : "Добавить"}
              type={"default"}
              isButtonLoading={isButtonLoading}
              isDisabled={
                isUpdate
                  ? !selectedDocType ||
                    !selectedFile ||
                    !selectedForChangingFile
                  : !selectedDocType || !selectedFile
              }
            />,
          ]}
        >
          <Upload {...uploadProps} onChange={selectFileHandler}>
            <Button icon={<UploadOutlined />} disabled={isFile}>
              Выбрать файл
            </Button>
          </Upload>

          <div className={styles.select}>
            <Text type={"secondary"} className={styles.selectText}>
              Группа
            </Text>

            <StyledSelect
              widthPercent={50}
              onChange={selectorGroupChangeHandler}
              options={docTypes.map((item: DocTypesResponseType) => ({
                label: item.description,
                value: item.id,
                key: item.id,
              }))}
              allowClear
              showSearch
              optionFilterProp={"label"}
            />
          </div>

          <div>
            <StyledSwitchDiv isUpdate={!isUpdate}>
              Добавить новый
            </StyledSwitchDiv>
            <Switch
              disabled={
                selectedModel === null || selectedModel.items.length < 1
              }
              className={styles.switch}
              checked={isUpdate}
              onChange={switchChangeHandler}
            />
            <StyledSwitchDiv isUpdate={isUpdate}>
              Заменить существующий
            </StyledSwitchDiv>
            <br />
          </div>

          {!isUpdate ? null : (
            <div>
              <Text type={"secondary"} className={styles.selectText}>
                Выбрать файл для замены
              </Text>
              <StyledSelect
                widthPercent={70}
                onChange={selectorFileChangeHandler}
                options={selectedModel?.items.map((item: any) => ({
                  label: (
                    <div>
                      {item.icon}
                      <span className={styles.optionSpan}>{item.fileName}</span>
                    </div>
                  ),
                  value: item.id,
                  key: item.id,
                }))}
                showSearch
                optionFilterProp={"label"}
                filterOption={(input, option) =>
                  filterOptionsHandler(input, option)
                }
                labelInValue={true}
                value={{
                  value: "",
                  label: (
                    <div>
                      {selectedForChangingFile?.icon}
                      <span className={styles.optionSpan}>
                        {selectedForChangingFile?.fileName}
                      </span>
                    </div>
                  ),
                }}
              />
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

