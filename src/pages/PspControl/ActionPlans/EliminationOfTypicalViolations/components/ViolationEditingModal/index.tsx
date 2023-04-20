import React from "react";
import classNames from "classnames/bind";
import { FieldArray, Formik, FormikProps } from "formik";
import { Form, FormItem, Input, InputNumber, Select } from "formik-antd";
import { Button, message, Modal, Popconfirm, Spin } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import {
  AreaOfResponsibilityOptions,
  AreaOfResponsibilityValues,
  FormFields,
  TypicalViolation,
  ValidationSchema,
} from "./constants";
import { IFormValues } from "./types";
import { Nullable, StateType } from "types";
import {
  createIdentifiedTypicalViolation,
  editIdentifiedTypicalViolation,
  getIdentifiedViolation,
  removeIdentifiedTypicalViolation,
} from "api/requests/pspControl/plan-typical-violations";
import { HandleViolationEditingModalInfo } from "../../types";
import { AreasOfResponsibility } from "../../constants";
import { ModalModes } from "enums";
import styles from "./violationEditingForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { ActionPlanTypicalViolationsStore } from "slices/pspControl/actionPlanTypicalViolations/types";
import { setReloadTableItems } from "slices/pspControl/actionPlanTypicalViolations";

const { TextArea } = Input;

const cx = classNames.bind(styles);

interface IProps {
  isVisible: boolean;
  onCancel: HandleViolationEditingModalInfo;
  violationId: Nullable<string>;
  mode: ModalModes;
  initialValues?: any;
  planId: string | undefined;
  onSave: (areasOfResponsibility: AreasOfResponsibility) => void;
  isIL: boolean;
}

