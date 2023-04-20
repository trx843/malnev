import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PspObject } from "../../../components/PspControl/PspObject";

import { StateType } from "../../../types";
import { ICheckingObjectsStore } from "../../../slices/pspControl/checkingObjects";

import { getPspObjectThunk } from "../../../thunks/pspControl";
import "./style.css";

export const PspObjectContainer: FC = () => {
  const { pspId } = useParams<{ pspId: string }>();
  const [loading, setLoading] = useState(true);
  const { pspsHash } = useSelector<StateType, ICheckingObjectsStore>(
    state => state.checkingObjects
  );
  const dispatch = useDispatch();

  const fetchPspObject = useCallback(async () => {
    try {
      dispatch(getPspObjectThunk({ id: pspId }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pspId, pspsHash]);

  useEffect(() => {
    fetchPspObject();
  }, [fetchPspObject]);

  const psp = useMemo(() => pspsHash[pspId.toLocaleLowerCase()] || {}, [
    pspId,
    pspsHash
  ]);

  return <PspObject data={psp} id={pspId} loading={loading} />;
};
