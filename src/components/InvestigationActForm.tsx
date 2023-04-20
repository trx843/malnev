import { FieldArray, Formik, FormikHelpers } from "formik";
import React, { Component } from "react";
import {
  FormItem,
  DatePicker,
  TimePicker,
  InputNumber,
  Checkbox,
  Input,
  Select,
  SubmitButton,
  Switch,
  Form,
} from "formik-antd";
import { SiknOffItem } from "../classes";
import axios from "axios";
import {
  Row,
  Col,
  Button,
  Card,
  Space,
  Divider,
  Input as AntInput,
  Spin,
  Skeleton,
  message,
  Steps,
} from "antd";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import MinusCircleOutlined from "@ant-design/icons/MinusCircleOutlined";
import { SelectedNode } from "../interfaces";
import Title from "antd/lib/typography/Title";
import {
  InvestigationActInfo,
  MemberType,
  SiknOffEventsType,
  SiknOffPosts,
} from "../classes/SiknOffItem";
import { SiknOffGroupsEnum } from "../enums";
import * as Yup from "yup";
import { apiBase, pureDate } from "../utils";
import locale from "antd/es/date-picker/locale/ru_RU";
import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import PlusCircleFilled from "@ant-design/icons/PlusCircleFilled";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import styled from "styled-components";

interface IInvestigationActFormProps {
  initial?: SiknOffItem;
  submitCallback: (item: SiknOffItem) => Promise<SiknOffItem>;
  downloadFileCallback: (item: SiknOffItem) => Promise<SiknOffItem>;
  node: SelectedNode;
}

interface IInvestigationActFormState {
  step: number;
  loading: boolean;
  newPostName: string;
  investigationActInfo: InvestigationActInfo;
}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};

const validationSchema = Yup.object({
  investigationAct: Yup.object({
    reconcilingPost: Yup.string()
      .required("Поле обязательно к заполнению!")
      .nullable(),
    reconcilingFio: Yup.string()
      .required("Поле обязательно к заполнению!")
      .nullable()
      .trim()
      .matches(
        /[аА-яЯ\-./s]+$/,
        "Разрешено использовать только буквы кириллического алфавита"
      ),
    approverPost: Yup.string()
      .required("Поле обязательно к заполнению!")
      .nullable(),
    approverFio: Yup.string()
      .required("Поле обязательно к заполнению!")
      .nullable()
      .trim()
      .matches(
        /[аА-яЯ\-./s]+$/,
        "Разрешено использовать только буквы кириллического алфавита"
      ),
    commissionChairmanPost: Yup.string()
      .required("Поле обязательно к заполнению!")
      .nullable(),
    commissionChairmanFio: Yup.string()
      .required("Поле обязательно к заполнению!")
      .nullable()
      .trim()
      .matches(
        /[аА-яЯ\-./s]+$/,
        "Разрешено использовать только буквы кириллического алфавита"
      ),
    commissionMembers: Yup.array()
      .of(
        Yup.object().shape({
          post: Yup.string().required("Поле обязательно к заполнению!"),
          fio: Yup.string()
            .required("Поле обязательно к заполнению!")
            .trim()
            .matches(
              /[аА-яЯ\-./s]+$/,
              "Разрешено использовать только буквы кириллического алфавита"
            ),
        })
      )
      .required("Должен быть как минимум один член комиссии!")
      .min(1, "Минимум один член комиссии"),
    siknOffEvents: Yup.array()
      .of(
        Yup.object().shape({
          content: Yup.string()
            .required("Поле обязательно к заполнению!")
            .trim(),
          date: Yup.date().required("Поле обязательно к заполнению!"),
          performers: Yup.array()
            .of(
              Yup.object().shape({
                post: Yup.string().required("Поле обязательно к заполнению!"),
                fio: Yup.string()
                  .required("Поле обязательно к заполнению!")
                  .trim()
                  .matches(
                    /[аА-яЯ\-./s]+$/,
                    "Разрешено использовать только буквы кириллического алфавита"
                  ),
              })
            )
            .required("Должен быть как минимум один член комиссии!")
            .min(1, "Минимум один член комиссии"),
        })
      )
      .required("Должно быть как минимум одно мероприятие!")
      .min(1, "Минимум одно мероприятие"),
  }),
});

