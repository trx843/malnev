import { FC, useEffect, useState } from "react";
import { Col, Row, Form, Input, Checkbox, Select, Spin } from "antd";
import { FieldData, IDictionary } from "types";
import { PositionSelect } from "components/DictionarySelects/PositionSelect";
import { FioSelect } from "components/DictionarySelects/FioSelect";
import { DropdownSelectTypes } from "components/DropdownSelect/constants";
import { getAllOrganizations } from "api/requests/pspControl/dictionaries";

interface MatchingFormProps {
  fields?: FieldData[] | undefined;
  onValuesChange?: (changedValues: any, values: any) => void;
  onSelectOpen?: () => Promise<void>;
  options?: { value: string; label: string }[]
}

export const MatchingForm: FC<MatchingFormProps> = ({
  fields,
  onValuesChange,
  onSelectOpen,
  options,
}) => {
  const [pending, setPending] = useState(false);
  const [organizationsSelect, setOrganizationsSelect] = useState<{ isLoading: boolean, organizations: Array<IDictionary> }>({ isLoading: false, organizations: [] });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setOrganizationsSelect({ ...organizationsSelect, isLoading: true });
    const data = await getAllOrganizations();
    setOrganizationsSelect({ isLoading: false, organizations: data });
  };

  const handleOpen = async (open: boolean) => {
    if (!open) {
      return;
    }
    try {
      setPending(true);
      await onSelectOpen?.()
    } finally {
      setPending(false);
    }
  };

  return (
    <Form layout="vertical" fields={fields} onValuesChange={onValuesChange}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item name="organizationName" label="Организация">
            <Select
              showArrow
              showSearch
              placeholder={"Выберите организацию"}
              loading={organizationsSelect.isLoading}
              filterOption={(input, option) => option?.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
              }
            >
              {
                organizationsSelect?.organizations.map(item => (
                  <Select.Option
                    value={`${item.label}`}
                    key={item.id}
                  >
                    {item.label ? item.label : "???"}
                  </Select.Option>
                ))
              }
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="isOutsideOrganization" valuePropName="checked">
            <Checkbox>Сторонняя организация</Checkbox>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="jobTitle" label="Должность">
            <PositionSelect type={DropdownSelectTypes.antd} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="fullName" label="ФИО">
            <FioSelect type={DropdownSelectTypes.antd} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="commisionTypesId"
        label="Согласующий/утверждающий"
      >
        <Select
          loading={pending}
          notFoundContent={pending ? <Spin size="small" /> : "Нет данных"}
          onDropdownVisibleChange={handleOpen}
          options={options}
        />
      </Form.Item>
    </Form>
  );
};
