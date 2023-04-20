import React, {FC} from "react";
import {Button} from "antd";

interface MenuFilterProps {
  selectedKey: string | null;
  fields: string[];
  onSelect: (key: string) => void;
  loading?: boolean;
}

export const MenuFilter: FC<MenuFilterProps> = ({
  selectedKey,
  fields,
  onSelect,
  loading
}) => (
  <ul className="psp-custom-filter-modal__menu">
    {fields.map(field => (
      <li key={field} className="psp-custom-filter-modal__menu-field">
        <Button
          type={field === selectedKey ? "ghost" : "text"}
          onClick={() => onSelect(field)}
        >
          {field}
        </Button>
      </li>
    ))}
  </ul>
);
