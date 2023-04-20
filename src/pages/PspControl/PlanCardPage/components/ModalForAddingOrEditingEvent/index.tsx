import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import classNames from "classnames/bind";
import { Formik, FormikProps } from "formik";
import { Modal, RadioChangeEvent, Space, Spin } from "antd";
import { Form, FormItem, Radio, DatePicker, Input } from "formik-antd";
import {
  DoneActionText,
  DoneActionTextPattern,
  FormFields,
  InitialFormValues,
  ModalEntityTypes,
  ModalModes,
  PermanentActionPattern,
  PermanentActionText,
  RadioGroupValues,
} from "./constants";
import { Nullable, StateType } from "../../../../../types";
import { IPlanCardStore } from "../../../../../slices/pspControl/planCard";
import { getPlanCardThunk } from "../../../../../thunks/pspControl/planCard";
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
} from "./utils";
import { IActionPlanModel } from "../../../../../slices/pspControl/planCard/types";
import {
  createActionPlan,
  editActionPlan,
  getActionPlan,
} from "api/requests/pspControl/planCardPage";
import styles from "./modalForAddingOrEditingEvent.module.css";
import locale from "antd/lib/date-picker/locale/ru_RU";

const cx = classNames.bind(styles);

const { TextArea } = Input;

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  mode: ModalModes;
  entity: Nullable<{ [key: string]: any }>; // объект с информацией о наршуении или рекомендации
  entityType: ModalEntityTypes; // тип сущности нарушение или рекомендация
}

export const ModalForAddingOrEditingEvent: React.FC<IProps> = ({
  isVisible,
  onCancel,
  mode,
  entity,
  entityType,
}) => {
  const { planId } = useParams<{ planId: string }>();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(false);

  const { planCardInfo } = useSelector<StateType, IPlanCardStore>(
    (state) => state.planCard
  );

  const actionPlanId = entity?.actionPlan_id;

  const formikRef = React.useRef<FormikProps<IActionPlanModel>>(null); // реф для того чтобы засабмитить форму из вне компонента формы

  const initFormValues = async (actionPlanId: string) => {
    setIsLoading(true);
    const actionPlan = await getActionPlan(actionPlanId);
    setIsLoading(false);

    if (actionPlan) {
      const setValues = formikRef.current?.setValues;
      if (setValues) setValues(getFormValues(actionPlan));
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
        entity,
        planId,
        entityType
      ) as any;

      setIsLoading(true);
      await createActionPlan(adjustedValues);
      setIsLoading(false);
    }

    if (mode === ModalModes.edit) {
      const adjustedValues = adjustValuesToEdit(values);

      setIsLoading(true);
      await editActionPlan(adjustedValues);
      setIsLoading(false);
    }

    dispatch(getPlanCardThunk(planId));

    onCancel();
  };

  const addOrEditEvent = () => {
    const submitForm = formikRef.current?.submitForm;
    if (submitForm) submitForm();
  };

  const handleChangeIsPermanent = (e: RadioChangeEvent) => {
    const setFieldValue = formikRef.current?.setFieldValue;
    const isPermanent = e.target.value;

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
        const verificatedOn = getDate(planCardInfo?.verificatedOn);
        setFieldValue(FormFields.EliminatedOn, verificatedOn);
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
      onCancel={onCancel}
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
            planCardInfo?.verificationTypeCode
          )}
        >
          {(props) => {
            const values = props.values;

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
                      disabled={isDoneDisabled(values)}
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

                <FormItem
                  name={FormFields.EliminatedOn}
                  label="Срок устранения"
                >
                  <DatePicker
                    className={cx("elimination-term-field")}
                    name={FormFields.EliminatedOn}
                    placeholder="Выберите дату"
                    allowClear={false}
                    format="DD.MM.YYYY"
                    disabled={isEliminatedOnDisabled(values)}
                    locale={locale}
                  />
                </FormItem>

                <p className={cx("marked-title")}>
                  Ответственный за выполнение
                </p>

                <FormItem name={FormFields.PositionExecutor} label="Должность">
                  <Input name={FormFields.PositionExecutor} />
                </FormItem>
                <FormItem name={FormFields.FullNameExecutor} label="ФИО">
                  <Input name={FormFields.FullNameExecutor} />
                </FormItem>

                <p className={cx("marked-title")}>Ответственный за контроль</p>

                <FormItem
                  name={FormFields.PositionController}
                  label="Должность"
                >
                  <Input name={FormFields.PositionController} />
                </FormItem>
                <FormItem name={FormFields.FullNameController} label="ФИО">
                  <Input name={FormFields.FullNameController} />
                </FormItem>
              </Form>
            );
          }}
        </Formik>
      </Spin>
    </Modal>
  );
};
