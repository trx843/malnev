import { FC, useEffect } from "react";
import { Button, Modal } from "antd";
import { CommissionForm } from "./CommissionForm";
import { useAntdFormik } from "../../../../../../customHooks/useAntdFormik";
import { validationSchema } from "./helpers";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (values: any) => Promise<void>;
}

export const CommissionModal: FC<ModalProps> = ({
  visible,
  onClose,
  onCreate
}) => {
  const formik = useAntdFormik({
    validateOnChange: false,
    initialValues: {
      jobTitle: "",
      organizationName: "",
      fullName: "",
      isInPresence: false
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
      title="Комиссия"
      visible={visible}
      maskClosable={false}
      onCancel={handleOnClose}
      width={780}
      destroyOnClose
      footer={
        <Button
          type="primary"
          loading={formik.isSubmitting}
          disabled={formik.isSubmitting}
          onClick={handleSubmitButton}
        >
          Сохранить
        </Button>
      }
    >
      <CommissionForm
        fields={formik.fields}
        onChange={formik.setFieldAntdValue}
        onError={formik.setErrorsAntd}
      />
    </Modal>
  );
};