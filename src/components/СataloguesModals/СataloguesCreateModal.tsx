import React, { FC } from 'react';
import { Checkbox, DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
import { UniButton } from '../UniButton';
import { FormItemType } from '../../slices/nsi';
import { FieldType, SchemeType } from '../../api/params/nsi-page.params';
import { FieldSelectorsCrossItemsType, SelectorCrossItemType } from '../../api/responses/nsi-page.response';
import locale from 'antd/es/date-picker/locale/ru_RU';

type PropsType = {
    selectedScheme: SchemeType;
    isModalVisible: boolean;
    modalOnOkHandler: (selectedScheme: SchemeType) => void;
    modalOnResetHandler: () => void;
    modalOnCancelHandler: () => void;
    isButtonLoading: boolean;
    modalTitle: string;
    itemsForForm: Array<FormItemType>;
    dataSelectors: Array<FieldSelectorsCrossItemsType>;
    formik: any;
};

export const NsiCreateModal: FC<PropsType> = React.memo(({
    selectedScheme,
    isModalVisible,
    modalOnOkHandler,
    modalOnCancelHandler,
    isButtonLoading,
    itemsForForm,
    modalTitle,
    dataSelectors,
    modalOnResetHandler,
    formik,
}) => {

    return <>
        {
            isModalVisible && <Modal
                maskClosable={false}
                title={modalTitle}
                visible={isModalVisible}
                confirmLoading={isButtonLoading}
                onCancel={modalOnCancelHandler}
                footer={[
                    <UniButton
                        key={"back"}
                        buttonHandler={modalOnCancelHandler}
                        isDisabled={isButtonLoading}
                        danger={true}
                        title={"Закрыть"}
                        type={"default"}
                    />,
                    <UniButton
                        key={"clear"}
                        buttonHandler={modalOnResetHandler}
                        isDisabled={isButtonLoading}
                        title={"Очистить"}
                        type={"default"}
                    />,
                    <UniButton
                        key={"submit"}
                        htmlType={"submit"}
                        isButtonLoading={isButtonLoading}
                        title={"Сохранить"}
                        type={"default"}
                        buttonHandler={() => modalOnOkHandler(selectedScheme)}
                    />
                ]}
            >
                <Form
                    layout={"vertical"}
                    fields={formik.fields}
                    onValuesChange={formik.setFieldAntdValue}
                    onFinishFailed={formik.setErrorsAntd}
                >
                    {
                        itemsForForm.map(item => {
                            const field = selectedScheme.fields.find((field: FieldType) => field.name === item.name);

                            if (field?.foreignKey) {
                                return <Form.Item
                                    key={item.name}
                                    name={item.name}
                                    label={item.description}
                                    rules={[
                                        {
                                            required: !field.isNullable,
                                            message: "Заполните поле",
                                        },
                                    ]}
                                >
                                    <Select allowClear placeholder={"Выберите значение из выподающего списка"}>
                                        {
                                            dataSelectors.find((field: FieldSelectorsCrossItemsType) => field.fieldName === item.name)
                                                ?.crossItems
                                                .map((item: SelectorCrossItemType) => <Select.Option value={item.primary}>
                                                    {item.foreign ? item.foreign : item.primary}
                                                </Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>
                            }
                            if (field?.fieldType === 3) {
                                return <Form.Item
                                    key={item.name}
                                    name={item.name}
                                    label={item.description}
                                    rules={[
                                        {
                                            required: !field.isNullable,
                                            message: "Заполните поле",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        placeholder={"Вводимый тип данных должен быть целым числом"}
                                        style={{ width: "100%" }}
                                        min={item.name !== "TimeZone" ? 0 : undefined}
                                    />
                                </Form.Item>
                            }
                            if (field?.fieldType === 9) {
                                return <Form.Item
                                    key={item.name}
                                    name={item.name}
                                    label={item.description}
                                    rules={[
                                        {
                                            required: !field.isNullable,
                                            message: "Заполните поле",
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        placeholder={"Вводимый тип данных может быть числом с плавающей точкой"}
                                        style={{ width: "100%" }}
                                        step={'0.01'}
                                        stringMode
                                        min={0}
                                    />
                                </Form.Item>
                            }
                            if (field?.fieldType === 1) {
                                return <Form.Item
                                    key={item.name}
                                    name={item.name}
                                    label={item.description}
                                    rules={[
                                        {
                                            required: !field.isNullable,
                                            message: "Заполните поле",
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        showTime
                                        locale={locale}
                                        format={"DD.MM.YYYY HH.mm.ss"}
                                        allowClear={false}
                                        style={{ width: "472px" }}
                                    />
                                </Form.Item>
                            }
                            if (field?.fieldType === 0 || field?.fieldType === 2) {
                                return <Form.Item
                                    key={item.name}
                                    name={item.name}
                                    label={item.description}
                                    rules={[
                                        {
                                            required: !field.isNullable,
                                            message: "Заполните поле",
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={"Вводимый тип данных должен быть строкой"}
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            }
                            if (selectedScheme.fields.find((field: FieldType) => field.name === item.name)?.fieldType === 6) {
                                return <Form.Item
                                    key={item.name}
                                    name={item.name}
                                    valuePropName={"checked"}
                                    labelAlign={"left"}
                                >
                                    <Checkbox>{item.description}</Checkbox>
                                </Form.Item>
                            }
                        })
                    }
                </Form>
            </Modal>
        }
    </>
});