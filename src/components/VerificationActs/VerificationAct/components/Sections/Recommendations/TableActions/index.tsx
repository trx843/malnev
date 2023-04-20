import { FC, useState } from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  VerticalAlignMiddleOutlined,
} from "@ant-design/icons";

import { RendererProps } from "../../../../../../ItemsTable";
import { IdType, StateType } from "../../../../../../../types";
import { useVerificationModals } from "../../../Provider";
import { useActStatusPermission } from "../../../../hooks/useActStatusPermission";
import { RecommendationsTypeModals } from "../constants";
import { ActionsEnum, Can } from "../../../../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";
import { RecommendationItemModel, VerificationActStore } from "slices/verificationActs/verificationAct/types";
import { useSelector } from "react-redux";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";


interface TableActActionsProps extends RendererProps<RecommendationItemModel> {
  onDelete?: (id: IdType) => Promise<void>;
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
      await onDelete?.(data.id);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    modalsState.setModal({
      type: RecommendationsTypeModals.EDIT_RECOMMENDATION_MODAL,
      visible: true,
      payload: data,
    });
  };



  return (
    <div className="ais-table-actions">
      <Can
        I={ActionsEnum.View}
        a={elementId(VerificationActsElements[VerificationActsElements.EditRecomendation])}
      >
        <Tooltip
          arrowPointAtCenter
          title={<span style={{ color: "black" }}>Редактировать</span>}
          color="#ffffff"
          placement="bottomLeft"
        >
          <Button
            icon={<EditOutlined />}
            type="link"
            className="ais-table-actions__item"
            onClick={handleEdit}
            disabled={buttonProps.disabled || isOperationDisabled}
          />
        </Tooltip>
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(VerificationActsElements[VerificationActsElements.DelRecomendation])}
      >
        <Tooltip
          arrowPointAtCenter
          title={<span style={{ color: "black" }}>Удалить</span>}
          color="#ffffff"
          placement="bottomLeft"
        >
          <Popconfirm
            title="Вы уверены, что хотите удалить рекомендацию?"
            onConfirm={handleDelete}
            okText="Удалить"
            cancelText="Отмена"
            disabled={buttonProps.disabled || data.hasActionPlan || isOperationDisabled}
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              type="link"
              loading={loading}
              disabled={buttonProps.disabled || data.hasActionPlan || isOperationDisabled}
              className="ais-table-actions__item"
            />
          </Popconfirm>
        </Tooltip>
      </Can>
    </div>
  );
};
