import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Button, Tooltip } from "antd";
import FileSearchOutlined from "@ant-design/icons/FileSearchOutlined";
import { IdType } from "../../../../types";
import { ActionsEnum, Can } from "../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";

interface InfoLinkProps {
  className?: string;
  id: IdType;
  pspId: string;
}

export const InfoLinkAction: FC<InfoLinkProps> = ({ className, id, pspId }) => {
  return (
    <Can
      I={ActionsEnum.View}
      a={elementId(VerificationActsElements[VerificationActsElements.ViewCard])}
    >
      <Link className={className} to={`/pspcontrol/verification-acts/${id}`}>
        <Tooltip title="Посмотреть карточку">
          <Button
            type="link"
            icon={<FileSearchOutlined />}
          />
        </Tooltip>
      </Link>
    </Can>
  );
};
