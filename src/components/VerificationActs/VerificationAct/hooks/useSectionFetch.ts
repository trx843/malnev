import React, { Dispatch, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getVerificationActSectionPageThunk,
  getViolationsThunk,
} from "../../../../thunks/verificationActs/verificationAct";
import { VerificationActSection } from "../../../../containers/VerificationActs/VerificationAct/types";

export const useSectionFetch = (
  sectionType: VerificationActSection
): [boolean, Dispatch<React.SetStateAction<boolean>>] => {
  const [isLoading, setLoading] = useState(true);
  const { actId } = useParams<{ actId: string }>();

  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    try {
      if (
        sectionType ===
        VerificationActSection.IdentifiedViolationsOrRecommendations
      ) {
        await dispatch(getViolationsThunk({ actId }));
      } else {
        await dispatch(
          getVerificationActSectionPageThunk({
            actId,
            sectionType,
          })
        );
      }
    } finally {
      setLoading(false);
    }
  }, [actId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [isLoading, setLoading];
};
