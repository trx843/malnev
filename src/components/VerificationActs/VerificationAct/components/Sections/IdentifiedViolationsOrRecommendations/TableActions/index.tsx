import { FC, useState } from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  BlockOutlined,
  DeleteOutlined,
  EditOutlined,
  VerticalAlignMiddleOutlined,
} from "@ant-design/icons";
import { RendererProps } from "../../../../../../ItemsTable";
import { IdType, StateType } from "../../../../../../../types";
import { IdentifiedVItem } from "../../../../classes";
import { useVerificationModals } from "../../../Provider";
import { useActStatusPermission } from "../../../../hooks/useActStatusPermission";
import { ViolationActModals } from "components/VerificationActs/VerificationAct/components/Sections/IdentifiedViolationsOrRecommendations/constants";
import { VerificationActStore, Violation } from "slices/verificationActs/verificationAct/types";
import { ActionsEnum, Can } from "../../../../../../../casl";
import {
  elementId,
  VerificationActsElements,
} from "pages/VerificationActs/constant";
import { useSelector } from "react-redux";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

interface TableActActionsProps extends RendererProps<IdentifiedVItem> {
  onDelete?: (id: IdType, siknLabRsuId: string, area: string) => Promise<void>;
}

export const TableActions: FC<TableActActionsProps> = ({ onDelete, data }) => {
  const { act } = useSelector<StateType, VerificationActStore>(
    state => state.verificationAct
  );
  const { isUserAllowedOst } = useSelector<
    StateType,
    HomeStateType
  >((state) => state.home);

  const isOperationDisabled = verificationLevelHandler(isUserAllowedOst, act?.verificationLevelId);

  const buttonProps = useActStatusPermission();
  const modalsState = useVerificationModals();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const item = data as unknown as Violation;
      await onDelete?.(
        data.violationId,
        data.siknLabRsuId,
        item.areaOfResponsibility
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (data.identifiedTypicalViolationId !== null) {
      modalsState.setModal({
        visible: true,
        payload: data,
        type: ViolationActModals.EDIT_TYPICAL_VIOLATION_MODAL,
      });
    } else {
      modalsState.setModal({
        visible: true,
        payload: data,
        type: ViolationActModals.EDIT_NEW_VIOLATION_MODAL,
      });
    }
  };

  const handleCopy = () => {
    const item = data as unknown as Violation;

    const violation = {
      identifiedTypicalViolationId: null,
      areaOfResponsibility: item.areaOfResponsibility,
      classifficationTypeId: item.classifficationTypeId,
      serial: item.serial,
      siknLabRsu: item.siknLabRsu.map((i: any) => i.id),
      sourceRemarkId: item.sourceRemarkId,
      specialOpinion: item.specialOpinion,
      verificationActId: item.verificationActId,
      violations: item.violations.map((violation) => ({
        pointNormativeDocuments: violation.pointNormativeDocuments,
        violationText: violation.violationText,
      })),
    };

    modalsState.setModal({
      visible: true,
      payload: violation,
      type: ViolationActModals.COPY_VIOLATION_MODAL,
    });
  };

  const handleOrderViolations = () => {
    const item = data as unknown as Violation;
    modalsState.setModal({
      visible: true,
      payload: { id: data.id, area: item.areaOfResponsibility },
      type: ViolationActModals.CHANGE_VIOLATION_ORDER_MODAL,
    });
  };

  return (
    <div className="ais-table-actions">
      <Can
        I={ActionsEnum.View}
        a={elementId(
          VerificationActsElements[VerificationActsElements.EditDefect]
        )}
      >
        <Tooltip title={"Редактировать"}>
          <Button
            icon={<EditOutlined />}
            type="link"
            className="ais-table-actions__item"
            onClick={handleEdit}
            disabled={isOperationDisabled}
          />
        </Tooltip>
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(
          VerificationActsElements[VerificationActsElements.CopyDefect]
        )}
      >
        <Tooltip title="Копировать нарушение">
          <Button
            className="ais-table-actions__item"
            icon={<BlockOutlined />}
            type="link"
            onClick={handleCopy}
            disabled={buttonProps.disabled || loading || isOperationDisabled}
          />
        </Tooltip>
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(
          VerificationActsElements[VerificationActsElements.DelDefect]
        )}
      >
        <Popconfirm
          title="Вы уверены, что хотите удалить нарушение?"
          onConfirm={handleDelete}
          okText="Удалить"
          cancelText="Отмена"
          disabled={buttonProps.disabled || isOperationDisabled}
        >
          <Tooltip title={"Удалить"}>
            <Button
              icon={<DeleteOutlined />}
              danger
              type="link"
              loading={loading}
              disabled={buttonProps.disabled || loading || isOperationDisabled}
              className="ais-table-actions__item"
            />
          </Tooltip>
        </Popconfirm>
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(
          VerificationActsElements[VerificationActsElements.ChangeOrder]
        )}
      >
        <Tooltip title="Изменить порядок">
          <Button
            className="ais-table-actions__item"
            icon={<VerticalAlignMiddleOutlined />}
            type="link"
            onClick={handleOrderViolations}
            disabled={buttonProps.disabled || loading || isOperationDisabled}
          />
        </Tooltip>
      </Can>
    </div>
  );
};