const { Step } = Steps;

type Step = {
  title: string;
  content: JSX.Element | string;
};

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

export class InvestigationActForm extends Component<
  IInvestigationActFormProps,
  IInvestigationActFormState
> {
  constructor(props: IInvestigationActFormProps) {
    super(props);
    this.state = {
      step: 0,
      loading: true,
      newPostName: "",
      investigationActInfo: {
        reconcilingPosts: [],
        approverPosts: [],
        commissionChairmanPosts: [],
        commissionMembersPosts: [],
        performersPosts: [],
        reconciling: { fio: "", post: "" },
        approver: { fio: "", post: "" },
        commissionChairman: { fio: "", post: "" },
        commissionMembers: [{ fio: "", post: "" }],
        events: [
          {
            content: "",
            date: pureDate(new Date()),
            performers: [{ fio: "", post: "" }],
            notes: "",
          },
        ],
      },
    };
  }

  private steps = (setFieldValue: any, values: SiknOffItem): Step[] => [
    {
      title: "Отключение оборудования",
      content: (
        <>
          <Row>
            <Col span={24}>
              <Row>
                <Title level={5}>Согласующий:</Title>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <FormItem
                    required
                    name="investigationAct.reconcilingPost"
                    label="Должность:"
                  >
                    <Select
                      name={`investigationAct.reconcilingPost`}
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                          <Divider style={{ margin: "4px 0" }} />
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "nowrap",
                              padding: 8,
                            }}
                          >
                            <AntInput
                              style={{ flex: "auto" }}
                              value={this.state.newPostName}
                              onChange={this.onNameChange}
                            />
                            <a
                              style={{
                                flex: "none",
                                padding: "8px",
                                display: "block",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                this.addPost(SiknOffGroupsEnum.Reconciling)
                              }
                            >
                              <PlusOutlined />
                              Добавить
                            </a>
                          </div>
                        </div>
                      )}
                    >
                      {this.state.investigationActInfo.reconcilingPosts.map(
                        (post) => (
                          <Select.Option value={post.id}>
                            {post.name}
                          </Select.Option>
                        )
                      )}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    required
                    name="investigationAct.reconcilingFio"
                    label="ФИО:"
                  >
                    <Input name="investigationAct.reconcilingFio" />
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Title level={5}>Утверждающий:</Title>
              <Row gutter={16}>
                <Col span={8}>
                  <FormItem
                    required
                    name="investigationAct.approverPost"
                    label="Должность:"
                  >
                    <Select
                      name={`investigationAct.approverPost`}
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                          <Divider style={{ margin: "4px 0" }} />
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "nowrap",
                              padding: 8,
                            }}
                          >
                            <AntInput
                              style={{ flex: "auto" }}
                              value={this.state.newPostName}
                              onChange={this.onNameChange}
                            />
                            <a
                              style={{
                                flex: "none",
                                padding: "8px",
                                display: "block",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                this.addPost(SiknOffGroupsEnum.Approver)
                              }
                            >
                              <PlusOutlined />
                              Добавить
                            </a>
                          </div>
                        </div>
                      )}
                    >
                      {this.state.investigationActInfo.approverPosts.map(
                        (post) => (
                          <Select.Option value={post.id}>
                            {post.name}
                          </Select.Option>
                        )
                      )}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    required
                    name="investigationAct.approverFio"
                    label="ФИО:"
                  >
                    <Input name="investigationAct.approverFio" />
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem
                style={{ marginBottom: 0 }}
                name="startDateTime"
                label="Дата внепланового отключения:"
              >
                <DatePicker
                  locale={locale}
                  style={{ width: "100%" }}
                  showTime
                  disabled
                  name="startDateTime"
                  onChange={(value) => {
                    if (value !== null) {
                      setFieldValue("startDateTime", value.toDate());
                    }
                  }}
                />
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem
                style={{ marginBottom: 0 }}
                name="endDateTime"
                label="Дата включения:"
              >
                <DatePicker
                  locale={locale}
                  style={{ width: "100%" }}
                  showTime
                  disabled
                  name="endDateTime"
                  onChange={(value) => {
                    if (value !== null) {
                      setFieldValue("endDateTime", value.toDate());
                    }
                  }}
                />
              </FormItem>
            </Col>

            <Col span={8}>
              <Row style={{ marginBottom: "8px" }}>
                <span>Продолжительность отключения:</span>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem name="durationHour">
                    <InputNumber
                      disabled
                      min={0}
                      placeholder={"00чч"}
                      name="durationHour"
                    ></InputNumber>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem name="durationMinute" labelAlign={"right"}>
                    <InputNumber
                      disabled
                      min={0}
                      placeholder={"00мин"}
                      name="durationMinute"
                    ></InputNumber>
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem
                labelCol={{ span: 16 }}
                wrapperCol={{ span: 16 }}
                name="normalOperation"
                label="Режим работы СИКН до внепланового отключения:"
              >
                <Input name="normalOperation" />
              </FormItem>

              <Row>
                <Col span={8}>
                  <span>Продолжительность работы по РСУ</span>
                  <Row>
                    <Col span={8}>
                      <FormItem name="rsuDurationHours" label="часов">
                        <InputNumber
                          disabled={!values.rsuId}
                          min={0}
                          placeholder={"00чч"}
                          name="rsuDurationHours"
                        ></InputNumber>
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem name="rsuDurationMinutes" label="минут">
                        <InputNumber
                          disabled={!values.rsuId}
                          min={0}
                          placeholder={"00мин"}
                          name="rsuDurationMinutes"
                        ></InputNumber>
                      </FormItem>
                    </Col>
                  </Row>
                </Col>

                <Col span={8}>
                  <FormItem labelCol={{ span: 12 }} name="moveToRsu">
                    <Checkbox
                      disabled
                      checked={values.rsuId !== null}
                      name="moveToRsu"
                    >
                      Переход на РСУ
                    </Checkbox>
                  </FormItem>
                </Col>
              </Row>

              <FormItem
                labelCol={{ span: 16 }}
                wrapperCol={{ span: 16 }}
                name="stopReasonCode"
                label="Код причины внепланового отключения:"
              >
                <Input disabled name="stopReasonCode" />
              </FormItem>
              <FormItem
                labelCol={{ span: 16 }}
                wrapperCol={{ span: 16 }}
                name="stopReasonText"
                label="Причина внепланового отключения СИКН:"
              >
                <Input disabled name="stopReasonText" />
              </FormItem>
            </Col>
          </Row>
        </>
      ),
    },
    /*     {
      title: "Показания СОИ СИКН",
      content: (
        <>
          <Row>
            <Col span={24}>
              <TitleStyled>На момент отключения СИКН</TitleStyled>
              <Col span={8}>
                <FormItem
                  labelCol={{ span: 8 }}
                  name="volume"
                  label="Объем, м³:"
                >
                  <Input disabled name="volume" />
                </FormItem>
                <FormItem labelCol={{ span: 8 }} name="mass" label="Масса, т:">
                  <Input disabled name="mass" />
                </FormItem>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <TitleStyled>На момент включения СИКН</TitleStyled>
              <Col span={8}>
                <FormItem
                  labelCol={{ span: 8 }}
                  name="volumeStart"
                  label="Объем, м³:"
                >
                  <Input disabled name="volumeStart" />
                </FormItem>
                <FormItem
                  labelCol={{ span: 8 }}
                  name="massStart"
                  label="Масса, т:"
                >
                  <Input disabled name="massStart" />
                </FormItem>
              </Col>
            </Col>
          </Row>
        </>
      ),
    }, */
    {
      title: "Состав комиссионной группы",
      content: (
        <>
          <Row>
            <Col span={24}>
              <Row>
                <Title level={5}>Председатель комиссии:</Title>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <FormItem
                    required
                    name="investigationAct.commissionChairmanPost"
                    label="Должность:"
                  >
                    <Select
                      name={`investigationAct.commissionChairmanPost`}
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                          <Divider style={{ margin: "4px 0" }} />
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "nowrap",
                              padding: 8,
                            }}
                          >
                            <AntInput
                              style={{ flex: "auto" }}
                              value={this.state.newPostName}
                              onChange={this.onNameChange}
                            />
                            <a
                              style={{
                                flex: "none",
                                padding: "8px",
                                display: "block",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                this.addPost(
                                  SiknOffGroupsEnum.CommissionChairman
                                )
                              }
                            >
                              <PlusOutlined />
                              Добавить
                            </a>
                          </div>
                        </div>
                      )}
                    >
                      {this.state.investigationActInfo.commissionChairmanPosts.map(
                        (post) => (
                          <Select.Option value={post.id}>
                            {post.name}
                          </Select.Option>
                        )
                      )}
                    </Select>
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    required
                    name="investigationAct.commissionChairmanFio"
                    label="ФИО:"
                  >
                    <Input name="investigationAct.commissionChairmanFio" />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Title level={5}>Члены комиссии:</Title>
              </Row>

              <FieldArray
                name="investigationAct.commissionMembers"
                render={(arrayHelpers) => (
                  <div>
                    {values.investigationAct.commissionMembers &&
                    values.investigationAct.commissionMembers.length > 0 ? (
                      values.investigationAct.commissionMembers.map(
                        (friend, index) => (
                          <>
                            <Row gutter={16} align="middle">
                              <Col span={8}>
                                <FormItem
                                  required
                                  name={`investigationAct.commissionMembers.${index}.post`}
                                  label="Должность:"
                                >
                                  <Select
                                    name={`investigationAct.commissionMembers.${index}.post`}
                                    dropdownRender={(menu) => (
                                      <div>
                                        {menu}
                                        <Divider
                                          style={{
                                            margin: "4px 0",
                                          }}
                                        />
                                        <div
                                          style={{
                                            display: "flex",
                                            flexWrap: "nowrap",
                                            padding: 8,
                                          }}
                                        >
                                          <AntInput
                                            style={{
                                              flex: "auto",
                                            }}
                                            value={this.state.newPostName}
                                            onChange={this.onNameChange}
                                          />
                                          <a
                                            style={{
                                              flex: "none",
                                              padding: "8px",
                                              display: "block",
                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              this.addPost(
                                                SiknOffGroupsEnum.CommissionMembers
                                              )
                                            }
                                          >
                                            <PlusOutlined />
                                            Добавить
                                          </a>
                                        </div>
                                      </div>
                                    )}
                                  >
                                    {this.state.investigationActInfo.commissionMembersPosts.map(
                                      (post) => (
                                        <Select.Option value={post.id}>
                                          {post.name}
                                        </Select.Option>
                                      )
                                    )}
                                  </Select>
                                </FormItem>
                              </Col>
                              <Col span={8}>
                                <FormItem
                                  required
                                  name={`investigationAct.commissionMembers.${index}.fio`}
                                  label="ФИО:"
                                >
                                  <Input
                                    name={`investigationAct.commissionMembers.${index}.fio`}
                                  />
                                </FormItem>
                              </Col>
                              <Col>
                                {values.investigationAct.commissionMembers &&
                                values.investigationAct.commissionMembers
                                  .length > 1 ? (
                                  <DeleteOutlined
                                    style={{ color: "red" }}
                                    onClick={() => arrayHelpers.remove(index)}
                                  />
                                ) : (
                                  <div></div>
                                )}
                              </Col>
                            </Row>
                          </>
                        )
                      )
                    ) : (
                      <Button></Button>
                    )}
                    <Button
                      type={"link"}
                      icon={<PlusCircleFilled />}
                      size="large"
                      onClick={() =>
                        arrayHelpers.push({
                          post: "",
                          fio: "",
                        })
                      }
                    >
                      Добавить
                    </Button>
                  </div>
                )}
              />
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: "Мероприятия по предупреждению отказа",
      content: (
        <>
          <Row>
            <Col span={24}>
              <FieldArray
                name="investigationAct.siknOffEvents"
                render={(eventArrayHelpers) => (
                  <div>
                    {values.investigationAct.siknOffEvents &&
                    values.investigationAct.siknOffEvents.length > 0 ? (
                      values.investigationAct.siknOffEvents.map(
                        (event, eventIndex) => (
                          <>
                            <Row gutter={16}>
                              <Col span={8}>
                                <FormItem
                                  name={`investigationAct.siknOffEvents.${eventIndex}.date`}
                                  label="Срок исполнения мероприятия"
                                >
                                  <DatePicker
                                    locale={locale}
                                    style={{ width: "100%" }}
                                    name={`investigationAct.siknOffEvents.${eventIndex}.date`}
                                    onChange={(value) => {
                                      if (value !== null) {
                                        setFieldValue(
                                          `investigationAct.siknOffEvents.${eventIndex}.date`,
                                          value.toDate()
                                        );
                                      }
                                    }}
                                  />
                                </FormItem>
                              </Col>

                              <Col span={16}>
                                <FormItem
                                  required
                                  name={`investigationAct.siknOffEvents.${eventIndex}.content`}
                                  label="Содержание мероприятия"
                                >
                                  <Input.TextArea
                                    name={`investigationAct.siknOffEvents.${eventIndex}.content`}
                                  />
                                </FormItem>
                                <FormItem
                                  name={`investigationAct.siknOffEvents.${eventIndex}.notes`}
                                  label="Примечания"
                                >
                                  <Input.TextArea
                                    name={`investigationAct.siknOffEvents.${eventIndex}.notes`}
                                  />
                                </FormItem>
                              </Col>

                              <Col span={24}>
                                <Title level={5}>Исполнители:</Title>
                                <FieldArray
                                  name={`investigationAct.siknOffEvents.${eventIndex}.performers`}
                                  render={(arrayHelpers) => (
                                    <div>
                                      {values.investigationAct.siknOffEvents[
                                        eventIndex
                                      ].performers &&
                                      values.investigationAct.siknOffEvents[
                                        eventIndex
                                      ].performers.length > 0 ? (
                                        values.investigationAct.siknOffEvents[
                                          eventIndex
                                        ].performers.map((perfomer, index) => (
                                          <>
                                            <Row gutter={16} align="middle">
                                              <Col span={8}>
                                                <FormItem
                                                  required
                                                  name={`investigationAct.siknOffEvents.${eventIndex}.performers.${index}.post`}
                                                  label="Должность:"
                                                >
                                                  <Select
                                                    name={`investigationAct.siknOffEvents.${eventIndex}.performers.${index}.post`}
                                                    dropdownRender={(menu) => (
                                                      <div>
                                                        {menu}
                                                        <Divider
                                                          style={{
                                                            margin: "4px 0",
                                                          }}
                                                        />
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            flexWrap: "nowrap",
                                                            padding: 8,
                                                          }}
                                                        >
                                                          <AntInput
                                                            style={{
                                                              flex: "auto",
                                                            }}
                                                            value={
                                                              this.state
                                                                .newPostName
                                                            }
                                                            onChange={
                                                              this.onNameChange
                                                            }
                                                          />
                                                          <a
                                                            style={{
                                                              flex: "none",
                                                              padding: "8px",
                                                              display: "block",
                                                              cursor: "pointer",
                                                            }}
                                                            onClick={() =>
                                                              this.addPost(
                                                                SiknOffGroupsEnum.Performers
                                                              )
                                                            }
                                                          >
                                                            <PlusOutlined />{" "}
                                                            Добавить
                                                          </a>
                                                        </div>
                                                      </div>
                                                    )}
                                                  >
                                                    {this.state.investigationActInfo.performersPosts.map(
                                                      (post) => (
                                                        <Select.Option
                                                          value={post.id}
                                                        >
                                                          {post.name}
                                                        </Select.Option>
                                                      )
                                                    )}
                                                  </Select>
                                                </FormItem>
                                              </Col>
                                              <Col span={8}>
                                                <FormItem
                                                  required
                                                  name={`investigationAct.siknOffEvents.${eventIndex}.performers.${index}.fio`}
                                                  label="ФИО:"
                                                >
                                                  <Input
                                                    name={`investigationAct.siknOffEvents.${eventIndex}.performers.${index}.fio`}
                                                  />
                                                </FormItem>
                                              </Col>
                                              <Col>
                                                {values.investigationAct
                                                  .siknOffEvents[eventIndex]
                                                  .performers &&
                                                values.investigationAct
                                                  .siknOffEvents[eventIndex]
                                                  .performers.length > 1 ? (
                                                  <DeleteOutlined
                                                    style={{
                                                      color: "red",
                                                    }}
                                                    onClick={() =>
                                                      arrayHelpers.remove(index)
                                                    }
                                                  />
                                                ) : (
                                                  <div></div>
                                                )}
                                              </Col>
                                            </Row>
                                          </>
                                        ))
                                      ) : (
                                        <div></div>
                                      )}
                                      <Button
                                        type={"link"}
                                        icon={<PlusCircleFilled />}
                                        size="large"
                                        onClick={() =>
                                          arrayHelpers.push({
                                            post: "",
                                            fio: "",
                                          })
                                        }
                                      >
                                        Добавить исполнителя
                                      </Button>
                                    </div>
                                  )}
                                />
                              </Col>
                            </Row>
                            <Row justify={"end"}>
                              <Col>
                                {values.investigationAct.siknOffEvents &&
                                values.investigationAct.siknOffEvents.length >
                                  1 ? (
                                  <DeleteOutlined
                                    style={{ color: "red" }}
                                    onClick={() =>
                                      eventArrayHelpers.remove(eventIndex)
                                    }
                                  />
                                ) : (
                                  <div></div>
                                )}
                              </Col>
                            </Row>
                            <Divider />
                          </>
                        )
                      )
                    ) : (
                      <div></div>
                    )}
                    <Button
                      type={"link"}
                      icon={<PlusCircleFilled />}
                      size="large"
                      onClick={() =>
                        eventArrayHelpers.push({
                          content: "",
                          date: pureDate(new Date()),
                          performers: [{ fio: "", post: "" }],
                          notes: "",
                        })
                      }
                      block
                    >
                      Добавить мероприятие
                    </Button>
                  </div>
                )}
              />
            </Col>
          </Row>
        </>
      ),
    },
    {
      title: "Заключение и рекомендации",
      content: (
        <>
          <Row>
            <Col span={16}>
              <FormItem
                name="recommendations"
                label="Заключение и рекомендации"
              >
                <Input.TextArea name="recommendations" />
              </FormItem>
            </Col>
            <Divider />
            <Col span={16}>
              <FormItem name="remark" label="Примечание">
                <Input.TextArea name="remark" />
              </FormItem>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  onNameChange = (event: any) => {
    this.setState({
      newPostName: event.target.value,
    });
  };

  addPost = (group: SiknOffGroupsEnum) => {
    const { investigationActInfo, newPostName } = this.state;
    if (newPostName === "") return;
    switch (group) {
      case SiknOffGroupsEnum.Reconciling:
        if (
          this.state.investigationActInfo.reconcilingPosts.filter(
            (x) => x.name.toLowerCase() === newPostName.toLowerCase()
          ).length > 0
        ) {
          message.warn("Введенная должность уже существует");
          return;
        }
        this.setState({
          investigationActInfo: {
            ...this.state.investigationActInfo,
            reconcilingPosts: [
              ...investigationActInfo.reconcilingPosts,
              { id: newPostName, name: newPostName },
            ],
          },
          newPostName: "",
        });
        break;
      case SiknOffGroupsEnum.Approver:
        if (
          this.state.investigationActInfo.approverPosts.filter(
            (x) => x.name.toLowerCase() === newPostName.toLowerCase()
          ).length > 0
        ) {
          message.warn("Введенная должность уже существует");
          return;
        }
        this.setState({
          investigationActInfo: {
            ...this.state.investigationActInfo,
            approverPosts: [
              ...investigationActInfo.approverPosts,
              { id: newPostName, name: newPostName },
            ],
          },
          newPostName: "",
        });
        break;
      case SiknOffGroupsEnum.CommissionChairman:
        if (
          this.state.investigationActInfo.commissionChairmanPosts.filter(
            (x) => x.name.toLowerCase() === newPostName.toLowerCase()
          ).length > 0
        ) {
          message.warn("Введенная должность уже существует");
          return;
        }
        this.setState({
          investigationActInfo: {
            ...this.state.investigationActInfo,
            commissionChairmanPosts: [
              ...investigationActInfo.commissionChairmanPosts,
              { id: newPostName, name: newPostName },
            ],
          },
          newPostName: "",
        });
        break;
      case SiknOffGroupsEnum.CommissionMembers:
        if (
          this.state.investigationActInfo.commissionMembersPosts.filter(
            (x) => x.name.toLowerCase() === newPostName.toLowerCase()
          ).length > 0
        ) {
          message.warn("Введенная должность уже существует");
          return;
        }
        this.setState({
          investigationActInfo: {
            ...this.state.investigationActInfo,
            commissionMembersPosts: [
              ...investigationActInfo.commissionMembersPosts,
              { id: newPostName, name: newPostName },
            ],
          },
          newPostName: "",
        });
        break;
      case SiknOffGroupsEnum.Performers:
        if (
          this.state.investigationActInfo.performersPosts.filter(
            (x) => x.name.toLowerCase() === newPostName.toLowerCase()
          ).length > 0
        ) {
          message.warn("Введенная должность уже существует");
          return;
        }
        this.setState({
          investigationActInfo: {
            ...this.state.investigationActInfo,
            performersPosts: [
              ...investigationActInfo.performersPosts,
              { id: newPostName, name: newPostName },
            ],
          },
          newPostName: "",
        });
        break;
      default:
        break;
    }
  };

  next() {
    this.setState({ step: this.state.step + 1 });
  }

  prev() {
    this.setState({ step: this.state.step - 1 });
  }

  render(): JSX.Element {
    if (this.props.initial !== null && this.props.initial !== undefined) {
      if (
        this.props.initial.investigationAct === null ||
        this.props.initial.investigationAct === undefined
      ) {
        this.props.initial.investigationAct = {
          reconcilingPost: "",
          reconcilingFio: "",
          approverPost: "",
          approverFio: "",

          commissionChairmanPost: "",

          commissionChairmanFio: "",

          commissionMembers: [{ fio: "", post: "" }],
          siknOffEvents: [
            {
              content: "",
              date: pureDate(new Date()),
              performers: [{ fio: "", post: "" }],
              notes: "",
            },
          ],
        };
      }
      this.props.initial.investigationAct.commissionMembers =
        this.state.investigationActInfo.commissionMembers;
      this.props.initial.investigationAct.siknOffEvents =
        this.state.investigationActInfo.events;
      this.props.initial.investigationAct.commissionChairmanPost =
        this.state.investigationActInfo.commissionChairman.post;
      this.props.initial.investigationAct.reconcilingPost =
        this.state.investigationActInfo.reconciling.post;
      this.props.initial.investigationAct.approverPost =
        this.state.investigationActInfo.approver.post;
    }
    let title: string = "";
    switch (this.props.node.type) {
      case "siknrsus":
        title = this.props.node.title;
        break;
      case "osts":
        if (this.props.initial !== undefined) {
          title = this.props.initial.siknFullName;
        }
        break;
    }
    return (
      <div style={{ width: "100%", margin: "auto" }}>
        <Formik
          initialValues={
            this.props.initial ?? SiknOffItem.Default(this.props.node.nodeId)
          }
          onSubmit={async (
            data: SiknOffItem,
            helpers: FormikHelpers<SiknOffItem>
          ) => {
            if (
              this.state.step ===
              this.steps(helpers.setFieldValue, data).length - 1
            ) {
              let res = await this.props.submitCallback(data);

              if (data.withFile === true)
                await this.props.downloadFileCallback(res);
              helpers.setSubmitting(false);
            }
          }}
          validationSchema={validationSchema}
        >
          {({ setFieldValue, values }) => {
            return (
              <>
                {this.state.loading ? (
                  <div className="mx-auto my-auto">
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                  </div>
                ) : (
                  <Layout>
                    <Sider theme="light" width={240}>
                      <Steps
                        current={this.state.step}
                        direction="vertical"
                        size="small"
                      >
                        {this.steps(setFieldValue, values).map((s) => (
                          <Step key={s.title} title={s.title} />
                        ))}
                      </Steps>
                    </Sider>
                    <Layout>
                      <Content
                        style={{
                          background: "#FFFFFF",
                          padding: "0px",
                          paddingLeft: "24px",
                        }}
                      >
                        <Header
                          style={{
                            background: "#FFFFFF",
                            padding: "0px",
                          }}
                        >
                          <Row>
                            <Col span={24}>
                              <Title level={4}>{title}</Title>
                            </Col>
                          </Row>
                        </Header>

                        <Form layout="vertical">
                          {
                            this.steps(setFieldValue, values)[this.state.step]
                              .content
                          }
                          <Footer
                            style={{
                              background: "#FFFFFF",
                              height: "80px",
                              margin: "0px",
                            }}
                          >
                            <Row justify="end" align="bottom">
                              {this.state.step ===
                                this.steps(setFieldValue, values).length -
                                  1 && (
                                <>
                                  <Space align="baseline" size="middle">
                                    <FormItem
                                      style={{ margin: "0px", padding: "0px" }}
                                      name="withFile"
                                    >
                                      <Switch name="withFile" />
                                    </FormItem>
                                    <span>Скачать акт</span>
                                  </Space>
                                </>
                              )}
                              {this.state.step > 0 && (
                                <Button type="link" onClick={() => this.prev()}>
                                  Назад
                                </Button>
                              )}
                              {this.state.step <
                                this.steps(setFieldValue, values).length -
                                  1 && (
                                <Button
                                  type="primary"
                                  style={{
                                    background: "#1890FF",
                                    color: "#FFFFFF",
                                  }}
                                  onClick={() => this.next()}
                                >
                                  Далее
                                </Button>
                              )}
                              {this.state.step ===
                                this.steps(setFieldValue, values).length -
                                  1 && (
                                <>
                                  <SubmitButton
                                    style={{
                                      background: "#219653",
                                      color: "#FFFFFF",
                                    }}
                                  >
                                    Добавить
                                  </SubmitButton>
                                </>
                              )}
                            </Row>
                          </Footer>
                        </Form>
                      </Content>
                    </Layout>
                  </Layout>
                )}
              </>
            );
          }}
        </Formik>
      </div>
    );
  }

  componentDidMount() {
    if (this.props.initial !== null && this.props.initial !== undefined) {
      axios
        .get<InvestigationActInfo>(
          `${apiBase}/siknoff/investigationactinfo/${this.props.initial.id}`
        )
        .then((result) => {
          this.setState({
            investigationActInfo: result.data,
            loading: false,
          });
        });
    }
  }
}
