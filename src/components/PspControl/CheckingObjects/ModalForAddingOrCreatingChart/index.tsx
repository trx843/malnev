import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, FormikProps } from "formik";
import { Spin, Space, Modal } from "antd";
import { Form, FormItem, Select, Radio, DatePicker } from "formik-antd";
import { CheckingObjectsItem } from "../classes";
import {
  RadioGroupValues,
  FormFields,
  InitialFormValues,
  ValidationSchema,
  InitDictionaries,
  DictionariesNames,
} from "./constants";
import {
  serializeValues,
  getCheckTypeOptions,
  isVerificationLevelId,
  disabledDate,
  mapVerificationSchedules,
  mapVerificationLevels,
  getOwnType,
  getFormValues,
  validateCheckType,
  verificationLevelValidator,
  verificationScheduleValidator,
  getOstIds,
} from "./utils";
import {
  addToScheduleThunk,
  createVerificationScheduleThunk,
  getVerificationSchedules,
  getVerificationLevels,
} from "../../../../thunks/pspControl/checkingObjects/index";
import { IdType, StateType } from "../../../../types";
import { ICheckingObjectsStore } from "../../../../slices/pspControl/checkingObjects";
import { IDictionaries, IFormValues } from "./types";
import { PspcontrolVerificationSchedulesParams } from "../../../../api/params/put-pspcontrol-verification-schedules.params";
import { IPostPspcontrolVerificationSchedulesParams } from "../../../../api/params/post-pspcontrol-verification-schedules.params";
import { OwnStatuses } from "../../../../slices/pspControl/verificationSchedule/constants";

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  checkingObjectsItem: CheckingObjectsItem[];
}

