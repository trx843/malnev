import { useMemo, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { useDispatch, useSelector } from "react-redux";

import { VerificationActOptions } from "../../../../containers/VerificationActs/VerificationAct/types";
import { StateType } from "../../../../types";
import {
  ClassifType,
  GroupClassiffNumbersOptions,
  VerificationActOptionsStore
} from "../../../../slices/verificationActs/verificationAct/types";
import {
  getAreaResponsibilitiesThunk,
  getCheckingObjectVerificationThunk,
  getClassificationNumbersNumberThunk,
  getCtoThunk,
  getOSUSVerificationThunk,
  getViolationSourceThunk,
  getSourceRemarkThunk
} from "../../../../thunks/verificationActs/verificationAct";
import { OsusItem } from "../../../PspControl/PspObject/classes";
import { selectOptionsByTypeAndId } from "../helpers";
import { getCheckingObjectViolationsItemsByActIdRequest } from "../../../../api/requests/verificationActs";

type Response = {
  getSourceOptions: () => Promise<void>;
  getOSUOptions: (params: {
    pspId: string | null | undefined;
  }) => Promise<void>;
  getAreasOptions: () => Promise<void>;
  getClassificationNumberOptions: (type: ClassifType) => Promise<void>;
  getCtoOptions: () => Promise<void>;
  getSourceRemarkOptions: () => Promise<void>;
  getCheckingObjectsOptions: () => Promise<void>;
  getCheckingViolationsOptions: () => Promise<void>;
  osusOptions: { label: string; value: string }[];
  sourceRemarkOptions: { label: string; value: string }[];
  typicalViolationNumbers: GroupClassiffNumbersOptions[];
  sources: { label: string; value: string }[];
  areas: { label: string; value: string }[];
  ctos: { label: string; value: string }[];
  checkingObjectViolationsOptions: {
    label: string;
    value: string;
    data: any;
  }[];
};

export const useVerificationActOptions = (): Response => {
  const [
    checkingObjectViolationsOptions,
    setCheckingObjectViolations
  ] = useState<{ label: string; value: string; data: any }[]>([]);
  const dispatch = useDispatch();
  const { memoizeOptions, currentId } = useSelector<
    StateType,
    {
      currentId: string | null;
      memoizeOptions: Record<string, VerificationActOptionsStore>;
    }
  >(state => ({
    currentId: state.verificationAct.currentId,
    memoizeOptions: state.verificationAct.memoizeOptions
  }));

  const isMemoized = (params: { type: VerificationActOptions }) => {
    if (!currentId) {
      return false;
    }
    return !isEmpty(memoizeOptions[currentId]?.[params.type]);
  };

  const handleGetOSUOptions = async (params: {
    pspId: string | null | undefined;
  }) => {
    if (currentId) {
      if (!params.pspId) {
        throw Error("Not found ostRnuPspId");
      }
      if (!isMemoized({ type: VerificationActOptions.OSUS })) {
        await dispatch(
          getOSUSVerificationThunk({
            actId: currentId,
            pspId: params.pspId
          })
        );
      }
    }
  };

  const handleGetSourceRemarkOptions = async () => {
    if (currentId) {
      if (!isMemoized({ type: VerificationActOptions.SourceRemark })) {
        await dispatch(
          getSourceRemarkThunk({
            actId: currentId
          })
        );
      }
    }
  };

  const handleGetCheckingObjectOptions = async () => {
    if (currentId) {
      await dispatch(getCheckingObjectVerificationThunk({ actId: currentId }));
    }
  };

  const handleCheckingObjectOptions = async () => {
    if (currentId) {
      const checkingObjectViolations = await getCheckingObjectViolationsItemsByActIdRequest(
        currentId
      );

      const options = checkingObjectViolations.map(osu => ({
        label: osu.osuShortName,
        value: osu.id,
        data: osu
      }));

      setCheckingObjectViolations(options);
    }
  };

  const handleGetAreasOptions = async () => {
    if (currentId) {
      if (!isMemoized({ type: VerificationActOptions.AreaOfResponsibility })) {
        await dispatch(getAreaResponsibilitiesThunk({ actId: currentId }));
      }
    }
  };

  const handleClassificationNumberOptions = async (type: ClassifType) => {
    if (currentId) {
      await dispatch(
        getClassificationNumbersNumberThunk({ actId: currentId, type })
      );
    }
  };

  const handleSourceOptions = async () => {
    if (currentId) {
      if (!isMemoized({ type: VerificationActOptions.SourceViolations })) {
        await dispatch(getViolationSourceThunk({ actId: currentId }));
      }
    }
  };

  const handleCtoOptions = async () => {
    if (currentId) {
      if (!isMemoized({ type: VerificationActOptions.CTO })) {
        await dispatch(getCtoThunk({ actId: currentId }));
      }
    }
  };

  const osusOptions = useMemo(() => {
    const items = selectOptionsByTypeAndId<OsusItem[]>({
      memoizeOptions,
      id: currentId,
      type: VerificationActOptions.OSUS
    });

    return items.map(osu => ({
      value: osu.id as string,
      label: osu.osuShortName
    }));
  }, [currentId, memoizeOptions]);

  const areas = useMemo(() => {
    const items = selectOptionsByTypeAndId<string[]>({
      memoizeOptions,
      id: currentId,
      type: VerificationActOptions.AreaOfResponsibility
    });

    return items.map(item => ({
      value: item,
      label: item
    }));
  }, [currentId, memoizeOptions]);

  const typicalViolationNumbers = useMemo(
    () =>
      selectOptionsByTypeAndId<GroupClassiffNumbersOptions[]>({
        memoizeOptions,
        id: currentId,
        type: VerificationActOptions.ClassificationNumber
      }),
    [currentId, memoizeOptions]
  );

  const sourceRemarkOptions = useMemo(() => {
    const items = selectOptionsByTypeAndId<{ label: string; id: string }[]>({
      memoizeOptions,
      id: currentId,
      type: VerificationActOptions.SourceRemark
    });
    return items.map(item => ({
      value: item.id,
      label: item.label
    }));
  }, [currentId, memoizeOptions]);

  const sources = useMemo(() => {
    const items = selectOptionsByTypeAndId<string[]>({
      memoizeOptions,
      id: currentId,
      type: VerificationActOptions.SourceViolations
    });

    return items.map(item => ({
      value: item,
      label: item
    }));
  }, [currentId, memoizeOptions]);

  const ctos = useMemo(() => {
    const items = selectOptionsByTypeAndId<{ id: null; label: string }[]>({
      memoizeOptions,
      id: currentId,
      type: VerificationActOptions.CTO
    });
    return items.map(item => ({
      value: item.label,
      label: item.label
    }));
  }, [currentId, memoizeOptions]);

  return {
    getOSUOptions: handleGetOSUOptions,
    getCheckingObjectsOptions: handleGetCheckingObjectOptions,
    getAreasOptions: handleGetAreasOptions,
    getClassificationNumberOptions: handleClassificationNumberOptions,
    getSourceOptions: handleSourceOptions,
    getCtoOptions: handleCtoOptions,
    getCheckingViolationsOptions: handleCheckingObjectOptions,
    getSourceRemarkOptions: handleGetSourceRemarkOptions,
    sourceRemarkOptions,
    sources,
    areas,
    osusOptions,
    typicalViolationNumbers,
    ctos,
    checkingObjectViolationsOptions
  };
};
