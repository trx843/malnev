import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Spin } from "antd";

import { VerificationActContainer } from "containers/VerificationActs/VerificationAct";
import { getVerificationActPageThunk } from "thunks/verificationActs/verificationAct";

import "./style.css";
import { Loading } from "components/Loading";

export const VerificationActPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const { actId } = useParams<{ actId: string }>();

  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    try {
      await dispatch(getVerificationActPageThunk(actId));
    } finally {
      setLoading(false);
    }
  }, [actId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <Loading tip="Загрузка акта..." />;
  }

  return <VerificationActContainer />;
};
