import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tooltip,
} from "antd";
import isEmpty from "lodash/isEmpty";
import { animateScroll as scroll } from "react-scroll";
import { DeleteOutlined, PlusCircleFilled } from "@ant-design/icons";
import _ from "lodash";

import { DividerForm } from "../../../DividerForm";
import { useVerificationActOptions } from "../../../../hooks/useVerificationActOptions";
import { useMutationObserver } from "components/VerificationActs/VerificationAct/components/modals/ViolationsModal/NewViolation/useMutationObserver";
import { useSelector } from "react-redux";
import { StateType } from "types";
import { VerificationActStore } from "slices/verificationActs/verificationAct/types";
import {
  getAreaOfResponsibilityByIdRequest,
  getCheckingObjectViolationsItemsByActIdRequest,
  getClassiffRequest,
  getSourceRemark,
} from "api/requests/verificationActs";
import { OsuTypes } from "enums";
import { getSiknLabRsuValidator } from "./helpers";

interface NewViolationsFormProps {
  siknLabRsu: string[];
  resetClassif: () => void;
  onAddViolation: () => void;
  onOpenTypicalViolations?: () => void;
  visibleTypicalButton?: boolean;
  disabledFields?: {
    isDuplicate?: boolean;
    violations?: boolean;
    areaOfResponsibility?: boolean;
    siknLabRsu?: boolean;
    typicalViolationNumber?: boolean;
    identifiedTypicalViolationId?: boolean;
    sourceRemarkId?: boolean;
    specialOpinion?: boolean;
    selectButton?: boolean;
    resetButton?: boolean;
  };
  resetNumberOfTypicalViolation: () => void;
}

