import React from "react";
import classNames from "classnames/bind";
import { Select } from "antd";
import { IOption, StateType } from "types";
import { getvlwithOverdue } from "api/requests/pspControl/CheckingObjects";
import { mapOptions } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import {
  ICheckingObjectsStore,
  setAppliedFilter,
} from "slices/pspControl/checkingObjects";
import styles from "./expiredCheckFilter.module.css";

const cx = classNames.bind(styles);

interface IProps {}

export const ExpiredCheckFilter: React.FC<IProps> = () => {
  const dispatch = useDispatch();

  const { appliedFilter } = useSelector<StateType, ICheckingObjectsStore>(
    (state) => state.checkingObjects
  );

  const [isLoading, setIsLoading] = React.useState(false);
  const [options, setOptions] = React.useState<IOption[]>([]);

  React.useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setIsLoading(true);
    const options = await getvlwithOverdue();
    setOptions(mapOptions(options));
    setIsLoading(false);
  };

  const handleChange = (value: number) => {
    const adjustedFilter = {
      ...appliedFilter,
      filter: {
        ...appliedFilter.filter,
        overdueСheck: value,
      },
      pageIndex: 1,
    };

    dispatch(setAppliedFilter(adjustedFilter));
  };

  const defaultValue = options.length
    ? appliedFilter.filter?.overdueСheck
    : undefined;

  return (
    <div className={cx("wrapper")}>
      <p className={cx("label")}>Просрочена проверка для уровня</p>
      <Select
        placeholder={"Выберите уровень проверки"}
        value={defaultValue}
        style={{ width: "100%" }}
        options={options}
        onChange={handleChange}
        loading={isLoading}
        allowClear
      />
    </div>
  );
};
