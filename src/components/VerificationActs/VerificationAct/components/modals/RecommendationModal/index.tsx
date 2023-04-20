import React, { FC, useEffect } from "react";
import { Button, Form, Modal } from "antd";

import { RecommendationForm } from "./RecommendationForm";
import { useAntdFormik } from "../../../../../../customHooks/useAntdFormik";
import { validationSchema } from "./helpers";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (values: any) => Promise<void>;
}

export const RecommendationModal: FC<ModalProps> = ({
  visible,
  onCreate,
  onClose
}) => {
  const formik = useAntdFormik({
    validateOnChange: false,
    initialValues: {
      recommendationsText: ""
    },
    validationSchema,
    onSubmit: onCreate
  });

  useEffect(() => {
    if (!visible) {
      formik.resetForm();
    }
  }, [visible]);

  const handleSubmitButton = async () => {
    await formik.submitForm();
  };

  const handleOnClose = () => {
    formik.resetForm();
    onClose?.();
  };

  return (
    <Modal
      title="Рекомендация"
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
      <RecommendationForm
        fields={formik.fields}
        onChange={formik.setFieldAntdValue}
        onError={formik.setErrorsAntd}
      />
    </Modal>
  );
};
