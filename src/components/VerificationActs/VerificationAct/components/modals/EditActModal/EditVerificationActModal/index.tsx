import { FC, useState } from "react";
import { Form, Modal } from "antd";
import * as Yup from "yup";
import { Moment } from "moment/moment";
import moment from "moment";

import { InfoGeneral } from "../components";
import { useAntdFormik } from "../../../../../../../customHooks/useAntdFormik";
import { VerificationItem } from "components/VerificationActs/classes";

interface EditActModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit: (values: ActSchedule) => void;
  initialValues: VerificationItem;
  loading: boolean;
}

export interface ActSchedule {
  verificationPlace: string;
  preparedOn: Moment;
  verificatedOn: Moment;
}

export interface ActParams {
  preparedOn: Moment | null;
  inspectedTypeId: string;
  verificatedOn: Moment;
  verificationPlace: string;
  ostRnuPsp_VerificationSchedulesId: string;
  checkTypeId: string;
  verificationLevelId: string;
  isVisibilityInspection: boolean;
}

const validationSchema = Yup.object({
  preparedOn: Yup.date().required("Поле обязательно к заполнению!").nullable(),
  isVisibilityInspection: Yup.bool(),
  inspectedTypeId: Yup.string().when("isVisibilityInspection", {
    is: (isVisibilityInspection) => isVisibilityInspection,
    then: Yup.string().required("Поле обязательно к заполнению!"),
  }),
  verificatedOn: Yup.date().required("Поле обязательно к заполнению!"),
  verificationPlace: Yup.string().required("Поле обязательно к заполнению!"),
});

export const EditVerificationActModal: FC<EditActModalProps> = ({
  visible,
  onClose,
  onEdit,
  initialValues,
  loading,
}) => {
  const formik = useAntdFormik({
    initialValues: {
      verificationPlace: initialValues.verificationPlace,
      preparedOn: moment(initialValues.preparedOn),
      verificatedOn: moment(initialValues.verificatedOn),
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      await onEdit({
        verificationPlace: values.verificationPlace,
        preparedOn: values.preparedOn, // дата подготовки
        verificatedOn: values.verificatedOn, // дата проведения
      });
      formik.setSubmitting(false);
    },
  });
  const [form] = Form.useForm<ActParams>();

  const handleOnClose = () => {
    formik.resetForm();
    onClose?.();
  };

  return (
    <Modal
      title="Редактирование акта проверки"
      destroyOnClose
      maskClosable={false}
      visible={visible}
      onCancel={handleOnClose}
      onOk={formik.submitForm}
      okText={"Сохранить"}
      cancelText={"Отменить"}
      confirmLoading={loading}
    >
      <Form
        form={form}
        fields={formik.fields}
        layout="vertical"
        onFieldsChange={(fieldsValue) => formik.onFieldChange(fieldsValue[0])}
        onFinishFailed={formik.setErrorsAntd}
        initialValues={{}}
      >
        <InfoGeneral />
      </Form>
    </Modal>
  );
};
