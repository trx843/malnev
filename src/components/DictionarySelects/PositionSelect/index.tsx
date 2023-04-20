import React from "react";
import classNames from "classnames/bind";
import { DropdownSelect } from "components/DropdownSelect";
import {
  addJobTitle,
  deleteJobTitle,
  getJobTitles,
} from "api/requests/pspControl/dictionaries";
import { IDictionary } from "types";
import { DropdownOptionsType } from "components/DropdownSelect/types";
import { DictionarySelectProps } from "../types";
import styles from "./positionSelect.module.css";

const cx = classNames.bind(styles);

export const PositionSelect: React.FC<DictionarySelectProps> = ({
  onChange,
  ...restProps
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [options, setOptions] = React.useState<IDictionary[]>([]);

  React.useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setIsLoading(true);
    const data = await getJobTitles();
    setOptions(data);
    setIsLoading(false);
  };

  const handleAddOption = async (name: string) => {
    setIsLoading(true);
    await addJobTitle(name);
    await init();
    setIsLoading(false);
  };

  const handleDeleteOption = async (id: string) => {
    setIsLoading(true);
    await deleteJobTitle(id);
    await init();
    setIsLoading(false);
  };

  // для того чтобы в значении формы хранилось название должности, а не id
  const handleChange = (value: string, option: DropdownOptionsType) => {
    if (onChange) {
      const optionById = options.find((option) => option.id === value);
      const optionLabel = optionById?.label;
      if (optionLabel) {
        onChange(optionLabel, option);
      }
    }
  };

  return (
    <DropdownSelect
      {...restProps}
      onChange={handleChange}
      options={options.map((o) => ({ value: o.id, label: o.label }))}
      onDeleteOption={handleDeleteOption}
      onAddOption={handleAddOption}
      loading={isLoading}
      notFoundContent="Нет данных"
    />
  );
};
