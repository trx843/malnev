import { Modal } from "antd";
import { ResponseItemsType } from "api/responses/iotspd";
import { UniButton } from "components/UniButton";
import { FieldArray, Formik, FormikProps } from "formik";
import { ParamModalFormStyled } from "pages/IOTSPD/styled";
import React from "react";
import { FC } from "react";
import { NewParametrBlock } from "./NewParametrBlock";

type PropsType = {
    isModalVisible: boolean;
    isButtonLoading: boolean;
    modalVariant: string;
    validationSchema: any;
    newParamsListInitialValues: any;
    updateParamsListInitialValues: any;
    onOk: (params) => void;
    onCancel: () => void;
    paramItems: ResponseItemsType;
    maxCountNumberHandler: (value: string) => number;
};

export const ParametrModal: FC<PropsType> = React.memo(({
    isModalVisible,
    isButtonLoading,
    modalVariant,
    validationSchema,
    newParamsListInitialValues,
    updateParamsListInitialValues,
    onOk,
    onCancel,
    paramItems,
    maxCountNumberHandler,
}) => {

    const formikRef = React.useRef<FormikProps<any>>(null);

    return <Modal
        maskClosable={false}
        visible={isModalVisible}
        title={modalVariant === "add" ? "Добавление параметра" : "Редактирование параметра"}
        onCancel={() => {
            onCancel();
            formikRef.current?.resetForm();
        }}
        width={1177}
        destroyOnClose
        footer={<UniButton
            key={"submit"}
            title={"Сохранить"}
            type={"primary"}
            buttonHandler={() => formikRef.current?.submitForm()}
            color={"white"}
            isButtonLoading={isButtonLoading}
        />}
    >
        <Formik
            initialValues={modalVariant === "add" ? newParamsListInitialValues : updateParamsListInitialValues}
            onSubmit={onOk}
            innerRef={formikRef}
            validationSchema={validationSchema}
        >
            {({ values }) => {
                return (
                    <ParamModalFormStyled layout={"vertical"}>
                        <FieldArray
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
                                                isDisabled={false}
                                                maxCountNumberHandler={maxCountNumberHandler}
                                            />
                                        ))
                                    }
                                </div>
                            )}
                        />
                    </ParamModalFormStyled>
                )
            }}
        </Formik>
    </Modal>
});