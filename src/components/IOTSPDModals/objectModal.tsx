import { Col, Modal, Row, Spin } from "antd";
import { ResponseItemsType, SelectItemsType } from "api/responses/iotspd";
import { UniButton } from "components/UniButton";
import { FieldArray, Formik, FormikProps } from "formik";
import { FormItem, Select, Input, InputNumber } from "formik-antd";
import {
  ObjectModalFormStyled,
  ModalTitleBlockStyled,
} from "pages/IOTSPD/styled";
import React, { FC, useEffect } from "react";
import { objectModalVariantConstant } from "slices/iotspd";
import { NewParametrBlock } from "./NewParametrBlock";

type PropsType = {
  isModalVisible: boolean;
  modalVariant: string;
  onSubmit: (params) => void;
  onCancel: () => void;
  objectItems: ResponseItemsType;
  toTypeSelectHandler: (value: string) => void;
  isButtonLoading: boolean;
  toNumList: Array<SelectItemsType>;
  paramItems: ResponseItemsType;
  objectValidationSchema: any;
  newObjectInitialValues: any;
  modifingObjectFormInitialValues: any;
  setWarnFieldsMessageHandler: (errors: any) => void;
  onCloseWarnMessageHandler: () => void;
  onOpenWarnMessageHandler: () => void;
  maxCountNumberHandler: (value: string) => number;
};

