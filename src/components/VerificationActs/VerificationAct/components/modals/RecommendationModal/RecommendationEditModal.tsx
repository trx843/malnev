import React, { FC, useCallback, useEffect } from "react";
import { Button, Modal } from "antd";
import { useSelector } from "react-redux";

import { RecommendationForm } from "./RecommendationForm";
import { StateType } from "../../../../../../types";
import { VerificationActStore } from "../../../../../../slices/verificationActs/verificationAct/types";
import { useAntdFormik } from "../../../../../../customHooks/useAntdFormik";
import { validationSchema } from "./helpers";
import { ActionsEnum, Can } from "../../../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit: (values: any) => Promise<void>;
  initialValues: any
}

export const RecommendationEditModal: FC<ModalProps> = ({
  visible,
  onClose,
  onEdit,
  initialValues
}) => {
  const formik = useAntdFormik({
    validateOnChange: false,
    initialValues: {
      recommendationsText: ""
    },
    validationSchema,
    onSubmit: onEdit
  });

  useEffect(() => {
    formik.setValues(initialValues);
  }, [initialValues]);

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
      title="Рекомендаций"
      visible={visible}
      maskClosable={false}
      onCancel={handleOnClose}
      destroyOnClose
      footer={
        <Can
          I={ActionsEnum.Edit}
          a={elementId(VerificationActsElements[VerificationActsElements.EditRecomendation])}
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
      <RecommendationForm
        fields={formik.fields}
        onChange={formik.setFieldAntdValue}
        onError={formik.setErrorsAntd}
      />
    </Modal>
  );
};
