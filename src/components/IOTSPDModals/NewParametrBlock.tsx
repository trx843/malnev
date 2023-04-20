import { DeleteOutlined, PlusCircleFilled } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { ResponseItemsType, SelectItemsType } from "api/responses/iotspd";
import { FormItem, Input, InputNumber, Select } from "formik-antd";
import { ModalTitleBlockStyled, ParametrFormBlockStyled } from "pages/IOTSPD/styled";
import React, { FC } from "react";

type PropsType = {
    index: number;
    paramItems: ResponseItemsType;
    arrayHelpers: any;
    modalVariant: string;
    isDisabled: boolean;
    maxCountNumberHandler: (value: string) => number;
};

export const NewParametrBlock: FC<PropsType> = React.memo(({
    index,
    paramItems,
    arrayHelpers,
    modalVariant,
    isDisabled,
    maxCountNumberHandler,
}) => {

    return <ParametrFormBlockStyled>
        <ModalTitleBlockStyled>
            {modalVariant === "add" ? `Параметр объекта ${index + 1}` : "Параметр объекта"}
        </ModalTitleBlockStyled>

        <Row style={{ width: "100%" }}>
            <Col span={7}>
                <FormItem
                    name={`paramList.${index}.dataType`}
                    label={`Тип данных`}
                >
                    <Select
                        name={`paramList.${index}.dataType`}
                        filterOption={(input, option) =>
                            option?.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                        disabled={isDisabled}
                    >
                        {paramItems["1"] &&
                            paramItems["1"].map(
                                (item: SelectItemsType) => (
                                    <Select.Option
                                        value={item.id}
                                        key={item.id}
                                    >
                                        {`(${item.id}) ${item.fullName}`}
                                    </Select.Option>
                                )
                            )}
                    </Select>
                </FormItem>
            </Col>

            <Col span={7} offset={1}>
                <FormItem
                    name={`paramList.${index}.paramGroup`}
                    label="Группа параметров"
                >
                    <Select
                        name={`paramList.${index}.paramGroup`}
                        filterOption={(input, option) =>
                            option?.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                        disabled={isDisabled}
                    >
                        {paramItems["2"] &&
                            paramItems["2"].map(
                                (item: SelectItemsType) => (
                                    <Select.Option
                                        value={item.id}
                                        key={item.id}
                                    >
                                        {`(${item.id}) ${item.fullName}`}
                                    </Select.Option>
                                )
                            )}
                    </Select>
                </FormItem>
            </Col>
        </Row>

        <Row style={{ width: "100%" }}>
            <Col span={7}>
                <FormItem
                    name={`paramList.${index}.param`}
                    label="Вид параметра"
                >
                    <Select
                        name={`paramList.${index}.param`}
                        filterOption={(input, option) =>
                            option?.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                        disabled={isDisabled}
                    >
                        {paramItems["3"] &&
                            paramItems["3"].map(
                                (item: SelectItemsType) => (
                                    <Select.Option
                                        value={item.id}
                                        key={item.id}
                                    >
                                        {`(${item.id}) ${item.fullName}`}
                                    </Select.Option>
                                )
                            )}
                    </Select>
                </FormItem>
            </Col>

            <Col span={7} offset={1}>
                <FormItem
                    name={`paramList.${index}.paramNum`}
                    label="Номер параметра"
                >
                    <InputNumber
                        name={`paramList.${index}.paramNum`}
                        style={{ width: "323px" }}
                        placeholder={
                            "Вводимое значение должно быть целым числом"
                        }
                        disabled={isDisabled}
                        min={0}
                        parser={maxCountNumberHandler}
                    />
                </FormItem>
            </Col>
        </Row>

        <Row style={{ width: "100%" }}>
            <Col span={15}>
                <FormItem
                    name={`paramList.${index}.comment`}
                    label="Комментарий"
                >
                    <Input name={`paramList.${index}.comment`} disabled={isDisabled} />
                </FormItem>
            </Col>
        </Row>

        <Row>
            <Col span={5}>
                {
                    arrayHelpers.form.values.paramList && modalVariant === "add" && index === arrayHelpers.form.values.paramList.length - 1
                        || arrayHelpers.form.values.paramList && modalVariant === "addChild" && index === arrayHelpers.form.values.paramList.length - 1
                        ? <Button
                            type={"link"}
                            icon={<PlusCircleFilled />}
                            size="large"
                            style={{ border: "1px solid #d9d9d9", marginBottom: "24px" }}
                            onClick={() =>
                                arrayHelpers.push({
                                    dataType: "",
                                    paramGroup: "",
                                    param: "",
                                    paramNum: 0,
                                    comment: "",
                                })
                            }
                        >
                            Добавить параметр
                        </Button>
                        : <div></div>
                }
            </Col>
            <Col
                span={1}
                offset={18}
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
                {
                    index > 0 && modalVariant !== "edit" ? (
                        <DeleteOutlined
                            size={24}
                            style={{ color: "red" }}
                            onClick={() => arrayHelpers.remove(index)}
                        />
                    ) : (
                        <div></div>
                    )
                }
            </Col>
        </Row>
    </ParametrFormBlockStyled>
});