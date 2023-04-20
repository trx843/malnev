import React from "react";
import classNames from "classnames/bind";
import { Button, Tooltip } from "antd";
import {
  AuditOutlined,
  CloseCircleOutlined,
  ExceptionOutlined,
  FileDoneOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { TypesOfOperations } from "../../../ModalOfOperations/constants";
import {
  isAcceptMaterialsButtonVisible,
  isDeclineRenewalButtonVisible,
  isEliminationProgressInformationButtonVisible,
  isExtendButtonVisible,
  isRejectMaterialsButtonVisible,
  isRequestAnExtensionButtonVisible,
  isSendForVerificationButtonVisible,
} from "./utils";
import { Nullable, StateType } from "../../../../../../../types";
import styles from "./actionsColumn.module.css";
import { ActionsEnum, Can } from "../../../../../../../casl";
import {
  elementId,
  EliminationOfViolationsElements,
} from "pages/PspControl/EliminationOfViolations/constants";
import { useSelector } from "react-redux";
import { HomeStateType } from "slices/home";
import { verificationLevelHandler } from "utils";

const cx = classNames.bind(styles);

interface IProps {
  data: any;
  handleSetModalOfOperationsInfo: (
    violation: any,
    typeOfOperation: TypesOfOperations
  ) => void;
  handleOpenModalEliminationProgressInformation: (id: Nullable<string>) => void;
}

export const ActionsColumn: React.FC<IProps> = ({
  data,
  handleSetModalOfOperationsInfo,
  handleOpenModalEliminationProgressInformation,
}) => {
  const eliminateStatus = data?.actionPlan_eliminateStatusId;
  const eliminateOperationId = data?.actionPlan_eliminateOperationId;
  const eliminationId = data.actionPlan_eliminationId;

  const { isUserAllowedOst } = useSelector<StateType, HomeStateType>(
    (state) => state.home
  );

  const isOperationDisabled = verificationLevelHandler(
    isUserAllowedOst,
    data.actionPlan_verificationLevelId
  );

  return (
    <React.Fragment>
      <Can
        I={ActionsEnum.View}
        a={elementId(
          EliminationOfViolationsElements[
          EliminationOfViolationsElements.FixingProcessInfo
          ]
        )}
      >
        {isEliminationProgressInformationButtonVisible(eliminationId) && (
          <Tooltip title="Открыть информацию о ходе устранения">
            <Button
              onClick={() =>
                handleOpenModalEliminationProgressInformation(eliminationId)
              }
              icon={<FileTextOutlined />}
              type="link"
            />
          </Tooltip>
        )}
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(
          EliminationOfViolationsElements[
          EliminationOfViolationsElements.SendToCheck
          ]
        )}
      >
        {!data.actionPlan_disableforCheck ? (
          <>{isSendForVerificationButtonVisible(eliminateStatus) && (
            <Tooltip title="Отправить на проверку">
              <Button
                onClick={() =>
                  handleSetModalOfOperationsInfo(
                    data,
                    TypesOfOperations.sendForVerification
                  )
                }
                icon={<AuditOutlined />}
                type="link"
              />
            </Tooltip>
          )}</>) : (null)}

      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(
          EliminationOfViolationsElements[
          EliminationOfViolationsElements.RejectExtension
          ]
        )}
      >
        {isDeclineRenewalButtonVisible(eliminateStatus, eliminateOperationId) && (
          <Tooltip title="Отклонить продление">
            <Button
              onClick={() =>
                handleSetModalOfOperationsInfo(
                  data,
                  TypesOfOperations.rejectExtension
                )
              }
              icon={<CloseCircleOutlined style={!isOperationDisabled ? { color: "#FF0000" } : {}} />}
              type="link"
              disabled={isOperationDisabled}
            />
          </Tooltip>
        )}
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(
          EliminationOfViolationsElements[
          EliminationOfViolationsElements.RejectMaterials
          ]
        )}
      >
        {isRejectMaterialsButtonVisible(
          eliminateStatus,
          eliminateOperationId
        ) && (
            <Tooltip title="Отклонить материалы">
              <Button
                onClick={() =>
                  handleSetModalOfOperationsInfo(
                    data,
                    TypesOfOperations.rejectMaterials
                  )
                }
                icon={<FileExcelOutlined style={!isOperationDisabled ? { color: "#FF0000" } : {}} />}
                type="link"
                disabled={isOperationDisabled}
              />
            </Tooltip>
          )}
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(
          EliminationOfViolationsElements[
          EliminationOfViolationsElements.AcceptMaterials
          ]
        )}
      >
        {isAcceptMaterialsButtonVisible(
          eliminateStatus,
          eliminateOperationId
        ) && (
            <Tooltip title="Принять">
              <Button
                onClick={() =>
                  handleSetModalOfOperationsInfo(
                    data,
                    TypesOfOperations.acceptMaterials
                  )
                }
                icon={<FileDoneOutlined style={!isOperationDisabled ? { color: "#32CD32" } : {}} />}
                type="link"
                disabled={isOperationDisabled}
              />
            </Tooltip>
          )}
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(
          EliminationOfViolationsElements[
          EliminationOfViolationsElements.Extend
          ]
        )}
      >
        {isExtendButtonVisible(eliminateStatus, eliminateOperationId) && (
          <Tooltip title="Продлить">
            <Button
              onClick={() =>
                handleSetModalOfOperationsInfo(data, TypesOfOperations.extend)
              }
              icon={<HistoryOutlined style={!isOperationDisabled ? { color: "#32CD32" } : {}} />}
              type="link"
              disabled={isOperationDisabled}
            />
          </Tooltip>
        )}
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(
          EliminationOfViolationsElements[
          EliminationOfViolationsElements.SendToProlongation
          ]
        )}
      >
        {isRequestAnExtensionButtonVisible(eliminateStatus) && (
          <Tooltip title="Отправить на продление">
            <Button
              onClick={() =>
                handleSetModalOfOperationsInfo(
                  data,
                  TypesOfOperations.requestAnExtension
                )
              }
              icon={<HistoryOutlined />}
              type="link"
            />
          </Tooltip>
        )}
      </Can>
    </React.Fragment>
  );
};
