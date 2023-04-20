import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FieldArray, FieldArrayRenderProps, Formik, FormikProps } from "formik";
import moment from "moment";
import {
  Space,
  Spin,
  Modal,
  Button,
  Tooltip,
  Popconfirm,
  Divider,
  notification,
} from "antd";
import ruLocale from "antd/es/date-picker/locale/ru_RU";
import {
  Form,
  FormItem,
  DatePicker,
  Checkbox,
  Select,
  Radio,
} from "formik-antd";
import { DeleteOutlined, PlusCircleFilled } from "@ant-design/icons/lib/icons";
import _ from "lodash";
import { IdType, StateType } from "../../../../../types";
import {
  IVerificationScheduleCardStore,
  setNotificationVerSched,
} from "../../../../../slices/pspControl/verificationScheduleCard";
import {
  dateOfVerificationValidator,
  getEmptyPsp,
  getValidationSchema,
  isDividerVisible,
  isVerificationScheduleLevelEqualOst,
  mapVerificationLevelsOst,
  mapVerificationObjectsPps,
  monthValidator,
} from "./utils";
import { IFormValues } from "./types";
import { FormFields, ListOfMonths, MAX_PSPS } from "./constants";
import {
  IOsu,
  IPspViewModel,
  IVerificationLevelsOst,
} from "../../../../../slices/pspControl/verificationScheduleCard/types";
import { ActionsEnum, Can } from "../../../../../casl";
import {
  elementId,
  VerificationScheduleElements,
} from "pages/PspControl/VerificationSchedulePage/constant";
import {
  editVerificationSchedule,
  getVerificationLevelsOst,
  getVerificationObjectsPps,
  getVerificationPsps,
} from "api/requests/pspControl/VerificationScheduleCard";
import {
  adjustParams,
  mapVerificationPsps,
} from "thunks/pspControl/verificationScheduleCard/utils";
import { getVerificationScheduleCardInfoThunk } from "thunks/pspControl/verificationScheduleCard";
import "./styles.css";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const { RangePicker } = DatePicker;

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  scheduleId: string;
}

