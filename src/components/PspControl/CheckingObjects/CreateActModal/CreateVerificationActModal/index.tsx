import React, { FC, useState } from "react";
import axios from "axios";
import { Button, Form, message, Modal, notification } from "antd";
import * as Yup from "yup";
import { Moment } from "moment/moment";
import moment from "moment";

import { InfoGeneral, Schedules } from "../components";
import { CreateActModalFooter } from "../components/CreateActModalFooter";
import { apiBase, openNotification } from "../../../../../utils";
import { ActImportType, IdType } from "types";
import { ApiRoutes } from "api/api-routes.enum";
import { VerificationScheduleItem } from "pages/PspControl/VerificationSchedulePage/classes";
import {
  getInspectionTypeRequest,
  getScheduleByIdRequest
} from "../../../../../api/requests/verificationActs";
import { useAntdFormik } from "../../../../../customHooks/useAntdFormik";
import { OwnStatuses } from "slices/pspControl/verificationSchedule/constants";
import { DictionariesNames, InitDictionaries } from "./constants";
import { IDictionaries, ISchedule } from "./types";
import { getVerificationLevels } from "thunks/pspControl/checkingObjects";
import { downloadTemplate } from "api/requests/pspControl/CheckingObjects";
import { ActImportStatuses } from "enums";
import { useHistory } from "react-router";

interface CreateActModalProps {
  visible: boolean;
  onClose: () => void;
  pspId: IdType;
  ownType: OwnStatuses;
  onCreateScheduled: (values: ActSchedule) => void;
  onCreateUnScheduled: (values: ActUnSchedule) => void;
}

enum StepCreateAct {
  Schedule = "schedule",
  General = "general"
}

export interface ActSchedule {
  verificationPlace: string;
  inspectedTypeId: string | null;
  preparedOn: Moment;
  scheduleId: IdType;
  verificatedOn: Moment;
}

export interface ActUnSchedule {
  verificationPlace: string;
  inspectedTypeId: string | null;
  preparedOn: Moment;
  verificationLevelId: string;
  checkTypeId: string;
  verificatedOn: Moment;
}

enum ActType {
  ExistSchedule = "existSchedule",
  NotExist = "notExist"
}

export interface ActParams {
  actType: ActType;
  preparedOn: Moment | null;
  inspectedTypeId: string;
  verificatedOn: Moment;
  verificationPlace: string;
  ostRnuPsp_VerificationSchedulesId: string;
  checkTypeId: string;
  verificationLevelId: string;
  isVisibilityInspection: boolean;
}

type Options = { id: string; label: string }[];

const validationSchema = Yup.object({
  actType: Yup.string()
    .oneOf(["notExist", "existSchedule"])
    .required("Поле обязательно к заполнению!"),
  ostRnuPsp_VerificationSchedulesId: Yup.string().when("actType", {
    is: actType => actType === ActType.ExistSchedule,
    then: Yup.string().required("Поле обязательно к заполнению!")
  }),
  checkTypeId: Yup.string().when("actType", {
    is: actType => actType === ActType.NotExist,
    then: Yup.string().required("Поле обязательно к заполнению!")
  }),
  verificationLevelId: Yup.string().when("actType", {
    is: actType => actType === ActType.NotExist,
    then: Yup.string().required("Поле обязательно к заполнению!")
  }),
  preparedOn: Yup.date().required("Поле обязательно к заполнению!").nullable(),
  isVisibilityInspection: Yup.bool(),
  inspectedTypeId: Yup.string().when("isVisibilityInspection", {
    is: isVisibilityInspection => isVisibilityInspection,
    then: Yup.string().required("Поле обязательно к заполнению!")
  }),
  verificatedOn: Yup.date().required("Поле обязательно к заполнению!"),
  verificationPlace: Yup.string().required("Поле обязательно к заполнению!")
});

