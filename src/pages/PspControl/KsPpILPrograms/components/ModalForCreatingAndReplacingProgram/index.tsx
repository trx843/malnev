import React, { useState } from "react";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Spin, Button, Upload, Select, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import locale from "antd/es/date-picker/locale/ru_RU";
import {
  FormFields,
  ModalTypes,
  OwnThirdPartyOptions,
  ProgramTypeValues,
  TransportedProductOptions,
} from "./constants";
import {
  normFile,
  serializeValues,
  getFormValues,
  normalizeDate,
  shouldUpdateTransportedProduct,
  shouldUpdateOwnThirdParty,
  mapKspPspOptions,
} from "./utils";
import { IFormValues } from "./types";
import {
  createProgramKsPp,
  getKsPpILProgramsThunk,
  getProgramKsPp,
  replaceProgramKsPp,
  uploadAttachmentProgramKsPp,
} from "../../../../../thunks/pspControl/ksPpILPrograms";
import { Nullable, StateType } from "../../../../../types";
import { IProgramKsPpIlModelDto } from "../../../../../slices/pspControl/ksPpILPrograms/types";
import { IKsPpILProgramsStore } from "../../../../../slices/pspControl/ksPpILPrograms";
import { getProgramKsPspTypeOptionsRequest } from "api/requests/pspControl/ksppsp";
import styles from "./modalForCreatingAndReplacingProgram.module.css";

const cx = classNames.bind(styles);

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  modalType: ModalTypes;
  programId: Nullable<string>;
}