export const ModalScheduleEditing: React.FC<IProps> = ({
  isVisible,
  onCancel,
  scheduleId,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { verificationScheduleCardInfo, verificationScheduleGroupInfo } =
    useSelector<StateType, IVerificationScheduleCardStore>(
      (state) => state.verificationScheduleCard
    );

  const verificationScheduleLevel =
    verificationScheduleCardInfo?.verificationLevel;
  const pspId = verificationScheduleGroupInfo?.id.toString();
  const listOfSiknLabRsuIds =
    verificationScheduleGroupInfo?.listOfSiknLabRsuIds;
  const hasDates = verificationScheduleGroupInfo?.hasDates;

  const inspectionYear =
    verificationScheduleCardInfo?.inspectionYear ?? moment().year();

  const [verificationLevelsOst, setVerificationLevelsOst] = React.useState<
    IVerificationLevelsOst[]
  >([]);
  const [isVerificationLevelsOstLoading, setIsVerificationLevelsOstLoading] =
    React.useState(false);

  const [verificationObjectsPps, setVerificationObjectsPps] = React.useState<
    IOsu[]
  >([]);
  const [isVerificationObjectsPpsLoading, setIsVerificationObjectsPpsLoading] =
    React.useState(false);

  const [isVerificationPspsLoading, setIsVerificationPspsLoading] =
    React.useState(false);

  const [isEditingVerificationSchedule, setIsEditingVerificationSchedule] =
    React.useState(false);

  const formikRef = React.useRef<FormikProps<IFormValues>>(null); // реф для того чтобы засабмитить форму из вне компонента формы

  React.useEffect(() => {
    fetchVerificationLevelsOst();
  }, []);

  React.useEffect(() => {
    if (
      pspId &&
      scheduleId &&
      verificationScheduleLevel &&
      listOfSiknLabRsuIds &&
      hasDates !== undefined
    ) {
      init(
        pspId,
        scheduleId,
        inspectionYear,
        verificationScheduleLevel,
        listOfSiknLabRsuIds,
        hasDates
      );
    }
  }, [
    listOfSiknLabRsuIds,
    scheduleId,
    inspectionYear,
    verificationScheduleLevel,
  ]);

  const init = (
    pspId: string,
    scheduleId: string,
    inspectionYear: number,
    verificationScheduleLevel: number,
    listOfSiknLabRsuIds: IdType[],
    hasDates: boolean
  ) => {
    fetchVerificationObjectsPps(pspId);
    fetchVerificationPsps(
      scheduleId,
      pspId,
      listOfSiknLabRsuIds,
      hasDates,
      inspectionYear,
      verificationScheduleLevel
    );
  };

  const fetchVerificationLevelsOst = async () => {
    setIsVerificationLevelsOstLoading(true);
    const options = await getVerificationLevelsOst();
    setVerificationLevelsOst(options);
    setIsVerificationLevelsOstLoading(false);
  };

  const fetchVerificationObjectsPps = async (pspId: string) => {
    setIsVerificationObjectsPpsLoading(true);
    const options = await getVerificationObjectsPps(pspId);
    setVerificationObjectsPps(options);
    setIsVerificationObjectsPpsLoading(false);
  };

  const fetchVerificationPsps = async (
    scheduleId: string,
    pspId: string,
    listOfSiknLabRsuIds: IdType[],
    hasDates: boolean,
    inspectionYear: number,
    verificationScheduleLevel: number
  ) => {
    setIsVerificationPspsLoading(true);
    const psps = await getVerificationPsps(
      scheduleId,
      pspId,
      listOfSiknLabRsuIds,
      hasDates
    );
    const adjustedPsps = mapVerificationPsps(
      psps,
      inspectionYear,
      verificationScheduleLevel
    );
    initFormValues(adjustedPsps);
    setIsVerificationPspsLoading(false);
  };

  const initFormValues = (values: IPspViewModel[]) => {
    const setFieldValue = formikRef.current?.setFieldValue;
    if (setFieldValue) setFieldValue(FormFields.psps, values);
  };

  const handleSubmitForm = async (values: IFormValues) => {
    if (scheduleId && listOfSiknLabRsuIds && pspId) {
      setIsEditingVerificationSchedule(true);
      const data = await editVerificationSchedule(
        scheduleId,
        pspId,
        listOfSiknLabRsuIds,
        adjustParams(values[FormFields.psps], inspectionYear)
      );

      setIsEditingVerificationSchedule(false);

      if (data !== undefined) {
        if (data.length > 0) dispatch(setNotificationVerSched(data));
        dispatch(getVerificationScheduleCardInfoThunk(scheduleId));
        onCancel();
      }
    }
  };

  const editSchedule = () => {
    const submitForm = formikRef.current?.submitForm;
    if (submitForm) submitForm();
  };

  const disabledDate = (current: moment.Moment) => {
    const year = current.year();
    return year > inspectionYear || year < inspectionYear;
  };

  const handleChangeCheckingObject = (
    value: string[],
    pspIndex: number,
    arrayHelpers: FieldArrayRenderProps
  ) => {
    if (!value.length) {
      // из-за https://github.com/jannikbuschke/formik-antd/issues/193
      formikRef.current?.setFieldValue(
        `${FormFields.psps}.${pspIndex}.${FormFields.checkingObject}`,
        null
      );
    }

    const psps = formikRef.current?.values[FormFields.psps] || [];

    psps.forEach(
      (psp, index) =>
        index !== 0 &&
        arrayHelpers.replace(index, {
          ...psp,
          _siknLabRsuIds: value,
        })
    );
  };

  return (
    <Modal
      width={600}
      visible={isVisible}
      title="Редактировать"
      onCancel={onCancel}
      cancelText="Назад"
      maskClosable={false}
      destroyOnClose
      footer={
        <Can
          I={ActionsEnum.Edit}
          a={elementId(
            VerificationScheduleElements[
              VerificationScheduleElements.EditSchedule
            ]
          )}
        >
          <Button
            type="primary"
            onClick={editSchedule}
            loading={isEditingVerificationSchedule}
          >
            Сохранить
          </Button>
        </Can>
      }
    >
      <Spin
        spinning={
          isVerificationLevelsOstLoading ||
          isVerificationObjectsPpsLoading ||
          isVerificationPspsLoading ||
          isEditingVerificationSchedule
        }
      >
        <Formik
          initialValues={{ [FormFields.psps]: [] }}
          onSubmit={handleSubmitForm}
          innerRef={formikRef}
          validationSchema={getValidationSchema(verificationScheduleLevel)}
        >
          {(props) => {
            return (
              <Form
                className="verification-schedule-card-page-modal__form"
                layout="vertical"
              >
                <FieldArray
                  name={FormFields.psps}
                  render={(arrayHelpers) => {
                    const psps = props.values[FormFields.psps];
                    const firstPsp = _.head(psps);
                    const isMaxPsps = psps.length === MAX_PSPS;
                    const isOnePsp = psps.length === 1;

                    return (
                      <React.Fragment>
                        <div className="verification-schedule-card-page-modal__field-array">
                          {psps &&
                            psps.length > 0 &&
                            psps.map((psp, index) => {
                              const isLastPsp = index === psps.length - 1;

                              return (
                                <React.Fragment>
                                  <FormItem
                                    name={`${FormFields.psps}.${index}.${FormFields.checkingObject}`}
                                    label="Объекты проверки"
                                    hidden={index !== 0}
                                  >
                                    <Select
                                      mode="multiple"
                                      name={`${FormFields.psps}.${index}.${FormFields.checkingObject}`}
                                      options={mapVerificationObjectsPps(
                                        verificationObjectsPps
                                      )}
                                      onChange={(value) =>
                                        handleChangeCheckingObject(
                                          value,
                                          index,
                                          arrayHelpers
                                        )
                                      }
                                    />
                                  </FormItem>

                                  {isVerificationScheduleLevelEqualOst(
                                    verificationScheduleLevel
                                  ) && (
                                    <FormItem
                                      name={`${FormFields.psps}.${index}.${FormFields.verificationOstLevelsId}`}
                                      label="Уровень проверки"
                                    >
                                      <Select
                                        className="verification-schedule-card-page-modal__field"
                                        name={`${FormFields.psps}.${index}.${FormFields.verificationOstLevelsId}`}
                                        options={mapVerificationLevelsOst(
                                          verificationLevelsOst
                                        )}
                                      />
                                    </FormItem>
                                  )}

                                  {isVerificationScheduleLevelEqualOst(
                                    verificationScheduleLevel
                                  ) && (
                                    <FormItem
                                      name={`${FormFields.psps}.${index}.${FormFields.isMonth}`}
                                    >
                                      <Radio.Group
                                        name={`${FormFields.psps}.${index}.${FormFields.isMonth}`}
                                      >
                                        <Space size={175}>
                                          <Radio
                                            name={`${FormFields.psps}.${index}.${FormFields.isMonth}`}
                                            value={true}
                                          >
                                            Месяц проверки
                                          </Radio>
                                          <Radio
                                            name={`${FormFields.psps}.${index}.${FormFields.isMonth}`}
                                            value={false}
                                          >
                                            Дата проверки
                                          </Radio>
                                        </Space>
                                      </Radio.Group>
                                    </FormItem>
                                  )}

                                  <Space
                                    className="verification-schedule-card-page-modal__field-wrapper"
                                    align="end"
                                    size={30}
                                  >
                                    {psp[FormFields.isMonth] ? (
                                      <FormItem
                                        name={`${FormFields.psps}.${index}.${FormFields.month}`}
                                        label="Месяц"
                                      >
                                        <Select
                                          className="verification-schedule-card-page-modal__field"
                                          name={`${FormFields.psps}.${index}.${FormFields.month}`}
                                          options={ListOfMonths}
                                          validate={(monthNumber) =>
                                            monthValidator(
                                              monthNumber,
                                              psps,
                                              inspectionYear
                                            )
                                          }
                                        />
                                      </FormItem>
                                    ) : (
                                      <FormItem
                                        name={`${FormFields.psps}.${index}.${FormFields._dateRange}`}
                                        label="Дата проверки"
                                        validate={(dateRange) =>
                                          dateOfVerificationValidator(
                                            dateRange,
                                            psps,
                                            inspectionYear
                                          )
                                        }
                                      >
                                        <RangePicker
                                          className="verification-schedule-card-page-modal__field"
                                          dropdownClassName="verification-schedule-card-page-modal__range-picker-dropdown"
                                          name={`${FormFields.psps}.${index}.${FormFields._dateRange}`}
                                          disabledDate={disabledDate}
                                          allowClear={false}
                                          format="DD.MM.YYYY"
                                          locale={ruLocale}
                                          showTime
                                        />
                                      </FormItem>
                                    )}

                                    <React.Fragment>
                                      {isVerificationScheduleLevelEqualOst(
                                        verificationScheduleLevel
                                      ) && (
                                        <FormItem
                                          name={`${FormFields.psps}.${index}.${FormFields.isTnm}`}
                                        >
                                          <Checkbox
                                            name={`${FormFields.psps}.${index}.${FormFields.isTnm}`}
                                          >
                                            Участие ТНМ
                                          </Checkbox>
                                        </FormItem>
                                      )}
                                      <Tooltip
                                        title={
                                          isOnePsp
                                            ? "Удаление запрещено. Должен быть хотя бы 1 объект."
                                            : "Удалить элемент"
                                        }
                                      >
                                        <Popconfirm
                                          title="Вы уверены, что хотите удалить элемент?"
                                          okText="Удалить"
                                          cancelText="Отмена"
                                          onConfirm={() =>
                                            arrayHelpers.remove(index)
                                          }
                                          disabled={isOnePsp}
                                        >
                                          <Button
                                            className="verification-schedule-card-page-modal__delete-button"
                                            icon={<DeleteOutlined />}
                                            type="link"
                                            disabled={isOnePsp}
                                          />
                                        </Popconfirm>
                                      </Tooltip>
                                    </React.Fragment>
                                  </Space>
                                  {isDividerVisible(
                                    verificationScheduleLevel,
                                    isLastPsp
                                  ) && (
                                    <Divider className="verification-schedule-card-page-modal__divider" />
                                  )}
                                </React.Fragment>
                              );
                            })}
                        </div>
                        <Tooltip
                          title={
                            isMaxPsps
                              ? "Добавление запрещено. Максимальное число объектов(4)."
                              : "Добавить элемент"
                          }
                        >
                          <Button
                            className="verification-schedule-card-page-modal__add-button"
                            onClick={() =>
                              arrayHelpers.push(
                                getEmptyPsp(
                                  pspId,
                                  scheduleId,
                                  inspectionYear,
                                  firstPsp
                                )
                              )
                            }
                            icon={<PlusCircleFilled />}
                            disabled={isMaxPsps}
                            type="link"
                          >
                            Добавить
                          </Button>
                        </Tooltip>
                      </React.Fragment>
                    );
                  }}
                />
              </Form>
            );
          }}
        </Formik>
      </Spin>
    </Modal>
  );
};
