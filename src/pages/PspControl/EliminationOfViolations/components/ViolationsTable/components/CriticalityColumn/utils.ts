import { EliminationColors } from "../../../../../../../thunks/pspControl/eliminationOfViolations/constants";

export const getCriticalityTitle = (
  eliminationColorType: EliminationColors
) => {
  switch (eliminationColorType) {
    case EliminationColors.ApproachingColor:
      return "Срок устранения приближается";
    case EliminationColors.ExpireColor:
      return "Срок устранения вышел";
    case EliminationColors.None:
      return "Срок устранения не вышел";
    default:
      return null;
  }
};
