import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikProps } from "formik";
import { Spin, Modal } from "antd";
import { Form, FormItem } from "formik-antd";
import { FormFields, ValidationSchema } from "./constants";
import { IFormValues } from "./types";
import { StateType } from "types";
import { editSettingsPsp } from "api/requests/eliminationOfTypicalViolations";
import { IEliminationOfTypicalViolationsStore } from "slices/pspControl/eliminationOfTypicalViolations/types";
import { getSettingsPspThunk } from "thunks/pspControl/eliminationOfTypicalViolations";
import { FioSelect } from "components/DictionarySelects/FioSelect";
import { DropdownSelectTypes } from "components/DropdownSelect/constants";
import { PositionSelect } from "components/DictionarySelects/PositionSelect";

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
}

export const ModalForEditingResponsiblePerson: React.FC<IProps> = ({
  isVisible,
  onCancel,
}) => {
  const dispatch = useDispatch();

  const formikRef = React.useRef<FormikProps<IFormValues>>(null); // реф для того чтобы засабмитить форму из вне компонента формы

  const [isLoading, setIsLoading] = React.useState(false);

  const { settingsPsp } = useSelector<
    StateType,
    IEliminationOfTypicalViolationsStore
  >((state) => state.eliminationOfTypicalViolations);

  const handleSubmitForm = async (values: IFormValues) => {
    setIsLoading(true);
    await editSettingsPsp(values);
    setIsLoading(false);

    dispatch(getSettingsPspThunk(values.ostRnuPspId));

    onCancel();
  };

  return (
    <Modal
      width={562}
      visible={isVisible}
      title="Редактирование ответственного за проверку"
      onOk={() => formikRef.current?.submitForm()}
      onCancel={onCancel}
      cancelButtonProps={{ type: "text" }}
      okButtonProps={{ loading: isLoading, disabled: !settingsPsp }}
      cancelText="Отмена"
      okText="Сохранить"
      maskClosable={false}
      destroyOnClose
      centered
    >
      <Spin spinning={isLoading}>
        <Formik
          initialValues={settingsPsp || {}}
          onSubmit={handleSubmitForm}
          innerRef={formikRef}
          validationSchema={ValidationSchema}
        >
          {({ setFieldValue }) => {
            return (
              <Form layout="vertical">
                <FormItem name={FormFields.FullName} label="ФИО*">
                  <FioSelect
                    type={DropdownSelectTypes.formik}
                    name={FormFields.FullName}
                    placeholder="Введите ФИО"
                    onChange={(value: string) =>
                      setFieldValue(FormFields.FullName, value)
                    }
                  />
                </FormItem>
                <FormItem name={FormFields.Position} label="Должность*">
                  <PositionSelect
                    type={DropdownSelectTypes.formik}
                    name={FormFields.Position}
                    placeholder="Введите должность"
                    onChange={(value: string) =>
                      setFieldValue(FormFields.Position, value)
                    }
                  />
                </FormItem>
              </Form>
            );
          }}
        </Formik>
      </Spin>
    </Modal>
  );
};
