import React, { FC } from "react";
import { Button, Tooltip } from "antd";
import { ICellRendererParams } from "ag-grid-community";
import { Link } from "react-router-dom";
import { ApiRoutes } from "../../../api/api-routes.enum";
import FileSearchOutlined from "@ant-design/icons/FileSearchOutlined";
import ScheduleOutlined from "@ant-design/icons/ScheduleOutlined";
import FileAddOutlined from "@ant-design/icons/FileAddOutlined";
import ProfileOutlined from "@ant-design/icons/ProfileOutlined";
import { ActionsEnum, Can } from "../../../casl";
import { CheckingObjectsElements, elementId } from "pages/PspControl/CheckingObjectsPage/constant";

interface IProps extends ICellRendererParams {
  handleCreateActionPlan: (pspId: string) => void
}

export const PspControlInfoButton: FC<IProps> = ({ data, handleCreateActionPlan }) => {
  return (
    <React.Fragment>
      <Tooltip title="Посмотреть информ. по ОСУ">
        <Button type="link" icon={<FileSearchOutlined />} />
      </Tooltip>
      <Can
        I={ActionsEnum.View}
        a={elementId(CheckingObjectsElements[CheckingObjectsElements.CreateCheckAct])}
      >
        <Tooltip title="Создать акт проверки">
          <Button type="link" icon={<FileAddOutlined />} />
        </Tooltip>
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(CheckingObjectsElements[CheckingObjectsElements.CreateActionPlan])}
      >
        <Tooltip title="Создать план мероприятий">
          <Button
            type="link"
            icon={<ScheduleOutlined />}
            onClick={() => handleCreateActionPlan(data?.id)}
          />
        </Tooltip>
      </Can>
      <Can
        I={ActionsEnum.View}
        a={elementId(CheckingObjectsElements[CheckingObjectsElements.OpenPSP])}
      >
        <Tooltip title="Открыть ПСП">
          <Link to={`${ApiRoutes.CheckingObjects}/${data.id}`}>
            <Button type="link" icon={<ProfileOutlined />} />
          </Link>
        </Tooltip>
      </Can>
    </React.Fragment>
  );
};
