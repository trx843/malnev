import React from "react";
import classNames from "classnames/bind";
import { Formik, FormikProps } from "formik";
import { Modal, RadioChangeEvent, Space, Spin } from "antd";
import { Form, FormItem, Radio, DatePicker, Input } from "formik-antd";
import {
  createActionPlan,
  createActionPlanForTypicalViolation,
  editActionPlan,
  getActionPlan,
} from "api/requests/pspControl/planCardPage";
import { IActionPlanModel } from "slices/pspControl/planCard/types";
import { VerificationTypeCodes } from "../../enums";
import {
  DoneActionText,
  DoneActionTextPattern,
  FormFields,
  InitialFormValues,
  ModalModes,
  PermanentActionPattern,
  PermanentActionText,
  RadioGroupValues,
  TargetFormNames,
} from "./constants";
import {
  getDate,
  getFormValues,
  isDoneDisabled,
  isEliminatedOnDisabled,
  isPermanentDisabled,
  adjustValuesToCreate,
  adjustValuesToEdit,
  getAdjustedActionText,
  getValidationSchema,
  getModalTitle,
  isShowed,
} from "./utils";
import { EntityValues } from "./types";
import { FioSelect } from "components/DictionarySelects/FioSelect";
import { DropdownSelectTypes } from "components/DropdownSelect/constants";
import { PositionSelect } from "components/DictionarySelects/PositionSelect";
import styles from "./modalForAddingOrEditingEvent.module.css";
import locale from "antd/lib/date-picker/locale/ru_RU";
import { Nullable } from "types";

const cx = classNames.bind(styles);

const { TextArea } = Input;

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  mode: ModalModes;
  planId: string;
  onSubmitForm: () => void;
  entityValues: EntityValues; // объект с информацией о наршуении или рекомендации
  verificatedOn?: any; // дата проверки(обязательна при вызове с формы карточки плана)
  verificationTypeCode?: VerificationTypeCodes; // Код статуса плана(обязателен при вызове с формы карточки плана)
  targetForm: TargetFormNames; // целевая формы вызова модального окна(Карточка плана мероприятий | План мероприятий по устранению типовых нарушений)
}

