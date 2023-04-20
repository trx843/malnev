import { useSelector } from "react-redux";
import { StateType } from "../../../../types";
import { VerificationActSection } from "../../../../containers/VerificationActs/VerificationAct/types";
import { StatusesIds } from "../../../../enums";

export const useActStatusPermission = () => {
  const status = useSelector<
    StateType,
    {
      verificationStatusId: number;
      verificationStatus: string;
    } | null
  >(state => {
    const act = state.verificationAct.act;
    if (!act?.id) {
      return null;
    }
    return {
      verificationStatus: act.verificationStatus,
      verificationStatusId: act.verificationStatusId
    };
  });
  return {
    disabled: status?.verificationStatusId === StatusesIds.Signed,
    isSigned: status?.verificationStatusId === StatusesIds.Signed
  };
};
