import { FC, useEffect, useState } from "react";
import { Col, Row, Form, Input, Checkbox, Select, Spin } from "antd";
import { FieldData, IDictionary } from "types";
import { PositionSelect } from "components/DictionarySelects/PositionSelect";
import { FioSelect } from "components/DictionarySelects/FioSelect";
import { DropdownSelectTypes } from "components/DropdownSelect/constants";
import { getAllOrganizations } from "api/requests/pspControl/dictionaries";

const { Option } = Select;

interface MatchingFormProps {
  fields?: FieldData[] | undefined;
  onValuesChange?: (changedValues: any, values: any) => void;
  onSelectOpen?: () => Promise<void>;
  options?: { value: string; label: string }[];
  isTypical?: boolean;
}

export const MatchingForm: FC<MatchingFormProps> = ({
  fields,
  onValuesChange,
  onSelectOpen,
  options,
  isTypical,
}) => {
  const [pending, setPending] = useState(false);
  const [organizationsSelect, setOrganizationsSelect] = useState<{
    isLoading: boolean;
    organizations: Array<IDictionary>;
  }>({ isLoading: false, organizations: [] });

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
      await onSelectOpen?.();
    } finally {
      setPending(false);
    }
  };

  return (
    <Form layout="vertical" fields={fields} onValuesChange={onValuesChange}>
      <Row gutter={[16, 16]}>
        {isTypical! ||
          (isTypical === undefined && (
            <>
              <Col span={12}>
                <Form.Item name="organizationName" label="Организация">
                  <Select
                    showArrow
                    showSearch
                    placeholder={"Выберите организацию"}
                    notFoundContent={"Нет данных"}
                    loading={organizationsSelect.isLoading}
                    filterOption={(input, option) =>
                      option?.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {organizationsSelect?.organizations.map((item) => (
                      <Select.Option value={`${item.label}`} key={item.id}>
                        {item.label ? item.label : "???"}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="isOutsideOrganization" valuePropName="checked">
                  <Checkbox>Сторонняя организация</Checkbox>
                </Form.Item>
              </Col>
            </>
          ))}
        {isTypical && (
          <Col span={24}>
            <Form.Item name="organizationName" label="Организация">
              <Select>
                <Option value={`ПАО “Транснефть”`}>ПАО “Транснефть”</Option>
                <Option value={`АО «Транснефть - Метрология»`}>
                  АО «Транснефть - Метрология»
                </Option>
              </Select>
            </Form.Item>
          </Col>
        )}
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
        label="Согласующий/утверждающий/разработал"
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
