import React, { FC } from "react";

import { InfoLinkAction } from "./InfoLinkAction";
import { CreatePlanAction } from "./CreatePlanAction";
import { RemoveAction } from "./RemoveAction";
import { RendererProps } from "../../../ItemsTable";
import { VerificationItem } from "../../classes";
import { ViewAct } from "./ViewAct";
import { OpenActionPlan } from "./OpenActionPlan";
import { LinkToNotClassifiedAct } from "./LinkToNotClassifiedAct";
import { EditAct } from "./EditAct";

interface TableActActionsProps extends RendererProps<VerificationItem> {
  onRemove: (id: string) => Promise<void>;
  deletable: boolean;
}

export const TableActActions: FC<TableActActionsProps> = ({
  onRemove,
  data,
  deletable = true,
}) => {

  return (
    <React.Fragment>
      <InfoLinkAction pspId={data.psp} id={data.id} />
      <EditAct data={data} isDisabled={!deletable} />
      <LinkToNotClassifiedAct id={data.id} isDisabled={!data.hasNotClassified} />
      <CreatePlanAction data={data} hasNotClassifiyedViolation={data.hasNotClassified} />
      <OpenActionPlan planId={data?.planId} />
      <ViewAct
        actId={data?.id.toString()}
        actName={data?.actName}
        verificationStatusId={data?.verificationStatusId}
      />
      <RemoveAction
        data={data}
        onRemove={onRemove}
        id={data.id as string}
        disabled={!deletable}
      />
    </React.Fragment>
  );
};
