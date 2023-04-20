import React, { FC } from "react";
import { RendererProps } from "../../../ItemsTable";
import { CheckingObjectsItem } from "../classes";
import { Button, Tooltip } from "antd";
import FileSearchOutlined from "@ant-design/icons/FileSearchOutlined";
import ScheduleOutlined from "@ant-design/icons/ScheduleOutlined";
import { BlockOutlined, FileAddOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ApiRoutes } from "../../../../api/api-routes.enum";
import ProfileOutlined from "@ant-design/icons/ProfileOutlined";
import { ActionsEnum, Can } from "../../../../casl";
import { CheckingObjectsElements, elementId } from "pages/PspControl/CheckingObjectsPage/constant";

interface CheckingObjectActionsProps
  extends RendererProps<CheckingObjectsItem> {
  onClickCreateModal: () => void;
  handleCreateActionPlan: (pspId: string) => void;
  openModalForAddingResponsiblePerson: (pspId: string) => void;
  openModalInformationOnOsuModal: (pspId: string) => void;
}

export const CheckingObjectActions: FC<CheckingObjectActionsProps> = ({
  data,
  onClickCreateModal,
  handleCreateActionPlan,
  openModalForAddingResponsiblePerson,
  openModalInformationOnOsuModal,
}) => {
  const pspId = data.pspId.toString();

  return (
    <div className="ais-table-actions">
      {/* <Can
        I={ActionsEnum.View}
        a={elementId(CheckingObjectsElements[CheckingObjectsElements.CheckOsuInfo])}
      >
        <Tooltip title="Посмотреть информ. по ОСУ">
          <Button
            className="ais-table-actions__item"
            onClick={() => openModalInformationOnOsuModal(pspId)}
            type="link"
            icon={<FileSearchOutlined />}
          />
        </Tooltip>
      </Can> */}

      <Can
        I={ActionsEnum.View}
        a={elementId(CheckingObjectsElements[CheckingObjectsElements.CreateCheckAct])}
      >
        <Tooltip title="Создать акт проверки">
          <Button
            className="ais-table-actions__item"
            onClick={onClickCreateModal}
            type="link"
            icon={<FileAddOutlined />}
          />
        </Tooltip>
      </Can>

      <Can
        I={ActionsEnum.View}
        a={elementId(CheckingObjectsElements[CheckingObjectsElements.CreateActionPlan])}
      >
        <Tooltip title="Создать план мероприятий">
          <Button
            className="ais-table-actions__item"
            type="link"
            icon={<ScheduleOutlined />}
            onClick={() => handleCreateActionPlan(pspId)}
          />
        </Tooltip>
      </Can>

      <Can
        I={ActionsEnum.View}
        a={elementId(CheckingObjectsElements[CheckingObjectsElements.OpenPSP])}
      >
        <Tooltip title="Открыть ПСП">
          <Link
            to={`${ApiRoutes.CheckingObjects}/${data?.pspId}`}
            className="ais-table-actions__item"
          >
            <Button type="link" icon={<ProfileOutlined />} />
          </Link>
        </Tooltip>
      </Can>

      <Can
        I={ActionsEnum.View}
        a={elementId(CheckingObjectsElements[CheckingObjectsElements.TypViolationCheck])}
      >
        <Tooltip title="Проверить на наличие типовых нарушений">
          <Button
            onClick={() => openModalForAddingResponsiblePerson(pspId)}
            type="link"
            icon={<BlockOutlined />}
          />
        </Tooltip>
      </Can>
    </div>
  );
};
