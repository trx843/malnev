import React from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames/bind";
import ruLocale from "antd/lib/date-picker/locale/ru_RU";
import { Formik, FormikProps } from "formik";
import { Form, FormItem, DatePicker } from "formik-antd";
import { IFormValues } from "./types";
import { FormFields, InitialFormValues, ValidationSchema } from "./constants";
import { Col, Modal, Row, Spin } from "antd";
import {
  typicalPlanChangeName,
  typicalPlanEditing,
} from "api/requests/pspControl/plan-typical-violations";
import { getPlanName } from "./utils";
import { Nullable } from "types";
import { getTypicalPlanPageThunk } from "thunks/pspControl/actionPlans/actionPlanTypicalViolations";
import styles from "./modalPlanEditing.module.css";
import { ModalModes } from "enums";

const cx = classNames.bind(styles);

interface IProps {
  isVisible: boolean;
  onCancel: (payload: Nullable<IFormValues>, mode: ModalModes) => void;
  planId: string | undefined;
  mode: ModalModes;
  initialValues: Nullable<IFormValues>;
}

export const ModalPlanEditing: React.FC<IProps> = ({
  isVisible,
  onCancel,
  planId,
  mode,
  initialValues = InitialFormValues,
}) => {
  const dispatch = useDispatch();

  const [isTypicalPlanEditing, setIsTypicalPlanEditing] = React.useState(false);
  const formikRef = React.useRef<FormikProps<IFormValues>>(null); // реф для того чтобы засабмитить форму из вне компонента формы

  const handleSubmitForm = async (values: IFormValues) => {
    if (planId) {
      const planName = getPlanName(values);
      setIsTypicalPlanEditing(true);
      mode === ModalModes.edit
        ? await typicalPlanEditing(planId, planName)
        : await typicalPlanChangeName(planId, planName);
      setIsTypicalPlanEditing(false);
      dispatch(getTypicalPlanPageThunk());
      onCancel(null, ModalModes.none);
    }
  };

  return (
    <Modal
      width={600}
      visible={isVisible}
      title="Редактирование"
      onOk={() => formikRef.current?.submitForm()}
      onCancel={() => onCancel(null, ModalModes.none)}
      cancelButtonProps={{
        type: "link",
      }}
      cancelText="Отменить"
      okText="Сохранить"
      okButtonProps={{
        loading: isTypicalPlanEditing,
      }}
      maskClosable={false}
      destroyOnClose
      centered
    >
      <Spin spinning={isTypicalPlanEditing}>
        <Formik
          initialValues={initialValues || InitialFormValues}
          onSubmit={handleSubmitForm}
          validationSchema={ValidationSchema}
          innerRef={formikRef}
        >
          <Form layout="vertical">
            <Row>
              <Col span={11}>
                <FormItem
                  name={FormFields.verificationPeriodFrom}
                  label="Период проверки с"
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    name={FormFields.verificationPeriodFrom}
                    placeholder="Выберите год"
                    allowClear={false}
                    locale={ruLocale}
                    picker="year"
                  />
                </FormItem>
              </Col>
              <Col span={11} offset={2}>
                <FormItem
                  name={FormFields.verificationPeriodFor}
                  label="Период проверки по"
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    name={FormFields.verificationPeriodFor}
                    placeholder="Выберите год"
                    allowClear={false}
                    locale={ruLocale}
                    picker="year"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Formik>
      </Spin>
    </Modal>
  );
};
