import { Button, Col, Row } from "antd";
import { Form, ResetButton } from "formik-antd";
import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { ListFilterBase, SelectedNode } from "../../interfaces";
import { ICustomFilterState } from "../../slices/customFilter";
import { ICheckingObjectsStore } from "../../slices/pspControl/checkingObjects";
import { FilterContainer } from "../../styles/commonStyledComponents";
import { StateType } from "../../types";
import { GroupFilter } from "./groupFilter";
import { IGenericFilterConfig } from "./interfaces";

interface IFilterFormProps {
  isSubmitting: boolean;
  values: any;
  submitForm: (filter: any) => Promise<void>;
  changeFilterCallback: (filter: any) => Promise<void>;
  applyFilterCallback: (filter: any) => Promise<void>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
}
export const FilterForm: FC<IFilterFormProps> = props => {
  const customFilterStore = useSelector<StateType, ICustomFilterState>(
    state => state.customFilter
  );

  const resetDependsFilters = async (
    props: React.PropsWithChildren<IFilterFormProps>
  ) => {
    return [];
  };

  useEffect(() => {
    (async () => {
      await resetDependsFilters(props);
      /* props.changeFilterCallback({});
      props.applyFilterCallback({}); */
    })();
  }, [customFilterStore.selectedTreeNode]);

  return (
    <Form layout="vertical">
      <Row>
        <Col span={24}>
          <FilterContainer>
            <Row gutter={[24, 24]}>
              {customFilterStore.filterConfig.filterList.map(group => {
                return (
                  <Col>
                    <GroupFilter
                      sumbitForm={props.submitForm}
                      groupFilter={group}
                    />
                  </Col>
                );
              })}
            </Row>
          </FilterContainer>
        </Col>
      </Row>
      <Row justify="end">
        <Col>
          <ResetButton
            type={"text"}
            onClick={() => {
              props.changeFilterCallback({});
              props.applyFilterCallback({});
            }}
          >
            Сбросить
          </ResetButton>
          <Button
            type={"link"}
            loading={props.isSubmitting}
            onClick={() => props.applyFilterCallback(props.values)}
          >
            Применить
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
