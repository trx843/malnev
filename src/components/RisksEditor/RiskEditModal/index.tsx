import { Button, Col, Row } from "antd";
import Modal from "antd/lib/modal/Modal";
import { Formik, FormikHelpers } from "formik";
import { FormItem, Input, Form, Select, SubmitButton } from "formik-antd";
import React, { useEffect, useState } from "react";
import { RiskItem } from "../types";
import * as Yup from "yup";
import { PostConstantRiskParams } from "../../../api/params/post-constant-risk.params";
import { zeroGuid } from "../../../utils";
import { getMssEventSeverityLevels } from "../../../thunks/riskSettings";
import { EventSeverityLevel } from "../../../api/responses/get-mss-event-severity-levels-response";

interface RiskEditModal {
  risk?: RiskItem;
  isOpen: boolean;
  submitCallback: (data: PostConstantRiskParams, id?: number) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Поле обязательно к заполнению!"),
  severityLevelID: Yup.string().required("Поле обязательно к заполнению!"),
  ratio: Yup.string().required("Поле обязательно к заполнению!"),
});

export const RiskEditModal = ({
  risk,
  isOpen,
  submitCallback,
  onCancel,
}: RiskEditModal) => {
  const [options, setOptions] = useState<{ label: string; value: number }[]>(
    []
  );
  const [severityLevels, setSeverityLevels] = useState<EventSeverityLevel[]>(
    []
  );

  useEffect(() => {
    (async () => {
      const res = await getMssEventSeverityLevels();
      if (res && res.data) {
        setSeverityLevels(res.data);
        const options = res.data.map((item) => ({
          label: item.shortName,
          value: item.id,
        }));
        setOptions(options);
      }
    })();
  }, []);

  const onSubmit = async (item: any, helpers: FormikHelpers<any>) => {
    const data: PostConstantRiskParams = {
      id: zeroGuid,
      name: item.name,
      severityLevelID: item.severityLevelID,
      severityLevelStr:
        severityLevels.find((option) => option.id === item.severityLevelID)
          ?.afName || "",
      ratio: item.ratio,
    };

    await submitCallback(data);
    helpers.setSubmitting(false);
  };

  return (
    <Modal
      visible={isOpen}
      title={(risk ? "Обновление" : "Создание") + " постоянного риска"}
      footer={""}
      onCancel={onCancel}
      destroyOnClose
      maskClosable={false}
    >
      <Formik
        initialValues={risk || {}}
        onSubmit={(data: any, helpers: FormikHelpers<any>) => {
          onSubmit(data, helpers);
        }}
        validationSchema={validationSchema}
      >
        {() => (
          <Form layout="vertical">
            <FormItem name="name" label="Имя риска">
              <Input name="name" />
            </FormItem>
            <FormItem name="severityLevelID" label="Критичность">
              <Select
                showSearch
                optionFilterProp={"label"}
                name="severityLevelID"
                options={options}
                placeholder={"Выберите критичность риска"}
                allowClear
              />
            </FormItem>
            <FormItem name="ratio" label="Риск">
              <Input min={0} name="ratio" type="number" />
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
