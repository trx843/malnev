import React from "react";
import classNames from "classnames/bind";
import {
  Button,
  Col,
  Divider,
  Input,
  Row,
  Select as AntdSelect,
  SelectProps,
  Tooltip,
} from "antd";
import {
  Select as FormikSelect,
  SelectProps as FormikSelectProps,
} from "formik-antd";
import { SelectValue } from "antd/lib/select";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { DropdownOptionsType } from "./types";
import { DropdownSelectTypes } from "./constants";
import styles from "./dropdownSelect.module.css";

const cx = classNames.bind(styles);

const SelectComponents = {
  [DropdownSelectTypes.antd]: AntdSelect,
  [DropdownSelectTypes.formik]: FormikSelect,
};

interface IAntdSelectProps extends SelectProps<SelectValue> {
  name?: never;
  type: DropdownSelectTypes.antd;
  onDeleteOption: (id: string) => Promise<void>;
  onAddOption: (value: string) => Promise<void>;
  options: DropdownOptionsType;
}

interface IFormikSelectProps extends FormikSelectProps {
  type: DropdownSelectTypes.formik;
  onDeleteOption: (id: string) => Promise<void>;
  onAddOption: (value: string) => Promise<void>;
  options: DropdownOptionsType;
}

type Props = IAntdSelectProps | IFormikSelectProps;

export const DropdownSelect: React.FC<Props> = ({
  name,
  type,
  options,
  onDeleteOption,
  onAddOption,
  loading,
  ...props
}) => {
  const [value, setValue] = React.useState("");

  const handleAddOption = async () => {
    await onAddOption(value);
    setValue("");
  };

  const handleDeleteOption = (
    event: React.MouseEvent<HTMLElement>,
    optionId: string
  ) => {
    event.stopPropagation();
    onDeleteOption(optionId);
  };

  const renderDropdown = (menu: React.ReactElement) => {
    return (
      <React.Fragment>
        <div className={cx("dropdown")}>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
          <Button
            icon={<PlusOutlined />}
            onClick={handleAddOption}
            disabled={!value}
            loading={loading}
            type="link"
          >
            Добавить
          </Button>
        </div>
        <Divider className={cx("divider")} />
        {menu}
      </React.Fragment>
    );
  };

  const renderOptions = (options: DropdownOptionsType) => {
    const Select = SelectComponents[type];

    return options.map((option) => {
      const { value: optionValue, label: optionLabel } = option;

      return (
        <Select.Option
          key={optionValue}
          value={optionValue}
          label={optionLabel}
        >
          <Row wrap={false} justify={"space-between"} align={"middle"}>
            <Col>
              <Tooltip title={optionLabel}>
                <p className={cx("option-label")}>{optionLabel}</p>
              </Tooltip>
            </Col>
            <Col>
              <Button
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                  handleDeleteOption(e, optionValue)
                }
                icon={<DeleteOutlined style={{ color: "#FF4D4F" }} />}
                loading={loading}
                type="link"
              />
            </Col>
          </Row>
        </Select.Option>
      );
    });
  };

  return type === DropdownSelectTypes.antd ? (
    <AntdSelect
      {...props}
      showSearch
      loading={loading}
      dropdownRender={renderDropdown}
      optionFilterProp="label"
      dropdownMatchSelectWidth={500}
    >
      {renderOptions(options)}
    </AntdSelect>
  ) : (
    <FormikSelect
      {...props}
      showSearch
      name={name as string}
      loading={loading}
      dropdownRender={renderDropdown}
      optionFilterProp="label"
    >
      {renderOptions(options)}
    </FormikSelect>
  );
};
