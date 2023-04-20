import React from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { Button, message, Popconfirm, Tooltip, Upload } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import {
  FileExcelOutlined,
  FileOutlined,
  SwapOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  cancelProgramKsPp,
  getKsPpILProgramsThunk,
} from "../../../../../../../thunks/pspControl/ksPpILPrograms";
import { Nullable, StateType } from "../../../../../../../types";
import { IKsPpILProgramsStore } from "../../../../../../../slices/pspControl/ksPpILPrograms";
import { ModalTypes } from "../../../ModalForCreatingAndReplacingProgram/constants";
import { ITableCellRendererParams } from "../../../../../../../components/AgGridTable/types";
import { IProgramKsPpIlListModel } from "../../../../../../../slices/pspControl/ksPpILPrograms/types";
import styles from "./actionsColumn.module.css";
import {
  apiBase,
  textFilesAndImagesValidator,
} from "../../../../../../../utils";
import { ApiRoutes } from "../../../../../../../api/api-routes.enum";
import { UploadFileStatuses } from "../../../../../../../components/UploadAttachment/types";
import {
  isCancelProgramButtonVisible,
  isProgramReplacementButtonVisible,
} from "./utils";
import { ActionsEnum, Can } from "../../../../../../../casl";
import { elementId, KsPpILProgramsElements } from "pages/PspControl/KsPpILPrograms/constants";

const cx = classNames.bind(styles);

interface IProps extends ITableCellRendererParams<IProgramKsPpIlListModel> {
  openProgramReplacementModal: (type: ModalTypes, id: Nullable<string>) => void;
}

export const ActionsColumn: React.FC<IProps> = ({
  data,
  openProgramReplacementModal,
}) => {
  const programId = data.id;
  const statusId = data.statusId;
  const hasFile = data.hasFile;

  const dispatch = useDispatch();

  const { listFilter } = useSelector<StateType, IKsPpILProgramsStore>(
    (state) => state.ksPpILPrograms
  );

  const handleCancelProgramKsPp = async () => {
    await cancelProgramKsPp(programId);
    dispatch(getKsPpILProgramsThunk(listFilter));
  };

  const onChangeUpload = (info: UploadChangeParam) => {
    if (info.file.status === UploadFileStatuses.done) {
      dispatch(getKsPpILProgramsThunk(listFilter));
    }

    if (info.file.status === UploadFileStatuses.error) {
      message.error({
        content: "Произошла ошибка при добавлении файла",
        duration: 2,
      });
    }
  };

  return (
    <React.Fragment>
      {!hasFile && (
        <Tooltip title="Добавить вложение">
          <Upload
            action={`${apiBase}${ApiRoutes.ProgramKspp}/${programId}/file`}
            beforeUpload={textFilesAndImagesValidator}
            onChange={onChangeUpload}
            withCredentials={true}
            showUploadList={false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />} type="link" />
          </Upload>
        </Tooltip>
      )}
      <Can
        I={ActionsEnum.View}
        a={elementId(KsPpILProgramsElements[KsPpILProgramsElements.DownloadProgram])}
      >
        {hasFile && (
          <Tooltip title="Скачать программу">
            <Button
              icon={<FileOutlined />}
              type="link"
              href={`${apiBase}${ApiRoutes.ProgramKspp}/file/${programId}`}
            />
          </Tooltip>
        )}
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(KsPpILProgramsElements[KsPpILProgramsElements.CancelProgram])}
      >
        {isCancelProgramButtonVisible(statusId, hasFile) && (
          <Popconfirm
            title="Действие программы будет отменено. Вы действительно хотите выполнить отмену?"
            onConfirm={handleCancelProgramKsPp}
            okText="Да"
            cancelText="Отмена"
          >
            <Tooltip title="Отменить программу">
              <Button icon={<FileExcelOutlined />} type="link" />
            </Tooltip>
          </Popconfirm>
        )}
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(KsPpILProgramsElements[KsPpILProgramsElements.Changeprogram])}
      >
        {isProgramReplacementButtonVisible(statusId, hasFile) && (
          <Tooltip title="Заменить программу">
            <Button
              onClick={() =>
                openProgramReplacementModal(ModalTypes.replacement, programId)
              }
              icon={<SwapOutlined />}
              type="link"
            />
          </Tooltip>
        )}
      </Can>
    </React.Fragment>
  );
};