export const ModalForAddingOrEditingEvent: React.FC<IProps> = ({
  isVisible,
  onCancel,
  mode,
  planId,
  onSubmitForm,
  entityValues,
  verificatedOn,
  verificationTypeCode,
  targetForm,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const actionPlanId = entityValues?.actionPlanId;

  const formikRef = React.useRef<FormikProps<IActionPlanModel>>(null); // реф для того чтобы засабмитить форму из вне компонента формы

  const [isPermanent, setIsPermanent] = React.useState<
    Nullable<boolean> | undefined
  >(false);

  const initFormValues = async (actionPlanId: string) => {
    setIsLoading(true);
    const actionPlan = await getActionPlan(actionPlanId);
    setIsLoading(false);

    if (actionPlan) {
      const setValues = formikRef.current?.setValues;
      if (setValues) setValues(getFormValues(actionPlan));
      const isPernanentInForm =
        formikRef.current?.values[FormFields.IsPermanent];
      setIsPermanent(isPernanentInForm);
    }
  };

  React.useEffect(() => {
    if (mode === ModalModes.edit && actionPlanId) {
      initFormValues(actionPlanId);
    }
  }, [mode, actionPlanId]);

  const handleSubmitForm = async (values: IActionPlanModel) => {
    if (mode === ModalModes.create) {
      const adjustedValues = adjustValuesToCreate(
        values,
        entityValues,
        planId
      ) as any;

      setIsLoading(true);
      if (targetForm === TargetFormNames.PlanCardPage) {
        await createActionPlan(adjustedValues);
      }

      if (targetForm === TargetFormNames.EliminationOfTypicalViolations) {
        await createActionPlanForTypicalViolation(planId, adjustedValues);
      }

      setIsLoading(false);
    }

    if (mode === ModalModes.edit) {
      const adjustedValues = adjustValuesToEdit(values);

      setIsLoading(true);
      await editActionPlan(adjustedValues);
      setIsLoading(false);
    }

    onCancel();
    onSubmitForm();
  };

  const addOrEditEvent = () => {
    const submitForm = formikRef.current?.submitForm;
    if (submitForm) submitForm();
  };

  const handleChangeIsPermanent = (e: RadioChangeEvent) => {
    const setFieldValue = formikRef.current?.setFieldValue;
    const isPermanent = e.target.value;
    setIsPermanent(isPermanent);

    if (setFieldValue && mode === ModalModes.create) {
      const actionText = formikRef.current?.values[FormFields.ActionText];
      const adjustedActionText = getAdjustedActionText(
        actionText,
        isPermanent,
        PermanentActionPattern,
        PermanentActionText
      );
      setFieldValue(FormFields.ActionText, adjustedActionText);
    }
  };

  const handleChangeIsDone = (e: RadioChangeEvent) => {
    const setFieldValue = formikRef.current?.setFieldValue;
    const isDone = e.target.value;
    if (setFieldValue) {
      if (isDone) {
        const momentDate = getDate(verificatedOn);
        setFieldValue(FormFields.EliminatedOn, momentDate);
      }

      if (!isDone) setFieldValue(FormFields.EliminatedOn, null);

      if (mode === ModalModes.create) {
        const actionText = formikRef.current?.values[FormFields.ActionText];
        const adjustedActionText = getAdjustedActionText(
          actionText,
          isDone,
          DoneActionTextPattern,
          DoneActionText
        );
        setFieldValue(FormFields.ActionText, adjustedActionText);
      }
    }
  };

  return (
    <Modal
      width={562}
      visible={isVisible}
      title={<p className={cx("modal-title")}>{getModalTitle(mode)}</p>}
      onOk={addOrEditEvent}
      onCancel={() => onCancel()}
      okText="Сохранить"
      okButtonProps={{ loading: isLoading }}
      cancelButtonProps={{
        style: { display: "none" },
      }}
      maskClosable={false}
      destroyOnClose
      centered
    >
      <Spin spinning={isLoading}>
        <Formik<IActionPlanModel>
          initialValues={InitialFormValues}
          onSubmit={handleSubmitForm}
          innerRef={formikRef}
          validationSchema={getValidationSchema(
            verificationTypeCode,
            targetForm,
            isPermanent
          )}
        >
          {(props) => {
            const values = props.values;
            const setFieldValue = props.setFieldValue;

            return (
              <Form className={cx("form")} layout="vertical">
                <FormItem name={FormFields.ActionText} label="Мероприятие">
                  <TextArea
                    name={FormFields.ActionText}
                    className={cx("event-field")}
                  />
                </FormItem>

                <Space className={cx("radio-wrapper")} size={180}>
                  <FormItem name={FormFields.IsPermanent} label="Постоянно">
                    <Radio.Group
                      name={FormFields.IsPermanent}
                      onChange={handleChangeIsPermanent}
                      disabled={isPermanentDisabled(values)}
                    >
                      <Space direction="vertical">
                        <Radio
                          name={FormFields.IsPermanent}
                          value={RadioGroupValues.yes}
                        >
                          Да
                        </Radio>
                        <Radio
                          name={FormFields.IsPermanent}
                          value={RadioGroupValues.no}
                        >
                          Нет
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </FormItem>
                  <FormItem name={FormFields.IsDone} label="Выполнено">
                    <Radio.Group
                      name={FormFields.IsDone}
                      onChange={handleChangeIsDone}
                      disabled={isDoneDisabled(values, targetForm)}
                    >
                      <Space direction="vertical">
                        <Radio
                          name={FormFields.IsDone}
                          value={RadioGroupValues.yes}
                        >
                          Да
                        </Radio>
                        <Radio
                          name={FormFields.IsDone}
                          value={RadioGroupValues.no}
                        >
                          Нет
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </FormItem>
                </Space>
                {isShowed(values, targetForm) && (
                  <FormItem
                    name={FormFields.EliminatedOn}
                    label="Срок устранения"
                  >
                    <DatePicker
                      className={cx("elimination-term-field")}
                      name={FormFields.EliminatedOn}
                      placeholder="Выберите дату"
                      format="DD.MM.YYYY"
                      locale={locale}
                      disabled={isEliminatedOnDisabled(values)}
                      allowClear
                    />
                  </FormItem>
                )}

                <p className={cx("marked-title")}>
                  Ответственный за выполнение
                </p>

                <FormItem name={FormFields.PositionExecutor} label="Должность">
                  <PositionSelect
                    type={DropdownSelectTypes.formik}
                    name={FormFields.PositionExecutor}
                    placeholder="Введите должность"
                    onChange={(value: string) =>
                      setFieldValue(FormFields.PositionExecutor, value)
                    }
                    allowClear
                  />
                </FormItem>
                <FormItem name={FormFields.FullNameExecutor} label="ФИО">
                  <FioSelect
                    type={DropdownSelectTypes.formik}
                    name={FormFields.FullNameExecutor}
                    placeholder="Введите ФИО"
                    onChange={(value: string) =>
                      setFieldValue(FormFields.FullNameExecutor, value)
                    }
                    allowClear
                  />
                </FormItem>

                <p className={cx("marked-title")}>Ответственный за контроль</p>

                <FormItem
                  name={FormFields.PositionController}
                  label="Должность"
                >
                  <PositionSelect
                    type={DropdownSelectTypes.formik}
                    name={FormFields.PositionController}
                    placeholder="Введите должность"
                    onChange={(value: string) =>
                      setFieldValue(FormFields.PositionController, value)
                    }
                    allowClear
                  />
                </FormItem>
                <FormItem name={FormFields.FullNameController} label="ФИО">
                  <FioSelect
                    type={DropdownSelectTypes.formik}
                    name={FormFields.FullNameController}
                    placeholder="Введите ФИО"
                    onChange={(value: string) =>
                      setFieldValue(FormFields.FullNameController, value)
                    }
                    allowClear
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
