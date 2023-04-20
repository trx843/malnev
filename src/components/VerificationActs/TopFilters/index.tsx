import React, { FC, useState } from "react";
import { Button, Card } from "antd";
import FilterFilled from "@ant-design/icons/lib/icons/FilterFilled";
import { ModalVerificationActsFilters } from "./ModalVerificationActsFilters";
import { AppliedVerificationActsFilterTags } from "./AppliedVerificationActsFilterTags";
import { VerificationActsStore } from "slices/verificationActs/verificationActs";
import { useSelector } from "react-redux";
import { StateType } from "types";

export const TopFilters: FC = () => {
  const [visible, setVisibleModalFilter] = useState(false);
  const { pending } = useSelector<StateType, VerificationActsStore>(
    (state) => state.verificationActs
  );
  return (
    <>
      <Card size="small">
        <Button
          type="link"
          icon={<FilterFilled />}
          disabled={pending}
          onClick={() => setVisibleModalFilter(true)}
        >
          Раскрыть фильтр
        </Button>
        <AppliedVerificationActsFilterTags />
      </Card>
      <ModalVerificationActsFilters
        visible={visible}
        onClose={() => setVisibleModalFilter(false)}
      />
    </>
  );
};