export const ModalForCreatingAndReplacingProgram: React.FC<IProps> = ({
  isVisible,
  onCancel,
  modalType,
  programId,
}) => {
  const [kspPspOptions, setKspPspOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const dispatch = useDispatch();

  const { listFilter } = useSelector<StateType, IKsPpILProgramsStore>(
    (state) => state.ksPpILPrograms
  );

  const [form] = Form.useForm<IFormValues>();

  const init = async () => {
    if (modalType === ModalTypes.replacement && programId) {
      setIsPerformingOperation(true);
      const program = await getProgramKsPp(programId);
      setIsPerformingOperation(false);

      if (program) {
        const isProgramTypeValueEqualControl =
          program.programKsppTypesId === ProgramTypeValues.Control;
        setIsCheckInstructionsFields(isProgramTypeValueEqualControl);
        form.setFieldsValue(getFormValues(program));
      }
    }
  };

  React.useEffect(() => {
    init();
  }, [modalType, programId]);

  const initKspPspOptions = async () => {
    setIsPerformingOperation(true);
    const options = await getProgramKsPspTypeOptionsRequest();
    setIsPerformingOperation(false);

    if (options) setKspPspOptions(mapKspPspOptions(options));
  };

  React.useEffect(() => {
    initKspPspOptions();
  }, []);

  const [isCheckInstructionsFields, setIsCheckInstructionsFields] =
    React.useState(false);

  const [isPerformingOperation, setIsPerformingOperation] =
    React.useState(false);

  const createOrReplaceProgramKsPp = async (
    id: Nullable<string>,
    values: IProgramKsPpIlModelDto
  ) => {
    if (modalType === ModalTypes.creation) {
      const res = await createProgramKsPp(values);
      return res;
    }

    if (id) {
      const res = await replaceProgramKsPp(id, values);
      return res;
    }
  };

  const handleSubmitForm = async (values: IFormValues) => {
    const { File, ...restValues } = serializeValues(values);

    setIsPerformingOperation(true);
    const id = await createOrReplaceProgramKsPp(programId, restValues);
    if (id) {
      await uploadAttachmentProgramKsPp(id, File[0].originFileObj);
    }
    setIsPerformingOperation(false);

    handleCancelModal();
    dispatch(getKsPpILProgramsThunk(listFilter));
  };

  const handleCancelModal = () => {
    onCancel();
    form.resetFields();
  };

  const handleChangeProgramType = (value: ProgramTypeValues) => {
    if (value === ProgramTypeValues.Control) {
      setIsCheckInstructionsFields(true);
      return;
    }

    setIsCheckInstructionsFields(false);
    form.setFieldsValue({
      [FormFields.TransportedProduct]: undefined,
      [FormFields.OwnThirdParty]: undefined,
    });
  };

  return (
    <Modal
      width="61.4%"
      visible={isVisible}
      title={<p className={cx("modal-title")}>Создать Программу КС ПСП и ИЛ</p>}
      onOk={form.submit}
      onCancel={handleCancelModal}
      cancelButtonProps={{
        style: { display: "none" },
      }}
      okText="Создать"
      okButtonProps={{
        loading: isPerformingOperation,
      }}
      maskClosable={false}
      destroyOnClose
      centered
    >
      <Spin spinning={isPerformingOperation}>
        <Form
          className={cx("form")}
          form={form}
          onFinish={handleSubmitForm}
          layout="vertical"
        >
          <Form.Item
            className={cx("form-item", "program-type-field")}
            name={FormFields.ProgramType}
            label="Тип программы"
            rules={[
              { required: true, message: "Поле обязательно к заполнению!" },
            ]}
          >
            <Select
              onChange={handleChangeProgramType}
              options={kspPspOptions}
              notFoundContent="Нет данных"
              placeholder="Не задано"
            />
          </Form.Item>
          <Form.Item noStyle shouldUpdate={shouldUpdateTransportedProduct}>
            {({ getFieldValue }) => {
              const programType = getFieldValue(FormFields.ProgramType);

              return (
                <Form.Item
                  className={cx("form-item")}
                  name={FormFields.TransportedProduct}
                  label="Транспортируемый продукт"
                  dependencies={[FormFields.ProgramType]}
                  rules={[
                    {
                      required: isCheckInstructionsFields || !programType,
                      message: "Поле обязательно к заполнению!",
                    },
                  ]}
                >
                  <Select
                    options={TransportedProductOptions}
                    placeholder="Не задано"
                    disabled={!isCheckInstructionsFields && programType}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
          <Form.Item noStyle shouldUpdate={shouldUpdateOwnThirdParty}>
            {({ getFieldValue }) => {
              const programType = getFieldValue(FormFields.ProgramType);

              return (
                <Form.Item
                  className={cx("form-item")}
                  name={FormFields.OwnThirdParty}
                  label="Собственный/сторонний"
                  dependencies={[FormFields.ProgramType]}
                  rules={[
                    {
                      required: isCheckInstructionsFields || !programType,
                      message: "Поле обязательно к заполнению!",
                    },
                  ]}
                >
                  <Select
                    options={OwnThirdPartyOptions}
                    placeholder="Не задано"
                    disabled={!isCheckInstructionsFields && programType}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>
          <Form.Item
            className={cx("form-item")}
            name={FormFields.DateOfIntroduction}
            label="Дата введения"
            rules={[
              { required: true, message: "Поле обязательно к заполнению!" },
            ]}
            normalize={normalizeDate}
          >
            <DatePicker
              format="DD.MM.YYYY"
              placeholder="ДД.ММ.ГГГГ"
              locale={locale}
            />
          </Form.Item>
          <Form.Item
            className={cx("form-item")}
            name={FormFields.DateOfApproval}
            label="Дата утверждения"
            rules={[
              { required: true, message: "Поле обязательно к заполнению!" },
            ]}
            normalize={normalizeDate}
          >
            <DatePicker
              format="DD.MM.YYYY"
              placeholder="ДД.ММ.ГГГГ"
              locale={locale}
            />
          </Form.Item>
          <Form.Item
            className={cx("form-item")}
            name={FormFields.File}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: "Поле обязательно к заполнению!" },
            ]}
          >
            <Upload
              showUploadList={{ showRemoveIcon: false }}
              beforeUpload={() => false}
            >
              <Button className={cx("upload-button")} icon={<UploadOutlined />}>
                Обзор
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
