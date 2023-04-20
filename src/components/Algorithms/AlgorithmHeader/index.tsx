import FileSearchOutlined from "@ant-design/icons/FileSearchOutlined";
import {
  Button,
  Card,
  Col,
  Divider,
  Row,
  DatePicker,
  Select,
  Form,
  Input,
  Typography,
} from "antd";
import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlgorithmModalsIds,
  AlgorithmsSlice,
  setFilterParams,
  setOpenedModalId,
} from "../../../slices/algorithmStatus/algorithms";
import {
  getAlgorithmConfigurationThunk,
  getConfigurationThunk,
  getOperandThunk,
} from "../../../thunks/algorithmStatus/algorithms";
import { StateType } from "../../../types";
import locale from "antd/es/date-picker/locale/ru_RU";

import "./styles.css";
import moment, { Moment } from "moment";
import { TextGrayStyled } from "../../../styles/commonStyledComponents";
import { TreeStatusColors } from "../../../enums";
import { ActionsEnum, Can } from "../../../casl";
import {
  AlgorithmStatusElements,
  elementId,
} from "../../../pages/AlgorithmStatus/constant";
import { GeneralAlgorithmStatusColors } from "../enums";

const { RangePicker } = DatePicker;

const { Title } = Typography;

const { Item } = Form;

const algStatuses: {
  [key: number]: "Good" | "Warning" | "Danger" | "Disabled";
} = {
  2: "Good",
  5: "Warning",
  3: "Danger",
  4: "Disabled",
};

const generalAlgStatuses: { [key: number]: "Good" | "Warning" | "Bad" } = {
  0: "Good",
  1: "Warning",
  2: "Bad",
};

const b = (name: string): string => `algorithm-header__${name}`;

interface IProps {}

interface AIIProps {
  title: string;
  value?: string | number;
  color?: string;
}

enum DateFormats {
  Picker = "YYYY-MM-DD",
  RunTime = "yyyy-MM-DD HH:mm:ss.SSS",
  LocalDate = "YYYY-MM-DDTHH:mm:ss",
}

const AlgorithmInfoItem: FC<AIIProps> = ({ title, value, color }) => (
  <div className={b("header-item")}>
    <div className={b("header-item__title")}>{title}</div>
    <div style={{ color }} className={b("header-item__value")}>
      {value}
    </div>
  </div>
);

