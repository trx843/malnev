import React, { FC } from "react";
import { Button, Upload } from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { ActParams } from "../CreateVerificationActModal";

interface CreateActModalFooterProps {
  isFinish: boolean;
  onBack: () => void;
  onNext: () => void;
  onCreate: () => void;
  onDownloadTemplate: () => void;
  loading: boolean;
  customRequest: (options: any) => void;
  isImportLoading: boolean;
  isDownloadLoading: boolean;
  values: ActParams;
}

export const CreateActModalFooter: FC<CreateActModalFooterProps> = ({
  isFinish,
  onBack,
  onNext,
  onCreate,
  onDownloadTemplate,
  loading,
  customRequest,
  isImportLoading,
  isDownloadLoading,
  values,
}) => {
  const downloadDisableHandler = () => {
    let result = false;
    if (values.actType === "existSchedule"
      && values.ostRnuPsp_VerificationSchedulesId.length < 1) {
      result = true;
    }
    if (values.actType === "notExist"
      && values.verificationLevelId.length < 1
      || values.actType === "notExist"
      && values.checkTypeId.length < 1) {
      result = true;
    }
    return result;
  }

  const renderFinish = () => (
    <>
      <Button type="link" onClick={onBack}>
        Назад
      </Button>
      <Button type="primary" loading={loading} onClick={onCreate}>
        Создать
      </Button>
    </>
  );

  const renderNavigation = () => (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        onClick={onDownloadTemplate}
        icon={<DownloadOutlined />}
        style={{ marginRight: "15px" }}
        disabled={isImportLoading || downloadDisableHandler()}
        loading={isDownloadLoading}
      >
        Скачать шаблон
      </Button>

      <Upload
        customRequest={customRequest}
        showUploadList={false}
      >
        <Button
          icon={<UploadOutlined />}
          loading={isImportLoading}
          disabled={isDownloadLoading}
        >
          Импорт файла
        </Button>
      </Upload>

      <Button
        type="primary"
        onClick={onNext}
        style={{ marginLeft: "15px" }}
        disabled={isImportLoading || isDownloadLoading}
      >
        Далее
      </Button>
    </div>
  );
  return <>{isFinish ? renderFinish() : renderNavigation()}</>;
};
