import { FC } from "react";
import { Form, Select } from "antd";
import { mapVerificationSchedules } from "./utils";
import { ISchedule } from "../CreateVerificationActModal/types";

interface SchedulesProps {
  verificationSchedules: ISchedule[];
}

export const ScheduledActField: FC<SchedulesProps> = ({
  verificationSchedules
}) => {
  return (
    <Form.Item
      name="ostRnuPsp_VerificationSchedulesId"
      label="График проверки"
      className="schedule-form__field"
      rules={[{ required: true, message: "Выберите график" }]}
    >
      <Select
        options={mapVerificationSchedules(verificationSchedules)}
        notFoundContent={"Нет данных"}
      />
    </Form.Item>
  );
};
