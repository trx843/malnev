import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Formik } from "formik";
import FilterFilled from "@ant-design/icons/lib/icons/FilterFilled";
import isEmpty from "lodash/isEmpty";
import { Button, Modal, Skeleton } from "antd";
import isEqual from "lodash/isEqual";

import { MenuFilter } from "./components/MenuFilter";
import { FilterBody } from "./components/FilterBody";
import { IFilterGroup, IGenericFilterConfig } from "../CustomFilter/interfaces";
import "./styles.css";

import { OptionData } from "../../global";

interface ModalCustomFilterProps {
  visible: boolean;
  onClose: () => void;
  filterValues: Record<string, any>;
  onReset?: () => void;
  onSubmit?: (values: any) => void;
  filterConfig: IGenericFilterConfig;
  onFetchSelect?: (
    name: string,
    value: any,
    controller: string
  ) => Promise<OptionData[]>;
  loading?: boolean;
}

export const ModalCustomFilter: FC<ModalCustomFilterProps> = ({
  visible,
  onClose,
  filterValues,
  filterConfig,
  onFetchSelect,
  onReset,
  loading,
  onSubmit,
}) => {
  const formikRef = React.useRef<any>(null);
  const [isDirty, setDirty] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const setConfig = useCallback(() => {
    const filterGroupKeys = filterConfig.filterList.reduce(
      (acc, filter) => ({
        ...acc,
        [filter.displayGroupName]: filter.displayGroupName,
      }),
      {}
    );
    setKeys(filterGroupKeys);
    setSelectedFilter(Object.keys(filterGroupKeys)[0]);
    setIsLoading(false);
  }, [filterConfig.filterList]);

  useEffect(() => {
    if (
      !isEqual(formikRef.current?.values, filterValues) &&
      !isEmpty(formikRef.current)
    ) {
      formikRef.current?.setValues(filterValues);
    }
  }, [filterValues, formikRef.current]);

  useEffect(() => {
    setConfig();
  }, [setConfig]);

  const handleResetFilter = () => {
    try {
      onReset?.();
      formikRef.current?.resetForm();
      formikRef.current?.setValues({});
      setDirty(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleClose = () => {
    formikRef.current?.resetForm();
    onClose();
  };

  const handleSubmitButton = () => {
    formikRef.current?.submitForm?.();
  };

  const renderFooter = () => (
    <div>
      <Button
        type="text"
        disabled={loading || isDirty}
        onClick={handleResetFilter}
      >
        Сбросить
      </Button>
      <Button
        htmlType="submit"
        type="link"
        onClick={handleSubmitButton}
        loading={loading}
        disabled={loading}
      >
        Применить
      </Button>
    </div>
  );

  const handleSubmit = (values: any) => {
    onSubmit?.(values);
    onClose();
  };

  const normalizeToHashGroups = useMemo(
    (): Record<string, IFilterGroup[]> =>
      filterConfig.filterList.reduce((acc, group) => {
        if (acc[group.displayGroupName as keyof typeof acc]) {
          return {
            ...acc,
            [group.displayGroupName]: [
              ...acc[group.displayGroupName as keyof typeof acc],
              group,
            ],
          };
        }
        return {
          ...acc,
          [group.displayGroupName]: [group],
        };
      }, {}),
    [filterConfig.filterList]
  );

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title={null}
      width={920}
      destroyOnClose
      footer={renderFooter()}
      className="psp-custom-filter-modal__modal-body"
    >
      <Formik
        initialValues={filterValues}
        onSubmit={handleSubmit}
        innerRef={formikRef}
      >
        {({ setFieldValue, values }) => (
          <div className="psp-custom-filter-modal__content">
            <div className="psp-custom-filter-modal__nav">
              <div className="psp-custom-filter-modal__title">
                <Button
                  type="text"
                  icon={<FilterFilled />}
                  onClick={handleClose}
                >
                  Cкрыть фильтр
                </Button>
              </div>
              {!isLoading ? (
                <MenuFilter
                  selectedKey={selectedFilter}
                  onSelect={(key) => setSelectedFilter(key)}
                  fields={Object.keys(keys)}
                />
              ) : (
                <Skeleton loading active />
              )}
            </div>
            <div className="psp-custom-filter-modal__filter">
              {!isLoading ? (
                <FilterBody
                  values={values}
                  setFieldValue={setFieldValue}
                  selectedKey={selectedFilter}
                  groups={normalizeToHashGroups}
                  getOptionsSelect={async (name: string, controller: string) =>
                    (await onFetchSelect?.(name, values, controller)) || []
                  }
                />
              ) : (
                <Skeleton loading active />
              )}
            </div>
          </div>
        )}
      </Formik>
    </Modal>
  );
};
