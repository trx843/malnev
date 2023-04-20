import React, { FC, useEffect } from "react";
import { Button, DatePicker, Form } from "antd";
import locale from "antd/es/date-picker/locale/ru_RU";
import * as Yup from "yup";
import moment, { Moment } from "moment";

import { SiderPage } from "../../../../components/SiderPage";
import { useAntdFormik } from "../../../../customHooks/useAntdFormik";

import "./styles.css";

interface GeneralInfoSiderProps {
  loading?: boolean;
  to?: Moment;
  from?: Moment;
  onSubmit: (values: { to: Moment; from: Moment }) => void;
}

export const validationSchema = Yup.object({
  to: Yup.date().required("Поле обязательно к заполнению!"),
  from: Yup.date().required("Поле обязательно к заполнению!")
});

export const GeneralInfoSider: FC<GeneralInfoSiderProps> = ({
  loading,
  to = moment(),
  from = moment(),
  onSubmit
}) => {
  const formik = useAntdFormik({
    initialValues: {
      to,
      from
    },
    validationSchema,
    validateOnChange: false,
    onSubmit
  });
  useEffect(() => {
    if (to || from) {
      formik.setValues({
        to,
        from
      });
    }
  }, [to, from]);
  return (
    <Form
      fields={formik.fields}
      onFieldsChange={fieldsValue => formik.onFieldChange(fieldsValue[0])}
      onFinishFailed={formik.setErrorsAntd}
    >
      <SiderPage title="Основные сведения" loading={loading}>
        <SiderPage.Field
          name="Период проверки с"
          component={
            <Form.Item name="from" style={{ margin: 0 }}>
              <DatePicker locale={locale} placeholder="Введите дату" />
            </Form.Item>
          }
        />
        <SiderPage.Field
          name="Период проверки по"
          component={
            <Form.Item name="to" style={{ margin: 0 }}>
              <DatePicker locale={locale} placeholder="Введите дату" />
            </Form.Item>
          }
        />
        <div className="act-plans-typical-violations__general-sider-button">
          <Button
            htmlType="submit"
            type="link"
            loading={formik.isSubmitting}
            disabled={formik.isSubmitting}
            onClick={() => formik.submitForm()}
          >
            Применить
          </Button>
        </div>
      </SiderPage>
    </Form>
  );
};
