import { Formik, FormikHelpers } from "formik";
import React, { Component } from "react";
import {
  Form,
  FormItem,
  Input,
  Select,
  SubmitButton,
  Switch,
} from "formik-antd";
import { SiModel } from "../classes";
import { apiBase } from "../utils";
import axios from "axios";
import { message, Row, Col, Space, Skeleton, Modal } from "antd";
import * as Yup from "yup";
import { SiTypes } from "../classes/SiTypes";
import styled from "styled-components";
import { ActionsEnum, Can } from "../casl";
import { EditorSiElements, elementId } from "../pages/EditorSiPage/constant";

const { confirm } = Modal;

interface IEditorSiModelFormProps {
  initial?: SiModel;
  submitCallback: (item: SiModel) => Promise<SiModel>;
}

interface IEditorSiModelFormState {
  loading: boolean;
  siTypes: Array<SiTypes>;
}

const validationSchema = Yup.object({
  shortName: Yup.string().required("Поле обязательно к заполнению!"),
  grNumber: Yup.string().required("Поле обязательно к заполнению!"),
  manufacturer: Yup.string().required("Поле обязательно к заполнению!"),
  siTypeId: Yup.number().required("Поле обязательно к заполнению!"),
});

function showConfirm() {
  confirm({
    title: "Вы уверены, что хотите архивировать модель СИ?",
    content: "ВНИМАНИЕ! Отменить архивацию может только администратор!",
    okText: "Архивировать",
    cancelText: "Отменить",
    onOk() {
      console.log("OK");
    },
    onCancel() {
      console.log("Cancel");
    },
  });
}

const TitleStyled = styled.div`
  width: 100%;
  background: #e8f4ff;
  font-family: "IBM Plex Sans";
  font-weight: 500;
  font-size: 16px;
  color: #667985;
  padding: 8px 0 8px 12px;
  margin-bottom: 24px;
  border: none;
`;

export class EditorSiModelForm extends Component<
  IEditorSiModelFormProps,
  IEditorSiModelFormState
> {
  constructor(props: IEditorSiModelFormProps) {
    super(props);
    this.state = {
      loading: false,
      siTypes: [],
    };
  }

  render(): JSX.Element {
    return (
      <div style={{ width: "100%", margin: "auto" }}>
        <Formik
          initialValues={this.props.initial ?? new SiModel()}
          onSubmit={(data: SiModel, helpers: FormikHelpers<SiModel>) => {
            console.log(data);

            this.props
              .submitCallback(data)
              .then(() => helpers.setSubmitting(false))
              .catch((err) => {
                helpers.setSubmitting(false);
                message.error(err);
              });
          }}
          validationSchema={validationSchema}
        >
          {() => {
            return (
              <>
                {this.state.loading ? (
                  <div className="mx-auto my-auto">
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                  </div>
                ) : (
                  <Form layout="vertical">
                    <Row>
                      <Col span={24}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <FormItem
                              required
                              name="shortName"
                              label="Модель СИ"
                            >
                              <Input
                                name="shortName"
                                placeholder="Введите имя модели СИ"
                              />
                            </FormItem>
                          </Col>
                          <Col span={12}>
                            <FormItem
                              required
                              name="grNumber"
                              label="Номер в гос.реестре"
                            >
                              <Input
                                name="grNumber"
                                placeholder="Введите номер в гос.реестре"
                              />
                            </FormItem>
                          </Col>
                        </Row>
                        <Row gutter={16}>
                          <Col span={12}>
                            <FormItem
                              required
                              name="manufacturer"
                              label="Производитель модели СИ"
                            >
                              <Input
                                name="manufacturer"
                                placeholder="Введите производителя модели СИ"
                              />
                            </FormItem>
                          </Col>
                          <Col span={12}>
                            <FormItem required name="siTypeId" label="Тип СИ">
                              <Select
                                showSearch
                                optionFilterProp={"label"}
                                name="siTypeId"
                                options={this.state.siTypes.map((x) => ({
                                  label: x.shortName,
                                  value: x.id,
                                  key: x.id,
                                }))}
                                placeholder={"Выберите тип СИ"}
                                allowClear
                              />
                            </FormItem>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <TitleStyled>
                        Поля отмеченные{" "}
                        <span style={{ color: "#ff4d4f" }}>*</span> обязательны
                        для заполнения
                      </TitleStyled>
                    </Row>
                    <Space size={"large"} align="baseline">
                      <Can
                        I={ActionsEnum.Edit}
                        a={elementId(
                          EditorSiElements[EditorSiElements.SiModelAdd]
                        )}
                      >
                        <SubmitButton
                          style={{
                            background: "#219653",
                            color: "#FFFFFF",
                          }}
                        >
                          Сохранить
                        </SubmitButton>
                      </Can>
                      {this.props.initial !== undefined && (
                        <FormItem
                          style={{
                            alignItems: "baseline",
                            display: "flex",
                            flexDirection: "row",
                          }}
                          name="isArchival"
                          label="Архивировать"
                        >
                          <Switch
                            style={{ marginLeft: 10 }}
                            name="isArchival"
                            onChange={(checked: boolean) => {
                              if (checked) showConfirm();
                            }}
                          ></Switch>
                        </FormItem>
                      )}
                    </Space>
                  </Form>
                )}
              </>
            );
          }}
        </Formik>
      </div>
    );
  }

  componentDidMount() {
    axios.get<Array<SiTypes>>(`${apiBase}/SiTypes`).then((result) => {
      this.setState({ siTypes: result.data.filter((x) => x.isSiType) });
    });
  }
}