export const CreateVerificationActModal: FC<CreateActModalProps> = ({
  visible,
  onClose,
  pspId,
  ownType,
  onCreateScheduled,
  onCreateUnScheduled
}) => {
  const history = useHistory()
  const [schedule, setSchedule] = useState<VerificationScheduleItem | null>(
    null
  );
  const formik = useAntdFormik({
    initialValues: {
      actType: ActType.ExistSchedule,
      ostRnuPsp_VerificationSchedulesId: "",
      verificationPlace: "",
      preparedOn: null,
      inspectedTypeId: "",
      verificatedOn: moment(),
      isVisibilityInspection: false,
      verificationLevelId: "",
      checkTypeId: ""
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: async values => {
      if (values.actType === ActType.ExistSchedule && schedule && values.preparedOn) {
        await onCreateScheduled({
          verificationPlace: values.verificationPlace,
          inspectedTypeId: values.isVisibilityInspection
            ? values.inspectedTypeId
            : null,
          preparedOn: values.preparedOn, // дата подготовки
          scheduleId: schedule.id,
          verificatedOn: values.verificatedOn // дата проведения
        });
        formik.setSubmitting(false);
      }

      if (values.actType === ActType.NotExist && values.preparedOn) {
        const payload = {
          preparedOn: values.preparedOn,
          verificatedOn: values.verificatedOn,
          verificationPlace: values.verificationPlace,
          inspectedTypeId: values.isVisibilityInspection
            ? values.inspectedTypeId
            : null,
          verificationLevelId: values.verificationLevelId,
          checkTypeId: values.checkTypeId
        };

        await onCreateUnScheduled(payload);
        formik.setSubmitting(false);
      }
    }
  });
  const [verificationOptions, setVerificationOptions] = useState<Options>([]);
  const [form] = Form.useForm<ActParams>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dictionaries, setDictionaries] = React.useState<IDictionaries>(InitDictionaries);
  const [isImportLoading, setIsImportLoading] = useState<boolean>(false);
  const [isDownloadLoading, setIsDownloadingLoading] = useState<boolean>(false);

  const STEPS: StepCreateAct[] = [
    StepCreateAct.Schedule,
    StepCreateAct.General
  ];

  const handleGetVerificationOptions = async () => {
    const data = await getInspectionTypeRequest();
    setVerificationOptions(data);
  };

  const handleGetSchedule = async () => {
    try {
      if (!formik.values.ostRnuPsp_VerificationSchedulesId) {
        return;
      }
      const data = await getScheduleByIdRequest(
        formik.values.ostRnuPsp_VerificationSchedulesId
      );
      setSchedule(data);
      formik.setFieldValue(
        "isVisibilityInspection",
        data.isVisibilityInspection
      );
    } catch (e) {
      console.log(e.message);
    }
  };

  React.useEffect(() => {
    if (pspId && visible) {
      fetchVerificationSchedules(pspId);
    }

    if (visible) {
      fetchVerificationLevels();
    }
  }, [pspId, visible]);

 

  const fetchVerificationSchedules = async (pspId: IdType) => {
    const response = await axios.get<ISchedule[]>(
      `${apiBase}${ApiRoutes.GetPsp}/${pspId}/schedules`
    );

    setDictionaries(prevState => {
      return {
        ...prevState,
        [DictionariesNames.verificationSchedules]: response.data
      };
    });
  };

  const fetchVerificationLevels = async () => {
    const levels = await getVerificationLevels();
    setDictionaries(prevState => {
      return {
        ...prevState,
        [DictionariesNames.verificationLevels]: levels
      };
    });
  };

  const handleNextStep = async () => {
    try {
      if (formik.values.actType === ActType.ExistSchedule) {
        await formik.validateField("ostRnuPsp_VerificationSchedulesId");
        if (formik.values.ostRnuPsp_VerificationSchedulesId) {
          if (!schedule) {
            await handleGetSchedule();
          }
          if (currentIndex !== STEPS.length - 1) {
            setCurrentIndex(prev => prev + 1);
          }
        }
      } else {
        await Promise.all<Promise<string | undefined> | Promise<void>>([
          formik.validateField("verificationLevelId"),
          formik.validateField("checkTypeId")
        ]);

        if (formik.values.verificationLevelId && formik.values.checkTypeId) {
          if (currentIndex !== STEPS.length - 1) {
            setCurrentIndex(prev => prev + 1);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlePrevStep = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleOnClose = () => {
    formik.resetForm();
    setSchedule(null);
    setVerificationOptions([]);
    setCurrentIndex(0);
    onClose?.();
  };

  const handleDownloadTemplate = () => {
    if (formik.values.actType === ActType.ExistSchedule) {
      downloadTemplate(
        setIsDownloadingLoading,
        pspId,
        formik.values.ostRnuPsp_VerificationSchedulesId,
        null,
        null,
        true,
      )
    } else {
      downloadTemplate(
        setIsDownloadingLoading,
        pspId,
        null,
        formik.values.verificationLevelId,
        formik.values.checkTypeId,
        true
      )
    }
  }

  const handlePreparedOnDate = async (verificatedOnDate: Moment) => {
    const response = await axios.get(
      `${apiBase}/pspcontrol/act/plannedDate?date=${verificatedOnDate.format("YYYY-MM-DD")}`
    );
    if (response.data)
      formik.setFieldValue("preparedOn", moment(response.data));
    else
    {
      formik.setFieldValue("preparedOn", verificatedOnDate);
      openNotification("Уведомление", "В МКО ТКО не заполнен производственный календарь. Обратитесь к администратору либо проставьте Дату подготовки плана самостоятельно");
    }
  };



  const renderBody = () => {
    switch (STEPS[currentIndex]) {
      case StepCreateAct.Schedule: {
        return (
          <Schedules
            ownType={ownType}
            onSelectCheckType={(isVisible: boolean) =>
              formik.setFieldValue("isVisibilityInspection", isVisible)
            }
            values={formik.values}
            verificationLevels={dictionaries.verificationLevels}
            verificationSchedules={dictionaries.verificationSchedules}
          />
        );
      }
      case StepCreateAct.General: {
        return (
          <InfoGeneral
            verificationOptions={verificationOptions}
            getVerificationOptions={handleGetVerificationOptions}
            isVisibleInspectType={formik.values.isVisibilityInspection}
            onSelectVerification={id =>
              formik.setFieldValue("verificationSchedulesId", id)
            }
            onVerificatedOnChange={handlePreparedOnDate}
          />
        );
      }
      default: {
        return (
          <Schedules
            ownType={ownType}
            values={formik.values}
            onSelectCheckType={(isVisible: boolean) =>
              formik.setFieldValue("isVisibilityInspection", isVisible)
            }
            verificationLevels={dictionaries.verificationLevels}
            verificationSchedules={dictionaries.verificationSchedules}
          />
        );
      }
    }
  };

  const customRequest = async options => {
    const { onSuccess, onError, file, onProgress } = options;
    let isValidType = false;
    let isValidSize = true;

    if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      || file.type === "application/vnd.ms-excel"
      || file.type === "application/vnd.ms-excel.sheet.macroEnabled.12") {
      isValidType = true;
    } else {
      notification.warn({
        message: 'Разрешение файла недопустимо',
        description: 'Для загрузки допускаются файлы только в расширениях .xls, .xlsx и .xlsm!',
        duration: 0,
      });
    };

    if (file.size > 20971520) {
      isValidSize = false;
      notification.warn({
        message: 'Файл слишком тяжелый',
        description: 'Максимально допустимый размер файла 20мб!',
        duration: 0,
      });
    };

    if (isValidSize && isValidType) {
      const fmData = new FormData();
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      const key = `open${Date.now()}`;

      setIsImportLoading(true);

      fmData.append("file", file);
      try {
        const res = await axios.post<ActImportType>(
          `${apiBase}/pspcontrol/checkingobjects/actImport`,
          fmData,
          config
        );
        if (res.data.status === ActImportStatuses.success) {
          notification.success({
            message: "Файл загружен успешно.",
            description: "",
            duration: 0,
            placement: "topRight",
            btn: (
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  notification.close(key)
                  history.push(`/pspcontrol/verification-acts/${res.data.verificationActId}`)
                }}
              >
                Перейти на страницу акта
              </Button>
            ),
            key,
          });
          handleOnClose();
        }
        if (res.data.status === ActImportStatuses.warn) {
          notification.warn({
            message: "Импорт завершен с предупреждением.",
            description: res.data.lastMessage,
            duration: 0,
            placement: "topRight",
            btn: (
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  notification.close(key)
                  history.push(`/pspcontrol/verification-acts/${res.data.verificationActId}`)
                }}
              >
                Перейти на страницу акта
              </Button>
            ),
            key,
          });
        }
        if (res.data.status === ActImportStatuses.error) {
          notification.error({
            message: "Импорт не выполнен.",
            description: res.data.lastMessage,
            duration: 0,
            placement: "topRight",
          });
        }
        setIsImportLoading(false)
        onSuccess("Ok");
      } catch (err) {
        setIsImportLoading(false);
        notification.error({
          message: "Ошибка процесса импорта!",
          description: err,
          duration: 0,
          placement: "topRight",
        });
        onError({ err });
      }
    };
  };

  return (
    <Modal
      title="Создание акта проверки"
      destroyOnClose
      maskClosable={false}
      visible={visible}
      onCancel={handleOnClose}
      footer={
        <CreateActModalFooter
          isFinish={currentIndex === STEPS.length - 1}
          onNext={handleNextStep}
          onBack={handlePrevStep}
          loading={formik.isSubmitting}
          onCreate={formik.submitForm}
          onDownloadTemplate={handleDownloadTemplate}
          customRequest={customRequest}
          isImportLoading={isImportLoading}
          isDownloadLoading={isDownloadLoading}
          values={formik.values}

        />
      }
    >
      <Form
        form={form}
        fields={formik.fields}
        layout="vertical"
        onFieldsChange={fieldsValue => {
          formik.onFieldChange(fieldsValue[0])
        }}
        onFinishFailed={formik.setErrorsAntd}
        initialValues={{
          actType: "existSchedule"
        }}
      >
        {renderBody()}
      </Form>
    </Modal>
  );
};
