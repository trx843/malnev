import { FC, useEffect } from "react";
import { Button, Col, Form, Input, Modal, Popconfirm, Row } from "antd";
import * as Yup from "yup";
import Title from "antd/lib/typography/Title";
import Checkbox from "antd/lib/checkbox/Checkbox";
import moment from "moment";
import classNames from "classnames/bind";

import { useAntdFormik } from "../../../../customHooks/useAntdFormik";

import styles from "./addingFactAcquaintance.module.css";

const cx = classNames.bind(styles);

export type AddingAcquaintanceValues = {
  createdOn: string;
  isPlan: boolean;
  isAct: boolean;
  position: string;
  fullname: string;
};

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: AddingAcquaintanceValues) => void;
  profile: { fullname: string; position: string };
}

const validationSchema = Yup.object({
  createdOn: Yup.string().required("Поле обязательно к заполнению!").trim(),
  fullname: Yup.string().required("Поле обязательно к заполнению!"),
  position: Yup.string().required("Поле обязательно к заполнению!"),
  isAct: Yup.bool(),
  isPlan: Yup.bool(),
});

export const AddingFactAcquaintanceModal: FC<ModalProps> = ({
  visible,
  profile,
  onSubmit,
  onClose,
}) => {
  const formik = useAntdFormik({
    initialValues: {
      createdOn: moment().format("DD.MM.YYYY"),
      isPlan: true,
      isAct: true,
      position: profile.position,
      fullname: profile.fullname,
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    if (visible) {
      formik.setValues({
        ...formik.values,
        ...profile,
      });
    }
  }, [profile, visible]);

  const handleClose = () => {
    onClose?.();
    formik.resetForm();
  };

  const handleSubmitButton = async () => {
    await formik.submitForm();
  };

  return (
    <Modal
      title="Добавление факта ознакомления"
      visible={visible}
      maskClosable={false}
      onCancel={handleClose}
      width={657}
      destroyOnClose
      footer={
        <>
          <Button onClick={handleClose} type="link">
            Закрыть
          </Button>
          <Popconfirm
            title={
              <p className={cx("title")}>
                Убедитесь, что ознакомились с актом (отчетом) и планом
                мероприятий. Если с документами нужно ознакомиться позже,
                закройте форму без завершения. После завершения добавить факт
                ознакомления будет уже нельзя.
              </p>
            }
            disabled={
              (!formik.values.isAct && !formik.values.isPlan) ||
              formik.isSubmitting
            }
            okText={"Да"}
            cancelText={"Отмена"}
            onConfirm={handleSubmitButton}
          >
            <Button
              loading={formik.isSubmitting}
              disabled={
                (!formik.values.isAct && !formik.values.isPlan) ||
                formik.isSubmitting
              }
              type="primary"
            >
              Завершить
            </Button>
          </Popconfirm>
        </>
      }
    >
      <Form
        layout="vertical"
        onValuesChange={formik.setFieldAntdValue}
        onFinishFailed={formik.setErrorsAntd}
        fields={formik.fields}
      >
        <Row gutter={[16, 4]}>
          <Col span={24}>
            <Title level={5}>
              Подтверждаю факт ознакомления со следующими документами
            </Title>
          </Col>
          <Col span={24}>
            <Form.Item
              className="acquaintance-form__field"
              name="isAct"
              labelAlign="right"
              valuePropName="checked"
            >
              <Checkbox disabled>Акт (отчет)</Checkbox>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              className="acquaintance-form__field"
              name="isPlan"
              valuePropName="checked"
            >
              <Checkbox disabled> План мероприятий </Checkbox>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              className="acquaintance-form__field"
              name="createdOn"
              label="Дата ознакомления"
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="fullname"
              label="Лицо, ознакомившееся с документом, ФИО"
              className="acquaintance-form__field"
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="position"
              label="Лицо, ознакомившееся с документом, Должность"
              className="acquaintance-form__field"
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
