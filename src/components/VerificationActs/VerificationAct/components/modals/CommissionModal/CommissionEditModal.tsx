import { FC, useCallback, useEffect } from "react";
import { Button, Modal } from "antd";
import { useSelector } from "react-redux";
import { CommissionForm } from "./CommissionForm";
import { StateType } from "../../../../../../types";
import { VerificationActStore } from "../../../../../../slices/verificationActs/verificationAct/types";
import { useAntdFormik } from "../../../../../../customHooks/useAntdFormik";
import { validationSchema } from "./helpers";
import { ActionsEnum, Can } from "../../../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";
import { CommissionItem } from "components/VerificationActs/VerificationAct/classes";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit: (values: any) => Promise<void>;
  initialValues: CommissionItem | any;
}

export const CommissionEditModal: FC<ModalProps> = ({
  visible,
  onClose,
  onEdit,
  initialValues
}) => {
  const formik = useAntdFormik({
    validateOnChange: false,
    initialValues: {
      jobTitle: "",
      organizationName: "",
      fullName: "",
      isInPresence: true
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
        <Can
          I={ActionsEnum.Edit}
          a={elementId(VerificationActsElements[VerificationActsElements.EditCommitteeMember])}
        >
          <Button
            type="primary"
            loading={formik.isSubmitting}
            disabled={formik.isSubmitting}
            onClick={handleSubmitButton}
          >
            Сохранить
          </Button>
        </Can>
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