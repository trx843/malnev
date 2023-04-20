import React, { FC, useEffect, useMemo, useState } from "react";
import { Button, Col, Row } from "antd";
import Modal from "antd/lib/modal/Modal";
import { Formik, FormikHelpers } from "formik";
import { FormItem, Input, Form, Select, SubmitButton } from "formik-antd";
import * as Yup from "yup";
import { getMssEventSeverityLevels } from "../../../thunks/riskSettings";
import { EventSeverityLevel } from "../../../api/responses/get-mss-event-severity-levels-response";
import { useSelector } from "react-redux";
import { StateType } from "../../../types";
import { MssEventType } from "../../../classes";

interface EventRiskEditModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (data: MssEventType) => void;
}

const returnValidationSchema = (isMultiple: boolean) => {
  const defaultConfig = {
    riskRatio: Yup.string().required("Поле обязательно к заполнению!"),
  };
  if (!isMultiple) {
    return Yup.object({
      ...defaultConfig,
      mssEventSeverityLevelId: Yup.string().required(
        "Поле обязательно к заполнению!"
      ),
    });
  }
  return Yup.object(defaultConfig);
};

export const EventRiskEditModal: FC<EventRiskEditModalProps> = ({
  isOpen,
  onCancel,
  onSubmit,
}) => {
  const selectedEventTypes = useSelector<StateType, MssEventType[]>(
    (state) => state.riskSettings.selectedMssEventTypes
  );

  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    []
  );

  useEffect(() => {
    (async () => {
      const res = await getMssEventSeverityLevels();
      if (res && res.data) {
        const options = res.data.map((item) => ({
          label: item.shortName,
          value: item.id,
        }));
        setOptions(options);
      }
    })();
  }, []);

  const isMultiple: boolean = useMemo(
    () => selectedEventTypes.length > 1,
    [selectedEventTypes.length]
  );

  const handleSubmit = async (
    data: MssEventType,
    helpers: FormikHelpers<MssEventType>
  ) => {
    await onSubmit(data);
    helpers.setSubmitting(false);
  };

  const returnModalName = () =>
    isMultiple ? "Редактирование выбранных рисков" : "Редактирование риска";

  return (
    <Modal
      visible={isOpen}
      title={returnModalName()}
      footer={""}
      onCancel={onCancel}
      destroyOnClose
      maskClosable={false}
    >
      <Formik
        initialValues={isMultiple ? {} : selectedEventTypes[0]}
        onSubmit={(
          data: MssEventType,
          helpers: FormikHelpers<MssEventType>
        ) => {
          handleSubmit(data, helpers);
        }}
        validationSchema={returnValidationSchema(isMultiple)}
      >
        {() => (
          <Form layout="vertical">
            {!isMultiple && (
              <FormItem name="mssEventSeverityLevelId" label="Критичность">
                <Select
                  showSearch
                  optionFilterProp={"label"}
                  name="mssEventSeverityLevelId"
                  options={options}
                  placeholder={"Выберите критичность риска"}
                  allowClear
                />
              </FormItem>
            )}
            <FormItem name="riskRatio" label="Риск">
              <Input min={0} name="riskRatio" type="number" />
            </FormItem>
            <Row justify="end">
              <Col>
                <Button onClick={onCancel}>Отменить</Button>
              </Col>
              <Col offset={1}>
                <SubmitButton>Сохранить</SubmitButton>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