export const ViolationEditingModal: React.FC<IProps> = ({
  isVisible,
  onCancel,
  violationId,
  mode,
  initialValues,
  planId,
  onSave,
  isIL,
}) => {
  const dispatch = useDispatch();
  const formikRef = React.useRef<FormikProps<IFormValues>>(null); // реф для того чтобы засабмитить форму из вне компонента формы

  const [isIdentifiedViolationLoading, setIsIdentifiedViolationLoading] =
    React.useState(false);

  const [isRemoveButtonLoading, setIsRemoveButtonLoading] =
    React.useState(false);

  React.useEffect(() => {
    if (isVisible && violationId && mode === ModalModes.edit) {
      initFormValues(violationId);
    }
  }, [violationId, isVisible, mode]);

  const modalTitleVariant = {
    [ModalModes.create]: "Добавление нарушения",
    [ModalModes.edit]: "Редактирование нарушения",
  };

  const {
    reloadTableItems
  } = useSelector<StateType, ActionPlanTypicalViolationsStore>(
    (state) => state.actionPlanTypicalViolations
  );

  const initFormValues = async (violationId: string) => {
    setIsIdentifiedViolationLoading(true);
    const identifiedViolation = await getIdentifiedViolation(violationId);
    setIsIdentifiedViolationLoading(false);

    if (identifiedViolation) {
      const setValues = formikRef.current?.setValues;
      if (setValues) setValues(identifiedViolation as any);
    }
  };

  const handleSubmitForm = async (values) => {

    setIsIdentifiedViolationLoading(true);
    if (mode === ModalModes.create) {
      const response = await createIdentifiedTypicalViolation(planId as string, values);

      if (response.id) {
        dispatch(setReloadTableItems(!reloadTableItems));
        message.success({
          content: "Типовое нарушение добавлено успешно",
          duration: 2,
        });
      }
    }

    if (mode === ModalModes.edit) {
      await editIdentifiedTypicalViolation(values.id, values);
    }
    setIsIdentifiedViolationLoading(false);

    const areasOfResponsibility =
      values.siknLabRsuTypeId ===
        AreaOfResponsibilityValues.AcceptancePointsForOilAndPetroleumProducts
        ? AreasOfResponsibility.AcceptancePointsForOilAndPetroleumProducts
        : AreasOfResponsibility.TestingLaboratoriesOfOilAndPetroleumProducts;

    onSave(areasOfResponsibility);
    onCancel(null, ModalModes.none, null);
  };

  const removeTypicalViolationHandler = async () => {
    setIsRemoveButtonLoading(true);
    violationId && await removeIdentifiedTypicalViolation(violationId);
    const areasOfResponsibility = isIL
      ? AreasOfResponsibility.TestingLaboratoriesOfOilAndPetroleumProducts
      : AreasOfResponsibility.AcceptancePointsForOilAndPetroleumProducts;

    onSave(areasOfResponsibility);
    onCancel(null, ModalModes.none, null);
    setIsRemoveButtonLoading(false);
  }

  return (
    <Modal
      width={1000}
      visible={isVisible}
      title={modalTitleVariant[mode]}
      onCancel={() => onCancel(null, ModalModes.none, null)}
      cancelButtonProps={{
        style: { display: "none" },
      }}
      maskClosable={false}
      destroyOnClose
      centered
      footer={
        mode === ModalModes.edit
          ? [
            <Popconfirm
              title="Вы уверены, что хотите удалить нарушение со всеми мероприятиями?"
              okText="Удалить"
              cancelText="Отменить"
              onConfirm={removeTypicalViolationHandler}
            >
              <Button
                type="primary"
                danger
                disabled={isIdentifiedViolationLoading}
                loading={isRemoveButtonLoading}
              >Удалить</Button>
            </Popconfirm>,
            <Button
              type="primary"
              onClick={() => formikRef.current?.submitForm()}
              loading={isIdentifiedViolationLoading}
              disabled={!planId || isRemoveButtonLoading}
            >Сохранить</Button>,
          ]
          : [<Button
            type="primary"
            onClick={() => formikRef.current?.submitForm()}
            loading={isIdentifiedViolationLoading}
            disabled={!planId}
          >
            Сохранить</Button>]
      }
    >
      <Spin spinning={isIdentifiedViolationLoading}>
        <Formik
          initialValues={initialValues || {}}
          onSubmit={handleSubmitForm}
          innerRef={formikRef}
          validationSchema={ValidationSchema}
        >
          {(props) => {
            const values = props.values;

            return (
              <Form className={cx("form")} layout="vertical">
                <p className={cx("marked-title")}>Нарушение</p>

                <FieldArray
                  name={FormFields.typicalViolations}
                  render={(arrayHelpers) => {
                    const typicalViolations =
                      values[FormFields.typicalViolations];

                    return (
                      <React.Fragment>
                        <div className={cx("typical-violations-wrapper")}>
                          {typicalViolations &&
                            typicalViolations.length > 0 &&
                            typicalViolations.map((typicalViolation, index) => {
                              return (
                                <React.Fragment key={typicalViolation.id}>
                                  <FormItem
                                    name={`${FormFields.typicalViolations}.${index}.${FormFields.typicalViolationText}`}
                                    label="Выявленные нарушения"
                                  >
                                    <TextArea
                                      name={`${FormFields.typicalViolations}.${index}.${FormFields.typicalViolationText}`}
                                    />
                                  </FormItem>
                                  <FormItem
                                    name={`${FormFields.typicalViolations}.${index}.${FormFields.pointNormativeDocuments}`}
                                    label="Пункт НД и/или ОРД"
                                  >
                                    <Input
                                      name={`${FormFields.typicalViolations}.${index}.${FormFields.pointNormativeDocuments}`}
                                    />
                                  </FormItem>
                                </React.Fragment>
                              );
                            })}
                        </div>
                      </React.Fragment>
                    );
                  }}
                />

                <p className={cx("marked-title")}>Атрибуты</p>

                <FormItem
                  name={`${FormFields.identifiedViolationSerial}`}
                  label="Номер типового нарушения"
                >
                  <InputNumber
                    name={`${FormFields.identifiedViolationSerial}`}
                    min={1}
                    disabled={true}
                    style={{ width: "100%" }}
                  />
                </FormItem>

                <FormItem
                  name={`${FormFields.siknLabRsuTypeId}`}
                  label="Зона ответственности"
                  hidden={true}
                >
                  <Select
                    name={`${FormFields.siknLabRsuTypeId}`}
                    options={AreaOfResponsibilityOptions}
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
