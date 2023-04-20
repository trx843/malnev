import React from "react";
import classNames from "classnames/bind";
import { Col, Row } from "antd";
import { Formik } from "formik";
import { Form, FormItem, DatePicker, Select } from "formik-antd";
import {
  FormFields,
  InitialFormValues,
  PresenceOfViolationOptions,
} from "./contants";
import { IFormValues } from "./types";
import { adjustValues } from "./utils";
import styles from "./filter.module.css";
import locale from "antd/lib/date-picker/locale/ru_RU";

const cx = classNames.bind(styles);

interface IProps {
  handleSetFilter: (values) => void;
}

export const Filter: React.FC<IProps> = ({ handleSetFilter }) => {
  const handleSubmitForm = async (values: IFormValues) => {
    const adjustedValues = adjustValues(values);
    handleSetFilter(adjustedValues);
  };

  return (
    <Formik initialValues={InitialFormValues} onSubmit={handleSubmitForm}>
      {(props) => {
        const submitForm = props.submitForm;

        return (
          <Form layout="vertical">
            <Row>
              <Col span={6}>
                <FormItem
                  name={FormFields.DateOfVerificationFrom}
                  label="Дата проверки с"
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    name={FormFields.DateOfVerificationFrom}
                    onChange={submitForm}
                    placeholder="ДД.ММ.ГГГГ"
                    format="DD.MM.YYYY"
                    locale={locale}
                  />
                </FormItem>
              </Col>
              <Col offset={1} span={6}>
                <FormItem
                  name={FormFields.DateOfVerificationBy}
                  label="Дата проверки по"
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    name={FormFields.DateOfVerificationBy}
                    onChange={submitForm}
                    placeholder="ДД.ММ.ГГГГ"
                    format="DD.MM.YYYY"
                    locale={locale}
                  />
                </FormItem>
              </Col>
              <Col offset={1} span={6}>
                <FormItem
                  name={FormFields.PresenceOfViolation}
                  label="Наличие нарушения"
                >
                  <Select
                    name={FormFields.PresenceOfViolation}
                    options={PresenceOfViolationOptions}
                    onChange={submitForm}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};
