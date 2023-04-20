import { FC } from "react";
import { TypicalPlanCardFilterEntitiesDto } from "api/requests/pspControl/plan-typical-violations/dto-types";

import { SortViolationsModals as SortViolations } from "./SortViolations";
import { SortViolationProvider } from "./Provider";

interface ModalProps {
  visible?: boolean;
  items: TypicalPlanCardFilterEntitiesDto[];
  id: string;
  onClose?: () => void;
  onSave?: (
    items: TypicalPlanCardFilterEntitiesDto[],
    id: string
  ) => Promise<void>;
}

export const SortViolationModal: FC<ModalProps> = ({ ...props }) => {
  return (
    <SortViolationProvider>
      <SortViolations {...props} />
    </SortViolationProvider>
  );
};