export const ObjectModal: FC<PropsType> = React.memo(
  ({
    isModalVisible,
    modalVariant,
    onSubmit,
    onCancel,
    objectItems,
    toTypeSelectHandler,
    isButtonLoading,
    toNumList,
    paramItems,
    objectValidationSchema,
    newObjectInitialValues,
    modifingObjectFormInitialValues,
    setWarnFieldsMessageHandler,
    onCloseWarnMessageHandler,
    onOpenWarnMessageHandler,
    maxCountNumberHandler,
  }) => {

    const formikRef = React.useRef<FormikProps<any>>(null); // реф для того чтобы засабмитить форму из вне компонента формы

    return (
      <Modal
        maskClosable={false}
        title={objectModalVariantConstant[modalVariant]}
        visible={isModalVisible}
        onCancel={onCancel}
        width={1177}
        destroyOnClose
        footer={[
          <UniButton
            key={"back"}
            title={"Назад"}
            type={"link"}
            buttonHandler={() => {
              onCancel()
              onCloseWarnMessageHandler()
            }}
            isDisabled={isButtonLoading}
          />,
          <UniButton
            key={"submit"}
            title={"Сохранить"}
            type={"text"}
            buttonHandler={() => {
              formikRef.current?.submitForm()
              onOpenWarnMessageHandler()
            }}
            background={"#219653"}
            color={"white"}
            isButtonLoading={isButtonLoading}
          />,
        ]}
      >
        <Formik
          initialValues={modalVariant === "add" ? newObjectInitialValues : modifingObjectFormInitialValues}
          onSubmit={onSubmit}
          innerRef={formikRef}
          validationSchema={objectValidationSchema}
          validateOnChange={false}
        >
          {({ values, errors }) => {
            useEffect(() => {
              setWarnFieldsMessageHandler(errors)
            }, [errors]);

            return (
              <ObjectModalFormStyled
                layout="vertical"
              >
                <ModalTitleBlockStyled>
                  Принадлежность к организационной единице
                </ModalTitleBlockStyled>
                <Row style={{ width: "100%" }}>
                  <Col span={7}>
                    <FormItem
                      name={"ost"}
                      label="Организация (ОСТ)"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <Select
                        name={"ost"}
                        filterOption={(input, option) =>
                          option?.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {objectItems["1"] &&
                          objectItems["1"].map((item: SelectItemsType) => (
                            <Select.Option
                              value={`${item.id}`}
                              key={item.id}
                            >
                              {`(${item.id}) ${item.fullName}`}
                            </Select.Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>

                  <Col span={7} offset={1}>
                    <FormItem
                      name={"rnu"}
                      label="Филиал (РНУ)"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <Select
                        name={"rnu"}
                        filterOption={(input, option) =>
                          option?.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {objectItems["2"] &&
                          objectItems["2"].map((item: SelectItemsType) => (
                            <Select.Option
                              value={`${item.id}`}
                              key={item.id}
                            >
                              {`(${item.id}) ${item.fullName}`}
                            </Select.Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>

                  <Col span={7} offset={1}>
                    <FormItem
                      name={"po"}
                      label="Площадочный объект (ЛДПС, НПС, ПСП)"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <Select
                        name={"po"}
                        filterOption={(input, option) =>
                          option?.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {objectItems["3"] &&
                          objectItems["3"].map((item: SelectItemsType) => (
                            <Select.Option
                              value={`${item.id}`}
                              key={item.id}
                            >
                              {`(${item.id}) ${item.fullName}`}
                            </Select.Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>

                <ModalTitleBlockStyled>
                  Принадлежность к линейной части
                </ModalTitleBlockStyled>
                <Row style={{ width: "100%" }}>
                  <Col span={7}>
                    <FormItem
                      name={"mt"}
                      label="Магистральный трубопровод"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <Select
                        name={"mt"}
                        filterOption={(input, option) =>
                          option?.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {objectItems["4"] &&
                          objectItems["4"].map((item: SelectItemsType) => (
                            <Select.Option
                              value={`${item.id}`}
                              key={item.id}
                            >
                              {`(${item.id}) ${item.fullName}`}
                            </Select.Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>

                  <Col span={7} offset={1}>
                    <FormItem
                      name={"uchMt"}
                      label="Линейная часть (участок МТ)"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <Select
                        name={"uchMt"}
                        filterOption={(input, option) =>
                          option?.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {objectItems["5"] &&
                          objectItems["5"].map((item: SelectItemsType) => (
                            <Select.Option
                              value={`${item.id}`}
                              key={item.id}
                            >
                              {`(${item.id}) ${item.fullName}`}
                            </Select.Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>

                <ModalTitleBlockStyled>
                  Принадлежность к маршруту (схеме учета)
                </ModalTitleBlockStyled>
                <Row style={{ width: "100%" }}>
                  <Col span={7}>
                    <FormItem
                      name={"routeType"}
                      label="Тип маршрута (схемы учета)"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <Select
                        name={"routeType"}
                        filterOption={(input, option) =>
                          option?.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {objectItems["6"] &&
                          objectItems["6"].map((item: SelectItemsType) => (
                            <Select.Option
                              value={`${item.id}`}
                              key={item.id}
                            >
                              {`(${item.id}) ${item.fullName}`}
                            </Select.Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>

                  <Col span={7} offset={1}>
                    <FormItem
                      name={"routeNum"}
                      label="Номер маршрута (схемы учета)"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "329px" }}
                        name={"routeNum"}
                        min={0}
                        parser={maxCountNumberHandler}
                      />
                    </FormItem>
                  </Col>
                </Row>

                <ModalTitleBlockStyled>
                  Принадлежность к технологическому объекту
                </ModalTitleBlockStyled>
                <Row style={{ width: "100%" }}>
                  <Col span={7}>
                    <FormItem
                      name={"toType"}
                      label="Тип технологического объекта"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <Select
                        name={"toType"}
                        showSearch
                        onChange={toTypeSelectHandler}
                        filterOption={(input, option) =>
                          option?.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {objectItems["7"] &&
                          objectItems["7"].map((item: SelectItemsType) => (
                            <Select.Option
                              value={`${item.id}`}
                              key={item.id}
                            >
                              {`(${item.id}) ${item.fullName}`}
                            </Select.Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>

                  <Col span={7} offset={1}>
                    {isButtonLoading ? (
                      <Spin size="large" />
                    ) : toNumList.length ? (
                      <FormItem
                        name={"toNum"}
                        label="Номер технологического объекта"
                        rules={[
                          {
                            required: true,
                            message: "Выберите параметр",
                          },
                        ]}
                      >
                        <Select name={"toNum"}>
                          {toNumList.map((item: SelectItemsType) => (
                            <Select.Option
                              value={`${item.id}`}
                              key={item.id}
                            >
                              {`(${item.id}) ${item.fullName}`}
                            </Select.Option>
                          ))}
                        </Select>
                      </FormItem>
                    ) : (
                      <FormItem
                        name={"toNum"}
                        label="Номер технологического объекта"
                        rules={[
                          {
                            required: true,
                            message: "Выберите параметр",
                          },
                        ]}
                      >
                        <Input
                          style={{ width: "329px" }}
                          name={"toNum"}
                          min={0}
                          maxLength={6}
                        />
                      </FormItem>
                    )}
                  </Col>
                </Row>

                <ModalTitleBlockStyled>
                  Принадлежность к системе автоматики
                </ModalTitleBlockStyled>
                <Row style={{ width: "100%" }}>
                  <Col span={7}>
                    <FormItem
                      name={"saType"}
                      label="Код СА"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <Select
                        name={"saType"}
                        filterOption={(input, option) =>
                          option?.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {objectItems["8"] &&
                          objectItems["8"].map((item: SelectItemsType) => (
                            <Select.Option
                              value={`${item.id}`}
                              key={item.id}
                            >
                              {`(${item.id}) ${item.fullName}`}
                            </Select.Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>

                  <Col span={7} offset={1}>
                    <FormItem
                      name={"saTransmitterType"}
                      label="Тип оборудования передачи данных"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <Select
                        name={"saTransmitterType"}
                        filterOption={(input, option) =>
                          option?.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {objectItems["9"] &&
                          objectItems["9"].map((item: SelectItemsType) => (
                            <Select.Option
                              value={`${item.id}`}
                              key={item.id}
                            >
                              {`(${item.id}) ${item.fullName}`}
                            </Select.Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>

                  <Col span={7} offset={1}>
                    <FormItem
                      name={"saTransmitterNum"}
                      label="Номер оборудования передачи данных"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "329px" }}
                        name={"saTransmitterNum"}
                        min={0}
                        parser={maxCountNumberHandler}
                      />
                    </FormItem>
                  </Col>
                </Row>

                <ModalTitleBlockStyled>
                  Принадлежность к технологическому блоку
                </ModalTitleBlockStyled>
                <Row style={{ width: "100%" }}>
                  <Col span={7}>
                    <FormItem
                      name={"tbType"}
                      label="Тип ТБ"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <Select
                        name={"tbType"}
                        filterOption={(input, option) =>
                          option?.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {objectItems["10"] &&
                          objectItems["10"].map((item: SelectItemsType) => (
                            <Select.Option
                              value={`${item.id}`}
                              key={item.id}
                            >
                              {`(${item.id}) ${item.fullName}`}
                            </Select.Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>

                  <Col span={7} offset={1}>
                    <FormItem
                      name={"tbNum"}
                      label="Номер ТБ"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "329px" }}
                        name={"tbNum"}
                        min={0}
                        parser={maxCountNumberHandler}
                      />
                    </FormItem>
                  </Col>
                </Row>

                <ModalTitleBlockStyled>
                  Принадлежность к месту установки
                </ModalTitleBlockStyled>
                <Row style={{ width: "100%" }}>
                  <Col span={7}>
                    <FormItem
                      name={"muType"}
                      label="Тип места установки"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <Select
                        name={"muType"}
                        filterOption={(input, option) =>
                          option?.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {objectItems["11"] &&
                          objectItems["11"].map((item: SelectItemsType) => (
                            <Select.Option
                              value={`${item.id}`}
                              key={item.id}
                            >
                              {`(${item.id}) ${item.fullName}`}
                            </Select.Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>

                  <Col span={7} offset={1}>
                    <FormItem
                      name={"muNum"}
                      label="Номер места установки"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "329px" }}
                        name={"muNum"}
                        min={0}
                        parser={maxCountNumberHandler}
                      />
                    </FormItem>
                  </Col>
                </Row>

                <ModalTitleBlockStyled>
                  Принадлежность к отчетному документу
                </ModalTitleBlockStyled>
                <Row style={{ width: "100%" }}>
                  <Col span={7}>
                    <FormItem
                      name={"docType"}
                      label="Тип отчетного документа"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <Select
                        name={"docType"}
                        filterOption={(input, option) =>
                          option?.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {objectItems["12"] &&
                          objectItems["12"].map((item: SelectItemsType) => (
                            <Select.Option
                              value={`${item.id}`}
                              key={item.id}
                            >
                              {`(${item.id}) ${item.fullName}`}
                            </Select.Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>

                  <Col span={7} offset={1}>
                    <FormItem
                      name={"docSubtype"}
                      label="Подтип отчетного документа"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <Select
                        name={"docSubtype"}
                        filterOption={(input, option) =>
                          option?.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {objectItems["13"] &&
                          objectItems["13"].map((item: SelectItemsType) => (
                            <Select.Option
                              value={`${item.id}`}
                              key={item.id}
                            >
                              {`(${item.id}) ${item.fullName}`}
                            </Select.Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>

                <ModalTitleBlockStyled>Принадлежность к ТОУ</ModalTitleBlockStyled>
                <Row style={{ width: "100%" }}>
                  <Col span={7}>
                    <FormItem
                      name={"tou"}
                      label="Тип ТОУ, оборудования, СИ"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <Select
                        name={"tou"}
                        filterOption={(input, option) =>
                          option?.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {objectItems["14"] &&
                          objectItems["14"].map((item: SelectItemsType) => (
                            <Select.Option
                              value={`${item.id}`}
                              key={item.id}
                            >
                              {`(${item.id}) ${item.fullName}`}
                            </Select.Option>
                          ))}
                      </Select>
                    </FormItem>
                  </Col>

                  <Col span={7} offset={1}>
                    <FormItem
                      name={"touNum"}
                      label="Технологический номер"
                      rules={[
                        {
                          required: true,
                          message: "Выберите параметр",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "329px" }}
                        name={"touNum"}
                        min={0}
                        parser={maxCountNumberHandler}
                      />
                    </FormItem>
                  </Col>
                </Row>

                {
                  values.paramList && values.paramList.length
                    ? <FieldArray
                      name="paramList"
                      render={(arrayHelpers) => (
                        <div style={{ width: "100%" }}>
                          {
                            values.paramList.map((param, index) => (
                              <NewParametrBlock
                                key={index}
                                index={index}
                                paramItems={paramItems}
                                arrayHelpers={arrayHelpers}
                                modalVariant={modalVariant}
                                isDisabled={modalVariant === "edit"}
                                maxCountNumberHandler={maxCountNumberHandler}
                              />
                            ))
                          }
                        </div>
                      )}
                    />
                    : <FieldArray
                      name="paramList"
                      render={(arrayHelpers) => (
                        <div style={{ width: "100%" }}>
                          {
                            [{
                              dataType: "",
                              paramGroup: "",
                              param: "",
                              paramNum: 0,
                              comment: "",
                            }].map((param, index) => (
                              <NewParametrBlock
                                key={index}
                                index={index}
                                paramItems={paramItems}
                                arrayHelpers={arrayHelpers}
                                modalVariant={modalVariant}
                                isDisabled={modalVariant === "edit"}
                                maxCountNumberHandler={maxCountNumberHandler}
                              />
                            ))
                          }
                        </div>
                      )}
                    />
                }
              </ObjectModalFormStyled>
            );
          }}
        </Formik>
      </Modal>
    );
  }
);
