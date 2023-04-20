import React, { FC, useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Modal } from "antd";
import maxBy from "lodash/maxBy";
import { OtherSideForm } from "./OtherSideForm";
import { StateType } from "../../../../../../types";
import { VerificationActStore } from "../../../../../../slices/verificationActs/verificationAct/types";
import { useVerificationActOptions } from "../../../hooks/useVerificationActOptions";
import { useAntdFormik } from "../../../../../../customHooks/useAntdFormik";
import { validationSchema, ALLOW_VALUES } from "./helpers";
import { ActionsEnum, Can } from "../../../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit: (values: any) => void;
  id: string;
}

export const OtherSideEditModal: FC<ModalProps> = ({
  id,
  visible,
  onClose,
  onEdit,
}) => {
  const [form] = Form.useForm();
  const formik = useAntdFormik({
    validateOnChange: false,
    initialValues: {
      ctoName: "",
      partyName: "",
    },
    validationSchema,
    onSubmit: onEdit,
  });

  const { getCtoOptions } = useVerificationActOptions();
  const verificationAct = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );

  const setInitialValues = useCallback(() => {
    if (verificationAct.currentId && id && visible) {
      const items =
        verificationAct.memoizePages[verificationAct.currentId]?.otherSides
          .items;
      const target = items?.find((item) => item.id === id);
      if (target) {
        formik.setValues(target);
      }
    }
  }, [id, verificationAct.currentId, verificationAct.memoizePages, visible]);

  const loadOptions = useCallback(async () => {
    await getCtoOptions();
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  useEffect(() => {
    setInitialValues();
  }, [setInitialValues]);

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
  }, [verificationAct.currentId, verificationAct.memoizePages, id]);

  return (
    <Modal
      title="Другие стороны"
      visible={visible}
      maskClosable={false}
      onCancel={handleOnClose}
      width={780}
      destroyOnClose
      footer={
        <Can
          I={ActionsEnum.Edit}
          a={elementId(VerificationActsElements[VerificationActsElements.EditCamp])}
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
      <OtherSideForm
        form={form}
        serial={Number(maxSerial)}
        fields={formik.fields}
        onChange={formik.setFieldAntdValue}
        isRequiredPartName={!ALLOW_VALUES.includes(formik.values.ctoName)}
        onError={formik.setErrorsAntd}
      />
    </Modal>
  );
};
