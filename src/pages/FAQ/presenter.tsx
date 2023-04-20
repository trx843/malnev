import FileExcelOutlined from "@ant-design/icons/FileExcelOutlined";
import FilePdfOutlined from "@ant-design/icons/FilePdfOutlined";
import FilePptOutlined from "@ant-design/icons/FilePptOutlined";
import FileTextOutlined from "@ant-design/icons/FileTextOutlined";
import FileWordOutlined from "@ant-design/icons/FileWordOutlined";
import FileUnknownOutlined from "@ant-design/icons/lib/icons/FileUnknownOutlined";
import { message } from "antd";
import  { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DocTypesResponseType,
  FAQFileItemsType,
  FAQFileType,
  ResponseFAQFilesType,
} from "../../api/responses/faq-page.response";
import {
  changeValueIsSuccessMessage,
  clearErrorText,
  FAQStateType,
  setDeleteFileId,
  setIsDeleteModalVisible,
  setSelectedDocType,
  setSelectedFile,
  setSelectedForChangingFile,
  setSelectedModel,
  setUpdatedFAQFiles,
} from "../../slices/FAQ";
import {
  addNewFileTC,
  deleteFileTC,
  getAllFilesTC,
  getDocTypesTC,
  getOneFileTC,
  replaceFileTC,
} from "../../thunks/FAQPage";
import { IdType, StateType } from "../../types";
import styles from "./styles.module.css";