export const NewViolationsForm: FC<NewViolationsFormProps> = ({
  siknLabRsu,
  resetClassif,
  onAddViolation,
  disabledFields,
  onOpenTypicalViolations,
  visibleTypicalButton = false,
  resetNumberOfTypicalViolation,
}) => {
  const refScroll = useRef<HTMLDivElement | null>(null);
  const [focused, setFocused] = useState(true);
  const scrollList = useRef<{
    beforeScrollHeight: number;
    beforeScrollTop: number;
    scrollTop: number;
  }>({
    beforeScrollHeight: 1000,
    beforeScrollTop: 1000,
    scrollTop: 1000,
  });
  const [refMut] = useMutationObserver(
    () => {
      if (focused) {
        scroll.scrollToBottom({
          containerId: "scroll-messages",
          duration: 100,
        });
      }
    },
    {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true,
    }
  );

  const state = useSelector<StateType, VerificationActStore>(
    (state) => state.verificationAct
  );
  const actId = state.act?.id;

  const [areas, setAreas] = useState<any[]>([]);
  const [checkingObjectViolationsOptions, setCheckingObjectViolationsOptions] =
    useState<any[]>([]);
  const [typicalViolationNumbers, setTypicalViolationNumbers] = useState<any[]>(
    []
  );
  const [sourceRemarkOptions, setSourceRemarkOptions] = useState<any[]>([]);

  React.useEffect(() => {
    if (actId) init(actId);
  }, [actId]);

  React.useEffect(() => {
    if (siknLabRsu) fetchClassificationNumberOptions(siknLabRsu);
  }, [siknLabRsu]);

  React.useEffect(() => {
    fetchSourceRemarkOptions();
  }, []);

  const init = async (actId: string) => {
    fetchAreasOptions(actId);
    fetchCheckingViolationsOptions(actId);
  };

  const fetchAreasOptions = async (actId: string) => {
    const options = await getAreaOfResponsibilityByIdRequest(actId);
    const adjustedOptions = options.map((item) => ({
      value: item,
      label: item,
    }));
    setAreas(adjustedOptions);
  };

  const fetchCheckingViolationsOptions = async (actId: string) => {
    const options = await getCheckingObjectViolationsItemsByActIdRequest(actId);
    const adjustedOptions = options.map((osu) => ({
      label: osu.osuShortName,
      value: osu.id,
      data: osu,
    }));
    setCheckingObjectViolationsOptions(adjustedOptions);
  };

  const fetchClassificationNumberOptions = async (siknLabRsu: string[]) => {
    const selectedOptions = _.intersectionWith(
      checkingObjectViolationsOptions,
      siknLabRsu,
      (arrValue, othArrValue) => arrValue.value === othArrValue
    );
    const isAllIlObjects = selectedOptions.every(
      (so) => so.data.osuTypeId === OsuTypes.il
    );

    if (isAllIlObjects) {
      const options = await getClassiffRequest(OsuTypes.il);
      setTypicalViolationNumbers(options);
      return;
    }

    const options = await getClassiffRequest(OsuTypes.osu);
    setTypicalViolationNumbers(options);
  };

  const fetchSourceRemarkOptions = async () => {
    const options = await getSourceRemark();
    const adjustedOptions = options.map((item) => ({
      value: item.id,
      label: item.label,
    }));
    setSourceRemarkOptions(adjustedOptions);
  };

  const renderOptionGroups = () =>
    typicalViolationNumbers.map((item) => (
      <Select.OptGroup label={item.group} key={item.group}>
        {item.options.map((opt) => (
          <Select.Option key={opt.id} value={opt.id}>
            {`${opt.serial} ${opt.name}`}
          </Select.Option>
        ))}
      </Select.OptGroup>
    ));

  const onScroll = () => {
    const element = refScroll.current as any;
    const scrollTop = element.scrollTop;

    if (element.scrollHeight - element.clientHeight <= scrollTop + 20) {
      setFocused(true);
    } else {
      setFocused(false);
    }

    scrollList.current.scrollTop = element.scrollTop;
    scrollList.current.beforeScrollHeight = element.scrollHeight;
    scrollList.current.beforeScrollTop = element.scrollTop;
  };

  const handleChangeSiknLabRsu = (value) => {
    resetClassif();
    fetchClassificationNumberOptions(value);
  };

  return (
    <>
      <DividerForm title="Нарушение" />
      <div
        id="scroll-messages"
        ref={refScroll}
        onScroll={onScroll}
      >
        <div ref={refMut}>
          <Form.List name="violations">
            {(fields, { add, remove }) => {
              return <>
                {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    direction="vertical"
                  >
                    {index !== 0 && <Divider />}
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, "violationText"]}
                          fieldKey={[fieldKey, "violationText"]}
                          rules={[
                            {
                              required: true,
                              message: "Поле обязательно к заполнению!",
                            },
                          ]}
                          label="Выявленные нарушения"
                        >
                          <Input.TextArea
                            disabled={disabledFields?.violations}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, "pointNormativeDocuments"]}
                          fieldKey={[fieldKey, "pointNormativeDocuments"]}
                          rules={[
                            {
                              required: true,
                              message: "Поле обязательно к заполнению!",
                            },
                          ]}
                          label="Пункт НД и/или ОРД"
                        >
                          <Input disabled={disabledFields?.violations} />
                        </Form.Item>
                      </Col>
                      {fields.length > 1 && (
                        <div className="violations-act-form__delete">
                          <Button
                            onClick={() => remove(name)}
                            disabled={disabledFields?.violations}
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                          />
                        </div>
                      )}
                    </Row>
                  </Space>
                ))}
                <div className="violation-form__bottom">
                  <Row>
                    <Col>
                      <Button
                        type="link"
                        disabled={disabledFields?.violations}
                        onClick={() => add({
                          pointNormativeDocuments: "",
                          violationText: ""
                        })}
                        block
                        icon={<PlusCircleFilled />}
                      >
                        Добавить
                      </Button>
                    </Col>
                  </Row>
                </div>
              </>
            }}
          </Form.List>
        </div>
      </div>
      <DividerForm title="Атрибуты" />
      <Row gutter={[16, 1]}>
        <Col span={6}>
          <Form.Item
            name="areaOfResponsibility"
            label="Зона ответственности"
            rules={[
              { required: true, message: "Поле обязательно к заполнению!" },
            ]}
          >
            <Select
              options={areas}
              disabled={disabledFields?.areaOfResponsibility}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="siknLabRsu"
            label="Система учета/ИЛ"
            rules={[
              { required: true, message: "Поле обязательно к заполнению!" },
              getSiknLabRsuValidator(checkingObjectViolationsOptions),
            ]}
          >
            <Select
              onChange={handleChangeSiknLabRsu}
              options={checkingObjectViolationsOptions}
              mode="multiple"
              maxTagCount={"responsive"}
              disabled={disabledFields?.siknLabRsu}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="typicalViolationNumber"
            label="Номер типового нарушения"
          >
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={6} hidden>
          <Form.Item name="identifiedTypicalViolationId">
            <Input disabled />
          </Form.Item>
        </Col>
        <React.Fragment>
          <Col span={3} style={{ marginTop: 28 }}>
            <Button
              onClick={onOpenTypicalViolations}
              disabled={disabledFields?.selectButton}
            >Выбрать</Button>
          </Col>
          <Col span={3} style={{ marginTop: 28 }}>
            <Tooltip title="Очистить нарушения">
              <Button
                onClick={resetNumberOfTypicalViolation}
                disabled={disabledFields?.resetButton}
              >Очистить</Button>
            </Tooltip>
          </Col>
        </React.Fragment>
      </Row>
      <Row gutter={[16, 1]}>
        <Col span={12}>
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const siknLabRsuValue = getFieldValue("siknLabRsu");
              return (
                <Form.Item
                  name="classifficationTypeId"
                  label="Номер и наименование классификации"
                >
                  <Select
                    disabled={isEmpty(siknLabRsu) && isEmpty(siknLabRsuValue)}
                  >
                    {renderOptionGroups()}
                  </Select>
                </Form.Item>
              );
            }}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="sourceRemarkId"
            label="Источник замечания"
            rules={[
              { required: true, message: "Поле обязательно к заполнению!" },
            ]}
          >
            <Select
              options={sourceRemarkOptions}
              disabled={disabledFields?.sourceRemarkId}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="isDuplicate"
            valuePropName="checked"
            initialValue={false}
            label="Повторяющееся нарушение"
          >
            <Checkbox disabled={disabledFields?.isDuplicate} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item name="specialOpinion" label="Особое мнение">
            <Input.TextArea disabled={disabledFields?.specialOpinion} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};
