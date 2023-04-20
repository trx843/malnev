import React, { FC, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Modal } from "antd";
import maxBy from "lodash/maxBy";

import { OtherSideForm } from "./OtherSideForm";
import { StateType } from "../../../../../../types";
import { VerificationActStore } from "../../../../../../slices/verificationActs/verificationAct/types";
import { useAntdFormik } from "../../../../../../customHooks/useAntdFormik";
import { validationSchema, ALLOW_VALUES } from "./helpers";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (values: any) => Promise<any>;
}

export const OtherSideModal: FC<ModalProps> = ({
  onCreate,
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();

  const formik = useAntdFormik({
    validateOnChange: false,
    initialValues: {
      ctoName: "",
      partyName: "",
    },
    validationSchema,
    onSubmit: onCreate,
  });

  const verificationAct = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  useEffect(() => {
    if (!visible) {
      formik.resetForm();
      form.resetFields();
    }
  }, [visible]);

  const handleSubmitButton = () => {
    formik.submitForm();
  };

  const handleOnClose = () => {
    form.resetFields();
    onClose?.();
  };

  const maxSerial = useMemo(() => {
    if (!verificationAct.currentId) {
      return 0;
    }
    const items =
      verificationAct.memoizePages[verificationAct.currentId].otherSides.items;
    return maxBy(items, (item) => item.serial)?.serial || 0;
  }, [verificationAct.currentId, verificationAct.memoizePages]);

  return (
    <Modal
      title="Другие стороны"
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
      <OtherSideForm
        form={form}
        serial={Number(maxSerial) + 1}
        fields={formik.fields}
        isRequiredPartName={!ALLOW_VALUES.includes(formik.values.ctoName)}
        onChange={formik.setFieldAntdValue}
        onError={formik.setErrorsAntd}
      />
    </Modal>
  );
};