const usePresenter = () => {
  const dispatch = useDispatch();

  const {
    FAQFiles,
    updatedFAQFiles,
    selectedFile,
    selectedModel,
    selectedForChangingFile,
    errorText,
    isLoading,
    docTypes,
    selectedDocType,
    isButtonLoading,
    isSuccessMessage,
    deleteFileId,
    confirmLoading,
    isDeleteModalVisible
  } = useSelector<StateType, FAQStateType>((state) => state.FAQ);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isFile, setIsFile] = useState<boolean>(false);


  //page
  useEffect(() => {
    dispatch(getAllFilesTC()); //получение списка всех документов
    dispatch(getDocTypesTC()); //получение всех возможных директорий для документов
  }, []);

  useEffect(() => {
    dispatch(setUpdatedFAQFiles(FAQFielsHelper(FAQFiles))); //переформатирование списка файлов, вернувшихся с бэка, отрисовываем по нему
  }, [FAQFiles]);

  const getOneFAQFileHelper = useCallback((id: string | number) => {
    //получение и скачивание выбранного документа
    dispatch(getOneFileTC(id));
  }, []);

  const FAQFielsHelper = (FAQFiles: ResponseFAQFilesType) => {
    let data: Array<UpdatedFAQItemsType> = [];

    const fileItemHelper = (files: Array<FAQFileType>) => {
      const getIcon = (fileName: string) => {
        let split: string[] = fileName.split(".");
        let length: number = split.length;
        let ext: string = length > 0 ? split[length - 1] : "";
        switch (ext) {
          case "xls":
          case "xlsx":
            return <FileExcelOutlined className={styles.linkImage} />;
          case "doc":
          case "docx":
            return <FileWordOutlined className={styles.linkImage} />;
          case "ppt":
          case "pptx":
            return <FilePptOutlined className={styles.linkImage} />;
          case "pdf":
            return <FilePdfOutlined className={styles.linkImage} />;
          case "txt":
            return <FileTextOutlined className={styles.linkImage} />;
          default:
            return <FileUnknownOutlined className={styles.linkImage} />;
        }
      };
      let newFiles = files.map((file: FAQFileType) => ({
        id: file.id,
        fileName: file.fileName,
        disabled: file.disabled ?? false,
        icon: getIcon(file.fileName),
      }));
      return newFiles;
    };

    const fileItemsHelper = (filesBlock: FAQFileItemsType) => {
      let newFilesBlock: UpdatedFAQItemsType = {
        typeId: filesBlock.typeId,
        typeName: filesBlock.typeName,
        items: [],
      };
      newFilesBlock.items = fileItemHelper(filesBlock.items);
      return newFilesBlock;
    };

    FAQFiles.forEach((FAQFileItems: FAQFileItemsType) => {
      data.push(fileItemsHelper(FAQFileItems));
    });

    return data;
  };

  const modalOpenButtonHandler = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  //modal
  useEffect(() => {
    errorText &&
      message.error(errorText, () => {
        dispatch(clearErrorText());
      });
  }, [errorText]);

  useEffect(() => {
    setIsModalVisible(false);
    setIsUpdate(false);
    dispatch(setSelectedModel(null));
    dispatch(setSelectedFile(null));
    dispatch(setSelectedForChangingFile(null));
    isSuccessMessage &&
      message.success("Файл добавлен успешно!", () => {
        dispatch(changeValueIsSuccessMessage(false));
      });
  }, [isSuccessMessage]);

  const selectFileHandler = useCallback((e: HandlerFileType) => {
    //выбор файла для отправки на сервер
    dispatch(setSelectedFile(e.file));
  }, []);

  const selectorGroupChangeHandler = useCallback(
    (value: number) => {
      //выбор или изменение файловой группы
      setIsUpdate(false);
      dispatch(setSelectedDocType(null));
      let selectedDocType = docTypes.find(
        (y: DocTypesResponseType) => y.id === value
      );
      if (selectedDocType) {
        dispatch(setSelectedDocType(selectedDocType));
      }
      if (updatedFAQFiles) {
        let selectedModel = updatedFAQFiles.find(
          (model: UpdatedFAQItemsType) => model.typeId === value
        );
        if (selectedModel) {
          dispatch(setSelectedModel(selectedModel));
        } else {
          dispatch(setSelectedModel(null));
        }
      }
    },
    [docTypes, updatedFAQFiles]
  );

  const switchChangeHandler = useCallback(() => {
    //выбор варианта процедуры данного окна
    setIsUpdate(!isUpdate);
  }, [isUpdate]);

  const selectorFileChangeHandler = useCallback(
    (value: any) => {
      let newFile = selectedModel?.items.find((y: any) => y.id === value.key);
      if (newFile) {
        dispatch(setSelectedForChangingFile(newFile));
      }
    },
    [selectedModel]
  );

  const onCancelModalHandler = useCallback(() => {
    setIsModalVisible(false);
    setIsUpdate(false);
    setIsFile(false);
    dispatch(setSelectedModel(null));
    dispatch(setSelectedFile(null));
    dispatch(setSelectedForChangingFile(null));
  }, []);

  const addFileHandler = useCallback(() => {
    setIsFile(false);
    const fd = new FormData();
    if (selectedFile) {
      fd.append("file", selectedFile, selectedFile.name);
    }
    if (selectedDocType) {
      dispatch(addNewFileTC({ newFile: fd, docType: selectedDocType.id }));
    }
  }, [selectedFile, selectedDocType]);

  const replaceFileHandler = useCallback(() => {
    setIsFile(false);
    const fd = new FormData();
    if (selectedFile) {
      fd.append("file", selectedFile, selectedFile.name);
    }
    if (selectedForChangingFile && selectedModel) {
      dispatch(
        replaceFileTC({
          fileId: selectedForChangingFile?.id,
          newFile: fd,
          docType: selectedModel.typeId,
        })
      );
    }
  }, [selectedForChangingFile, selectedFile, selectedModel]);

  const deleteModelClikHandler = useCallback((id: IdType) => {
    dispatch(setIsDeleteModalVisible(true));
    dispatch(setDeleteFileId(id));
  }, []);

  const cancelDeleteModalHendler = useCallback(() => {
    dispatch(setIsDeleteModalVisible(false));
    dispatch(setDeleteFileId(null));
  }, []);
  const deleteFileHandler = useCallback(() => {
    if (deleteFileId) dispatch(deleteFileTC({ fileId: deleteFileId }));
  }, [deleteFileId]);

  const onRemoveHandler = useCallback(() => {
    setIsFile(false);
  }, []);

  const beforeUploadHandler = useCallback(() => {
    setIsFile(true);
  }, []);

  return {
    updatedFAQFiles,
    getOneFAQFileHelper,
    isModalVisible,
    modalOpenButtonHandler,
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
    beforeUploadHandler
  };
};

export default usePresenter;

export type UpdatedFAQItemsType = {
  typeId: number;
  typeName: string;
  items: Array<UpdatedFAQItemType>;
};

export type UpdatedFAQItemType = {
  id: string | number;
  fileName: string;
  disabled: boolean;
  icon: JSX.Element;
};

export type HandlerFileType = {
  file: File;
  fileList: Array<File>;
};


