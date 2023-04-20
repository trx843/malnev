import { FC, useEffect } from "react";
import { Button, Form, Modal } from "antd";

import { AddReportForm } from "./AddReportForm";
import { useAntdFormik } from "../../../../../../customHooks/useAntdFormik";
import { validationSchema } from "./helpers";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (values: any) => Promise<any>;
}

export const AddReportModal: FC<ModalProps> = ({
  visible,
  onClose,
  onCreate
}) => {
  const formik = useAntdFormik({
    initialValues: {
      name: "",
      pageCount: 0
    },
    validationSchema,
    onSubmit: onCreate
  });

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
        <Button
          loading={formik.isSubmitting}
          disabled={formik.isSubmitting}
          onClick={handleSubmitButton}
          type="primary"
        >
          Сохранить
        </Button>
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
