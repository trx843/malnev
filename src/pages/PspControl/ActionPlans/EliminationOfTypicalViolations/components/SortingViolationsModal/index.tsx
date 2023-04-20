import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgGridColumn } from "ag-grid-react";
import { RowDragEvent } from "ag-grid-community";
import classNames from "classnames/bind";
import _ from "lodash";
import { Modal, Spin } from "antd";
import { Form, Formik, FormikProps } from "formik";
import { FormItem, Input } from "formik-antd";
import { AgGridTable } from "components/AgGridTable";
import {
  ActionPlanTypicalViolationsStore,
  ITypicalViolationsForPlanCardWithActionPlanModel,
} from "slices/pspControl/actionPlanTypicalViolations/types";
import { FormValues } from "./types";
import { StateType } from "types";
import { sortTypicalViolations } from "api/requests/pspControl/plan-typical-violations";
import {
  adjustTypicalViolationSerial,
  adjustValues,
  getInitialValues,
} from "./utils";
import { getViolationsByAreaOfResponsibilityThunk } from "thunks/pspControl/actionPlans/actionPlanTypicalViolations";
import { AreasOfResponsibility } from "../../constants";
import styles from "./sortingViolationsModal.module.css";

const cx = classNames.bind(styles);

const TextAreaField = ({ data, value, ...restProps }) => {
  return (
    <FormItem
      style={{ margin: 0 }}
      name={`${data.id}.${restProps.column.colId}`}
      noStyle
    >
      <Input
        name={`${data.id}.${restProps.column.colId}`}
        style={{ width: "100%", height: "100%" }}
      />
    </FormItem>
  );
};

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  items: ITypicalViolationsForPlanCardWithActionPlanModel[];
  areasOfResponsibility: AreasOfResponsibility;
}

export const SortingViolationsModal: React.FC<IProps> = ({
  isVisible,
  onCancel,
  items,
  areasOfResponsibility,
}) => {
  const dispatch = useDispatch();

  const [data, setData] = React.useState<
    ITypicalViolationsForPlanCardWithActionPlanModel[]
  >([]);

  const [isSortingTypicalViolations, setIsSortingTypicalViolations] =
    React.useState(false);

  const { typicalPlanCard } = useSelector<
    StateType,
    ActionPlanTypicalViolationsStore
  >((state) => state.actionPlanTypicalViolations);

  const typicalPlanId = typicalPlanCard?.id;

  const formikRef = React.useRef<FormikProps<FormValues>>(null); // реф для того чтобы засабмитить форму из вне компонента формы

  React.useEffect(() => {
    setData(adjustTypicalViolationSerial(items));
  }, [items]);

  const handleSubmitForm = async (values: FormValues) => {
    if (typicalPlanId) {
      const adjustedValues = adjustValues(values, data);
      setIsSortingTypicalViolations(true);
      await sortTypicalViolations(adjustedValues, typicalPlanId);
      setIsSortingTypicalViolations(false);
      dispatch(getViolationsByAreaOfResponsibilityThunk(areasOfResponsibility));
      onCancel();
    }
  };

  const onRowDragEnd = (e: RowDragEvent) => {
    const orderedElements: ITypicalViolationsForPlanCardWithActionPlanModel[] =
      [];
    e.api.forEachNode((node, index) =>
      orderedElements.push({ ...node.data, typicalViolationSerial: index + 1 })
    );
    setData(orderedElements);
  };

  return (
    <Modal
      title="Редактирование нарушения"
      width={780}
      visible={isVisible}
      onCancel={() => onCancel()}
      onOk={() => formikRef.current?.submitForm()}
      cancelButtonProps={{ style: { display: "none" } }}
      okText="Сохранить"
      okButtonProps={{
        loading: isSortingTypicalViolations,
      }}
      maskClosable={false}
      destroyOnClose
    >
      <Spin spinning={isSortingTypicalViolations}>
        <Formik<FormValues>
          innerRef={formikRef}
          enableReinitialize
          initialValues={getInitialValues(items)}
          onSubmit={handleSubmitForm}
        >
          <Form>
            <AgGridTable
              className={cx("table")}
              rowData={data}
              onRowDragEnd={onRowDragEnd}
              rowDragManaged={true}
              animateRows={true}
            >
              <AgGridColumn
                headerName="№ подпункта"
                field="typicalViolationSerial"
                rowDrag
              />
              <AgGridColumn
                headerName="Содержание нарушения"
                field="typicalViolationText"
              />
              <AgGridColumn
                headerName="Требование НД"
                field="pointNormativeDocuments"
              />
            </AgGridTable>
          </Form>
        </Formik>
      </Spin>
    </Modal>
  );
};
