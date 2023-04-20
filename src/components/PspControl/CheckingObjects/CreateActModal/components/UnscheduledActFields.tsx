import React, { FC } from "react";
import { Col, Form, Row, Select, Spin } from "antd";
import { IPspcontrolVerificationLevelsResponse } from "api/responses/get-pspcontrol-verification-levels.response";
import { getCheckTypeOptions, mapVerificationLevels } from "./utils";
import { ActParams } from "../CreateVerificationActModal";
import { OwnStatuses } from "slices/pspControl/verificationSchedule/constants";

interface SchedulesProps {
  verificationLevels: IPspcontrolVerificationLevelsResponse[];
  values: ActParams;
  ownType: OwnStatuses;
  onSelectCheckType: (visible: boolean) => void;
}

export const UnScheduledActField: FC<SchedulesProps> = ({
  verificationLevels,
  values,
  ownType,
  onSelectCheckType
}) => {
  return (
    <Row>
      <Col span={16}>
        <Form.Item
          name="verificationLevelId"
          label="Уровень проверки"
          className="schedule-form__field"
        >
          <Select options={mapVerificationLevels(verificationLevels)} />
        </Form.Item>
      </Col>
      <Col span={16}>
        <Form.Item
          name="checkTypeId"
          label="Тип проверки"
          className="schedule-form__field"
        >
          <Select
            options={getCheckTypeOptions(
              verificationLevels,
              values.verificationLevelId,
              ownType
            )}
            notFoundContent={"Нет данных"}
            onSelect={(_, data) =>
              onSelectCheckType(data.isVisibilityInspection)
            }
            disabled={!values.verificationLevelId}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};
