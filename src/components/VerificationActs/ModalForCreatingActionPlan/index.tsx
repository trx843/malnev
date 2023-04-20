import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { Spin, Modal } from "antd";
import { Form, FormItem, Input } from "formik-antd";
import { FormFields, IFormValues, InitialFormValues, ValidationSchema } from "./constants";
import { StateType } from "../../../types";
import { VerificationActsStore } from "../../../slices/verificationActs/verificationActs";
import { createPlan } from "../../../thunks/verificationActs";
import "./styles.css";

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
}

export const ModalForCreatingActionPlan: React.FC<IProps> = ({
  isVisible,
  onCancel,
}) => {
  const dispatch = useDispatch();

  const { isCreatingPlan } = useSelector<StateType, VerificationActsStore>(
    (state) => state.verificationActs
  );

  const formikRef = React.useRef<any>(null); // реф для того чтобы засабмитить форму из вне компонента формы

  const creatingActionPlan = () => {
    const { submitForm } = formikRef?.current ?? {};
    if (submitForm) submitForm();
  }

  const handleSubmitForm = (values: IFormValues) => {
    if (values[FormFields.planName]) {
      // dispatch(createPlan())
    }
  }

  return (
    <Modal
      width={562}
      visible={isVisible}
      title="Создать план мероприятия"
      onOk={creatingActionPlan}
      onCancel={onCancel}
      okButtonProps={{ loading: isCreatingPlan }}
      cancelButtonProps={{
        style: { display: 'none' }
      }}
      okText="Создать"
      destroyOnClose
      centered
    >
      <Spin spinning={isCreatingPlan}>
        <Formik
          initialValues={InitialFormValues}
          onSubmit={handleSubmitForm}
          innerRef={formikRef}
          validationSchema={ValidationSchema}
        >
          <Form className="verification-acts-modal-for-creating-action-plan__form">
            <FormItem
              name={FormFields.planName}
              label="Наименование плана"
            >
              <Input name={FormFields.planName} />
            </FormItem>
          </Form>
        </Formik>
      </Spin>
    </Modal>
  );
};
