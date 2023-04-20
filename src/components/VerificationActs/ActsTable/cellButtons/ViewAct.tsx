import React from "react";
import { Button, Tooltip } from "antd";
import { exportToDoc } from "api/requests/verificationActs/verificationAct";
import { FileExcelOutlined } from "@ant-design/icons";
import { StatusesIds } from "../../../../enums";
import { Can } from "../../../../casl";
import { ActionsEnum } from "../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";

interface IProps {
  actId: string;
  actName: string;
  verificationStatusId: StatusesIds;
}

export const ViewAct: React.FC<IProps> = ({
  actId,
  actName,
  verificationStatusId,
}) => {
  const [isLoading, setLoading] = React.useState(false);

  const handleExportToDoc = async () => {
    setLoading(true);
    await exportToDoc(actId, actName);
    setLoading(false);
  };

  return (
    <Can
      I={ActionsEnum.View}
      a={elementId(VerificationActsElements[VerificationActsElements.ViewAct])}
    >
      <Tooltip title="Просмотреть акт">
        <Button
          icon={<FileExcelOutlined />}
          type="link"
          onClick={handleExportToDoc}
          loading={isLoading}
          disabled={verificationStatusId !== StatusesIds.Signed}
        />
      </Tooltip>
    </Can>
  );
};
