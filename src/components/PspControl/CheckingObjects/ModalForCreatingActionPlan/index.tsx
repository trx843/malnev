import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikProps } from "formik";
import { Spin, Modal } from "antd";
import { Form, FormItem, Select } from "formik-antd";
import {
  createPlan,
  getVerificationActsById,
} from "../../../../thunks/pspControl/checkingObjects/index";
import { StateType } from "../../../../types";
import { ICheckingObjectsStore } from "../../../../slices/pspControl/checkingObjects";
import { FormFields, InitialFormValues, ValidationSchema } from "./constants";
import { mapVerificationActs } from "./utils";
import { IFormValues } from "./types";

interface IProps {
  pspId: string;
  isVisible: boolean;
  onCancel: () => void;
}

export const ModalForCreatingActionPlan: React.FC<IProps> = ({
  pspId,
  isVisible,
  onCancel,
}) => {
  const dispatch = useDispatch();

  const { dictionaries, isCreatePlan } = useSelector<
    StateType,
    ICheckingObjectsStore
  >((state) => state.checkingObjects);

  const formikRef = React.useRef<FormikProps<IFormValues>>(null); // реф для того чтобы засабмитить форму из вне компонента формы

  React.useEffect(() => {
    if (pspId) {
      dispatch(getVerificationActsById(pspId));
    }
  }, [pspId]);

  const handleSubmitForm = (values: IFormValues) => {
    dispatch(createPlan(values));
  };

  const creatingActionPlan = () => {
    const submitForm = formikRef.current?.submitForm;
    if (submitForm) submitForm();
  };

  return (
    <Modal
      width={562}
      visible={isVisible}
      title="Связать с существующим актом"
      onOk={creatingActionPlan}
      onCancel={onCancel}
      okButtonProps={{ loading: isCreatePlan }}
      cancelButtonProps={{
        style: { display: "none" },
      }}
      okText="Создать"
      maskClosable={false}
      destroyOnClose
      centered
    >
      <Spin spinning={isCreatePlan}>
        <Formik
          initialValues={InitialFormValues}
          onSubmit={handleSubmitForm}
          innerRef={formikRef}
          validationSchema={ValidationSchema}
        >
          <Form layout="vertical">
            <FormItem
              style={{ marginBottom: 0 }}
              name={FormFields.VerificationActId}
              label="Акт проверки"
            >
              <Select
                name={FormFields.VerificationActId}
                options={mapVerificationActs(dictionaries.verificationActs)}
                optionFilterProp="label"
                showSearch
              />
            </FormItem>
          </Form>
        </Formik>
      </Spin>
    </Modal>
  );
};
