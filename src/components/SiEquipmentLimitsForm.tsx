import { Field, FieldArray, Formik, FormikHelpers } from "formik";
import React, { Component, FC } from "react";
import {
  Form,
  FormItem,
  SubmitButton,
  InputNumber,
  Checkbox,
} from "formik-antd";
import { apiBase } from "../utils";
import axios from "axios";
import { message, Row, Col, Space, Modal, Skeleton, Card, Divider } from "antd";
import { SelectedNode } from "../interfaces";
import Title from "antd/lib/typography/Title";
import * as Yup from "yup";
import { SiEquipmentLimits } from "../classes/SiEquipmentLimits";
import { TextGrayStyled as GrayStyled } from "../styles/commonStyledComponents";
import { ActionsEnum, Can } from "../casl";
import {
  elementId,
  SiEquipmentLimitsElements,
} from "../pages/SiEquipmentLimits/constant";

interface ISiEquipmentLimitsFormProps {
  initial: SiEquipmentLimits;
  submitCallback: (item: SiEquipmentLimits) => Promise<SiEquipmentLimits>;
  isSikn: boolean;
}

const validationSchema = Yup.object({
  techLimits: Yup.array().of(
    Yup.object()
      .shape(
        {
          lowerLimit: Yup.number()
            .when("upperLimit", {
              is: (value) => value != null,
              then: Yup.number().required("Требуется заполение!"),
            })
            .lessThan(
              Yup.ref("upperLimit"),
              "Нижний предел должен быть меньше, чем верхний"
            )
            .nullable(),

          upperLimit: Yup.number()
            .when("lowerLimit", {
              is: (value) => value != null,
              then: Yup.number().required("Требуется заполение!"),
            })
            .moreThan(
              Yup.ref("lowerLimit"),
              "Верхний предел должен быть больше, чем нижний"
            )
            .nullable(),
        },
        [["lowerLimit", "upperLimit"]]
      )
      .typeError("Введите число")
  ),
  siEqLimits: Yup.array().of(
    Yup.object()
      .shape(
        {
          lowerLimit: Yup.number()
            .when("upperLimit", {
              is: (value) => value != null,
              then: Yup.number().required("Требуется заполение!"),
            })
            .lessThan(
              Yup.ref("upperLimit"),
              "Нижний предел должен быть меньше, чем верхний"
            )
            .nullable(),
          upperLimit: Yup.number()
            .when("lowerLimit", {
              is: (value) => value != null,
              then: Yup.number().required("Требуется заполение!"),
            })
            .moreThan(
              Yup.ref("lowerLimit"),
              "Верхний предел должен быть больше, чем нижний"
            )
            .nullable(),
        },
        [["lowerLimit", "upperLimit"]]
      )
      .typeError("Введите число")
  ),
});

const siknValidationSchema = Yup.object({
  siknLimits: Yup.array().of(
    Yup.object()
      .shape(
        {
          lowerLimit: Yup.number()
            .when("upperLimit", {
              is: (value) => value != null,
              then: Yup.number().required("Требуется заполение!"),
            })
            .lessThan(
              Yup.ref("upperLimit"),
              "Нижний предел должен быть меньше, чем верхний"
            )
            .nullable(),
          upperLimit: Yup.number()
            .when("lowerLimit", {
              is: (value) => value != null,
              then: Yup.number().required("Требуется заполение!"),
            })
            .moreThan(
              Yup.ref("lowerLimit"),
              "Верхний предел должен быть больше, чем нижний"
            )
            .nullable(),
        },
        [["lowerLimit", "upperLimit"]]
      )
      .typeError("Введите число")
  ),
});

