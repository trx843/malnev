import { VerificationActSection } from "../../../containers/VerificationActs/VerificationAct/types";
import { ApiRoutes } from "../../api-routes.enum";
import { apiBase } from "../../../utils";

export const getVerificationSectionUrl = (
  section: VerificationActSection,
  actId: string
): string => {
  switch (section) {
    case VerificationActSection.OtherSides: {
      return `${apiBase}${ApiRoutes.VerificationActs}/${actId}/otherParties`;
    }
    case VerificationActSection.IdentifiedViolationsOrRecommendations: {
      return `${apiBase}${ApiRoutes.VerificationActs}/${actId}/identifiedViolations`;
    }
    case VerificationActSection.CompositionOfAppendicesToReport: {
      return `${apiBase}${ApiRoutes.VerificationActs}/${actId}/additions`;
    }
    case VerificationActSection.Recommendations: {
      return `${apiBase}${ApiRoutes.VerificationActs}/${actId}/recommendations`;
    }
    case VerificationActSection.NumberOneSide: {
      return `${apiBase}${ApiRoutes.VerificationActs}/${actId}/actCard`;
    }
    case VerificationActSection.Commission: {
      return `${apiBase}${ApiRoutes.VerificationActs}/${actId}/commissions`;
    }
    default: {
      return `${apiBase}${ApiRoutes.VerificationActs}/${actId}`;
    }
  }
};

export const getVerificationSectionUrlSort = (
  section: VerificationActSection
): string => {
  switch (section) {
    case VerificationActSection.OtherSides: {
      return `${apiBase}${ApiRoutes.VerificationActs}/otherParties/sort`;
    }
    case VerificationActSection.IdentifiedViolationsOrRecommendations: {
      return `${apiBase}${ApiRoutes.VerificationActs}/identifiedViolations/sort`;
    }
    case VerificationActSection.CompositionOfAppendicesToReport: {
      return `${apiBase}${ApiRoutes.VerificationActs}/additions/sort`;
    }
    case VerificationActSection.Recommendations: {
      return `${apiBase}${ApiRoutes.VerificationActs}/recommendations/sort`;
    }
    case VerificationActSection.NumberOneSide: {
      return `${apiBase}${ApiRoutes.VerificationActs}/actCard/sort`;
    }
    case VerificationActSection.Commission: {
      return `${apiBase}${ApiRoutes.VerificationActs}/commission/sort`;
    }
    default: {
      return `${apiBase}${ApiRoutes.VerificationActs}`;
    }
  }
};