export const AlgorithmHeader: FC<IProps> = ({}) => {
  const algorithmsState = useSelector<StateType, AlgorithmsSlice>(
    (state) => state.algorithms
  );

  const { filterParams, treeData, algorithmHistory, selectedAlgorithmId } =
    algorithmsState;

  const dispatch = useDispatch();

  const onAlgorithmConfigurationClick = () => {
    dispatch(setOpenedModalId(AlgorithmModalsIds.AlgConfiguration));
    dispatch(getAlgorithmConfigurationThunk());
  };

  const onConfigurationClick = () => {
    dispatch(setOpenedModalId(AlgorithmModalsIds.AlgConfiguration));
    dispatch(getConfigurationThunk());
  };

  const onOperandClick = () => {
    dispatch(getOperandThunk());
    dispatch(setOpenedModalId(AlgorithmModalsIds.AlgOperands));
  };

  const onDateChange = (dates: [Moment, Moment]) => {
    if (dates === null) {
      return dispatch(
        setFilterParams({
          ...filterParams.filter,
          startTime: null,
          endTime: null,
        })
      );
    }
    if (dates != undefined && dates[0] && dates[1]) {
      dispatch(
        setFilterParams({
          ...filterParams.filter,
          startTime: dates[0].format(DateFormats.Picker),
          endTime: dates[1].endOf("day").format(DateFormats.LocalDate),
        })
      );
    }
    return undefined;
  };

  const onStatusChange = (value: string | number) => {
    if (typeof value === "string") {
      return dispatch(
        setFilterParams({
          ...filterParams.filter,
          status: null,
        })
      );
    }
    return dispatch(
      setFilterParams({
        ...filterParams.filter,
        status: value,
      })
    );
  };

  const onReCalcChange = (value: string | number) => {
    if (typeof value === "string") {
      return dispatch(
        setFilterParams({
          ...filterParams.filter,
          recalc: null,
        })
      );
    }
    return dispatch(
      setFilterParams({
        ...filterParams.filter,
        recalc: !!value,
      })
    );
  };

  return (
    <Card style={{ margin: "-10px 0" }}>
      <Row justify="space-between">
        <Col>
          <AlgorithmInfoItem title="Всего" value={treeData?.allAlgsCount} />
        </Col>
        <Col>
          <AlgorithmInfoItem
            title="В работе"
            value={treeData?.enabledAlgsCount}
          />
        </Col>
        <Col>
          <AlgorithmInfoItem title="ОК" value={treeData?.goodAlgsCount} />
        </Col>
        <Col>
          <AlgorithmInfoItem
            title="Проблем"
            value={treeData?.errorAlgsCount}
            color={TreeStatusColors.Danger}
          />
        </Col>
        <Col>
          <AlgorithmInfoItem
            title="Предупр"
            value={treeData?.warnAlgsCount}
            color={TreeStatusColors.Warning}
          />
        </Col>
        <Col>
          <AlgorithmInfoItem
            title="Выкл."
            value={treeData?.notEnabledAlgsCount}
            color={TreeStatusColors.Disabled}
          />
        </Col>
        <Col>
          <AlgorithmInfoItem
            title="Состояние"
            value={treeData && generalAlgStatuses[treeData?.status]}
            color={
              treeData &&
              GeneralAlgorithmStatusColors[generalAlgStatuses[treeData?.status]]
            }
          />
        </Col>
        <Col>
          <Can
            I={ActionsEnum.View}
            a={elementId(
              AlgorithmStatusElements[AlgorithmStatusElements.MainConfig]
            )}
          >
            <Button
              type="link"
              onClick={onConfigurationClick}
              icon={<FileSearchOutlined />}
            >
              Общая конфигурация
            </Button>
          </Can>
        </Col>
      </Row>
      <Divider style={{ margin: "12px 0" }} />
      <Form layout="vertical">
        <Row justify="end">
          <Col>
            <Can
              I={ActionsEnum.View}
              a={elementId(
                AlgorithmStatusElements[AlgorithmStatusElements.AlgConfig]
              )}
            >
              <Button
                type="link"
                onClick={onAlgorithmConfigurationClick}
                icon={<FileSearchOutlined />}
                disabled={!selectedAlgorithmId}
              >
                Конфигурация алгоритма
              </Button>
            </Can>
          </Col>
          <Col>
            <Can
              I={ActionsEnum.View}
              a={elementId(
                AlgorithmStatusElements[AlgorithmStatusElements.AlgOperands]
              )}
            >
              <Button
                type="link"
                onClick={onOperandClick}
                icon={<FileSearchOutlined />}
                disabled={!selectedAlgorithmId}
              >
                Операнды алгоритма
              </Button>
            </Can>
          </Col>
        </Row>
        <Divider style={{ margin: "12px 0" }} />
        <Row justify="start">
          <Col span={4} style={{ paddingLeft: "10px" }}>
            <Title level={5} style={{ paddingTop: "20px" }}>
              {algorithmHistory?.enabled ? "Включен" : "Выключен"}
            </Title>
          </Col>
          <Col span={5} style={{ marginRight: "4px" }}>
            <Item label="Последний запуск" style={{ margin: 0 }}>
              <Input
                value={moment(algorithmHistory?.nextRunTime).format(
                  DateFormats.RunTime
                )}
                disabled
                bordered={false}
                style={{ padding: 0 }}
              />
            </Item>
          </Col>
          <Col span={5}>
            <Item label="Следующий запуск" style={{ margin: 0 }}>
              <Input
                value={moment(algorithmHistory?.nextRunTime).format(
                  DateFormats.RunTime
                )}
                disabled
                bordered={false}
                style={{ padding: 0 }}
              />
            </Item>
          </Col>
        </Row>
        <Divider style={{ margin: "12px 0" }} />
        <Row justify="space-between" style={{ padding: "0 4%" }}>
          <Col>
            <Item
              label={<TextGrayStyled>Даты</TextGrayStyled>}
              style={{ margin: 0 }}
            >
              <RangePicker
                style={{ width: "96%" }}
                locale={locale}
                onCalendarChange={onDateChange}
                defaultValue={[moment().startOf("day"), moment().endOf("day")]}
              />
            </Item>
          </Col>
          <Col>
            <Item label="Статус" style={{ margin: 0 }}>
              <Select
                style={{ width: "15rem" }}
                defaultValue="null"
                options={[
                  { label: "Все", value: "null" },
                  { label: "Завершен успешно", value: 20 },
                  { label: "Предупреждение", value: 25 },
                  { label: "Ошибка алгоритма", value: 30 },
                  { label: "Ошибка инфраструктуры", value: 40 },
                ]}
                onChange={onStatusChange}
              />
            </Item>
          </Col>
          <Col>
            <Item label="Признаки пересчета" style={{ margin: 0 }}>
              <Select
                style={{ width: "15rem" }}
                defaultValue="null"
                options={[
                  { label: "Все", value: "null" },
                  { label: "Да", value: 1 },
                  { label: "Нет", value: 0 },
                ]}
                onChange={onReCalcChange}
              />
            </Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};