export const ModalForAddingOrCreatingChart: React.FC<IProps> = ({
  isVisible,
  onCancel,
  checkingObjectsItem,
}) => {
  const dispatch = useDispatch();

  const formikRef = React.useRef<FormikProps<IFormValues>>(null); // реф для того чтобы засабмитить форму из вне компонента формы

  const [dictionaries, setDictionaries] =
    React.useState<IDictionaries>(InitDictionaries);

  const [radioValue, setRadioValue] = useState(RadioGroupValues.add);
  const { isAddToOrCreateSchedule } = useSelector<
    StateType,
    ICheckingObjectsStore
  >((state) => state.checkingObjects);

  const ownType = getOwnType(checkingObjectsItem);

  React.useEffect(() => {
    if (checkingObjectsItem.length && isVisible) {
      const ostIds = getOstIds(checkingObjectsItem);
      fetchVerificationSchedules(ownType, ostIds);
      fetchVerificationLevels();
    }
  }, [checkingObjectsItem.length, isVisible]);

  const fetchVerificationSchedules = async (
    ownType: OwnStatuses,
    ostIds: IdType[]
  ) => {
    const schedules = await getVerificationSchedules(ownType, ostIds);
    setDictionaries((prevState) => {
      return {
        ...prevState,
        [DictionariesNames.verificationSchedules]: schedules,
      };
    });
  };

  const fetchVerificationLevels = async () => {
    const levels = await getVerificationLevels();
    setDictionaries((prevState) => {
      return {
        ...prevState,
        [DictionariesNames.verificationLevels]: levels,
      };
    });
  };

  React.useEffect(() => {
    if (
      dictionaries.verificationSchedules.length ||
      dictionaries.verificationLevels.length
    ) {
      initFormValues();
    }
  }, [dictionaries]);

  const initFormValues = () => {
    const setValues = formikRef.current?.setValues;
    if (setValues) setValues(getFormValues(dictionaries));
  };

  const handleSubmitForm = (values: IFormValues) => {
    const adjustedValues = serializeValues(
      values,
      checkingObjectsItem
    ) as unknown;

    if (values[FormFields.radioGroup] === RadioGroupValues.add) {
      dispatch(
        addToScheduleThunk(
          adjustedValues as PspcontrolVerificationSchedulesParams
        )
      );
    }

    if (values[FormFields.radioGroup] === RadioGroupValues.create) {
      dispatch(
        createVerificationScheduleThunk(
          adjustedValues as IPostPspcontrolVerificationSchedulesParams
        )
      );
    }
  };

  const onChangeRadio = (e) => {
    setRadioValue(e.target.value);
  };

  return (
    <Modal
      width={562}
      visible={isVisible}
      title="Добавить в существующий график/создать новый график"
      onOk={() => {
        const submitForm = formikRef.current?.submitForm;
        if (submitForm) submitForm();
      }}
      onCancel={onCancel}
      cancelText="Назад"
      okText="Добавить"
      okButtonProps={{
        loading: isAddToOrCreateSchedule,
      }}
      maskClosable={false}
      destroyOnClose
    >
      <Spin spinning={isAddToOrCreateSchedule}>
        <Formik
          initialValues={InitialFormValues}
          onSubmit={handleSubmitForm}
          innerRef={formikRef}
          validationSchema={ValidationSchema}
        >
          {(props) => {
            const verificationLevelIdValue =
              props.values[FormFields.verificationLevelId];

            return (
              <Form layout="vertical">
                <FormItem name={FormFields.radioGroup}>
                  <Radio.Group
                    name={FormFields.radioGroup}
                    onChange={onChangeRadio}
                    value={radioValue}
                  >
                    <Space direction="vertical">
                      <Radio
                        name={FormFields.radioGroup}
                        value={RadioGroupValues.add}
                      >
                        Добавить в график
                      </Radio>
                      <Radio
                        name={FormFields.radioGroup}
                        value={RadioGroupValues.create}
                      >
                        Создать новый график
                      </Radio>
                    </Space>
                  </Radio.Group>
                </FormItem>

                {radioValue === RadioGroupValues.add && (
                  <FormItem
                    style={{ marginBottom: 0 }}
                    name={FormFields.verificationScheduleId}
                    label="График проверки"
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      style={{ width: 295 }}
                      dropdownMatchSelectWidth={false}
                      name={FormFields.verificationScheduleId}
                      options={mapVerificationSchedules(
                        dictionaries.verificationSchedules
                      )}
                      validate={(verificationScheduleId) =>
                        verificationScheduleValidator(
                          verificationScheduleId,
                          checkingObjectsItem,
                          dictionaries.verificationSchedules
                        )
                      }
                    />
                  </FormItem>
                )}

                {radioValue === RadioGroupValues.create && (
                  <React.Fragment>
                    <FormItem
                      style={{ width: 295 }}
                      name={FormFields.verificationLevelId}
                      label="Уровень проверки"
                      validate={(verificationLevelId) =>
                        verificationLevelValidator(
                          verificationLevelId,
                          checkingObjectsItem
                        )
                      }
                    >
                      <Select
                        showSearch
                        optionFilterProp="label"
                        name={FormFields.verificationLevelId}
                        options={mapVerificationLevels(
                          dictionaries.verificationLevels
                        )}
                      />
                    </FormItem>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormItem
                        style={{ width: 295, marginBottom: 0 }}
                        name={FormFields.checkTypeId}
                        label="Тип проверки"
                        validate={() =>
                          validateCheckType(
                            ownType,
                            dictionaries.verificationLevels,
                            verificationLevelIdValue
                          )
                        }
                      >
                        <Select
                          showSearch
                          optionFilterProp="label"
                          name={FormFields.checkTypeId}
                          options={getCheckTypeOptions(
                            dictionaries.verificationLevels,
                            verificationLevelIdValue,
                            ownType
                          )}
                          disabled={!isVerificationLevelId(props.values)}
                        />
                      </FormItem>

                      <FormItem
                        style={{ width: 170, marginBottom: 0 }}
                        name={FormFields.inspectionYear}
                        label="Год проверки"
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          name={FormFields.inspectionYear}
                          picker="year"
                          placeholder=""
                          allowClear={false}
                          disabledDate={disabledDate}
                        />
                      </FormItem>
                    </div>
                  </React.Fragment>
                )}
              </Form>
            );
          }}
        </Formik>
      </Spin>
    </Modal>
  );
};
