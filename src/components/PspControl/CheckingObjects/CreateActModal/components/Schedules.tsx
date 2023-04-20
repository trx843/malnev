import { FC } from "react";
import { Col, Form, Radio, Row, Space } from "antd";

import { ScheduledActField } from "./ScheduledActField";
import { UnScheduledActField } from "./UnscheduledActFields";
import { ActParams } from "../CreateVerificationActModal";
import { ISchedule } from "../CreateVerificationActModal/types";
import { IPspcontrolVerificationLevelsResponse } from "api/responses/get-pspcontrol-verification-levels.response";
import { OwnStatuses } from "slices/pspControl/verificationSchedule/constants";
import "./styles.css";

interface SchedulesProps {
  verificationLevels: IPspcontrolVerificationLevelsResponse[];
  verificationSchedules: ISchedule[];
  values: ActParams;
  ownType: OwnStatuses;
  onSelectCheckType: (visible: boolean) => void;
}

export const Schedules: FC<SchedulesProps> = ({
  verificationLevels,
  verificationSchedules,
  values,
  ownType,
  onSelectCheckType
}) => {
  return (
    <Space direction="vertical" className="schedule-form__space">
      <Row>
        <Col span={16}>
          <Form.Item
            label=""
            name="actType"
            className="schedule-form__field"
            rules={[{ required: true, message: "" }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="existSchedule">
                  Акт с существующим графиком проверки
                </Radio>
                <Radio value="notExist">Акт внеплановой проверки</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={4}></Col>
      </Row>
      {values.actType === "existSchedule" ? (
        <Row>
          <Col span={16}>
            <ScheduledActField verificationSchedules={verificationSchedules} />
          </Col>
        </Row>
      ) : (
        <UnScheduledActField
          ownType={ownType}
          values={values}
          onSelectCheckType={onSelectCheckType}
          verificationLevels={verificationLevels}
        />
      )}
    </Space>
  );
};
