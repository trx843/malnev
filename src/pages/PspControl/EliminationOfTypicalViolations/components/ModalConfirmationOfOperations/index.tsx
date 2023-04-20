import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import classNames from "classnames/bind";
import { Modal, Spin } from "antd";
import { IdType, StateType } from "types";
import { IEliminationOfTypicalViolationsStore } from "slices/pspControl/eliminationOfTypicalViolations/types";
import {
  adjustValues,
  getCollectionOfTypicalViolations,
  getStringOfViolationNumbers,
  getViolationsIds,
} from "./utils";
import { ModalConfirmationOfOperationsModes } from "./constants";
import {
  eliminationTypicalComplited,
  eliminationTypicalNotFound,
} from "api/requests/eliminationOfTypicalViolations";
import { getTypicalViolationsThunk } from "thunks/pspControl/eliminationOfTypicalViolations";
import styles from "./modalConfirmationOfOperations.module.css";

const cx = classNames.bind(styles);

interface IProps {
  isVisible: boolean;
  onCancel: () => void;
  mode: ModalConfirmationOfOperationsModes;
  toggleModalForEliminateViolationVisibility: (violationId: IdType[]) => void;
}

export const ModalConfirmationOfOperations: React.FC<IProps> = ({
  isVisible,
  onCancel,
  mode,
  toggleModalForEliminateViolationVisibility,
}) => {
  const { pspId } = useParams<{ pspId: string }>();
  const dispatch = useDispatch();

  const [collectionOfTypicalViolations, setCollectionOfTypicalViolations] =
    React.useState<{
      violationsWithCorrespondingStatus: any[];
      violationsWithInappropriateStatus: any[];
    }>({
      violationsWithCorrespondingStatus: [],
      violationsWithInappropriateStatus: [],
    });
  const [isLoading, setIsLoading] = React.useState(false);

  const { selectedIdentifiedTypicalViolations, settingsPsp, listFilter } =
    useSelector<StateType, IEliminationOfTypicalViolationsStore>(
      (state) => state.eliminationOfTypicalViolations
    );

  const init = async (selectedIdentifiedTypicalViolations: any[], mode) => {
   /*  const {
      violationsWithCorrespondingStatus,
      violationsWithInappropriateStatus,
    } = getCollectionOfTypicalViolations(
      selectedIdentifiedTypicalViolations,
      mode
    ); */


    const violationsWithCorrespondingStatus = selectedIdentifiedTypicalViolations;
    
    // if (/* violationsWithInappropriateStatus.length */ false) {
    //   setCollectionOfTypicalViolations({
    //     violationsWithCorrespondingStatus,
    //     violationsWithInappropriateStatus,
    //   });

    //   return;
    // }

    const violationsIds = getViolationsIds(violationsWithCorrespondingStatus);

    handleConfirmOperation(violationsIds);
  };

  React.useEffect(() => {
    if (isVisible && mode !== ModalConfirmationOfOperationsModes.none) {
      init(selectedIdentifiedTypicalViolations, mode);
    }
  }, [isVisible, selectedIdentifiedTypicalViolations, mode]);

  const handleConfirmOperation = async (violationsIds: string[]) => {
    if (mode === ModalConfirmationOfOperationsModes.markElimination) {
      toggleModalForEliminateViolationVisibility(violationsIds);
      onCancel();
      return;
    }
    const adjustedValues = adjustValues(pspId, violationsIds);

    if (mode === ModalConfirmationOfOperationsModes.noViolationDetected) {
      setIsLoading(true);
      await eliminationTypicalNotFound(adjustedValues);
      setIsLoading(false);
    }

    dispatch(getTypicalViolationsThunk(listFilter));

    onCancel();
  };

  const handleOnOk = () => {
    const { violationsWithCorrespondingStatus } = collectionOfTypicalViolations;
    const violationsIds = getViolationsIds(violationsWithCorrespondingStatus);
    handleConfirmOperation(violationsIds);
  };

  const {
    violationsWithCorrespondingStatus,
    violationsWithInappropriateStatus,
  } = collectionOfTypicalViolations;

  return (
    <Modal
      width="34.2%"
      visible={isVisible}
      title="Подтверждение операции"
      onOk={handleOnOk}
      onCancel={onCancel}
      cancelButtonProps={{
        style: { display: "none" },
      }}
      okText="Подтвердить"
      okButtonProps={{
        loading: isLoading,
        disabled: /* !violationsWithCorrespondingStatus.length */ false,
      }}
      maskClosable={false}
      destroyOnClose
      centered
    >
      <Spin spinning={isLoading}>
        {/* !!violationsWithInappropriateStatus.length */ false && (
          <React.Fragment>
            Операция не может быть выполнена для нарушения №{" "}
            {getStringOfViolationNumbers(violationsWithInappropriateStatus)}
          </React.Fragment>
        )}
      </Spin>
    </Modal>
  );
};
