import React from "react";
import { useParams } from "react-router";
import classNames from "classnames/bind";
import { Modal, Spin } from "antd";
import { AgGridTable } from "components/AgGridTable";
import { Filter } from "./components/Filter";
import { DefaultColDef, InitFilter, TableColumns } from "./constants";
import {
  IEliminationTypicalViolationFilter,
  IEliminationTypicalViolationInfoModel,
} from "api/requests/eliminationOfTypicalViolations/types";
import { IListFilter, Nullable, StateType } from "types";
import { getEliminationTypicalViolationByPspId } from "api/requests/eliminationOfTypicalViolations";
import { getModalTitleWithViolationNumber } from "../../utils";
import styles from "./modalVerificationInformation.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setEliminationTypicalViolationInfo } from "slices/pspControl/eliminationOfTypicalViolations";
import { IEliminationOfTypicalViolationsStore } from "slices/pspControl/eliminationOfTypicalViolations/types";
import { RendererProps } from "components/ItemsTable";
import "./styles.css";

const cx = classNames.bind(styles);

interface IProps {
  typicalViolation: Nullable<any>;
  isVisible: boolean;
  onCancel: () => void;
}

export const ModalVerificationInformation: React.FC<IProps> = ({
  typicalViolation,
  isVisible,
  onCancel,
}) => {

  const { eliminationTypicalViolationInfo } = useSelector<
    StateType,
    IEliminationOfTypicalViolationsStore
  >((state) => state.eliminationOfTypicalViolations);


  const { pspId } = useParams<{ pspId: string }>();

  const typicalViolationId = typicalViolation?.identifiedTypicalViolation_id;

  const [listFilter, setFilter] =
    React.useState<IListFilter<IEliminationTypicalViolationFilter>>(InitFilter);

  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();



  React.useEffect(() => {
    init(typicalViolationId, pspId);
  }, [typicalViolationId, pspId, listFilter]);

  const init = async (typicalViolationId: string, pspId: string) => {
    if (typicalViolationId && pspId) {
      setIsLoading(true);
      const eliminationTypicalViolationInfo =
        await getEliminationTypicalViolationByPspId({
          ...listFilter,
          filter: {
            ...listFilter.filter,
            identifiedTypicalViolationId: typicalViolationId,
            ostRnuPspId: pspId,
          },
        });
      setIsLoading(false);

      dispatch(setEliminationTypicalViolationInfo(eliminationTypicalViolationInfo));
    }
  };

  const handleSetFilter = (values: any) => {
    setFilter({
      ...listFilter,
      filter: {
        ...listFilter.filter,
        ...values,
      },
    });
  };

  const handleOnCancel = () => {
    setFilter(InitFilter);
    onCancel();
  };

  return (
    <Modal
      width="75.4%"
      visible={isVisible}
      title={getModalTitleWithViolationNumber(
        "Информация о проверке объекта на наличие типового нарушения",
        typicalViolation
      )}
      onCancel={handleOnCancel}
      footer={null}
      maskClosable={false}
      destroyOnClose
      centered
    >
      <Spin spinning={isLoading}>
        <p className={cx("content-title")}>Поиск</p>
        <Filter handleSetFilter={handleSetFilter} />
        <AgGridTable
          className={cx("table")}
          defaultColDef={DefaultColDef}
          rowData={eliminationTypicalViolationInfo}
          columnDefs={TableColumns}
          isAutoSizeColumns={false}
          frameworkComponents={{
            WrapText: (item: RendererProps<IEliminationTypicalViolationInfoModel>) => (
              <div className="ModalVerificationInformation__action-text">
                {item.value}
              </div>
            ),
          }}
        />
      </Spin>
    </Modal>
  );
};
