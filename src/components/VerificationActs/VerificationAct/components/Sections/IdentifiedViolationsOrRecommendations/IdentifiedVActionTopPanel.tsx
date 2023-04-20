import { FC } from "react";
import { Button, Dropdown, Menu } from "antd";
import DownOutlined from "@ant-design/icons/DownOutlined";
import { useVerificationModals } from "../../Provider";
import { useActStatusPermission } from "../../../hooks/useActStatusPermission";
import { ViolationActModals } from "./constants";
import { ActionsEnum, Can } from "../../../../../../casl";
import {
  elementId,
  VerificationActsElements,
} from "pages/VerificationActs/constant";
import { useSelector } from "react-redux";
import { StateType } from "types";
import { VerificationActStore } from "slices/verificationActs/verificationAct/types";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

export const IdentifiedVActionTopPanel: FC = () => {
  const { act } = useSelector<StateType, VerificationActStore>(
    state => state.verificationAct
  );
  const { isUserAllowedOst } = useSelector<
    StateType,
    HomeStateType
  >((state) => state.home);

  const isOperationDisabled = verificationLevelHandler(isUserAllowedOst, act?.verificationLevelId);

  const modalState = useVerificationModals();
  const buttonProps = useActStatusPermission();

  const handleSelectTypicalViolation = () => {
    modalState.setModal({
      visible: true,
      payload: null,
      type: ViolationActModals.TYPICAL_VIOLATION_MODAL_FROM_DIR,
    });
  };

  const handleClickNewViolation = () => {
    modalState.setModal({
      visible: true,
      payload: null,
      type: ViolationActModals.NEW_VIOLATION_MODAL,
    });
  };

  const handleClickViolation = () => {
    modalState.setModal({
      visible: true,
      payload: null,
      type: ViolationActModals.TYPICAL_VIOLATION_MODAL,
    });
  };

  const renderOverlay = () => (
    <Menu disabled={isOperationDisabled}>
      <Can
        key="newViolation"
        I={ActionsEnum.View}
        a={elementId(
          VerificationActsElements[VerificationActsElements.CreateNewDefect]
        )}
      >
        <Menu.Item
          key="newViolation"
          onClick={handleClickNewViolation}
          disabled={buttonProps.disabled}
        >
          Создать новое нарушение
        </Menu.Item>
      </Can>
      <Can
        key="fromDir"
        I={ActionsEnum.View}
        a={elementId(
          VerificationActsElements[VerificationActsElements.SelectDefect]
        )}
      >
        <Menu.Item
          key="fromDir"
          onClick={handleSelectTypicalViolation}
          disabled={buttonProps.disabled}
        >
          Выбрать нарушение из справочника
        </Menu.Item>
      </Can>
      <Can
        key="typicalViolation"
        I={ActionsEnum.View}
        a={elementId(
          VerificationActsElements[VerificationActsElements.SelectTypicalDefect]
        )}
      >
        <Menu.Item
          key="typicalViolation"
          onClick={handleClickViolation}
          disabled={buttonProps.disabled}
        >
          Выбрать типовое нарушение
        </Menu.Item>
      </Can>
    </Menu>
  );

  return (
    <>
      <Can
        I={ActionsEnum.View}
        a={elementId(
          VerificationActsElements[VerificationActsElements.AddDefect]
        )}
      >
        <Dropdown overlay={renderOverlay()} disabled={buttonProps.disabled}>
          <Button
            type="link"
            icon={<DownOutlined />}
            disabled={buttonProps.disabled}
          >
            Добавить нарушение
          </Button>
        </Dropdown>
      </Can>
    </>
  );
};
