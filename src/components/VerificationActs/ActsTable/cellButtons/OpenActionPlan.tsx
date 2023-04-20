import React from "react";
import { Link } from "react-router-dom";
import { Button, Tooltip } from "antd";
import { FileOutlined } from "@ant-design/icons";
import { Can } from "../../../../casl";
import { ActionsEnum } from "../../../../casl";
import { elementId, VerificationActsElements } from "pages/VerificationActs/constant";

interface IProps {
  planId: string;
}

export const OpenActionPlan: React.FC<IProps> = ({ planId }) => {
  return (
    <>
      <Can
        I={ActionsEnum.View}
        a={elementId(VerificationActsElements[VerificationActsElements.OpenActionPlan])}
      >
        <Tooltip title="Открыть план мероприятий">
          <Link to={`/pspcontrol/action-plans/cards/${planId}`}>
            <span style={{ cursor: !planId ? 'not-allowed' : 'pointer' }}>
              <Button
                icon={<FileOutlined />}
                type="link"
                disabled={!planId}
                style={{ pointerEvents: 'none' }}
              />
            </span>
          </Link>
        </Tooltip>
      </Can>
    </>
  )
};
