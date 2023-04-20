import { FC, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Modal } from "antd";

import { AddReportForm } from "./AddReportForm";
import { StateType } from "../../../../../../types";
import { VerificationActStore } from "slices/verificationActs/verificationAct/types";
import { useAntdFormik } from "../../../../../../customHooks/useAntdFormik";
import { validationSchema } from "./helpers";
import { ActionsEnum, Can } from "../../../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  id: string;
  onEdit: (values: any) => Promise<any>;
}

export const ReportEditModal: FC<ModalProps> = ({
  id,
  visible,
  onClose,
  onEdit
}) => {
  const formik = useAntdFormik({
    initialValues: {
      name: "",
      pageCount: 0
    },
    validationSchema,
    onSubmit: onEdit
  });
  const verificationAct = useSelector<StateType, VerificationActStore>(
    state => state.verificationAct
  );

  const actId = verificationAct.act?.id;

  const setInitialValues = useCallback(() => {
    if (actId && id && visible) {
      const items = verificationAct.compositionOfAppendicesToReport;
      const target = items?.find(item => item.id === id);
      if (target) {
        formik.setValues(target);
      }
    }
  }, [id, actId, visible]);

  useEffect(() => {
    setInitialValues();
  }, [setInitialValues]);

  useEffect(() => {
    if (!visible) {
      formik.resetForm();
    }
  }, [visible]);

  const handleSubmitButton = () => {
    formik.submitForm();
  };

  const handleOnClose = () => {
    formik.resetForm();

    onClose?.();
  };

  return (
    <Modal
      title="Добавить информацию о приложениях к отчету"
      visible={visible}
      maskClosable={false}
      onCancel={handleOnClose}
      destroyOnClose
      footer={
        <Can
          I={ActionsEnum.Edit}
          a={elementId(VerificationActsElements[VerificationActsElements.EditApp])}
        >
          <Button
            loading={formik.isSubmitting}
            disabled={formik.isSubmitting}
            onClick={handleSubmitButton}
            type="primary"
          >
            Сохранить
          </Button>
        </Can>
      }
    >
      <AddReportForm
        fields={formik.fields}
        onChange={formik.setFieldAntdValue}
        onError={formik.setErrorsAntd}
      />
    </Modal>
  );
};
