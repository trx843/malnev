import { FC, useEffect, useCallback, useState } from "react";
import { Button, Modal } from "antd";
import * as Yup from "yup";
import { useSelector } from "react-redux";

import { useAntdFormik } from "../../../../../../../customHooks/useAntdFormik";
import { MatchingForm } from "./Form";
import { getCommissionTypesRequest } from "api/requests/pspControl/planCard";
import { IPlanCardStore } from "slices/pspControl/planCard";
import { StateType } from "types";
import { CommissionTypesStages } from "enums";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  id?: string | null | undefined;
  isTypical?: boolean;
}

const validationSchema = Yup.object({
  jobTitle: Yup.string().required("Поле обязательно к заполнению!").trim(),
  organizationName: Yup.string().required("Поле обязательно к заполнению!"),
  fullName: Yup.string().required("Поле обязательно к заполнению!"),
  commisionTypesId: Yup.string().required("Поле обязательно к заполнению!"),
});

export const CommissionModal: FC<ModalProps> = ({
  visible,
  onClose,
  onSubmit,
  id,
  isTypical,
}) => {
  const [types, setTypes] = useState<{ value: string; label: string }[]>([]);
  const [attempt, setAttempt] = useState(false);
  const { commissions } = useSelector<StateType, IPlanCardStore>(
    (state) => state.planCard
  );

  const handleLoadOptions = async () => {
    if (attempt) {
      return;
    }
    setAttempt(true);
    const options = await getCommissionTypesRequest(CommissionTypesStages.Plan);
    setTypes(options.map((opt) => ({ value: opt.id, label: opt.label })));
  };

  const handleLoadComission = useCallback(async () => {
    if (!id && !visible) {
      return;
    }

    const item = commissions.find((commission) => commission.id === id);

    if (!item) {
      return;
    }

    await handleLoadOptions();

    await formik.setValues(item);
  }, [visible, id, commissions]);

  const formik = useAntdFormik({
    initialValues: {
      jobTitle: "",
      organizationName: "",
      fullName: "",
    },
    validationSchema,
    onSubmit,
  });

  const handleClose = () => {
    onClose?.();
    formik.resetForm();
  };

  const handleSubmitButton = async () => {
    await formik.submitForm();
  };

  useEffect(() => {
    if (!visible) {
      formik.resetForm();
    }
  }, [visible]);

  useEffect(() => {
    handleLoadComission();
  }, [handleLoadComission]);

  return (
    <Modal
      title="Согласующий"
      visible={visible}
      maskClosable={false}
      onCancel={handleClose}
      width={657}
      destroyOnClose
      footer={
        <>
          <Button onClick={handleClose} type="link">
            Отменить
          </Button>
          <Button
            loading={formik.isSubmitting}
            disabled={formik.isSubmitting}
            type="primary"
            onClick={handleSubmitButton}
          >
            Сохранить
          </Button>
        </>
      }
    >
      <MatchingForm
        fields={formik.fields}
        onValuesChange={formik.setFieldAntdValue}
        onSelectOpen={handleLoadOptions}
        options={types}
        isTypical={isTypical}
      />
    </Modal>
  );
};