export const SiEquipmentLimitsForm: FC<ISiEquipmentLimitsFormProps> = ({
  initial,
  submitCallback,
  isSikn,
}) => {
  return (
    <div style={{ width: "100%", margin: "auto" }}>
      <Formik
        initialValues={initial}
        onSubmit={(
          data: SiEquipmentLimits,
          helpers: FormikHelpers<SiEquipmentLimits>
        ) => {
          console.log(data);

          submitCallback(data)
            .then(() => helpers.setSubmitting(false))
            .catch((err) => {
              helpers.setSubmitting(false);
              message.error(err);
            });
        }}
        validationSchema={isSikn ? siknValidationSchema : validationSchema}
      >
        {({ values, setFieldValue }) => {
          return (
            <>
              <Form layout="vertical">
                <Row>
                  <Col span={24}>
                    <Title level={5}>
                      {values.siName}, {values.siTypeMeasurement}
                    </Title>
                    <GrayStyled>
                      {values.techPosName ? values.techPosName : ""}
                    </GrayStyled>
                  </Col>
                </Row>

                {isSikn ? (
                  <FieldArray
                    name="siknLimits"
                    render={() => (
                      <div>
                        {values.siknLimits && values.siknLimits.length > 0 ? (
                          values.siknLimits.map((siknLimit, index) => (
                            <Card
                              title={siknLimit.siLimitTypeName}
                              size={"small"}
                              headStyle={{ textAlign: "center" }}
                              bordered={true}
                            >
                              <Row gutter={16}>
                                <Col span={12}>
                                  <FormItem
                                    name={`siknLimits.${index}.lowerLimit`}
                                    label={`Нижний предел измерений`}
                                  >
                                    <InputNumber
                                      style={{ width: "100%" }}
                                      precision={values.digitsAfterDot}
                                      name={`siknLimits.${index}.lowerLimit`}
                                      onChange={(value: number) => {
                                        setFieldValue(
                                          `siknLimits.${index}.lowerHasChanged`,
                                          initial.siknLimits[index]
                                            .lowerLimit !== value
                                        );
                                      }}
                                    />
                                  </FormItem>
                                  <FormItem
                                    hidden
                                    name={`siknLimits.${index}.lowerHasChanged`}
                                  >
                                    <Checkbox
                                      name={`siknLimits.${index}.lowerHasChanged`}
                                    />
                                  </FormItem>
                                </Col>

                                <Col span={12}>
                                  <FormItem
                                    name={`siknLimits.${index}.upperLimit`}
                                    label={`Верхний предел измерений`}
                                  >
                                    <InputNumber
                                      style={{ width: "100%" }}
                                      precision={values.digitsAfterDot}
                                      name={`siknLimits.${index}.upperLimit`}
                                      onChange={(value: number) => {
                                        setFieldValue(
                                          `siknLimits.${index}.upperHasChanged`,
                                          initial.siknLimits[index]
                                            .upperLimit !== value
                                        );
                                      }}
                                    />
                                  </FormItem>
                                  <FormItem
                                    hidden
                                    name={`siknLimits.${index}.upperHasChanged`}
                                  >
                                    <Checkbox
                                      name={`siknLimits.${index}.upperHasChanged`}
                                    />
                                  </FormItem>
                                </Col>
                              </Row>
                            </Card>
                          ))
                        ) : (
                          <div></div>
                        )}
                      </div>
                    )}
                  />
                ) : (
                  <>
                    <FieldArray
                      name="techLimits"
                      render={() => (
                        <div>
                          {values.techLimits && values.techLimits.length > 0 ? (
                            values.techLimits.map((techLimit, index) => (
                              <Card
                                title={techLimit.siLimitTypeName}
                                size={"small"}
                                headStyle={{ textAlign: "center" }}
                                bordered={true}
                              >
                                <Row gutter={16}>
                                  <Col span={12}>
                                    <FormItem
                                      name={`techLimits.${index}.lowerLimit`}
                                      label={`Нижний предел измерений`}
                                    >
                                      <InputNumber
                                        style={{ width: "100%" }}
                                        precision={values.digitsAfterDot}
                                        name={`techLimits.${index}.lowerLimit`}
                                        onChange={(value: number) => {
                                          setFieldValue(
                                            `techLimits.${index}.lowerHasChanged`,
                                            initial?.techLimits[index]
                                              .lowerLimit !== value
                                          );
                                        }}
                                      />
                                    </FormItem>
                                    <FormItem
                                      hidden
                                      name={`techLimits.${index}.lowerHasChanged`}
                                    >
                                      <Checkbox
                                        name={`techLimits.${index}.lowerHasChanged`}
                                      />
                                    </FormItem>
                                  </Col>

                                  <Col span={12}>
                                    <FormItem
                                      name={`techLimits.${index}.upperLimit`}
                                      label={`Верхний предел измерений`}
                                    >
                                      <InputNumber
                                        style={{ width: "100%" }}
                                        precision={values.digitsAfterDot}
                                        name={`techLimits.${index}.upperLimit`}
                                        onChange={(value: number) => {
                                          setFieldValue(
                                            `techLimits.${index}.upperHasChanged`,
                                            initial?.techLimits[index]
                                              .upperLimit !== value
                                          );
                                        }}
                                      />
                                    </FormItem>
                                    <FormItem
                                      hidden
                                      name={`techLimits.${index}.upperHasChanged`}
                                    >
                                      <Checkbox
                                        name={`techLimits.${index}.upperHasChanged`}
                                      />
                                    </FormItem>
                                  </Col>
                                </Row>
                              </Card>
                            ))
                          ) : (
                            <div></div>
                          )}
                        </div>
                      )}
                    />

                    <FieldArray
                      name="siEqLimits"
                      render={() => (
                        <div>
                          {values.siEqLimits && values.siEqLimits.length > 0 ? (
                            values.siEqLimits.map((siLimit, index) => (
                              <Card
                                title={siLimit.siLimitTypeName}
                                size={"small"}
                                headStyle={{ textAlign: "center" }}
                                bordered={true}
                              >
                                <Row gutter={16}>
                                  <Col span={12}>
                                    <FormItem
                                      name={`siEqLimits.${index}.lowerLimit`}
                                      label={`Нижний предел измерений`}
                                    >
                                      <InputNumber
                                        style={{ width: "100%" }}
                                        precision={values.digitsAfterDot}
                                        name={`siEqLimits.${index}.lowerLimit`}
                                        onChange={(value: number) => {
                                          setFieldValue(
                                            `siEqLimits.${index}.lowerHasChanged`,
                                            initial?.siEqLimits[index]
                                              .lowerLimit !== value
                                          );
                                        }}
                                      />
                                    </FormItem>
                                    <FormItem
                                      hidden
                                      name={`siEqLimits.${index}.lowerHasChanged`}
                                    >
                                      <Checkbox
                                        name={`siEqLimits.${index}.lowerHasChanged`}
                                      />
                                    </FormItem>
                                  </Col>

                                  <Col span={12}>
                                    <FormItem
                                      name={`siEqLimits.${index}.upperLimit`}
                                      label={`Верхний предел измерений`}
                                    >
                                      <InputNumber
                                        style={{ width: "100%" }}
                                        precision={values.digitsAfterDot}
                                        name={`siEqLimits.${index}.upperLimit`}
                                        onChange={(value: number) => {
                                          setFieldValue(
                                            `siEqLimits.${index}.lowerHasChanged`,
                                            initial?.siEqLimits[index]
                                              .upperLimit !== value
                                          );
                                        }}
                                      />
                                    </FormItem>
                                    <FormItem
                                      hidden
                                      name={`siEqLimits.${index}.upperHasChanged`}
                                    >
                                      <Checkbox
                                        name={`siEqLimits.${index}.upperHasChanged`}
                                      />
                                    </FormItem>
                                  </Col>
                                </Row>
                              </Card>
                            ))
                          ) : (
                            <div></div>
                          )}
                        </div>
                      )}
                    />
                  </>
                )}
                <Divider />
                <Space size={"large"} align="baseline">
                  <Can
                    I={ActionsEnum.Edit}
                    a={elementId(
                      SiEquipmentLimitsElements[
                        SiEquipmentLimitsElements.MeasEdit
                      ]
                    )}
                  >
                    <SubmitButton>Сохранить</SubmitButton>
                  </Can>
                </Space>
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};
