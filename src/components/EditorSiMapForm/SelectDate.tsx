import { Col, Row } from "antd";
import React, { FC, useEffect, useState } from "react";
import {
  DarkBoldStyled,
  TextDarkStyled as DarkStyled,
  TextGrayStyled as GrayStyled,
  WarningStyled,
} from "../../styles/commonStyledComponents";
import { FormItem, DatePicker } from "formik-antd";
import locale from "antd/lib/date-picker/locale/ru_RU";
import { useSelector } from "react-redux";
import { SiequipmentsStateType } from "../../slices/siequipment";
import { StateType } from "../../types";
import { Moment } from "moment";
import moment from "moment";
import { EditorSiMapItem } from "classes";

interface SelectDateProps {
  isEditForm: boolean;
  values: EditorSiMapItem;
}

export const SelectDate: FC<SelectDateProps> = ({ isEditForm, values }) => {
  const { techPosition, oldSi, newSi, lastBinding } = useSelector<
    StateType,
    SiequipmentsStateType
  >((state) => state.siequipment);

  const [isWarn, setIsWarn] = useState(false);

  const disabledDate = (current: Moment) => {
    if (techPosition.siTypeId === 27 || techPosition.siTypeId === 23)
      return false;
    let lastDate = lastBinding
      ? current <= moment(lastBinding.effectiveFrom)
      : false;
    let effFor = values.effectiveFor
      ? current >= moment(values.effectiveFor)
      : false;

    return lastDate || effFor;
  };

  const disabledDateFor = (current: Moment) => {
    return values.effectiveFrom
      ? current && current <= moment(values.effectiveFrom)
      : false;
  };

  useEffect(() => {
    if (lastBinding && !isEditForm) {
      const diff: number =
        (new Date().getTime() - lastBinding.changeDate.getTime()) /
        1000 /
        60 /
        60;
      setIsWarn(diff < 24);
    }
  }, []);

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <GrayStyled>Технологическая позиция</GrayStyled>
          <DarkStyled>{techPosition.shortName}</DarkStyled>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        {/* Отображаеть, если это не прочее оборудование */}
        {techPosition.siTypeId !== 27 && techPosition.siTypeId !== 23 && (
          <Col span={24}>
            <Row>
              <Col>
                <DarkBoldStyled>Сейчас установлено:</DarkBoldStyled>
              </Col>
            </Row>
            {oldSi ? (
              <Row>
                <Col span={8}>
                  <GrayStyled>Тип СИ</GrayStyled>
                  <DarkStyled>{oldSi.siTypeName}</DarkStyled>
                </Col>
                <Col span={8}>
                  <GrayStyled>Модель СИ</GrayStyled>
                  <DarkStyled>{oldSi.siModelName}</DarkStyled>
                </Col>
                <Col span={8}>
                  <GrayStyled>Заводской номер</GrayStyled>
                  <DarkStyled>{oldSi.manufNumber}</DarkStyled>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col>
                  <GrayStyled>СИ</GrayStyled>
                  <DarkStyled>Не установлено</DarkStyled>
                </Col>
              </Row>
            )}
          </Col>
        )}
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row>
            <Col>
              <DarkBoldStyled>Будет установлено:</DarkBoldStyled>
            </Col>
          </Row>
          {newSi ? (
            <Row>
              <Col span={8}>
                <GrayStyled>Тип СИ</GrayStyled>
                <DarkStyled>{newSi.siTypeName}</DarkStyled>
              </Col>
              <Col span={8}>
                <GrayStyled>Модель СИ</GrayStyled>
                <DarkStyled>{newSi.siModelName}</DarkStyled>
              </Col>
              <Col span={8}>
                <GrayStyled>Заводской номер</GrayStyled>
                <DarkStyled>{newSi.manufNumber}</DarkStyled>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col>
                <GrayStyled>СИ</GrayStyled>
                <DarkStyled>Не установлено</DarkStyled>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
      <Row gutter={[32, 32]}>
        <Col>
          <FormItem required name="effectiveFrom" label={"Действует с"}>
            <DatePicker
              locale={locale}
              allowClear={false}
              name={"effectiveFrom"}
              format="DD.MM.YYYY HH:mm"
              showTime
              disabledDate={disabledDate}
            />
          </FormItem>
        </Col>

        {techPosition.siTypeId === 27 ||
        (techPosition.siTypeId === 23 && isEditForm) ? (
          <Col>
            <FormItem required name="effectiveFor" label={"Действует по"}>
              <DatePicker
                locale={locale}
                allowClear={false}
                name={"effectiveFor"}
                format="DD.MM.YYYY HH:mm"
                showTime
                disabledDate={disabledDateFor}
              />
            </FormItem>
          </Col>
        ) : null}
      </Row>

      <WarningStyled hidden={!isWarn}>
        <Row gutter={24} style={{ paddingLeft: 12 }}>
          Последняя замена производилась менее суток назад. Подтверждаете
          действие?
        </Row>
      </WarningStyled>
    </>
  );
};
